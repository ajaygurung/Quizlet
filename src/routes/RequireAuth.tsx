import { useEffect, useState, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { Store } from "../lib/store";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    Store.getSession()
      .then((s) => setAuthed(!!s))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-sm text-punti-muted">Loading…</div>;
  }

  if (!authed) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
