const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    // const {title, description,completed} = req.body
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashed_pw = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashed_pw,
    });

    await newUser.save();
    return res.status(200).json({ message: "user registered successfully" });
  } catch (error) {
    console.log({ error });

    return res.status(500).json({ error: error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(404).json({ error: "user not found" });
    }
    // check password.
    const isMatch = await bcrypt.compare(password, foundUser.password);

    if (!isMatch) {
      return res.status(403).json({ error: "wrong credentials" });
    }

    // sign jwt
    const token = await jwt.sign(
      { user_id: foundUser.id, email: foundUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const userObj = foundUser.toObject();
    delete userObj.password;
    // return token and user details except password
    return res
      .status(200)
      .json({ message: "login successful", token: token, user: userObj });
  } catch (error) {
    console.log({ error });

    return res.status(500).json({ error: error });
  }
});

module.exports = router;
