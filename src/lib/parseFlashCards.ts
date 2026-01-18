export type ParsedCard = { question: string; answer: string };

function isQuestionLine(line: string) {
  return /^\s*question\s*:/i.test(line);
}

function isAnswerLine(line: string) {
  return /^\s*answer\s*:/i.test(line);
}

function stripLabel(line: string) {
  // removes "Question:" or "Answer:" (case-insensitive) and trims
  return line.replace(/^\s*(question|answer)\s*:\s*/i, "").trimEnd();
}

export function parseFlashcards(input: string): { cards: ParsedCard[]; errors: string[] } {
  const errors: string[] = [];
  const lines = input.replace(/\r\n/g, "\n").split("\n");

  type Draft = { qLines: string[]; aLines: string[]; startedAtLine: number };
  let current: Draft | null = null;
  let mode: "q" | "a" | null = null;

  const cards: ParsedCard[] = [];

  const flush = () => {
    if (!current) return;

    const question = current.qLines.join("\n").trim();
    const answer = current.aLines.join("\n").trim();

    if (!question && !answer) {
      // empty block, ignore
      current = null;
      mode = null;
      return;
    }

    if (!question) {
      errors.push(`A card starting near line ${current.startedAtLine} is missing a Question.`);
    } else if (!answer) {
      errors.push(`A card starting near line ${current.startedAtLine} is missing an Answer.`);
    } else {
      cards.push({ question, answer });
    }

    current = null;
    mode = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const lineNo = i + 1;

    // Allow completely blank lines anywhere
    if (raw.trim() === "") continue;

    if (isQuestionLine(raw)) {
      // New card starts -> flush previous
      flush();
      current = { qLines: [], aLines: [], startedAtLine: lineNo };
      mode = "q";

      const content = stripLabel(raw).trim();
      if (content) current.qLines.push(content);
      continue;
    }

    if (isAnswerLine(raw)) {
      if (!current) {
        // Answer without a preceding Question
        errors.push(`Line ${lineNo}: Found "Answer:" before any "Question:".`);
        mode = null;
        continue;
      }
      mode = "a";
      const content = stripLabel(raw).trim();
      if (content) current.aLines.push(content);
      continue;
    }

    // Regular line (part of current question/answer)
    if (!current) {
      // Text before first Question: -> ignore (or you could treat as error)
      continue;
    }

    if (mode === "q") current.qLines.push(raw.trimEnd());
    else if (mode === "a") current.aLines.push(raw.trimEnd());
    else {
      // We have a card but haven't seen Answer: yet; safest is treat as question continuation
      current.qLines.push(raw.trimEnd());
      mode = "q";
    }
  }

  flush();

  return { cards, errors };
}
