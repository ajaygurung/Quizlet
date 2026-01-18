import { supabase } from "./supabase";

export type Subject = { id: string; name: string };
export type Lecture = { id: string; subjectId: string; name: string };
export type Card = { id: string; lectureId: string; question: string; answer: string };

export function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  const uid = data.user?.id;
  if (!uid) throw new Error("Not signed in");
  return uid;
}

export const Store = {
  // -------- AUTH --------
  async signUp(email: string, password: string) {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  },

  async signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  // -------- SUBJECTS --------
  async getSubjects(): Promise<Subject[]> {
    const user_id = await requireUserId();
    const { data, error } = await supabase
      .from("subjects")
      .select("id,name")
      .eq("user_id", user_id)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return (data ?? []).map((s) => ({ id: s.id, name: s.name }));
  },

  async addSubject(name: string): Promise<Subject> {
    const user_id = await requireUserId();
    const subject: Subject = { id: uid("sub"), name: name.trim() };

    const { error } = await supabase.from("subjects").insert({
      id: subject.id,
      user_id,
      name: subject.name,
    });

    if (error) throw error;
    return subject;
  },

  async deleteSubject(subjectId: string) {
    // cascades delete lectures + cards because of FK on delete cascade
    const user_id = await requireUserId();
    const { error } = await supabase
      .from("subjects")
      .delete()
      .eq("user_id", user_id)
      .eq("id", subjectId);

    if (error) throw error;
  },

  // -------- LECTURES --------
  async getLectures(subjectId: string): Promise<Lecture[]> {
    const user_id = await requireUserId();
    const { data, error } = await supabase
      .from("lectures")
      .select("id,subject_id,name")
      .eq("user_id", user_id)
      .eq("subject_id", subjectId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return (data ?? []).map((l) => ({
      id: l.id,
      subjectId: l.subject_id,
      name: l.name,
    }));
  },

  async addLecture(subjectId: string, name: string): Promise<Lecture> {
    const user_id = await requireUserId();
    const lecture: Lecture = { id: uid("lec"), subjectId, name: name.trim() };

    const { error } = await supabase.from("lectures").insert({
      id: lecture.id,
      user_id,
      subject_id: lecture.subjectId,
      name: lecture.name,
    });

    if (error) throw error;
    return lecture;
  },

  async deleteLecture(lectureId: string) {
    const user_id = await requireUserId();
    const { error } = await supabase
      .from("lectures")
      .delete()
      .eq("user_id", user_id)
      .eq("id", lectureId);

    if (error) throw error;
  },

  // -------- CARDS --------
  async getCards(lectureId: string): Promise<Card[]> {
    const user_id = await requireUserId();
    const { data, error } = await supabase
      .from("cards")
      .select("id,lecture_id,question,answer")
      .eq("user_id", user_id)
      .eq("lecture_id", lectureId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return (data ?? []).map((c) => ({
      id: c.id,
      lectureId: c.lecture_id,
      question: c.question,
      answer: c.answer,
    }));
  },

  async addCards(lectureId: string, cards: Omit<Card, "id" | "lectureId">[]) {
    const user_id = await requireUserId();
    const rows = cards.map((c) => ({
      id: uid("card"),
      user_id,
      lecture_id: lectureId,
      question: c.question,
      answer: c.answer,
    }));

    const { error } = await supabase.from("cards").insert(rows);
    if (error) throw error;
    return rows.length;
  },

  async deleteCard(cardId: string) {
    const user_id = await requireUserId();
    const { error } = await supabase
      .from("cards")
      .delete()
      .eq("user_id", user_id)
      .eq("id", cardId);

    if (error) throw error;
  },
};
