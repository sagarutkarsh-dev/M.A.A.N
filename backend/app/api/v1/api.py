from fastapi import APIRouter
from app.api.v1.endpoints import mpe, inspections, certificates, traders, instruments

api_router = APIRouter()

api_router.include_router(mpe.router, prefix="/mpe", tags=["Seventh Schedule MPE Engine"])
api_router.include_router(inspections.router, prefix="/inspections", tags=["Field Inspections"])
api_router.include_router(certificates.router, prefix="/certificates", tags=["Certificates & Public Verification"])
api_router.include_router(traders.router, prefix="/traders", tags=["Traders & Instruments"])
api_router.include_router(instruments.router, prefix="/instruments", tags=["Instrument Lifecycle (Rule 27)"])