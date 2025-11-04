from typing import Optional

def format_mongo_document(doc: Optional[dict] = None):
    if not doc:
        return None
    d = dict(doc)
    _id = d.get("_id")
    password = d.get("password")
    if _id is not None:
        d["id"] = str(_id)
        d.pop("_id", None)
    if password is not None:
        d.pop("password", None)
    return d