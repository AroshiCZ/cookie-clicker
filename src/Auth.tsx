import { type User } from "firebase/auth";
import { useState } from "react";

type AuthProps = {
  user: User | null;
  login: () => void;
  logout: () => void;
  displayName: string | undefined;
  onDisplayNameChange: (newName: string) => void;
};

export default function Auth({ user, login, logout, displayName, onDisplayNameChange }: AuthProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState("");

  const handleEditStart = () => {
    setTempName(displayName || "");
    setIsEditing(true);
  };

  const handleEditSave = () => {
    if (tempName.trim()) {
      onDisplayNameChange(tempName.trim());
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setTempName("");
  };

  return (
    <div className="auth-panel">
      {user ? (
        <>
          <div className="auth-user-info">
            {isEditing ? (
              <div className="username-editor">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Enter username"
                  maxLength={20}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleEditSave();
                    if (e.key === "Escape") handleEditCancel();
                  }}
                />
                <button onClick={handleEditSave} className="save-btn">✓</button>
                <button onClick={handleEditCancel} className="cancel-btn">✗</button>
              </div>
            ) : (
              <div className="username-display">
                <p className="auth-welcome">Signed in as {displayName || user.displayName || user.email}</p>
                <button onClick={handleEditStart} className="edit-username-btn">Edit</button>
              </div>
            )}
          </div>
          <button className="auth-button" onClick={logout}>
            Logout
          </button>
        </>
      ) : (
        <button className="auth-button" onClick={login}>
          Login with Google
        </button>
      )}
    </div>
  );
}
