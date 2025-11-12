from fastapi import APIRouter, HTTPException, Response
from app.schemas.compile import CompileRequest
from app.services.ir.validator import validate_diagram, IRValidationError
from app.services.ir.builder import build_ir
from app.services.codegen.rasa import generate_rasa_project
from app.services.botpack import build_botpack
from app.services.zipper import make_zip
import hashlib

router = APIRouter(prefix="/bots", tags=["export"])

@router.post("/{bot_id}/export")
def export_botpack(bot_id: str, req: CompileRequest):
    diagram = req.diagram
    if diagram is None:
        # export sin Mongo: diagrama es requerido si no hay DB
        raise HTTPException(
            status_code=404,
            detail="No se encontró diagrama en el body. Para exportar sin Mongo, envía 'diagram'."
        )

    try:
        validate_diagram(diagram)
    except IRValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))

    ir = build_ir(diagram, language=req.options.language)

    rasa_files = generate_rasa_project(
        ir=ir,
        include_demo_actions=req.options.includeDemoActions,
        pipeline_preset=req.options.pipelinePreset
    )

    botpack_files = build_botpack(
        bot_id=bot_id,
        ir=ir,
        rasa_files=rasa_files,
        language=req.options.language,
    )

    zip_bytes = make_zip(botpack_files)
    artifact_sha = hashlib.sha256(zip_bytes).hexdigest()

    headers = {
        "Content-Disposition": f'attachment; filename="botpack_{bot_id}.zip"',
        "X-Artifact-SHA256": artifact_sha,
    }
    return Response(content=zip_bytes, media_type="application/zip", headers=headers)
