from fastapi import APIRouter, HTTPException, Header, Depends
from pydantic import BaseModel, EmailStr
from bson import ObjectId
from app.config import db
from app.services.security import hash_password, verify_password, create_access_token, decode_token

router = APIRouter(prefix="/auth", tags=["auth"])

class Register(BaseModel):
    email: EmailStr
    password: str

class Login(BaseModel):
    email: EmailStr
    password: str

@router.post("/register")
def register(body: Register):
    exists = db.users.find_one({"email": body.email})
    if exists:
        raise HTTPException(409, "Email ya registrado")
    doc = {"email": body.email, "password": hash_password(body.password)}
    res = db.users.insert_one(doc)
    return {"id": str(res.inserted_id), "email": body.email}

@router.post("/login")
def login(body: Login):
    user = db.users.find_one({"email": body.email})
    if not user or not verify_password(body.password, user["password"]):
        raise HTTPException(401, "Credenciales inválidas")
    token = create_access_token(str(user["_id"]))
    return {"access_token": token, "token_type": "bearer"}

# dependencia para extraer usuario desde el token
def get_current_user(authorization: str | None = Header(default=None)):
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(401, "Token requerido")
    token = authorization.split(" ", 1)[1]
    data = decode_token(token)
    if not data:
        raise HTTPException(401, "Token inválido")
    uid = data.get("sub")
    user = db.users.find_one({"_id": ObjectId(uid)})
    if not user:
        raise HTTPException(401, "Usuario no encontrado")
    user["_id"] = str(user["_id"])
    return user
