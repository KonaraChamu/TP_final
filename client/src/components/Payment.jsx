import CheckoutForm from './CheckoutForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';

// stripe publishable key
const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

const Payment = () => {
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    setStripePromise(loadStripe(publishableKey));
  }, []);

  return (
    <>
      {stripePromise && (
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
};

export default Payment;
