"use client";

import { useState, FormEvent } from "react";
import { signIn, signUp } from "@/lib/auth";

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4" style={{ background: "#3A6EA5" }}>
      <div className="xp-dialog w-full max-w-md">
        {/* Dialog Title Bar */}
        <div className="xp-title-bar">
          <span>{isSignUp ? "Sign Up" : "Sign In"}</span>
        </div>
        
        {/* Dialog Content */}
        <div className="xp-panel" style={{ padding: "12px" }}>
          {/* Welcome Message */}
          <div className="mb-4 text-center">
            <h2 style={{ fontSize: "14px", fontWeight: "bold", color: "#000000", marginBottom: "4px" }}>
              Welcome to My To-Do List
            </h2>
            <p style={{ fontSize: "10px", color: "#000000", marginBottom: "8px" }}>
              Organize your tasks with a touch of nostalgia
            </p>
            <div className="xp-panel" style={{ padding: "6px", marginBottom: "8px", background: "#E8F4FD", border: "1px solid #B0D4F1" }}>
              <p style={{ fontSize: "9px", color: "#000000", margin: 0, lineHeight: "1.4" }}>
                <strong>Features:</strong> Secure cloud storage • Real-time sync • Classic Windows XP interface
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block"
                style={{ fontSize: "11px", color: "#000000", marginBottom: "4px" }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="xp-input w-full"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block"
                style={{ fontSize: "11px", color: "#000000", marginBottom: "4px" }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="xp-input w-full"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="xp-panel p-2" style={{ fontSize: "11px", color: "#800000", background: "#FFE4E1" }}>
                {error}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                }}
                className="xp-button-raised"
                style={{ minWidth: "80px" }}
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="xp-button-raised"
                style={{ minWidth: "80px" }}
              >
                {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

