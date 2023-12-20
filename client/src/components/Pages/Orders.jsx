import useAuth from '../../hooks/useAuth';
import ClientOrders from '../ClientOrders';
import KitchenOrders from '../KitchenOrder';

const Orders = () => {
  const { auth } = useAuth();

  return <>{auth?.user?.role == 'CLIENT' ? <ClientOrders /> : <KitchenOrders />}</>;
};

export default Orders;
