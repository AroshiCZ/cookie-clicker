import { useEffect, useMemo, useState } from "react";
import { auth, provider, db } from "./firebase";
import { type User, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { buildUpgradeDefinitions, cookiesPerSecond, defaultState } from "./gameConfig";

export type GameState = typeof defaultState;

export function useGame() {
  const [user, setUser] = useState<User | null>(null);
  const [state, setState] = useState<GameState>(defaultState);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadedState, setHasLoadedState] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setHasLoadedState(false);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user) {
      setHasLoadedState(false);
      setState(defaultState);
      setIsLoading(false);
      return;
    }

    const loadGameState = async () => {
      setIsLoading(true);

      try {
        const stateRef = doc(db, "cookieGames", user.uid);
        const stateSnap = await getDoc(stateRef);

        if (stateSnap.exists()) {
          const data = stateSnap.data() as Partial<GameState>;
          setState({
            cookies: data.cookies ?? defaultState.cookies,
            clickValue: data.clickValue ?? defaultState.clickValue,
            autoBakers: data.autoBakers ?? defaultState.autoBakers,
            autoCost: data.autoCost ?? defaultState.autoCost,
            clickPowerCost: data.clickPowerCost ?? defaultState.clickPowerCost,
            sugarMixers: data.sugarMixers ?? defaultState.sugarMixers,
            sugarMixerCost: data.sugarMixerCost ?? defaultState.sugarMixerCost,
            goldenSpoons: data.goldenSpoons ?? defaultState.goldenSpoons,
            goldenSpoonCost: data.goldenSpoonCost ?? defaultState.goldenSpoonCost,
            ovenChefs: data.ovenChefs ?? defaultState.ovenChefs,
            ovenCost: data.ovenCost ?? defaultState.ovenCost,
            criticalCookies: data.criticalCookies ?? defaultState.criticalCookies,
            criticalCookieCost: data.criticalCookieCost ?? defaultState.criticalCookieCost,
            displayName: data.displayName || user.displayName || user.email || undefined,
          });
        } else {
          await setDoc(stateRef, {
            ...defaultState,
            displayName: user.displayName || user.email || undefined,
            createdAt: serverTimestamp(),
          });
        }
      } catch (error) {
        console.error("Failed to load game state:", error);
      } finally {
        setHasLoadedState(true);
        setIsLoading(false);
      }
    };

    void loadGameState();
  }, [user]);

  useEffect(() => {
    if (!user || !hasLoadedState) return;

    const saveState = async () => {
      try {
        await setDoc(doc(db, "cookieGames", user.uid), {
          ...state,
          displayName: state.displayName || user.displayName || user.email || undefined,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        console.error("Failed to save game state:", error);
      }
    };

    const timeout = window.setTimeout(() => {
      void saveState();
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [user, hasLoadedState, state]);

  const bakeCookies = () => {
    setState((prevState) => {
      const clickGain = prevState.clickValue + prevState.goldenSpoons * 2;
      const multiplier = 1 + prevState.criticalCookies * 0.1;
      const gainedCookies = Math.floor(clickGain * multiplier);

      return {
        ...prevState,
        cookies: prevState.cookies + Math.max(1, gainedCookies),
      };
    });
  };

  const buyCriticalCookie = () => {
    setState((prevState) => {
      if (prevState.cookies < prevState.criticalCookieCost) return prevState;
        return {
            ...prevState,
            cookies: prevState.cookies - prevState.criticalCookieCost,
            criticalCookies: prevState.criticalCookies + 1,
            criticalCookieCost: Math.max(1000, Math.floor(prevState.criticalCookieCost * 1.6)),
        };
    });
  }
  const buyAutoBaker = () => {
    setState((prevState) => {
      if (prevState.cookies < prevState.autoCost) return prevState;
      return {
        ...prevState,
        cookies: prevState.cookies - prevState.autoCost,
        autoBakers: prevState.autoBakers + 1,
        autoCost: Math.max(10, Math.floor(prevState.autoCost * 1.35)),
      };
    });
  };

  const buyClickPower = () => {
    setState((prevState) => {
      if (prevState.cookies < prevState.clickPowerCost) return prevState;
      return {
        ...prevState,
        cookies: prevState.cookies - prevState.clickPowerCost,
        clickValue: prevState.clickValue + 1,
        clickPowerCost: Math.max(5, Math.floor(prevState.clickPowerCost * 1.5)),
      };
    });
  };

  const buySugarMixer = () => {
    setState((prevState) => {
      if (prevState.cookies < prevState.sugarMixerCost) return prevState;
      return {
        ...prevState,
        cookies: prevState.cookies - prevState.sugarMixerCost,
        sugarMixers: prevState.sugarMixers + 1,
        sugarMixerCost: Math.max(75, Math.floor(prevState.sugarMixerCost * 1.42)),
      };
    });
  };

  const buyGoldenSpoon = () => {
    setState((prevState) => {
      if (prevState.cookies < prevState.goldenSpoonCost) return prevState;
      return {
        ...prevState,
        cookies: prevState.cookies - prevState.goldenSpoonCost,
        goldenSpoons: prevState.goldenSpoons + 1,
        goldenSpoonCost: Math.max(150, Math.floor(prevState.goldenSpoonCost * 1.55)),
      };
    });
  };

  const buyOvenChef = () => {
    setState((prevState) => {
      if (prevState.cookies < prevState.ovenCost) return prevState;
      return {
        ...prevState,
        cookies: prevState.cookies - prevState.ovenCost,
        ovenChefs: prevState.ovenChefs + 1,
        ovenCost: Math.max(500, Math.floor(prevState.ovenCost * 1.5)),
      };
    });
  };

  const resetGame = () => {
    setState(defaultState);
  };

  const login = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const cookiesPerSecondValue = useMemo(() => cookiesPerSecond(state), [state]);

  useEffect(() => {
    if (cookiesPerSecondValue <= 0) return;

    const timer = window.setInterval(() => {
      setState((prevState) => ({
        ...prevState,
        cookies: prevState.cookies + cookiesPerSecondValue,
      }));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cookiesPerSecondValue]);

  const updateDisplayName = (newName: string) => {
    if (!user) return;

    setState((prevState) => {
      const nextState = {
        ...prevState,
        displayName: newName,
      };

      void setDoc(doc(db, "cookieGames", user.uid), {
        ...nextState,
        updatedAt: serverTimestamp(),
      });

      return nextState;
    });
  };

  const upgradeDefinitions = useMemo(
    () =>
      buildUpgradeDefinitions(state, {
        buyAutoBaker,
        buyClickPower,
        buySugarMixer,
        buyGoldenSpoon,
        buyOvenChef,
        buyCriticalCookie,
      }),
    [state],
  );

  return {
    user,
    isLoading,
    state,
    cookiesPerSecond: cookiesPerSecondValue,
    bakeCookies,
    resetGame,
    login,
    logout,
    updateDisplayName,
    upgradeDefinitions,
  };
}
