from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
import os

ALGO = os.getenv("JWT_ALGORITHM", "HS256")
SECRET = os.getenv("JWT_SECRET", "supersecreto")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(pw: str) -> str:
    return pwd_context.hash(pw)

def verify_password(pw: str, hashed: str) -> bool:
    return pwd_context.verify(pw, hashed)

def create_access_token(sub: str, expires_minutes: int = 60) -> str:
    exp = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode = {"sub": sub, "exp": exp}
    return jwt.encode(to_encode, SECRET, algorithm=ALGO)

def decode_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, SECRET, algorithms=[ALGO])
    except JWTError:
        return None
