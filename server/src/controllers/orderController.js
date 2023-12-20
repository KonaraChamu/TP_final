const {
  collection,
  addDoc,
  getDoc,
  doc,
  getDocs,
  or,
  query,
  where,
  updateDoc,
} = require("firebase/firestore");
const { db } = require("../firebase/firebase");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});

const OrdersDB = collection(db, "orders");
const MenuDB = collection(db, "menu");

const getKitchenOrders = async (req, res) => {
  const q = query(
    OrdersDB,
    or(where("status", "==", "PENDING"), where("status", "==", "ACCEPTED"))
  );
  try {
    const orders = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => orders.push({ id: doc.id, ...doc.data() }));
    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

const getClientOrders = async (req, res) => {
  const orderId = req.params.orderId;
  const { status } = req.body;
  const user = req.user;

  const q = query(OrdersDB, where("user", "==", req.user));

  try {
    const querySnapshot = await getDocs(q);
    const orders = [];
    querySnapshot.forEach((doc) => orders.push({ id: doc.id, ...doc.data() }));
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error signing in:", error.message);
    return res.sendStatus(500);
  }
};

const updateOrderStatus = async (req, res) => {
  const orderId = req.params.orderId;
  const { status } = req.body;

  try {
    const orderDocRef = doc(OrdersDB, orderId);
    await updateDoc(orderDocRef, { status });

    return res
      .status(200)
      .send({ message: "Order status updated successfully" });
  } catch (error) {
    console.error("Error creating user:", error.message);
    return res.sendStatus(500);
  }
};

const createOrder = async (req, res) => {
  const { paymentId, itemId } = req.body;
  const user = req.user;

  try {
    const payment = stripe.paymentIntents.create({
      currency: "EUR",
      amount: 1999,
      payment_method: paymentId,
      confirm: true,
    });

    // fetch menu item from store
    const menuItemDocRef = doc(MenuDB, itemId);
    const menuItem = (await getDoc(menuItemDocRef)).data();

    // create new order
    const newOrder = {
      status: "PENDING",
      item: menuItem,
      user,
      payment_id: paymentId,
    };

    // save new order in store
    await addDoc(OrdersDB, newOrder);

    return res.status(200).json({ message: "Order created successfully" });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

module.exports = {
  getClientOrders,
  getKitchenOrders,
  updateOrderStatus,
  createOrder,
};
