import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Store } from "../lib/store";
import { BackLink, PageTitle, SectionCard } from "../ui";
import { parseFlashcards } from "../lib/parseFlashCards";

const sample = `Question: What is CT?
Answer: Computed Tomography.`;

export default function ImportFlashcardsPage() {
  const { subjectId, lectureId } = useParams();
  const sid = subjectId ?? "";
  const lid = lectureId ?? "";
  const nav = useNavigate();

  const [text, setText] = useState("");
  const parsed = useMemo(() => parseFlashcards(text), [text]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <BackLink to={`/subjects/${sid}/lectures/${lid}`} label="Lecture" />
      </div>

      <PageTitle
        title="Add Flashcards"
        subtitle='Paste using "Question:" and "Answer:" — multi-line is allowed.'
      />

      <SectionCard>
        <textarea
          className="punti-input min-h-[240px] font-medium"
          value={text}
          placeholder={sample}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="mt-3 flex flex-col sm:flex-row gap-3">
          <button
            className={`punti-btn-primary w-full sm:w-auto ${
              parsed.cards.length === 0 || parsed.errors.length > 0 ? "opacity-50 pointer-events-none" : ""
            }`}
            onClick={async () => {
              if (parsed.cards.length === 0 || parsed.errors.length > 0) return;
              await Store.addCards(lid, parsed.cards);
              nav(`/subjects/${sid}/lectures/${lid}`);
            }}
          >
            Save to Lecture
          </button>

          <button className="punti-btn-ghost w-full sm:w-auto" onClick={() => setText("")}>
            Reset Sample
          </button>
        </div>

        {parsed.errors.length > 0 && (
          <div className="mt-4 rounded-xl2 border border-rose-200 bg-rose-50 p-3">
            <div className="font-extrabold text-rose-700">Fix these first:</div>
            <ul className="mt-2 list-disc pl-5 text-sm text-rose-700">
              {parsed.errors.map((e, idx) => (
                <li key={idx}>{e}</li>
              ))}
            </ul>
          </div>
        )}
      </SectionCard>

      <SectionCard>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-extrabold">Preview</div>
            <p className="text-sm text-punti-muted">Shows first 2 cards.</p>
          </div>
          <span className="punti-chip">💗</span>
        </div>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {parsed.cards.slice(0, 2).map((c, idx) => (
            <div key={idx} className="rounded-xl2 border border-punti-border bg-white p-4">
              <div className="punti-chip mb-2">Q</div>
              <pre className="whitespace-pre-wrap text-sm font-semibold text-punti-text">{c.question}</pre>
              <div className="punti-chip mt-3 mb-2">A</div>
              <pre className="whitespace-pre-wrap text-sm text-punti-text">{c.answer}</pre>
            </div>
          ))}
          {parsed.cards.length === 0 && (
            <div className="sm:col-span-2 text-center py-8 text-sm text-punti-muted">
              Paste content above to see preview ✨
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
