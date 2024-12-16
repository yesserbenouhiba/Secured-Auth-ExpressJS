const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  const { firstname, lastname, email, password, address, phoneNum, role, profilePic } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Validate required fields
    if (!firstname || !lastname || !email || !password || !address || !phoneNum) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      address: address, // Note: Ensure consistency with schema spelling
      phoneNum,
      role: role || "user", // Default role is 'user' if not provided
      profilePic: profilePic || "" // Default to empty string if not provided
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  // Set the token as a cookie
  res.cookie("token", token, {
    httpOnly: true,       // Ensures cookie is not accessible via JavaScript
    secure: false, // Set to true if using HTTPS in production
    maxAge: 3600000,      // Cookie expiration time (1 hour)
    path: "/",            // Make cookie accessible to all routes
  });

  res.json({ message: "Login successful" });
});

router.post('/logout', (req, res) => {
  // Clear the token cookie by setting its max age to 0
  res.clearCookie("token", {
    httpOnly: true,       // Same flag as when setting the cookie
    secure: false,        // Set to false for local development
    path: "/",            // Same path as when setting the cookie
  });

  // Respond with a success message
  res.json({ message: 'Successfully logged out' });
});

module.exports = router;
