import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Store, type Card } from "../lib/store";

export default function FlashcardsPlayerPage() {
  const nav = useNavigate();
  const { subjectId, lectureId } = useParams();
  const sid = subjectId ?? "";
  const lid = lectureId ?? "";

  const [cards, setCards] = useState<Card[]>([]);
  
  useEffect(() => {
    Store.getCards(lid).then(setCards).catch(console.error);
  }, [lid]);

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const total = cards.length;
  const safeIndex = Math.min(index, Math.max(0, total - 1));
  const current = cards[safeIndex];

  const goPrev = () => {
    setIndex((i) => Math.max(0, i - 1));
    setFlipped(false);
  };

  const goNext = () => {
    setIndex((i) => Math.min(total - 1, i + 1));
    setFlipped(false);
  };

  if (total === 0) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => nav(`/subjects/${sid}/lectures/${lid}`)}
          className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-sm font-semibold
             text-punti-text shadow-punti ring-1 ring-black/5 hover:bg-white"
        >
          ← Lecture
        </button>

        <div className="rounded-xl bg-white/80 shadow-punti ring-1 ring-black/5 p-8 text-center">
          <div className="text-4xl">🫧</div>
          <div className="mt-2 text-lg font-extrabold text-punti-text">No flashcards yet</div>
          <p className="mt-1 text-sm text-punti-muted">Add flashcards to start studying.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top row */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => nav(`/subjects/${sid}/lectures/${lid}`)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 14px",
          borderRadius: "999px",
          background: "rgba(255,79,163,0.08)",
          color: "#FF4FA3",
          fontSize: "14px",
          fontWeight: 700,
          border: "none",
          cursor: "pointer",
          transition: "all 160ms ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,79,163,0.14)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,79,163,0.08)";
        }}
      >
        ← Lecture
      </button>

        <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-punti-muted shadow-punti">
          {safeIndex + 1} / {total}
        </span>
      </div>

      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-punti-text">Flashcards</h1>
        <p className="mt-1 text-sm text-punti-muted">Tap the card to flip.</p>
      </div>

      {/* Card */}
      <div className="flip-scene mx-auto max-w-4xl w-full">
        <button onClick={() => setFlipped(f => !f)} className="w-full">

          <div
            className={[
              "flip-card relative w-full rounded-2xl bg-white shadow-punti ring-1 ring-black/5",
              "min-h-[240px] sm:min-h-[300px]",
              "p-5 sm:p-6",
              "transition",
              flipped ? "is-flipped" : "",
            ].join(" ")}
          >
            {/* Front */}
            <div className="flip-face absolute inset-0 p-6 sm:p-8">
              <div className="flex items-start justify-between">
                <span className="inline-flex items-center rounded-full bg-punti-pink/10 px-3 py-1 text-xs font-semibold text-punti-pink">
                  Question
                </span>
                <span className="text-xs text-punti-muted">Tap to flip 💗</span>
              </div>

              {/* center area */}
              <div className="mt-4 flex h-[calc(100%-44px)] items-center justify-center">
                <div className="w-full max-w-3xl text-center">
                  <div className="text-xl sm:text-l tracking-tight text-punti-text whitespace-pre-wrap">
                    {current?.question ?? ""}
                  </div>
                </div>
              </div>
            </div>


            {/* Back */}
            <div className="flip-face flip-back absolute inset-0 p-6 sm:p-8">
              <div className="flex items-start justify-between">
                <span className="inline-flex items-center rounded-full bg-punti-pink/10 px-3 py-1 text-xs font-semibold text-punti-pink">
                  Answer
                </span>
                <span className="text-xs text-punti-muted">Tap to flip 💗</span>
              </div>

              {/* center area */}
              <div className="mt-4 flex h-[calc(100%-44px)] items-center justify-center">
                <div className="w-full max-w-3xl text-center">
                  <div className="text-lg sm:text-2xl text-punti-text whitespace-pre-wrap leading-relaxed">
                    {current?.answer ?? ""}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </button>
      </div>

      {/* Bottom controls */}
      <div className="mt-4">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white/80 backdrop-blur
                  shadow-[0_18px_55px_rgba(0,0,0,.08)]
                  ring-1 ring-black/5 px-4 py-3">
          <div className="grid grid-cols-3 items-center gap-3">
            {/* Prev */}
            <button
              onClick={goPrev}
              disabled={safeIndex === 0}
              className={`justify-self-start inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold
          transition active:scale-[0.98]
          ${safeIndex === 0
                  ? "bg-black/5 text-punti-muted cursor-not-allowed"
                  : "bg-white text-punti-text ring-1 ring-black/10 hover:bg-black/[0.02]"
                }`}
            >
              <span className="text-base">←</span> Previous
            </button>

            {/* Progress */}
            <div className="flex flex-col items-center">
              <div className="text-xs font-semibold text-punti-muted">
                {safeIndex + 1} of {total}
              </div>

              <div className="mt-2 h-2 w-44 sm:w-64 rounded-full bg-black/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-punti-pink/80 to-pink-500/80"
                  style={{ width: `${((safeIndex + 1) / total) * 100}%` }}
                />
              </div>
            </div>

            {/* Next */}
            <button
              onClick={goNext}
              disabled={safeIndex === total - 1}
              style={{
                background: safeIndex === total - 1 ? "#F2F2F2" : "#FF4FA3",
                color: safeIndex === total - 1 ? "#999" : "white",
                padding: "10px 20px",
                borderRadius: "12px",
                fontWeight: 800,
                border: "none",
                boxShadow:
                  safeIndex === total - 1
                    ? "none"
                    : "0 10px 30px rgba(255,79,163,.25)",
                opacity: safeIndex === total - 1 ? 0.5 : 1,
                cursor: safeIndex === total - 1 ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                transition: "transform 120ms ease, box-shadow 120ms ease",
              }}
              onMouseDown={(e) => {
                if (safeIndex !== total - 1)
                  (e.currentTarget.style.transform = "scale(0.97)");
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Next <span style={{ fontSize: "16px" }}>→</span>
            </button>



          </div>
        </div>
      </div>




    </div>
  );
}
