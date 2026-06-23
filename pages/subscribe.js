export default function Subscribe() {
  return null;
}

export async function getServerSideProps({ query }) {
  const { plan, email } = query;

  const PRICES = {
    monthly: 'price_1Tf4jpQxYPNEtUDqtrmAeKMA',
    lifetime: 'price_1Tf4jpQxYPNEtUDqgRMPOZwB',
  };

  const priceId = PRICES[plan] || PRICES.monthly;
  const mode = plan === 'lifetime' ? 'payment' : 'subscription';

  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'payment_method_types[]': 'card',
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      'mode': mode,
      'success_url': 'https://batismart-backend.vercel.app/success',
      'cancel_url': 'https://batismart-backend.vercel.app/cancel',
      'customer_email': email || '',
    }).toString(),
  });

  const session = await response.json();

  return {
    redirect: {
      destination: session.url || '/cancel',
      permanent: false,
    },
  };
}