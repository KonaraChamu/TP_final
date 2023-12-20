require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const verifyJWT = require("./middleware/verifyJWT");
const corsOptions = require("./config/corsOptions");
const credentials = require("./middleware/credentials");

const OrderRoute = require("./routes/orderRoute");
const AuthRoute = require("./routes/authRoute");
const MenuRoute = require("./routes/menuRoute");
const RefreshTokenRoute = require("./routes/refreshTokenRoute");

const app = express();

app.use(credentials);

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(cookieParser());

app.use("/api/auth", AuthRoute);

app.use(verifyJWT);
app.use("/api/refresh", RefreshTokenRoute);
app.use("/api/menu", MenuRoute);
app.use("/api/order", OrderRoute);

app.listen(4000, () => {
  console.log("app listning on port 4000");
});
