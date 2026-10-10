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

/** The picture to draw for an entry: its cutout when it has one, else the photo as taken. */
export function shownPhotoId(en) {
  return en?.cutout_file_id || en?.photo_id || "";
}

/**
 * What to tell someone whose request to remove a photo's background was
 * refused. `status` is the hub's HTTP status and `detail` its reply.
 *
 * A 429 is two different refusals: with a `limit` in the reply it is the
 * household's monthly allowance, without one it is the hub's per-minute limit.
 */
export function cutoutRefusal(status, detail = null) {
  if (status === 429 && typeof detail?.limit === "number") {
    return `This month's ${detail.limit} photo cutouts are used up. The photo is kept as taken.`;
  }
  if (status === 429) return "Too many requests just now. Try again in a minute.";
  if (status === 409) return "The background is already being removed. Try again in a few seconds.";
  if (status === 402) return "Removing photo backgrounds needs an active plan.";
  if (status === 503) return "Removing photo backgrounds is unavailable right now. Try again later.";
  if (status === 413) return "That photo is too large to remove the background from.";
  if (status === 415) return "The background can only be removed from a JPEG, PNG or WebP photo.";
  if (status === 507) return "There is no storage left for a photo with its background removed.";
  return "The background could not be removed.";
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

/**
 * The picture to draw where it is shown small: the small copy of whichever
 * picture is shown, else that picture itself. A cutout's small copy and the
 * photo's are different pictures, so neither stands in for the other.
 */
export function tilePhotoId(row) {
  if (row?.cutout_file_id) return row.cutout_thumb_file_id || row.cutout_file_id;
  return row?.thumb_file_id || row?.photo_id || "";
}
