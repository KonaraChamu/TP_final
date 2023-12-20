import { Stack, Heading, Center, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const handleDone = () => navigate('/page/orders', { replace: true });
  return (
    <Stack spacing={4}>
      <Center>
        <Heading size="md">Payment Success</Heading>
      </Center>
      <Center>
        <QRCodeSVG value="/" />
      </Center>
      <Center>
        <Button onClick={handleDone}>Done</Button>
      </Center>
    </Stack>
  );
};

export default PaymentSuccess;
