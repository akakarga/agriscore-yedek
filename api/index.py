"""Vercel entrypoint: keep one canonical FastAPI implementation."""

from backend.main import app

__all__ = ["app"]
