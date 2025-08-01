def format_mongo_document(doc):
    if not doc :
        return None
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc
