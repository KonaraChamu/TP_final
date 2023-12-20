import { useNavigate } from 'react-router-dom';
import { Center, Heading, VStack, Button, Text } from '@chakra-ui/react';

const Unauthorised = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <Center h="100vh">
      <VStack>
        <Heading>Unauthorized </Heading>
        <Text>You do not have access to the requested page.</Text>
        <Button onClick={goBack}>Go Back</Button>
      </VStack>
    </Center>
  );
};

export default Unauthorised;
