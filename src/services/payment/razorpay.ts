
// Razorpay Type Definitions
interface RazorpayOptions {
  key: string;
  amount: number; // Amount in paise (e.g., 50000 for ₹500)
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string; // Optional for testing/mocking
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => any;
  }
}

// Helper to load the Razorpay script dynamically
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Main function to initiate payment
export const initiateRazorpayPayment = async ({
  amount,
  currency = 'INR',
  name = 'ConceptScroll',
  description = 'Premium Subscription',
  user,
  onSuccess,
  onFailure
}: {
  amount: number;
  currency?: string;
  name?: string;
  description?: string;
  user?: { name: string; email: string; contact: string };
  onSuccess: (paymentId: string) => void;
  onFailure: (error: any) => void;
}) => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    onFailure('Failed to load Razorpay SDK');
    return;
  }

  // TODO: In production, fetch this key from an environment variable
  const RAZORPAY_KEY_ID = 'rzp_test_1DP5mmOlF5G5ag'; // Public Test Key

  const options: RazorpayOptions = {
    key: RAZORPAY_KEY_ID,
    amount: amount * 100, // Convert to paise
    currency: currency,
    name: name,
    description: description,
    image: 'https://conceptscroll.com/logo.png', // Replace with actual logo URL
    handler: function (response: RazorpayResponse) {
      // In a real app, you would verify the signature on the backend here
      console.log('Payment Successful:', response);
      onSuccess(response.razorpay_payment_id);
    },
    prefill: {
      name: user?.name,
      email: user?.email,
      contact: user?.contact,
    },
    theme: {
      color: '#7C3AED', // Brand primary color (purple-600)
    },
  };

  try {
    const rzp1 = new window.Razorpay(options);
    rzp1.on('payment.failed', function (response: any) {
      console.error('Payment Failed:', response.error);
      onFailure(response.error);
    });
    rzp1.open();
  } catch (error) {
    console.error('Razorpay Error:', error);
    onFailure(error);
  }
};
