import Header from './Header';
import { Center, Container } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

const Page = () => {
  return (
    <div>
      <Header />
      <Center>
        <Container maxW="container.lg" marginTop={10}>
          <Outlet />
        </Container>
      </Center>
    </div>
  );
};

export default Page;
