"""Pydantic schemas for the API."""
from pydantic import BaseModel, Field


class CopilotQuery(BaseModel):
    query: str
    departments: list[str] | None = None      # slugs; None/empty = all
    quick_mode: bool = False                    # skip supersession agent (A1)


class Citation(BaseModel):
    gr_id: str
    date: str
    department: str
    subject_mr: str
    subject_en: str
    passage_mr: str
    passage_en: str
    source_url: str
    status: str = "current"                     # current | check | superseded
    later_gr: dict | None = None


class CopilotAnswer(BaseModel):
    answer: str
    lang: str
    citations: list[Citation]
    subquestions: list[str] = Field(default_factory=list)
    candidates: int = 0
    mock: bool = False


class LetterRequest(BaseModel):
    letter_type: str                            # e.g. "Office Order", "Reply"
    department: str | None = None
    recipient: str = ""
    subject: str = ""
    key_points: str = ""
    language: str = "en"                        # en | mr
    use_precedent: bool = True                  # RAG for style/precedent


class AnalyzeRequest(BaseModel):
    """Analyze a GR or Circular already in the corpus, by gr_id, or ad-hoc text."""
    gr_id: str | None = None
    text: str | None = None
    doc_type: str = "gr"                        # gr | circular
    question: str | None = None                 # optional Q&A over the doc


class SimpleText(BaseModel):
    text: str
    language: str = "en"


class TranslateRequest(BaseModel):
    text: str
    target_lang: str = "en"                     # en | mr
