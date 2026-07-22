import { expenseType, transactionCategory } from "@/types/expanse";

export type ParsedEntry = {
  amount: number;
  type: "income" | "expense";
  category: transactionCategory;
  description: string;
  confidence: number;
  isLending?: boolean; // true => candidate for UdharTransactions routing
  dateOffsetDays?: number; // days BEFORE the capture date (0 = capture day)
  date?: string;
};


export const CONFIDENCE_THRESHOLD = 0.5;

const INCOME_WORDS =
  /\b(salary|income|got|get|gotten|received|recieved|credited|earned|refund|cashback|bonus|prize|reward|won|paid me|sold|profit|gift(?:ed)?)\b/i;

// Lending / borrowing / repayment — detected before everything else.
const LENDING_WORDS =
  /\b(lend|lent|lended|borrow|borrowed|udhar|loan|loaned|repaid|repay|returned|return|owe|owed|paid back|get back|got back|give back|gave back)\b/i;
const MONEY_IN =
  /\b(get back|got back|received back|returned|repaid|paid back|back my|refund)\b/i;
const MONEY_OUT =
  /\b(lend|lent|lended|loan(?:ed)?|gave|give|borrow(?:ed)?\s+to)\b/i;

// ─────────────────────────────────────────────────────────────
// Category rules — first match wins. Tuned for Indian English,
// plurals, and common typos. Add a word here and it's supported.
// ─────────────────────────────────────────────────────────────
const CATEGORY_RULES: {
  cat: transactionCategory;
  re: RegExp;
}[] = [
  { cat: "Salary", re: /\b(salary|payday|wage|stipend)\b/i },
  {
    cat: "Gift",
    re: /\b(gift|gifted|present|prize|reward|won|inheritance)\b/i,
  },
  {
    cat: "Business",
    re: /\b(business|client|invoice|freelance|freelancing|project\s?payment|vendor|supplier|stock|inventory|wholesale|profit|commission|deal)\b/i,
  },
  {
    cat: "Bill",
    re: /\b(bill|bills|electric|electricity|current\s?bill|water\s?bill|internet|wifi|wi-fi|broadband|fiber|dth|emi|insurance|premium|subscription|netflix|spotify|prime|hotstar)\b/i,
  },
  {
    cat: "Fuel",
    re: /\b(fuel|fule|feul|petrol|petrl|diesel|gas|cng|pump|scooty|scuty|scooter|bike|car)\b/i,
  },
  {
    cat: "Recharge",
    re: /\b(recharge|recharg|rechrge|topup|top-up|jio|airtel|vi|vodafone|data\s?pack|prepaid|mobile\s?plan|talktime)\b/i,
  },
  { cat: "Rent", re: /\b(rent|deposit|landlord|pg|hostel|lease)\b/i },
  {
    cat: "Travels",
    re: /\b(travel|trip|tour|touring|uber|ola|rapido|cab|taxi|auto|bus|train|flight|ticket|metro|toll|parking|mamabari|outing|vacation)\b/i,
  },
  {
    cat: "Shopping",
    re: /\b(shopping|shop|cloth(?:es|ing)?|shirt|shirts|shari|saree|sari|pant|pants|shoe|shoes|amazon|flipkart|filpakar|flipkar|myntra|meesho|ajio|dress|electronics?|gadget|headphone|headphones|earphone|keyboard|mouse|laptop|phone|watch|order)\b/i,
  },
  {
    cat: "Food",
    re: /\b(food|foods|lunch|dinner|breakfast|snack|snacks|chai|tea|coffee|eggroll|roll|momo|samosa|swiggy|zomato|restaurant|hotel|dhaba|grocery|groceries|milk|vegetable|veggies|fruit|fruits|meal|meals|pizza|burger|biryani|eat|eating|ate)\b/i,
  },
];

// ─────────────────────────────────────────────────────────────
// Amount extraction
// ─────────────────────────────────────────────────────────────

const WORD_NUM: Record<string, number> = {
  hundred: 100,
  thousand: 1000,
  lakh: 100000,
  k: 1000,
};

function extractAmount(text: string): { amount: number; conf: number } {
  const t = text.toLowerCase();
  const kMatch = t.match(/(\d+(?:\.\d+)?)\s*k\b/);
  if (kMatch)
    return { amount: Math.round(parseFloat(kMatch[1]) * 1000), conf: 0.9 };
  const wordMatch = t.match(/(\d+(?:\.\d+)?)\s*(hundred|thousand|lakh)\b/);
  if (wordMatch)
    return {
      amount: Math.round(parseFloat(wordMatch[1]) * WORD_NUM[wordMatch[2]]),
      conf: 0.85,
    };
  const numMatches = [
    ...t.matchAll(/(?:₹|rs\.?|inr\s*)?\s*(\d[\d,]*(?:\.\d+)?)/g),
  ]
    .map((m) => parseFloat(m[1].replace(/,/g, "")))
    .filter((n) => !isNaN(n) && n > 0);
  if (numMatches.length === 0) return { amount: 0, conf: 0 };
  const amount = Math.max(...numMatches);
  const hasCurrency = /(?:₹|rs\.?|rupees?|ruppes?|inr)/i.test(t);
  return {
    amount,
    conf: hasCurrency ? 0.85 : numMatches.length === 1 ? 0.75 : 0.6,
  };
}


