from typing import Dict, Any
from datetime import datetime, timezone
import hashlib
import json

def _json_bytes(obj: Any) -> bytes:
    return json.dumps(obj, ensure_ascii=False, indent=2).encode("utf-8")

def _sha256(b: bytes) -> str:
    return hashlib.sha256(b).hexdigest()

def build_botpack(
    bot_id: str,
    ir: Dict[str, Any],
    rasa_files: Dict[str, bytes],
    language: str = "es"
) -> Dict[str, bytes]:
    files: Dict[str, bytes] = {}

    # IR
    files["ir/bot.json"] = _json_bytes(ir)

    # Rasa bajo platforms/rasa
    for path, data in rasa_files.items():
        norm = path if path.startswith("platforms/") else f"platforms/rasa/{path}"
        files[norm] = data

    # Script simple
    build_script = """#!/usr/bin/env python3
import json, os, sys
ROOT = os.path.dirname(os.path.dirname(__file__))
IR = os.path.join(ROOT, "ir", "bot.json")
RASA_DIR = os.path.join(ROOT, "platforms", "rasa")
def main():
    if not os.path.isfile(IR):
        print("No se encontró ir/bot.json", file=sys.stderr); return 1
    if not os.path.isdir(RASA_DIR):
        print("No se encontró platforms/rasa/", file=sys.stderr); return 1
    with open(IR, "r", encoding="utf-8") as f:
        data = json.load(f)
    if "intents" not in data:
        print("IR inválido: falta 'intents'", file=sys.stderr); return 2
    print("BotPack OK. Ejecute:")
    print("  cd platforms/rasa")
    print("  rasa train")
    print("  rasa run actions  # en otra terminal")
    print("  rasa shell")
    return 0
if __name__ == "__main__":
    sys.exit(main())
"""
    files["scripts/build_rasa.py"] = build_script.encode("utf-8")

    # Manifest + checksums
    created = datetime.now(timezone.utc).isoformat()
    checksums = {path: _sha256(content) for path, content in files.items()}
    manifest = {
        "name": f"botpack_{bot_id}",
        "specVersion": "1.0",
        "language": language,
        "targets": ["rasa"],
        "createdAt": created,
        "generator": {"name": "botverse", "version": "0.1"},
        "checksums": checksums,
    }
    files["manifest.json"] = _json_bytes(manifest)

    # README breve
    readme = """# BotPack
Este paquete contiene:
- manifest.json
- ir/bot.json
- platforms/rasa/*
- scripts/build_rasa.py

## Cómo ejecutar en Rasa
1) cd platforms/rasa
2) pip install -r actions/requirements.txt
3) rasa train
4) en terminal A: rasa run actions
5) en terminal B: rasa shell
"""
    files["README.md"] = readme.encode("utf-8")

    return files
