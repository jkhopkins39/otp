/**
 * Deterministic content pre-filter (no network).
 * Blatant junk is rejected before any AI / email / paid API call.
 */

const LEET: Record<string, string> = {
  "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "8": "b",
  "@": "a", "$": "s", "!": "i", "|": "i",
};

function normalize(value: unknown): string {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[01345789@$!|]/g, (c) => LEET[c] ?? c)
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function despace(text: string): string {
  return text.replace(/\b(?:[a-z] ){2,}[a-z]\b/g, (run) => run.replace(/ /g, ""));
}

function stretchy(term: string): RegExp {
  const body = term
    .split(" ")
    .map((word) => word.split("").map((ch) => `${ch}+`).join(""))
    .join(" +");
  return new RegExp(`\\b${body}s*\\b`);
}

const EXPLICIT = [
  "boob", "boobs", "booby", "titty", "titties", "tiddies", "tits",
  "cock", "blowjob", "blow job", "handjob", "rimjob", "deepthroat",
  "jizz", "wank", "wanker", "jerk off", "jack off",
  "pussy", "cunt", "twat", "slut", "whore",
  "suck my", "sucks my", "lick my", "eat my ass", "blow me", "up your ass",
  "porn", "porno", "pornhub", "milf", "bdsm",
  "fuck you", "fuck off", "fuck u", "stfu", "gtfo",
  "nigger", "nigga", "faggot", "fag", "tranny", "retard", "retarded",
  "kike", "wetback", "towelhead", "raghead",
  "kill yourself", "kys", "neck yourself",
].map(stretchy);

const JOKE_NAMES = [
  "hugh jass", "mike hunt", "mike oxlong", "mike oxmall", "mike rotch",
  "ben dover", "eileen dover", "seymour butts", "dixie normous", "dixie rect",
  "anita bath", "anita man", "phil mccracken", "jack mehoff", "jacques strap",
  "harry balls", "harry sack", "ivana tinkle", "oliver clothesoff",
  "hugh jorgan", "pat mycrotch", "al coholic", "moe lester", "connie lingus",
  "amanda hugginkiss", "bea oproblem", "i p freely", "ollie tabooger",
  "deez nuts", "joe mama", "your mom", "ur mom", "yo mama", "ligma", "sugma",
  "john doe", "jane doe", "bugs bunny", "mickey mouse", "donald duck",
  "john cena", "elon musk", "santa claus", "adolf hitler", "hitler",
].map(stretchy);

const LAUGHTER =
  /^(?:l+[oa]+l+(?:[oa]+l+)*|l+m+f?a+o+|(?:ha){2,}h?|(?:he){2,}h?|(?:hi){2,}|(?:ja){2,}|r+o+f+l+|x+d+|k+e+k+|b+a+h+a+|t+e+h+e+|y+e+e+t+|l+m+a+o+)+$/;

const FILLER_ONLY = new Set([
  "lol", "lmao", "lmfao", "rofl", "haha", "hehe", "hah", "heh", "xd", "kek",
  "yeet", "poggers", "bruh", "meh", "nvm", "blah", "blahblah",
  "asdf", "asdfasdf", "asdfghjkl", "qwerty", "qwertyuiop", "aaa", "aaaa",
  "test", "testing", "testtest", "ignorethis", "deeznuts",
]);

const MILD_PROFANITY = [
  "fuck", "fucking", "shit", "shitty", "bullshit", "bitch", "bastard",
  "asshole", "dumbass", "jackass", "damn", "crap", "piss", "dick", "prick",
  "idiot", "stupid", "moron", "sucks", "garbage", "trash",
].map(stretchy);

function matchAny(patterns: RegExp[], text: string): string | null {
  for (const re of patterns) {
    if (re.test(text)) return re.source.replace(/\\b|\+/g, "");
  }
  return null;
}

export type PrefilterHit = {
  category: string;
  reason: string;
  matched: string;
};

const DEFAULT_TEXT_KEYS = [
  "name", "company", "problem", "message", "details", "description",
  "additionalDetails", "additional_details",
];

/** Name field keys used for joke-alias checks and owner-test allowlist. */
export const NAME_KEYS = [
  "name", "full_name", "fullName", "contact_name", "referrer_name",
  "firstName", "lastName", "first_name", "last_name",
];

/**
 * Owner test allowlist: submissions from people named Jeremy always pass
 * screening and must fire the notification email (even for message "test").
 */
export function isOwnerTestSubmission(submission: Record<string, unknown>): boolean {
  const name = NAME_KEYS.map((k) => submission[k]).filter(Boolean).join(" ");
  const email = String(submission.email ?? "").trim().toLowerCase();
  if (/\bjeremy\b/i.test(name)) return true;
  if (email === "jeremy@hoppytech.com") return true;
  return false;
}

export const OWNER_TEST_SCREENING = {
  decision: "accept" as const,
  category: "genuine_inquiry",
  confidence: 100,
  reason: "Owner test submission (Jeremy allowlist).",
  screened: true,
  ownerTest: true,
};

export function prefilter(
  submission: Record<string, unknown>,
  textKeys: string[] = DEFAULT_TEXT_KEYS,
): PrefilterHit | null {
  const parts = textKeys.map((k) => despace(normalize(submission[k])));
  const name = despace(normalize(NAME_KEYS.map((k) => submission[k]).filter(Boolean).join(" ")));
  const company = despace(normalize(submission.company ?? submission.business_name ?? ""));
  const problem = parts.filter(Boolean).join(" ");
  const all = [name, company, problem].filter(Boolean).join(" | ");

  const explicit = matchAny(EXPLICIT, all);
  if (explicit) {
    return { category: "troll_or_abusive", reason: "Submission contains explicit or abusive language.", matched: explicit };
  }

  const joke = matchAny(JOKE_NAMES, `${name} ${company}`.trim());
  if (joke) {
    return { category: "troll_or_abusive", reason: "Submitted under a joke alias.", matched: joke };
  }

  if (problem) {
    const collapsed = problem.replace(/\s+/g, "");
    if (LAUGHTER.test(collapsed)) {
      return { category: "troll_or_abusive", reason: "Message is nothing but laughter.", matched: "laughter" };
    }
    if (FILLER_ONLY.has(collapsed)) {
      return { category: "test_submission", reason: "Message contains no actual request.", matched: collapsed };
    }
    if (collapsed.length >= 10 && !/[aeiouy]/.test(collapsed)) {
      return { category: "gibberish", reason: "Message is not readable text.", matched: "no-vowels" };
    }
  }

  return null;
}

export function hasMildProfanity(
  submission: Record<string, unknown>,
  textKeys?: string[],
): boolean {
  const keys = textKeys ?? Object.keys(submission ?? {});
  const text = despace(normalize(keys.map((k) => submission[k]).filter(Boolean).join(" ")));
  return Boolean(matchAny(MILD_PROFANITY, text));
}
