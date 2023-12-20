import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Heading,
  StackDivider,
  Stack,
  Box,
  Text,
  Spacer,
  Flex,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { convertCentsToEuroString } from '../../utils/helpers';

const Menu = () => {
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);
  const axios = useAxiosPrivate();

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const res = await axios.get('menu', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setMenu(res.data);
      } catch (error) {
        setMenu([]);
      }
    };

    loadMenu();
  }, []);

  const buyItem = (itemId, price) => {
    navigate('/page/payment', { state: { itemId, price } });
  };

  return (
    <Card variant="outline">
      <CardHeader>
        <Heading size="md">Menu</Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          {menu?.map((item) => (
            <Flex key={item?.id}>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  {item?.name}
                </Heading>
                <Text pt="2" fontSize="sm">
                  {item?.description}
                </Text>
                <Text as="b" pt="2" fontSize="sm">
                  {convertCentsToEuroString(item?.price)}
                </Text>
              </Box>
              <Spacer></Spacer>
              <Box>
                <Button
                  colorScheme="whatsapp"
                  onClick={() => {
                    buyItem(item?.id, item?.price);
                  }}
                >
                  Buy
                </Button>
              </Box>
            </Flex>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
};

export default Menu;
