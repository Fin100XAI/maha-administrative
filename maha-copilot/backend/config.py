"""Central configuration, loaded from environment / .env."""
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Together AI
    together_api_key: str = ""
    together_base_url: str = "https://api.together.xyz/v1"
    chat_model: str = "Qwen/Qwen2.5-72B-Instruct-Turbo"
    embed_model: str = "intfloat/multilingual-e5-large-instruct"
    embed_dim: int = 1024
    rerank_model: str = "Salesforce/Llama-Rank-V1"
    vision_model: str = "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8"

    # Vector store
    qdrant_url: str = ""
    qdrant_api_key: str = ""
    qdrant_path: str = "./storage/qdrant"

    # Retrieval
    bm25_top_k: int = 50
    dense_top_k: int = 50
    rrf_top_k: int = 80
    rerank_top_k: int = 5
    chunk_chars: int = 1100
    chunk_overlap: int = 150

    # App
    admin_token: str = "change-me-admin"
    gr_base_url: str = "https://gr.maharashtra.gov.in"

    @property
    def mock_mode(self) -> bool:
        """When no API key is set, the platform serves canned responses so the
        UI is fully demoable offline."""
        return not bool(self.together_api_key.strip())


@lru_cache
def get_settings() -> Settings:
    return Settings()
