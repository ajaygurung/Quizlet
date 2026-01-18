export type Subject = { id: string; name: string };
export type Lecture = { id: string; subjectId: string; name: string };
export type Card = { id: string; lectureId: string; question: string; answer: string };

type Db = {
  subjects: Subject[];
  lectures: Lecture[];
  cards: Card[];
};

const KEY = "study_pwa_db_v1";

function loadDb(): Db {
  const raw = localStorage.getItem(KEY);
  if (!raw) return { subjects: [], lectures: [], cards: [] };
  try {
    return JSON.parse(raw) as Db;
  } catch {
    return { subjects: [], lectures: [], cards: [] };
  }
}

function saveDb(db: Db) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

export function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export const Store = {
  // Subjects
  getSubjects(): Subject[] {
    return loadDb().subjects;
  },
  addSubject(name: string): Subject {
    const db = loadDb();
    const subject = { id: uid("sub"), name: name.trim() };
    db.subjects.push(subject);
    saveDb(db);
    return subject;
  },
  deleteSubject(subjectId: string) {
    const db = loadDb();
    const lectureIds = db.lectures
      .filter((l) => l.subjectId === subjectId)
      .map((l) => l.id);
    const lectureIdSet = new Set(lectureIds);
    db.subjects = db.subjects.filter((s) => s.id !== subjectId);
    db.lectures = db.lectures.filter((l) => l.subjectId !== subjectId);
    if (lectureIdSet.size > 0) {
      db.cards = db.cards.filter((c) => !lectureIdSet.has(c.lectureId));
    }
    saveDb(db);
  },

  // Lectures
  getLectures(subjectId: string): Lecture[] {
    return loadDb().lectures.filter((l) => l.subjectId === subjectId);
  },
  addLecture(subjectId: string, name: string): Lecture {
    const db = loadDb();
    const lecture = { id: uid("lec"), subjectId, name: name.trim() };
    db.lectures.push(lecture);
    saveDb(db);
    return lecture;
  },
  deleteLecture(lectureId: string) {
    const db = loadDb();
    db.lectures = db.lectures.filter((l) => l.id !== lectureId);
    db.cards = db.cards.filter((c) => c.lectureId !== lectureId);
    saveDb(db);
  },

  // Cards
  getCards(lectureId: string): Card[] {
    return loadDb().cards.filter((c) => c.lectureId === lectureId);
  },
  addCards(lectureId: string, cards: Omit<Card, "id" | "lectureId">[]) {
    const db = loadDb();
    const newCards: Card[] = cards.map((c) => ({
      id: uid("card"),
      lectureId,
      question: c.question,
      answer: c.answer,
    }));
    db.cards.push(...newCards);
    saveDb(db);
    return newCards.length;
  },
  deleteCard(cardId: string) {
    const db = loadDb();
    db.cards = db.cards.filter((c) => c.id !== cardId);
    saveDb(db);
  },
};
