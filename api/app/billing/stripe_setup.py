import os
import stripe

stripe.api_key = os.environ.get("STRIPE_SECRET_KEY", "")

PLANS = {
    "LOCAL_SCOUT": {
        "price_id": os.environ.get("STRIPE_PRICE_LOCAL_SCOUT", ""),
        "amount": 9900,
        "features": {"rfp_alerts": 3, "seats": 2, "saved_rfps": 50, "api_access": False},
    },
    "ENTERPRISE_HUNTER": {
        "price_id": os.environ.get("STRIPE_PRICE_ENTERPRISE_HUNTER", ""),
        "amount": 49900,
        "features": {"rfp_alerts": -1, "seats": -1, "saved_rfps": -1, "api_access": True},
    },
}


def create_checkout_session(workspace_id: str, plan: str, success_url: str, cancel_url: str):
    price_id = PLANS[plan]["price_id"]
    return stripe.checkout.Session.create(
        mode="subscription",
        line_items=[{"price": price_id, "quantity": 1}],
        metadata={"workspace_id": workspace_id, "plan": plan},
        success_url=success_url,
        cancel_url=cancel_url,
    )


def create_portal_session(stripe_customer_id: str, return_url: str):
    return stripe.billing_portal.Session.create(
        customer=stripe_customer_id,
        return_url=return_url,
    )