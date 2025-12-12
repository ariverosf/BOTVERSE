from zipfile import ZipFile, ZIP_DEFLATED, ZipInfo
from io import BytesIO
import time

def make_zip(files: dict[str, bytes]) -> bytes:
    buf = BytesIO()
    with ZipFile(buf, "w", ZIP_DEFLATED) as zf:

        # Detectar carpetas necesarias
        dirs = set()
        for path in files.keys():
            parts = path.split("/")
            for i in range(1, len(parts)):
                dirs.add("/".join(parts[:i]) + "/")

        # Crear entradas de carpeta correctamente
        for d in sorted(dirs):
            info = ZipInfo(d)
            info.external_attr = 0o755 << 16  # permisos tipo carpeta
            info.date_time = time.localtime()[:6]
            zf.writestr(info, "")

        # Escribir archivos
        for path, data in files.items():
            zf.writestr(path, data)

    return buf.getvalue()
