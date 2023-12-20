const express = require("express");
const { db, auth } = require("../firebase/firebase");
const { collection, getDocs } = require("firebase/firestore");
const MenuDB = collection(db, "menu");

const getMenuItems = async (req, res) => {
  try {
    const items = [];
    const docSnap = await getDocs(MenuDB);
    docSnap.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

module.exports = { getMenuItems };
