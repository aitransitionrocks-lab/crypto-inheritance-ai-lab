"""
LegacyGuard FastAPI application entry point.

Includes all routers, CORS middleware, and database initialisation.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from backend.database import Base, engine
from backend.api.users import router as users_router
from backend.api.plans import router as plans_router
from backend.api.heirs import router as heirs_router
from backend.api.triggers import router as triggers_router
from backend.api.partners import router as partners_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create database tables on startup."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(
    title="LegacyGuard API",
    description="Non-custodial crypto inheritance planning backend.",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS (allow all origins for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(users_router)
app.include_router(plans_router)
app.include_router(heirs_router)
app.include_router(triggers_router)
app.include_router(partners_router)


@app.get("/health")
async def health():
    """Health-check endpoint."""
    return {"status": "ok"}


@app.get("/api/docs")
async def api_docs_redirect():
    """Redirect to the Swagger UI."""
    return RedirectResponse(url="/docs")
