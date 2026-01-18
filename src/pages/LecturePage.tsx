import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Store } from "../lib/store";
import { BackLink } from "../ui";

export default function LecturePage() {
  const { subjectId, lectureId } = useParams();
  const sid = subjectId ?? "";
  const lid = lectureId ?? "";

  const [tick, setTick] = useState(0);
  const [showEditor, setShowEditor] = useState(false);
  const cards = useMemo(() => Store.getCards(lid), [lid, tick]);
  const cardCount = cards.length;

  const removeCard = (cardId: string) => {
    Store.deleteCard(cardId);
    setTick((t) => t + 1);
  };

  return (
    <div className="space-y-4">
      {/* Top row */}
      <div className="flex items-center justify-between gap-3">
              <BackLink to={`/subjects/${sid}`} label="Lectures" />
            </div>


      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-punti-text">
          Lecture
        </h1>
        <p className="mt-1 text-sm text-punti-muted">
          Add flashcards or start studying.
        </p>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Add flashcards */}
        <Link
          to={`/subjects/${sid}/lectures/${lid}/import`}
          className="rounded-xl bg-white shadow-punti ring-1 ring-black/5 p-4
               transition hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(255,79,163,.14)]
               focus:outline-none focus:ring-4 focus:ring-punti-pink/20"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-base font-extrabold text-punti-text">
                + Add Flashcards
              </div>
              <div className="mt-1 text-sm text-punti-muted">
                Paste Q/A and save to this lecture.
              </div>
            </div>
          </div>
        </Link>

        {/* Study */}
        {cardCount === 0 ? (
          <div className="rounded-xl bg-white shadow-punti ring-1 ring-black/5 p-4 opacity-95">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-base font-extrabold text-punti-text">
                  Study Flashcards
                </div>
                <div className="mt-1 text-sm text-punti-muted">
                  Add cards to enable study.
                </div>
              </div>

              <div className="h-10 w-10 rounded-xl bg-black/5 flex items-center justify-center text-punti-muted font-black">
                ▶
              </div>
            </div>
          </div>
        ) : (
          <Link
            to={`/subjects/${sid}/lectures/${lid}/flashcards`}
            className="rounded-xl bg-gradient-to-r from-pink-500 to-punti-pink text-white shadow-punti ring-1 ring-black/5 p-4
           transition hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(255,79,163,.22)]
           focus:outline-none focus:ring-4 focus:ring-punti-pink/20"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-base font-extrabold">Study Flashcards</div>
                <div className="mt-1 text-sm text-white/90">
                  One card at a time. Tap to flip.
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* card count badge now belongs HERE */}
                <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold text-white">
                  {cardCount} cards
                </span>

                <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center font-black">
                  ▶
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Edit flashcards */}
        <button
          type="button"
          onClick={() => setShowEditor((v) => !v)}
          className="rounded-xl bg-white shadow-punti ring-1 ring-black/5 p-4 text-left
                     transition hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(255,79,163,.14)]
                     focus:outline-none focus:ring-4 focus:ring-punti-pink/20"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-base font-extrabold text-punti-text">
                Edit Flashcards
              </div>
              <div className="mt-1 text-sm text-punti-muted">
                {showEditor ? "Hide list" : "Show list and remove cards"}
              </div>
            </div>

          </div>
        </button>
      </div>

      {showEditor ? (
        cards.length === 0 ? (
          <div className="rounded-xl bg-white/70 shadow-punti ring-1 ring-black/5 p-4 text-sm text-punti-muted">
            No flashcards yet.
          </div>
        ) : (
          <div className="rounded-xl bg-white shadow-punti ring-1 ring-black/5 p-4 space-y-3">
            {cards.map((card, i) => (
              <div
                key={card.id}
                className="rounded-lg bg-punti-bg ring-1 ring-black/5 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-punti-muted">
                      Card {i + 1}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-punti-text">
                      Q: {card.question}
                    </div>
                    <div className="mt-1 text-sm text-punti-muted">
                      A: {card.answer}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeCard(card.id)}
                    className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-600 font-black
                               hover:bg-red-500/20 focus:outline-none focus:ring-4 focus:ring-red-500/20"
                  >
                    x
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : null}


      {/* Paste format info */}
      <div className="rounded-xl bg-white/80 shadow-punti ring-1 ring-black/5 p-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-punti-pink/10 flex items-center justify-center text-punti-pink">
            ✨
          </div>

          <div className="min-w-0">
            <div className="font-extrabold text-punti-text">Paste format</div>
            <p className="mt-1 text-sm text-punti-muted">
              Use <span className="font-semibold text-punti-text">Question:</span> and{" "}
              <span className="font-semibold text-punti-text">Answer:</span> for each card.
              Multi-line is allowed.
            </p>

            <div className="mt-3 rounded-lg bg-punti-bg ring-1 ring-black/5 p-3 text-sm">
              <div className="font-semibold text-punti-text">Example</div>
              <pre className="mt-2 whitespace-pre-wrap text-xs text-punti-muted">
                {`Question: What is CT?
Answer: Computed Tomography.

Question: Why do we use collimation?
Answer: Reduce scatter and patient dose.`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
