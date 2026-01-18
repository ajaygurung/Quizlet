import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../lib/store";

export default function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // If already logged in, go home
  useEffect(() => {
    Store.getSession()
      .then((s) => {
        if (s) nav("/", { replace: true });
      })
      .catch(() => {});
  }, [nav]);

  const submit = async () => {
    setMsg(null);
    const e = email.trim();
    if (!e || password.length < 6) {
      setMsg("Use a valid email and password (min 6 chars).");
      return;
    }

    try {
      setLoading(true);
      if (mode === "signup") {
        await Store.signUp(e, password);
        setMsg("Account created! Now sign in 💗");
        setMode("signin");
      } else {
        await Store.signIn(e, password);
        nav("/", { replace: true });
      }
    } catch (err: any) {
      setMsg(err?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-punti ring-1 ring-black/5 p-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-punti-pink/15 flex items-center justify-center text-punti-pink font-black">
            S
          </div>
          <div>
            <div className="text-xl font-extrabold text-punti-text">Welcome</div>
            <div className="text-sm text-punti-muted">Sign in to sync flashcards</div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-black/5 p-1">
          <button
            onClick={() => setMode("signin")}
            className={`rounded-lg py-2 text-sm font-bold transition ${
              mode === "signin" ? "bg-white shadow ring-1 ring-black/5" : "text-punti-muted"
            }`}
          >
            Sign in
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`rounded-lg py-2 text-sm font-bold transition ${
              mode === "signup" ? "bg-white shadow ring-1 ring-black/5" : "text-punti-muted"
            }`}
          >
            Sign up
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-xl bg-white px-4 py-3 text-sm outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-punti-pink"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6 chars)"
            type="password"
            className="w-full rounded-xl bg-white px-4 py-3 text-sm outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-punti-pink"
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
          />

          {msg && (
            <div className="rounded-xl bg-pink-50 border border-pink-200 p-3 text-sm text-punti-text">
              {msg}
            </div>
          )}

          <button
            onClick={submit}
            disabled={loading}
            style={{
              background: "#FF4FA3",
              color: "white",
              padding: "12px 18px",
              borderRadius: "14px",
              fontWeight: 900,
              border: "none",
              width: "100%",
              boxShadow: "0 12px 35px rgba(255,79,163,.22)",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in"}
          </button>

          <div className="text-xs text-punti-muted text-center">
            Tip: use the same login on phone + laptop to see the same subjects/lectures/cards.
          </div>
        </div>
      </div>
    </div>
  );
}
