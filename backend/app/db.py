from pymongo import MongoClient
from app.settings import settings

client = MongoClient(
    settings.MONGO_URI,
    serverSelectionTimeoutMS=2000,
    connectTimeoutMS=2000,
    socketTimeoutMS=2000,
)
db = client[settings.MONGO_DB]
