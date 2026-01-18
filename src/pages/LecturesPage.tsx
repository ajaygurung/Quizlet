import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Store } from "../lib/store";
import { BackLink } from "../ui";

export default function LecturesPage() {
  const nav = useNavigate();
  const { subjectId } = useParams();
  const sid = subjectId ?? "";

  const [name, setName] = useState("");
  const [tick, setTick] = useState(0);

  const lectures = useMemo(() => Store.getLectures(sid), [sid, tick]);

  const addLecture = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    Store.addLecture(sid, trimmed);
    setName("");
    setTick((t) => t + 1);
  };
  const deleteLecture = (lectureId: string, lectureName: string) => {
    const confirmed = window.confirm(
      `Delete "${lectureName}"? This will remove all flashcards.`
    );
    if (!confirmed) return;
    Store.deleteLecture(lectureId);
    setTick((t) => t + 1);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
              <BackLink to="/" label="Subjects" />
            </div>
      
      <div className="text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-punti-text">
          Lectures
        </h1>
        <p className="mt-1 text-sm text-punti-muted">
          Create lectures and add flashcards inside each one.
        </p>
      </div>

      {/* Add Lecture */}
      <div className="rounded-xl bg-white shadow-punti ring-1 ring-black/5 p-3">
        <div className="flex gap-2 items-center">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New lecture (e.g., Lecture 3)"
            className="flex-1 rounded-lg bg-white px-4 py-2.5 text-sm outline-none
                       ring-1 ring-black/10 focus:ring-2 focus:ring-punti-pink"
            style={{ height: "48px" }}
            onKeyDown={(e) => {
              if (e.key === "Enter") addLecture();
            }}
          />

<button
  onClick={addLecture}
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

      {/* Lectures Grid */}
      {lectures.length === 0 ? (
        <div className="rounded-xl bg-white/70 shadow-punti ring-1 ring-black/5 p-8 text-center">
          <div className="text-3xl">📘</div>
          <div className="mt-2 font-extrabold">No lectures yet</div>
          <p className="mt-1 text-sm text-punti-muted">
            Add your first lecture above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {lectures.map((l) => {
            const count = Store.getCards(l.id).length;

            return (
              <div
                key={l.id}
                onClick={() => nav(`/subjects/${sid}/lectures/${l.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    nav(`/subjects/${sid}/lectures/${l.id}`);
                  }
                }}
                role="button"
                tabIndex={0}
                className="group rounded-xl bg-white shadow-punti ring-1 ring-black/5 p-4 text-left
                           transition hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(255,79,163,.16)]
                           focus:outline-none focus:ring-4 focus:ring-punti-pink/20"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-base font-extrabold text-punti-text truncate">
                      {l.name}
                    </div>
                    <div className="mt-1 text-sm text-punti-muted">
                      {count} flashcards
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={`Delete ${l.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteLecture(l.id, l.name);
                      }}
                      className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-600 font-black
                                 hover:bg-red-500/20 focus:outline-none focus:ring-4 focus:ring-red-500/20"
                    >
                      x
                    </button>
                    <span className="rounded-full bg-punti-pink/10 px-2.5 py-1 text-xs font-semibold text-punti-pink">
                      {count}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}




