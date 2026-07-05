from fastapi import FastAPI

from app.api.router import api_router
from app.config.settings import settings

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.include_router(api_router)


@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "AI Gateway is running",
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
    }