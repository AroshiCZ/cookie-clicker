import { useEffect, useState } from "react";
import { auth, provider } from "./firebase";
import { type User, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

export default function Auth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  const login = () => signInWithPopup(auth, provider);
  const logout = () => signOut(auth);

  return (
    <div>
      {user ? (
        <>
          <p>{user.displayName}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={login}>Login with Google</button>
      )}
    </div>
  );
}