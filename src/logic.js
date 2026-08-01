// Pure, testable logic extracted from index.html.
// No DOM, no network — safe to import from Node for unit tests.

export const QUESTIONS = [
  "How old are you?",
  "What is your favorite color?",
  "What is your favorite food?",
  "What do you want to be when you grow up?",
  "Who is your best friend?",
  "What is your favorite thing to do?",
  "What is your favorite book, show, or game?",
  "What always makes you happy?",
  "What are you really good at?",
  "What do you love most about our family?",
];

export const SIZE_FIELDS = [
  { key: "shirt", label: "Shirt" },
  { key: "pants", label: "Pants" },
  { key: "shoe", label: "Shoe" },
  { key: "coat", label: "Coat" },
  { key: "other", label: "Other" },
];

export function fmtHeight(inches) {
  if (!inches && inches !== 0) return "";
  const n = Number(inches);
  if (!n) return "";
  const ft = Math.floor(n / 12), rem = Math.round((n % 12) * 10) / 10;
  return ft ? `${ft}′${rem}″` : `${rem}″`;
}

export function kidById(kids, members, id) {
  return kids.find(k => k.id === id) ?? members.find(m => m.id === id) ?? null;
}

export function sizeFor(sizes, kidId) {
  return sizes.find(s => s.kid_id === kidId) ?? null;
}

/**
 * Fields the in-app search matches against (see hub-sdk `searchMatch`).
 * The interview answers are the journal — searching them is how you
 * find the year they said they wanted to be a marine biologist. The
 * column stores JSON, so the caller passes the answers in as text.
 */
export function searchableFields(entry, interviewText = "") {
  return [entry.note, entry.age_label, entry.entry_date, interviewText];
}

/** Flatten a stored interview JSON blob into plain text for searching. */
export function interviewText(raw) {
  try {
    const qa = JSON.parse(raw ?? "[]");
    return Array.isArray(qa) ? qa.map((x) => `${x.q ?? ""} ${x.a ?? ""}`).join(" ") : "";
  } catch {
    return "";
  }
}
