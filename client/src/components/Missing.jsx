import { Center, Heading, VStack } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Missing = () => {
  const navigate = useNavigate();
  const goHome = () => navigate('/');
  return (
    <Center h="100vh">
      <VStack>
        <Heading>Oops! Page Not Found </Heading>
        <Heading>
          <Button onClick={goHome}>Visit Our Homepage</Button>
        </Heading>
      </VStack>
    </Center>
  );
};

export default Missing;
