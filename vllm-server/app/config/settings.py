from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # ==========================
    # Application
    # ==========================
    APP_NAME: str = "AI Gateway"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"

    HOST: str = "0.0.0.0"
    PORT: int = 8000
    LOG_LEVEL: str = "INFO"

    # ==========================
    # LM Studio
    # ==========================
    LMSTUDIO_BASE_URL: str = "http://localhost:1234/v1"
    LMSTUDIO_MODEL: str = "qwen2.5-7b-instruct"

    # ==========================
    # Provider Selection
    # ==========================
    PRIMARY_PROVIDER: str = "lmstudio"

    # ==========================
    # API Keys
    # ==========================
    HF_TOKEN: str = "moonshotai/Kimi-K2-Instruct-0905"
    HF_MODEL: str = "moonshotai/Kimi-K2-Instruct-0905"
    OPENAI_API_KEY: str = ""
    ANTHROPIC_API_KEY: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()