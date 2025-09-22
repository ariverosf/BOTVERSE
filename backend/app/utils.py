# app/utils.py
def format_mongo_document(doc: dict | None):
    if not doc:
        return None
    d = dict(doc)
    _id = d.get("_id")
    if _id is not None:
        d["id"] = str(_id)
        d.pop("_id", None)
    return d