// ─────────────────────────────────────────────────────────────
// Short 5–6 word description (strips amounts, filler, verbs)
// ─────────────────────────────────────────────────────────────
const STOPWORDS = new Set(
  (
    "i we my me a an the of for on at to is was were be been bought buy brought paid pay spent spend cost costs " +
    "total get got gotten received recieved add today yesterday eve evening morning night rs rupees ruppes inr " +
    "way go going went out outside whole and then just some around about approx approximately please note need " +
    "as order repaire repair someone which witch back form from this months month " +
    "ago earlier prior day days week weeks din hafta hafte"
  ).split(" "),
);


function makeDescription(text: string, category: string): string {
  const words = text
    .replace(/[₹]/g, " ")
    .replace(
      /\d[\d,]*(?:\.\d+)?\s*(k|thousand|hundred|lakh|rs|rupees?|ruppes?|inr)?/gi,
      " ",
    )
    .replace(/[^\p{L}\s]/gu, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 1 && !STOPWORDS.has(w.toLowerCase()));
  const picked = words.slice(0, 6);
  if (picked.length === 0) return category;
  const desc = picked.join(" ");
  return desc.charAt(0).toUpperCase() + desc.slice(1);
}


// ─────────────────────────────────────────────────────────────
// Date extraction — RELATIVE only.
// ─────────────────────────────────────────────────────────────

export function extractDate(text: string): {
  offsetDays: number;
  matched?: string;
} {
  const t = text.toLowerCase();
  let m: RegExpMatchArray | null;

  if ((m = t.match(/\b(?:day before yesterday|before yesterday|parso)\b/)))
    return { offsetDays: 2, matched: m[0] };
  if ((m = t.match(/\b(?:yesterday|yday|ydy|yest|last night)\b/)))
    return { offsetDays: 1, matched: m[0] };
  if (
    (m = t.match(
      /\b(\d{1,3})\s*(?:days?|din)\s*(?:ago|back|before|earlier|prior)\b/,
    ))
  )
    return { offsetDays: Math.min(365, parseInt(m[1], 10)), matched: m[0] };
  if ((m = t.match(/\b(\d{1,2})\s*(?:weeks?|hafte?)\s*(?:ago|back|before)\b/)))
    return { offsetDays: Math.min(365, parseInt(m[1], 10) * 7), matched: m[0] };
  if ((m = t.match(/\b(?:last week|a week ago|week ago)\b/)))
    return { offsetDays: 7, matched: m[0] };
  if ((m = t.match(/\b(?:today|just now|abhi|aaj)\b/)))
    return { offsetDays: 0, matched: m[0] };

  return { offsetDays: 0 };
}

 


// ─────────────────────────────────────────────────────────────
// Path B — pure on-device rules
// ─────────────────────────────────────────────────────────────

export function parseLocally(raw: string): ParsedEntry {
  const text = raw.trim();

  const { offsetDays, matched: dateMatch } = extractDate(text);
  const cleaned = dateMatch
    ? text.replace(
        new RegExp(dateMatch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
        " ",
      )
    : text;

  const { amount, conf: amountConf } = extractAmount(cleaned);

  let type: "income" | "expense";
  let category: transactionCategory;
  let catConf: number;
  let isLending = false;

  if (LENDING_WORDS.test(cleaned)) {
    // Lending / repayment -> Business, direction inferred
    isLending = true;
    category = "Business";
    catConf = 0.7;
    type = MONEY_IN.test(cleaned)
      ? "income"
      : MONEY_OUT.test(cleaned)
        ? "expense"
        : "expense";
  } else {
    const isIncome =
      INCOME_WORDS.test(cleaned) &&
      !/\b(bought|buy|brought)\b.*\bgift/i.test(cleaned);
    type = isIncome ? "income" : "expense";
    category = "Others";
    catConf = 0.4;
    for (const rule of CATEGORY_RULES) {
      if (rule.re.test(cleaned)) {
        category = rule.cat;
        catConf = 0.9;
        break;
      }
    }
    if (isIncome && category === "Others") {
      category = "Salary";
      catConf = 0.55;
    }
  }

  const description = makeDescription(cleaned, category);
  const confidence =
    amount > 0 ? Math.min(1, amountConf * 0.6 + catConf * 0.4) : 0.2;

  return {
    amount,
    type,
    category,
    description,
    confidence,
    isLending,
    dateOffsetDays: offsetDays,
  };
}


//! ─────────────────────────────────────────────────────────────  
// THE SEAM — the app calls this, never parseLocally directly.
// Moving to Path A later = uncomment the block + implement parseViaCloud.
// Return shape is identical, so nothing downstream changes.
// ─────────────────────────────────────────────────────────────
export async function parseEntry(raw: string): Promise<ParsedEntry> {
  const local = parseLocally(raw);

  // ─── PATH A HOOK (future) ───────────────────────────────
  // if (local.confidence < CONFIDENCE_THRESHOLD) {
  //   try { return await parseViaCloud(raw); } catch { /* fall back to local */ }
  // }
  // ────────────────────────────────────────────────────────

  return local;
}

// async function parseViaCloud(raw: string): Promise<ParsedEntry> {
//   const res = await fetch("https://your-worker.example/parse", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ text: raw }),
//   });
//   return (await res.json()) as ParsedEntry;
// }
