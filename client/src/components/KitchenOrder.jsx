import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Stack,
  StackDivider,
  Text,
  Box,
  Flex,
  Spacer,
  Button,
} from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const KitchenOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const axios = useAxiosPrivate();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await axios.get('order/kitchen', {
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

  const updateStatus = async (orderId, status) => {
    setIsLoading(true);
    try {
      await axios.post(`order/status/${orderId}`, JSON.stringify({ status }), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error(error);
    }

    try {
      const res = await axios.get('order/kitchen', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setOrders(res.data);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <Card variant="outline">
      <CardHeader>
        <Heading size="md">Orders</Heading>
      </CardHeader>

      <CardBody>
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
              <Box>
                {order?.status === 'PENDING' ? (
                  <Button disabled={isLoading} onClick={() => updateStatus(order?.id, 'ACCEPTED')}>
                    Accept
                  </Button>
                ) : (
                  <Button disabled={isLoading} onClick={() => updateStatus(order?.id, 'READY')}>
                    READY
                  </Button>
                )}
              </Box>
            </Flex>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
};

export default KitchenOrders;
