const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const app = require("../../index");
const connectDB = require("../../../database/index");
const User = require("../../../database/models/User");
const { mockUsers } = require("../../../mocks/userMocks");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await connectDB(mongoServer.getUri());
});

beforeEach(async () => {
  await User.create(mockUsers[0]);
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given a post /users/register endpoint", () => {
  describe("when it receives a request with a new user", () => {
    test("Then it should respond with status 201 and the user created", async () => {
      const response = await request(app)
        .post("/users/register")
        .send(mockUsers[1])
        .expect(201);

      expect(response.body.user).toHaveProperty(
        "username",
        mockUsers[1].username
      );
    });
  });
});

describe("Given a post endpoint /users/login", () => {
  describe("when it receives a request", () => {
    test("then is should call the status method of res with 200 and a token", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({
          username: "maria jose",
          password: "123456",
        })
        .expect(200);

      expect(response.body.token).not.toBeNull();
    });
  });
});
