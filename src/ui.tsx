import React from "react";
import { Link } from "react-router-dom";

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-extrabold tracking-tight text-punti-text">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-punti-muted">{subtitle}</p>}
    </div>
  );
}

export function SectionCard({ children }: { children: React.ReactNode }) {
  return <div className="punti-card p-4">{children}</div>;
}

export function Tile({
  title,
  subtitle,
  right,
  onClick,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="punti-card p-4 text-left w-full transition hover:-translate-y-0.5 hover:shadow-punti
                 focus:outline-none focus:ring-4 focus:ring-punti-pink/20"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-base font-extrabold text-punti-text truncate">{title}</div>
          {subtitle && <div className="mt-1 text-sm text-punti-muted">{subtitle}</div>}
        </div>
        <div className="shrink-0 flex items-center gap-2">
          {right}
          <span className="text-punti-pink font-black text-xl">›</span>
        </div>
      </div>
    </button>
  );
}

export function BackLink({ to, label = "Back" }: { to: string; label?: string }) {
  return (
    <Link to={to} className="punti-btn-ghost inline-flex gap-2 items-center">
      <span className="text-lg">‹</span> {label}
    </Link>
  );
}
