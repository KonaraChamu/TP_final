import {
  Input,
  VStack,
  InputGroup,
  InputRightElement,
  Button,
  InputLeftAddon,
  Heading,
  Text,
  HStack,
  Spacer,
  Image,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Container,
  Center,
  useToast,
} from '@chakra-ui/react';
import { EmailIcon, LockIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { validateEmail } from '../utils/validators';
import useAuth from '../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const AuthForm = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [isSignUp, setIsSignUp] = useState(false);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState({
    value: '',
    isTouched: false,
  });

  const [password, setPassword] = useState({
    value: '',
    isTouched: false,
  });

  const [confirmPassword, setConfirmPassword] = useState({
    value: '',
    isTouched: false,
  });

  const handleClick = () => setShow(!show);

  const validatePassword = () => {
    return password.value.length > 1;
  };

  const validateConfirmPassword = () => {
    return confirmPassword.value === password.value;
  };

  const getIsFormValid = () => {
    return validateEmail(email.value) && validatePassword() && (!isSignUp || validateConfirmPassword());
  };

  const signIn = () =>
    axios.post('auth/signin', JSON.stringify({ username: email.value, password: password.value }), {
      headers: { 'Content-Type': 'application/json' },
    });

  const signUp = (username, password) =>
    axios.post('auth/signup', JSON.stringify({ username, password }), {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: false,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isSignUp) {
        await signUp(email.value, password.value);
        clearForm();
        setIsSignUp(false);
      } else {
        const res = await signIn(email.value, password.value);
        setAuth({ user: res?.data?.user, accessToken: res?.data?.accessToken });
        clearForm();
        navigate('/page/orders', { replace: true });
      }
    } catch (error) {
      console.error(error);
      let toastMsg = '';
      if (!error?.response) {
        toastMsg = 'No Server Response';
      } else if (error.response?.status === 400) {
        toastMsg = 'Missing Username or Password';
      } else if (error.response?.status === 401) {
        toastMsg = 'Unauthorized';
      } else if (error.response?.status === 409) {
        toastMsg = 'Username Taken';
      } else {
        toastMsg = isSignUp ? 'Registration Failed' : 'Login Failed';
      }
      toast({
        title: 'An error occurred.',
        description: toastMsg,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }

    setIsLoading(false);
  };

  const clearForm = () => {
    setEmail({ value: '', isTouched: false });
    setPassword({ value: '', isTouched: false });
    setConfirmPassword({ value: '', isTouched: false });
    setShow(false);
  };

  return (
    <Center h="80vh">
      <Container maxW="md">
        <Card variant="outline" p={18}>
          <CardHeader>
            <VStack spacing={3}>
              <Image src="/go-poulet-logo.svg" alt="Go poulet logo" />
              <Heading as="h2" textAlign="center" size="lg">
                Sign in
              </Heading>
              <Text textAlign="center"> to continue to Go Poulet</Text>
            </VStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={5}>
              <InputGroup size="lg">
                <InputLeftAddon pointerEvents="none">
                  <EmailIcon />
                </InputLeftAddon>
                <Input
                  type="email"
                  placeholder="Enter Email"
                  value={email.value}
                  onChange={(e) => setEmail({ ...email, value: e.target.value })}
                  onBlur={() => setEmail({ ...email, isTouched: true })}
                  isInvalid={!validateEmail(email.value) && email.isTouched}
                />
              </InputGroup>
              <InputGroup size="lg">
                <InputLeftAddon>
                  <LockIcon />
                </InputLeftAddon>
                <Input
                  pr="4.5rem"
                  name="password"
                  type={show ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password.value}
                  onChange={(e) => setPassword({ ...password, value: e.target.value })}
                  onBlur={() => setPassword({ ...password, isTouched: true })}
                  isInvalid={!validatePassword() && password.isTouched}
                />
                <InputRightElement>
                  <Button variant="ghost" onClick={handleClick}>
                    {show ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {isSignUp && (
                <InputGroup size="lg">
                  <InputLeftAddon>
                    <LockIcon />
                  </InputLeftAddon>
                  <Input
                    pr="4.5rem"
                    type={show ? 'text' : 'password'}
                    placeholder="Confirm password"
                    value={confirmPassword.value}
                    onChange={(e) => setConfirmPassword({ ...confirmPassword, value: e.target.value })}
                    onBlur={() => setConfirmPassword({ ...confirmPassword, isTouched: true })}
                    isInvalid={!validateConfirmPassword() && confirmPassword.isTouched}
                  />
                  <InputRightElement>
                    <Button variant="ghost" onClick={handleClick}>
                      {show ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              )}
            </VStack>
            <CardFooter pl={0} pr={0}>
              <VStack w="100%">
                <HStack w="100%" marginTop={10}>
                  <Button
                    colorScheme="whatsapp"
                    variant="link"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      clearForm();
                    }}
                  >
                    {isSignUp ? 'Signin' : 'Signup'}
                  </Button>
                  <Spacer />
                  <Button
                    colorScheme="whatsapp"
                    isLoading={isLoading}
                    onClick={handleSubmit}
                    isDisabled={!getIsFormValid()}
                  >
                    {isSignUp ? 'Signup' : 'Signin'}
                  </Button>
                </HStack>
              </VStack>
            </CardFooter>
          </CardBody>
        </Card>
      </Container>
    </Center>
  );
};

export default AuthForm;
