const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { MongoMemoryServer } = require("mongodb-memory-server");

const authRoutes = require("../routes/auth");
const User = require("../models/user");

// Create Express app and mount routes
const app = express();
app.use(express.json());
app.use(authRoutes);

let mongoServer;

// Setup mock MongoDB and JWT secret before running tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  process.env.JWT_SECRET = "testsecret";
});

// Cleanup after tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear collections between tests
afterEach(async () => {
  await User.deleteMany({});
});

describe("Authentication Routes", () => {
  describe("POST /register", () => {
    it("should register a new user", async () => {
      const newUser = {
        firstname: "John",
        lastname: "Doe",
        email: "john@example.com",
        password: "password123",
        address: "123 Main St",
        phoneNum: "1234567890",
      };

      const res = await request(app).post("/register").send(newUser);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("User registered successfully");

      // Check if the user was saved to the database
      const user = await User.findOne({ email: newUser.email });
      expect(user).not.toBeNull();
      expect(user.firstname).toBe(newUser.firstname);
    });

    it("should return 400 if email already exists", async () => {
      const existingUser = new User({
        firstname: "Jane",
        lastname: "Doe",
        email: "jane@example.com",
        password: "hashedpassword",
        address: "456 Main St",
        phoneNum: "0987654321",
      });
      await existingUser.save();

      const res = await request(app).post("/register").send({
        firstname: "John",
        lastname: "Smith",
        email: "jane@example.com", // Same email
        password: "password123",
        address: "789 Main St",
        phoneNum: "1112223333",
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Email already exists");
    });
  });

  describe("POST /login", () => {
    it("should login a user with valid credentials", async () => {
      const password = "password123";
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        firstname: "John",
        lastname: "Doe",
        email: "john@example.com",
        password: hashedPassword,
        address: "123 Main St",
        phoneNum: "1234567890",
      });
      await user.save();

      const res = await request(app).post("/login").send({
        email: "john@example.com",
        password,
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Login successful");
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should return 404 for non-existent user", async () => {
      const res = await request(app).post("/login").send({
        email: "nonexistent@example.com",
        password: "password123",
      });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("User not found");
    });

    it("should return 401 for invalid password", async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);

      const user = new User({
        firstname: "John",
        lastname: "Doe",
        email: "john@example.com",
        password: hashedPassword,
        address: "123 Main St",
        phoneNum: "1234567890",
      });
      await user.save();

      const res = await request(app).post("/login").send({
        email: "john@example.com",
        password: "wrongpassword",
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Invalid credentials");
    });
  });

  describe("POST /logout", () => {
    it("should clear the token cookie on logout", async () => {
      const res = await request(app).post("/logout");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Successfully logged out");
      expect(res.headers["set-cookie"][0]).toMatch(/token=;/);
    });
  });
});
