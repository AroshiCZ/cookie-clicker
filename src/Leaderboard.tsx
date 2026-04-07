import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

interface LeaderboardEntry {
  uid: string;
  displayName: string;
  cookies: number;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      const q = query(
        collection(db, "cookieGames"),
        orderBy("cookies", "desc"),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      const entries: LeaderboardEntry[] = [];

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        entries.push({
          uid: docSnap.id,
          displayName: data.displayName || `Player ${docSnap.id.slice(0, 8)}`,
          cookies: data.cookies || 0,
        });
      }

      setLeaderboard(entries);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchLeaderboard();

    // Set up live updates every 10 seconds
    const interval = setInterval(() => {
      fetchLeaderboard();
    }, 10000); // 10 seconds

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + "T";
    if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
    return num.toString();
  };

  if (loading) {
    return (
      <aside className="leaderboard">
        <h3>Leaderboard</h3>
        <p>Loading...</p>
      </aside>
    );
  }

  return (
    <aside className="leaderboard">
      <h3>Leaderboard</h3>
      <div className="leaderboard-list">
        {leaderboard.map((entry, index) => (
          <div key={entry.uid} className="leaderboard-entry">
            <div className="rank">#{index + 1}</div>
            <div className="player-info">
              <div className="player-name">{entry.displayName}</div>
              <div className="player-cookies">{formatNumber(entry.cookies)} cookies</div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}