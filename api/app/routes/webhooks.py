import os
import stripe
from fastapi import APIRouter, HTTPException, Request
from api.db.client import db

router = APIRouter(prefix="/webhooks", tags=["webhooks"])
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY", "")


@router.post("/stripe")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig, os.environ.get("STRIPE_WEBHOOK_SECRET", "")
        )
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    match event["type"]:
        case "checkout.session.completed":
            session = event["data"]["object"]
            workspace_id = session["metadata"]["workspace_id"]
            plan = session["metadata"]["plan"]
            await db.workspace.update(
                where={"id": workspace_id},
                data={
                    "plan": plan,
                    "stripeCustomerId": session["customer"],
                    "stripeSubscriptionId": session["subscription"],
                },
            )

        case "customer.subscription.deleted" | "invoice.payment_failed":
            sub = event["data"]["object"]
            await db.workspace.update_many(
                where={"stripeSubscriptionId": sub["id"]},
                data={"plan": "LOCAL_SCOUT"},
            )

    return {"received": True}