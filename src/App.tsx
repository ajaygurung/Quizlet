import { Routes, Route, Navigate, Link } from "react-router-dom";
import LecturePage from "./pages/LecturePage";
import FlashcardsPlayerPage from "./pages/FlashcardsPlayerPage";
import SubjectsPage from "./pages/SubjectsPage";
import LecturesPage from "./pages/LecturesPage";
import ImportFlashcardsPage from "./pages/ImportFlashcardsPage";

export default function App() {
  return (
    <div className="min-h-screen punti-gradient text-punti-text">
      <header className="sticky top-0 z-10 border-b border-punti-border bg-white/70 backdrop-blur">
  <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
    <div className="flex items-center gap-3">
      <div className="relative h-10 w-10 rounded-2xl bg-gradient-to-br from-punti-pink/30 to-white flex items-center justify-center shadow-punti border border-punti-border">
        <span className="text-punti-pink font-extrabold">
          <Link to="/">
          S
          </Link>
          </span>
        <span className="absolute -right-1 -bottom-1 h-3 w-3 rounded-full bg-punti-pink shadow-punti" />
      </div>

      <div className="leading-tight">
        <div className="text-lg font-extrabold tracking-tight">
          <Link to="/">
          Baby Girl
          </Link>
          </div>
        <div className="text-xs text-punti-muted">flashcards • subjects • lectures</div>
      </div>
    </div>

    <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-punti-border bg-white/80 px-3 py-1 text-xs text-punti-muted shadow-punti">
      <span className="h-2 w-2 rounded-full bg-punti-pink" />
      Tap card to flip 💗
    </span>
  </div>
</header>


      <main className="mx-auto max-w-5xl px-4 py-4">
        <Routes>
          <Route path="/" element={<SubjectsPage />} />
          <Route path="/subjects/:subjectId" element={<LecturesPage />} />
          <Route path="/subjects/:subjectId/lectures/:lectureId" element={<LecturePage />} />
          <Route path="/subjects/:subjectId/lectures/:lectureId/import" element={<ImportFlashcardsPage />} />
          <Route path="/subjects/:subjectId/lectures/:lectureId/flashcards" element={<FlashcardsPlayerPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
