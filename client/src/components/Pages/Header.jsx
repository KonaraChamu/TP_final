import { Container, Center, Flex, Spacer, Button, Image, Heading, HStack } from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
const Header = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const axios = useAxiosPrivate();
  const logout = async () => {
    await axios.post('auth/signout');
    setAuth({});
    navigate('/');
  };
  return (
    <Center paddingY={2} borderBottom={1} borderStyle="solid" borderColor="gray.200">
      <Container maxW="container.lg">
        <HStack spacing={8}>
          <HStack spacing={8} alignItems="center">
            <HStack spacing={2}>
              <Image src="/go-poulet-logo.svg" width={12} alt="Dan Abramov" />
            </HStack>
            <HStack spacing={2}>
              {auth?.user?.role === 'CLIENT' && <NavLink to="/page/menu">Menu</NavLink>}
              <NavLink to="/page/orders">Orders</NavLink>
            </HStack>
          </HStack>
          <Spacer></Spacer>
          <Flex>
            <Button variant="ghost" onClick={logout}>
              Logout
            </Button>
          </Flex>
        </HStack>
      </Container>
    </Center>
  );
};

export default Header;
