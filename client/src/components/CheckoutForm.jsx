import { CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Center, VStack, Heading, Card, CardBody, CardHeader, Box, CardFooter } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { convertCentsToEuroString } from '../utils/helpers';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const axios = useAxiosPrivate();
  const navigate = useNavigate();

  const itemId = location?.state?.itemId;
  const price = location?.state?.price;

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (!error) {
      try {
        const { id } = paymentMethod;
        console.log(itemId);
        await axios.post('order', JSON.stringify({ paymentId: id, itemId }), {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        navigate('/page/payment-success');
      } catch (error) {
        setMessage(error.message);
      }
    }

    setIsProcessing(false);
  };

  return (
    <Center>
      <Card marginTop={10} variant="outline">
        <CardHeader>
          <VStack>
            <Center>
              <Heading>Payment</Heading>
            </Center>
            <Center>
              <Heading>{convertCentsToEuroString(price)}</Heading>
            </Center>
          </VStack>
        </CardHeader>
        <CardBody>
          <form id="payment-form">
            <VStack spacing={10}>
              <Box width="300px">
                <CardElement id="payment-element" />
              </Box>
              <Button
                colorScheme="whatsapp"
                onClick={handleSubmit}
                disabled={isProcessing || !stripe || !elements}
                id="submit"
              >
                <span id="button-text">{isProcessing ? 'Processing ... ' : 'Pay now'}</span>
              </Button>
            </VStack>
          </form>
        </CardBody>
        <CardFooter>
          <Center>
            <Heading size="sm">{message}</Heading>
          </Center>
        </CardFooter>
      </Card>
    </Center>
  );
}
