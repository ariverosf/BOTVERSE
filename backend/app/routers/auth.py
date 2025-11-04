from fastapi import APIRouter, HTTPException, Cookie, Response
from pydantic import BaseModel, EmailStr
from bson import ObjectId
from app.config import db
from typing import Optional
from app.services.security import hash_password, verify_password, create_access_token, decode_token
from app.utils import format_mongo_document

router = APIRouter(prefix="/auth", tags=["auth"])

class Register(BaseModel):
    fullName: str
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
    doc = {"fullName": body.fullName, "email": body.email, "password": hash_password(body.password)}
    res = db.users.insert_one(doc)
    return {"id": str(res.inserted_id), "email": body.email}

@router.post("/login")
def login(response: Response, body: Login):
    user = db.users.find_one({"email": body.email})
    if not user or not verify_password(body.password, user["password"]):
        raise HTTPException(401, "Credenciales inválidas")
    
    userFormatted = { "user": format_mongo_document(user) }
    expirationTimeSeconds = 60
    token = create_access_token(str(user["_id"]), userFormatted, expirationTimeSeconds)
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=expirationTimeSeconds * 60
    )
    return userFormatted

# dependencia para extraer usuario desde el token
def get_current_user(access_token: Optional[str] = Cookie(default=None)):
    if not access_token:
        raise HTTPException(401, "Token requerido")

    data = decode_token(access_token)
    if not data:
        raise HTTPException(401, "Token inválido")
    uid = data.get("sub")
    user = db.users.find_one({"_id": ObjectId(uid)})
    if not user:
        raise HTTPException(401, "Usuario no encontrado")
    user["_id"] = str(user["_id"])
    return format_mongo_document(user)
