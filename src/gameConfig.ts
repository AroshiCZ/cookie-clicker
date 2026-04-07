export type GameState = {
  cookies: number;
  clickValue: number;
  autoBakers: number;
  autoCost: number;
  clickPowerCost: number;
  sugarMixers: number;
  sugarMixerCost: number;
  goldenSpoons: number;
  goldenSpoonCost: number;
  ovenChefs: number;
  ovenCost: number;
  criticalCookies: number;
  criticalCookieCost: number;
  displayName?: string;
};

export type UpgradeDefinition = {
  id: string;
  title: string;
  description: string;
  cost: number;
  count: number;
  onBuy: () => void;
  disabled: boolean;
};

export const defaultState: GameState = {
  cookies: 0,
  clickValue: 1,
  autoBakers: 0,
  autoCost: 50,
  clickPowerCost: 20,
  sugarMixers: 0,
  sugarMixerCost: 150,
  goldenSpoons: 0,
  goldenSpoonCost: 300,
  ovenChefs: 0,
  ovenCost: 900,
  criticalCookies: 0,
  criticalCookieCost: 1000,
};

export const cookiesPerSecond = (state: GameState) => {
  return (state.autoBakers + state.sugarMixers * 3 + state.ovenChefs * 10);
};

export const buildUpgradeDefinitions = (
  state: GameState,
  actions: {
    buyAutoBaker: () => void;
    buyClickPower: () => void;
    buySugarMixer: () => void;
    buyGoldenSpoon: () => void;
    buyOvenChef: () => void;
    buyCriticalCookie: () => void;
  },
): UpgradeDefinition[] => {
  return [
    {
      id: "autoBaker",
      title: "Auto Baker",
      description: "Earn 1 cookie per second automatically.",
      cost: state.autoCost,
      count: state.autoBakers,
      onBuy: actions.buyAutoBaker,
      disabled: state.cookies < state.autoCost,
    },
    {
      id: "clickPower",
      title: "Click Power",
      description: "Gain +1 cookie per click.",
      cost: state.clickPowerCost,
      count: state.clickValue - 1,
      onBuy: actions.buyClickPower,
      disabled: state.cookies < state.clickPowerCost,
    },
    {
      id: "sugarMixer",
      title: "Sugar Mixer",
      description: "Earn +3 cookies per second.",
      cost: state.sugarMixerCost,
      count: state.sugarMixers,
      onBuy: actions.buySugarMixer,
      disabled: state.cookies < state.sugarMixerCost,
    },
    {
      id: "goldenSpoon",
      title: "Golden Spoon",
      description: "Gain +2 cookies per click.",
      cost: state.goldenSpoonCost,
      count: state.goldenSpoons,
      onBuy: actions.buyGoldenSpoon,
      disabled: state.cookies < state.goldenSpoonCost,
    },
    {
      id: "ovenChef",
      title: "Oven Chef",
      description: "Earn +10 cookies per second.",
      cost: state.ovenCost,
      count: state.ovenChefs,
      onBuy: actions.buyOvenChef,
      disabled: state.cookies < state.ovenCost,
    },
    {
        id: "criticalCookie",
        title: "Critical Cookie",
        description: "Gain +10% click power per Critical Cookie.",
        cost: state.criticalCookieCost,
        count: state.criticalCookies,
        onBuy: actions.buyCriticalCookie,
        disabled: state.cookies < state.criticalCookieCost,
    }
  ];
};
