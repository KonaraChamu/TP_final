const jwt = require("jsonwebtoken");
const {
  where,
  query,
  collection,
  limit,
  getDocs,
  addDoc,
} = require("firebase/firestore");
const { db } = require("../firebase/firebase");
const bcrypt = require("bcrypt");
const userDB = collection(db, "users");
require("dotenv").config();

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const q = query(userDB, where("refreshToken", "==", refreshToken));

  try {
    const foundUser = await getDocs(q);

    if (foundUser.empty) return res.sendStatus(403); //Forbidden
    const user = foundUser.docs[0].data();
    // evaluate jwt
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || user.username !== decoded.username)
          return res.sendStatus(403);
        const accessToken = jwt.sign(
          { username: decoded.username },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "3000s" }
        );
        return res.json({ accessToken });
      }
    );
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

module.exports = { handleRefreshToken };
