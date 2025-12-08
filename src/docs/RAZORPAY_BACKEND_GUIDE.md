# Razorpay Backend Integration Guide

This document outlines the backend changes required to support the Razorpay payment flow implemented in the frontend.

## 1. Prerequisites

### Install Python Package
Add the Razorpay SDK to your Django requirements:
```bash
pip install razorpay
```

### Environment Variables
Add your Razorpay credentials to your Django `settings.py` or `.env` file:
```python
# settings.py
RAZORPAY_KEY_ID = os.getenv('RAZORPAY_KEY_ID')
RAZORPAY_KEY_SECRET = os.getenv('RAZORPAY_KEY_SECRET')
```

---

## 2. Database Models

It is recommended to create a `Transaction` or `Order` model to track payment attempts.

```python
# payments/models.py
from django.db import models
from django.conf import settings

class PaymentTransaction(models.Model):
    STATUS_CHOICES = (
        ('created', 'Created'),
        ('success', 'Success'),
        ('failed', 'Failed'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    order_id = models.CharField(max_length=100, unique=True) # Razorpay Order ID
    payment_id = models.CharField(max_length=100, blank=True, null=True)
    amount = models.IntegerField() # In paise
    currency = models.CharField(max_length=10, default='INR')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='created')
    plan_name = models.CharField(max_length=50) # e.g., 'Premium', 'Pro'
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.order_id}"
```

---

## 3. API Endpoints

You need to implement two primary endpoints.

### A. Create Order Endpoint
**URL:** `POST /api/payments/create-order/`
**Auth:** Required
**Description:** Generates a secure Order ID on Razorpay servers. This prevents amount tampering on the frontend.

**Request Body:**
```json
{
  "plan_id": "premium" // or "pro"
}
```

**Implementation Logic (Django View):**
```python
import razorpay
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from .models import PaymentTransaction

client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

class CreateOrderView(APIView):
    def post(self, request):
        plan_id = request.data.get('plan_id')
        
        # Define amounts based on plan (in paise)
        # 100 paise = 1 INR
        amounts = {
            'premium': 9900,  # ₹99
            'pro': 19900      # ₹199
        }
        
        amount = amounts.get(plan_id)
        if not amount:
            return Response({'error': 'Invalid plan'}, status=400)

        # Create Order on Razorpay
        data = {
            "amount": amount,
            "currency": "INR",
            "receipt": f"receipt_{request.user.id}",
            "notes": {
                "user_id": request.user.id,
                "plan": plan_id
            }
        }
        
        order = client.order.create(data=data)

        # Save to DB
        PaymentTransaction.objects.create(
            user=request.user,
            order_id=order['id'],
            amount=amount,
            plan_name=plan_id,
            status='created'
        )

        return Response({
            'order_id': order['id'],
            'amount': amount,
            'currency': 'INR',
            'key': settings.RAZORPAY_KEY_ID # Send public key to frontend
        })
```

### B. Verify Payment Endpoint
**URL:** `POST /api/payments/verify-payment/`
**Auth:** Required
**Description:** Verifies the cryptographic signature returned by Razorpay to ensure the payment was actually successful.

**Request Body:**
```json
{
  "razorpay_order_id": "order_Hj...x",
  "razorpay_payment_id": "pay_Hj...y",
  "razorpay_signature": "b2f...9a"
}
```

**Implementation Logic:**
```python
class VerifyPaymentView(APIView):
    def post(self, request):
        data = request.data
        
        try:
            # Verify Signature
            params_dict = {
                'razorpay_order_id': data['razorpay_order_id'],
                'razorpay_payment_id': data['razorpay_payment_id'],
                'razorpay_signature': data['razorpay_signature']
            }
            
            # This will raise a SignatureVerificationError if validation fails
            client.utility.verify_payment_signature(params_dict)

            # Update Transaction Status
            transaction = PaymentTransaction.objects.get(order_id=data['razorpay_order_id'])
            transaction.payment_id = data['razorpay_payment_id']
            transaction.status = 'success'
            transaction.save()

            # Update User Subscription
            user = request.user
            # Assuming you have a OneToOne profile or field on User
            user.profile.subscription = transaction.plan_name.lower()
            user.profile.save()

            return Response({'success': True, 'message': 'Payment verified'})

        except razorpay.errors.SignatureVerificationError:
            return Response({'error': 'Invalid signature'}, status=400)
        except PaymentTransaction.DoesNotExist:
            return Response({'error': 'Order not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
```

---

## 4. Swagger Definition Update

To ensure the frontend team can generate the correct clients, update your Swagger/OpenAPI definition:

```yaml
/api/payments/create-order/:
  post:
    summary: Create Razorpay Order
    tags: [Payments]
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            plan_id:
              type: string
              enum: [premium, pro]
    responses:
      200:
        description: Order created
        schema:
          type: object
          properties:
            order_id:
              type: string
            amount:
              type: integer
            key:
              type: string

/api/payments/verify-payment/:
  post:
    summary: Verify Razorpay Signature
    tags: [Payments]
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            razorpay_order_id:
              type: string
            razorpay_payment_id:
              type: string
            razorpay_signature:
              type: string
    responses:
      200:
        description: Payment verified and subscription updated
```

## 5. Frontend Alignment

Once these endpoints are deployed, update the frontend service `razorpay.ts` to:

1.  **Phase 1 (Order Creation):** Call `/api/payments/create-order/` *before* opening the Razorpay modal. Pass the returned `order_id` to the Razorpay options.
2.  **Phase 2 (Verification):** inside the `handler` (success callback), call `/api/payments/verify-payment/` instead of just showing a success toast.
