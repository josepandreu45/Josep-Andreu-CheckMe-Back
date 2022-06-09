require("dotenv").config();
const { verify } = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../index");
const connectDatabase = require("../../../database");
const mockUser = require("../../../mocks/userMocks");
const Check = require("../../../database/models/Check");
const listOfCheksMock = require("../../../mocks/checksMocks");
const User = require("../../../database/models/User");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await connectDatabase(mongoServer.getUri());
});

beforeEach(async () => {
  await Check.create(listOfCheksMock[0]);
  await Check.create(listOfCheksMock[1]);
});

afterEach(async () => {
  await Check.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
  verify: jest.fn(),
}));

describe("Given a GET '/checks' endpoint", () => {
  describe("When in recieves a request and the resource it's found on the server", () => {
    test("Then it should respond with status 200 and a list of projects", async () => {
      verify.mockImplementation(() => "mockVerifyValue");
      const expectedLength = 2;

      User.findOne = jest.fn().mockReturnValue(mockUser);
      Check.find = jest.fn().mockResolvedValueOnce(listOfCheksMock);

      const {
        body: { checks },
      } = await request(app)
        .get("/checks")
        .set({ authorization: "Bearer hola" })
        .expect(200);

      expect(checks).toHaveLength(expectedLength);
    });
  });
});

describe("Given a deleteCheck '/checks/:id' endpoint", () => {
  describe("When in recieves a request with an Id and the resource it's found on the server", () => {
    test("Then it should respond with status 200 and a json with a msg 'Check deleted'", async () => {
      verify.mockImplementation(() => "mockVerifyValue");
      const expectedJson = { msg: "Check deleted" };

      Check.findByIdAndDelete = jest.fn().mockResolvedValueOnce({});
      const { body } = await request(app)
        .delete("/checks/2")
        .set({ authorization: "Bearer mocktoken" })
        .expect(200);

      expect(body).toEqual(expectedJson);
    });
  });
});
