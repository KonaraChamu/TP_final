require("dotenv").config();
const {
  where,
  query,
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
} = require("firebase/firestore");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { db } = require("../firebase/firebase");

const userDB = collection(db, "users");

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  const q = query(userDB, where("username", "==", username));

  try {
    const foundUser = await getDocs(q);

    if (foundUser.empty) return res.sendStatus(401); //Unauthorized
    const user = foundUser.docs[0].data();
    const userId = foundUser.docs[0].id;
    // evaluate password
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      // create JWTs
      const accessToken = jwt.sign(
        { username: user.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      const refreshToken = jwt.sign(
        { username: user.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      // Saving refreshToken with current user
      const userDocRef = doc(userDB, userId);
      await updateDoc(userDocRef, { refreshToken });

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({ accessToken, user });
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const handleNewUser = async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role)
    res.status(400).json({ message: "Username and password are required." });

  const q = query(userDB, where("username", "==", username));

  try {
    const duplicate = !(await getDocs(q)).empty;
    if (duplicate) return res.sendStatus(409);
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);
    //store the new user
    // CLIENT role is default and the current implementation
    // Other role should be added mannually
    const newUser = { username: username, password: hashedPwd, role };
    await addDoc(userDB, newUser);
    res.status(201).json({ success: `New user ${username} created!` });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const handleLogout = async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const q = query(userDB, where("refreshToken", "==", refreshToken));
  const foundUser = await getDocs(q);

  if (foundUser.empty) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }

  const userId = foundUser.docs[0].id;

  // Delete refreshToken from db
  const userDocRef = doc(userDB, userId);
  await updateDoc(userDocRef, { refreshToken: "" });

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
};

module.exports = { handleLogin, handleNewUser, handleLogout };
