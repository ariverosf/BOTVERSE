
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGO_URI: str = "mongodb://localhost:27017"
    MONGO_DB: str = "botverse"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
