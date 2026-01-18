import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../lib/store";

export default function SubjectsPage() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [tick, setTick] = useState(0);
  const subjects = useMemo(() => Store.getSubjects(), [tick]);

  const addSubject = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    Store.addSubject(trimmed);
    setName("");
    setTick((t) => t + 1);
  };
  const deleteSubject = (subjectId: string, subjectName: string) => {
    const confirmed = window.confirm(
      `Delete "${subjectName}"? This will remove all lectures and flashcards.`
    );
    if (!confirmed) return;
    Store.deleteSubject(subjectId);
    setTick((t) => t + 1);
  };

  return (
    <div className="space-y-4">
      {/* header */}
      <div className="flex items-end justify-center gap-4 text-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-punti-text">
            Subjects
          </h1>
          <p className="mt-1 text-sm text-punti-muted">
            Create a subject, then add lectures inside it.
          </p>
        </div>

      </div>
      <div style={{ height: "16px" }} />

      {/* compact add bar */}
      <div
        className="rounded-xl bg-white shadow-punti ring-1 ring-black/5 p-3"
        style={{ marginTop: "16px" }}
      >
        <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New subject"
            className="min-w-0 w-full rounded-lg bg-white px-4 py-3 text-sm outline-none
                 ring-1 ring-black/10 focus:ring-2 focus:ring-punti-pink"
            style={{ height: "48px" }}
            onKeyDown={(e) => {
              if (e.key === "Enter") addSubject();
            }}
          />

          <button
            onClick={addSubject}
            disabled={!name.trim()}
            style={{
              background: "#FF4FA3",
              color: "white",
              padding: "10px 18px",
              borderRadius: "12px",
              fontWeight: 800,
              border: "none",
              boxShadow: "0 10px 30px rgba(255,79,163,.18)",
              opacity: name.trim() ? 1 : 0.5,
              cursor: name.trim() ? "pointer" : "not-allowed",
              position: "relative",
              zIndex: 9999,
            }}
          >
            + Add
          </button>



        </div>
      </div>



      {/* grid */}
      {subjects.length === 0 ? (
        <div className="rounded-2xl bg-white/70 shadow-punti ring-1 ring-black/5 p-8 text-center">
          <div className="mt-2 font-extrabold">No subjects yet</div>
          <p className="mt-1 text-sm text-punti-muted">Add one above to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {subjects.map((s) => (
            <div
              key={s.id}
              onClick={() => nav(`/subjects/${s.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  nav(`/subjects/${s.id}`);
                }
              }}
              role="button"
              tabIndex={0}
              className="group rounded-2xl bg-white shadow-punti ring-1 ring-black/5 p-4 text-left
                         transition hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(255,79,163,.16)]
                         focus:outline-none focus:ring-4 focus:ring-punti-pink/20"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-base font-extrabold text-punti-text truncate">
                    {s.name}
                  </div>
                  <div className="mt-1 text-sm text-punti-muted">Open lectures</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label={`Delete ${s.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSubject(s.id, s.name);
                    }}
                    className="h-9 w-9 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600 font-black
                               hover:bg-red-500/20 focus:outline-none focus:ring-4 focus:ring-red-500/20"
                  >
                    x
                  </button>
                </div>
              </div>

              <div className="mt-3 h-1 w-full rounded-full bg-black/5 overflow-hidden">
                <div className="h-full w-1/3 rounded-full bg-punti-pink/70 transition-all group-hover:w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



