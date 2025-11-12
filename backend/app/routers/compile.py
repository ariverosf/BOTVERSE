from fastapi import APIRouter, HTTPException, Response
from app.schemas.compile import CompileRequest  # 👈 sin CompileResponse
from app.services.ir.builder import build_ir
from app.services.ir.validator import validate_diagram, IRValidationError
from app.services.codegen.rasa import generate_rasa_project
from app.services.zipper import make_zip
from app.services.db.bots_repo import get_diagram_by_bot_id

router = APIRouter(prefix="/bots", tags=["compile"])

@router.post("/{bot_id}/compile")  # 👈 sin response_model
def compile_bot(bot_id: str, req: CompileRequest):
    diagram = req.diagram or get_diagram_by_bot_id(bot_id)
    if diagram is None:
        raise HTTPException(
            status_code=404,
            detail="No se encontró diagrama o la base de datos no está disponible. "
                   "Envía 'diagram' en el body o levanta MongoDB."
        )

    try:
        validate_diagram(diagram)
    except IRValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))

    ir = build_ir(diagram, language=req.options.language)
    files = generate_rasa_project(
        ir=ir,
        include_demo_actions=req.options.includeDemoActions,
        pipeline_preset=req.options.pipelinePreset
    )
    zip_bytes = make_zip(files)
    headers = {"Content-Disposition": f'attachment; filename="botpack_%s_rasa.zip"' % bot_id}
    return Response(content=zip_bytes, media_type="application/zip", headers=headers)
