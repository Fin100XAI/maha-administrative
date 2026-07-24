"""Language detection (F2). No API call — a Unicode Devanagari-block ratio."""


def detect_language(query: str) -> str:
    """Return 'mr' if the query is dominantly Devanagari, else 'en'.

    Mixed queries with a Devanagari ratio > 0.3 are treated as Marathi, per
    the F2 spec (e.g. "Revenue मध्ये income certificate साठी documents?").
    """
    devanagari = sum(1 for c in query if "\u0900" <= c <= "\u097f")
    ratio = devanagari / max(len(query.strip()), 1)
    return "mr" if ratio > 0.3 else "en"


LANG_INSTRUCTION = {
    "mr": "उत्तर मराठीत द्या. प्रत्येक दाव्यासाठी GR क्रमांक आणि दिनांक उद्धृत करा.",
    "en": "Answer in English. Cite GR id and date for every factual claim.",
}


def label(lang: str) -> str:
    return "मराठी" if lang == "mr" else "English"
