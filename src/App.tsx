import Auth from "./Auth";
import UpgradeCard from "./UpgradeCard";
import Leaderboard from "./Leaderboard";
import { useGame } from "./useGame";

export default function App() {
  const {
    user,
    isLoading,
    state,
    cookiesPerSecond,
    bakeCookies,
    resetGame,
    login,
    logout,
    updateDisplayName,
    upgradeDefinitions,
  } = useGame();

  const clickGain = Math.max(
    1,
    Math.floor((state.clickValue + state.goldenSpoons * 2) * (1 + state.criticalCookies * 0.1)),
  );
  // console.log(Math.floor((state.clickValue + state.goldenSpoons * 2) * (1 + state.criticalCookies * 0.1)))

  if (isLoading) {
    return (
      <main className="cookie-game">
        <h1>Cookie Clicker 🍪</h1>
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <>
      <main className="cookie-game">
        <h1>Cookie Clicker 🍪</h1>
        <Auth 
          user={user} 
          login={login} 
          logout={logout} 
          displayName={state.displayName}
          onDisplayNameChange={updateDisplayName}
        />

        {!user ? (
          <section className="auth-prompt">
            <p>Please login to save your cookie progress.</p>
          </section>
        ) : (
          <>
            <section className="cookie-board">
              <div className="cookie-score">
                <span className="score-value">{state.cookies.toLocaleString()}</span>
                <span className="score-label">cookies</span>
              </div>

              <button className="cookie-button" onClick={bakeCookies}>
                Bake {clickGain} cookie{clickGain !== 1 ? "s" : ""}
              </button>

              <div className="cookie-stats">
                <div>
                  <strong>{state.autoBakers}</strong> auto baker{state.autoBakers !== 1 ? "s" : ""}
                </div>
                <div>
                  <strong>{cookiesPerSecond}</strong> cookie{cookiesPerSecond !== 1 ? "s" : ""} / sec
                </div>
                <div>
                  <strong>{state.criticalCookies}</strong> critical cookie{state.criticalCookies !== 1 ? "s" : ""}
                </div>
              </div>
            </section>

            <section className="upgrades">
              <h2>Upgrades</h2>

              <div className="upgrade-list">
                {upgradeDefinitions.map((upgrade) => (
                  <UpgradeCard
                    key={upgrade.id}
                    title={upgrade.title}
                    description={upgrade.description}
                    cost={upgrade.cost}
                    count={upgrade.count}
                    onBuy={upgrade.onBuy}
                    disabled={upgrade.disabled}
                  />
                ))}
              </div>

              <button className="reset-button" onClick={resetGame}>
                Reset game
              </button>
            </section>
          </>
        )}
      </main>
      <Leaderboard />
    </>
  );
}
