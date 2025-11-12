from typing import Dict
from io import BytesIO
from zipfile import ZipFile, ZIP_DEFLATED

def make_zip(files: Dict[str, bytes]) -> bytes:
    """
    Recibe {ruta: contenido_bytes} y devuelve un ZIP (bytes).
    """
    buf = BytesIO()
    with ZipFile(buf, "w", ZIP_DEFLATED) as zf:
        for path, data in files.items():
            zf.writestr(path, data)
    return buf.getvalue()
