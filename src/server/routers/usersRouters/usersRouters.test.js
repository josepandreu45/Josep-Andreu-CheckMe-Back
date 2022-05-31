const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const app = require("../../index");
const connectDB = require("../../../database/index");
const User = require("../../../database/models/User");
const { mockUser } = require("../../../mocks/userMocks");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await connectDB(mongoServer.getUri());
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
        .send(mockUser)
        .expect(201);

      expect(response.body.user).toHaveProperty("username", mockUser.username);
    });
  });
});
