import os
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from api.app.middleware.auth import get_current_user
from api.app.billing.stripe_setup import create_checkout_session, create_portal_session

router = APIRouter(prefix="/billing", tags=["billing"])

FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")


class CheckoutRequest(BaseModel):
    plan: str


@router.post("/checkout")
async def checkout(body: CheckoutRequest, user=Depends(get_current_user)):
    session = create_checkout_session(
        workspace_id=user.workspaceId,
        plan=body.plan,
        success_url=f"{FRONTEND_URL}/billing?success=true",
        cancel_url=f"{FRONTEND_URL}/billing?canceled=true",
    )
    return {"url": session.url}


@router.post("/portal")
async def portal(user=Depends(get_current_user)):
    session = create_portal_session(
        stripe_customer_id=user.workspace.stripeCustomerId,
        return_url=f"{FRONTEND_URL}/billing",
    )
    return {"url": session.url}
