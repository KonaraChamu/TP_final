import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Stack,
  StackDivider,
  Text,
  Box,
  Tag,
  Flex,
  Spacer,
  Center,
  Button,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom';

const ClientOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const axios = useAxiosPrivate();

  const handleBuy = () => {
    navigate('/page/menu');
  };

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await axios.get('order/client', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setOrders(res.data);
      } catch (error) {
        setOrders([]);
      }
    };

    loadOrders();
  }, []);

  return (
    <Card variant="outline">
      <CardHeader>
        <Heading size="md">Orders</Heading>
      </CardHeader>

      <CardBody>
        {orders.length == 0 ? (
          <Stack>
            <Center>
              <Heading as="h2">No orders yet</Heading>
            </Center>
            <Center>
              <Button onClick={handleBuy} colorScheme="whatsapp" to="/page/orders">
                Buy
              </Button>
            </Center>
          </Stack>
        ) : (
          <Stack divider={<StackDivider />} spacing="4">
            {orders?.map((order) => (
              <Flex key={order.id}>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    {order?.id}
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    {order?.item?.name}
                  </Text>
                </Box>
                <Spacer></Spacer>
                <Box>{order?.status === 'PENDING' ? <Tag>Pending</Tag> : <Tag>Complete</Tag>}</Box>
              </Flex>
            ))}
          </Stack>
        )}
      </CardBody>
    </Card>
  );
};

export default ClientOrders;
