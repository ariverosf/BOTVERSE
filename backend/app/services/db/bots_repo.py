from typing import Optional, Dict, Any
from bson import ObjectId
from app.db import db

COLLECTION = "bots"

def get_bot_by_id(bot_id: str) -> Optional[Dict[str, Any]]:
    q = {"_id": ObjectId(bot_id)} if ObjectId.is_valid(bot_id) else {"_id": bot_id}
    return db[COLLECTION].find_one(q)

def get_diagram_by_bot_id(bot_id: str) -> Optional[Dict[str, Any]]:
    doc = get_bot_by_id(bot_id)
    if not doc:
        return None
    # ajusta el path según tu modelo real: diagram, flow, graph, etc.
    return doc.get("diagram") or doc.get("flow") or doc.get("graph")
