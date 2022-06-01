const bcrypt = require("bcrypt");
const { mockUser } = require("../../../mocks/userMocks");
const { registerUser, loginUser } = require("./usersControllers");
const User = require("../../../database/models/User");

describe("Given the registerUser function", () => {
  describe("when its called with a new username and password", () => {
    test("Then it should the response method 200 and the json with the new user", async () => {
      User.findOne = jest.fn().mockResolvedValue(false);
      User.create = jest.fn().mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, "hash").mockResolvedValue("123456");

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const req = {
        body: {
          name: "maria jose",
          username: "maria jose",
          password: "123456",
        },
      };
      const newUser = {
        name: mockUser.name,
        username: mockUser.username,
        password: mockUser.password,
      };

      const next = jest.fn();
      const expectedResult = 201;

      await registerUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(expectedResult);
      expect(res.json).toHaveBeenCalledWith({
        user: { name: newUser.name, username: newUser.username },
      });
    });
  });
  describe("when its called with a username that exists", () => {
    test("Then it should call next", async () => {
      User.findOne = jest.fn().mockResolvedValue(mockUser);

      const req = {
        body: {
          id: "1",
          name: "maria jose",
          username: "maria jose",
          password: "123456",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const next = jest.fn();

      await registerUser(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
  describe("when its called with wrong credentials", () => {
    test("Then it should call next", async () => {
      User.create = jest.fn().mockRejectedValue();
      const req = {
        body: {
          id: "1",
          name: "maria jose",
          username: "maria jose",
          password: "123456",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const error = new Error();
      error.customMessage = "bad request";
      error.statusCode = 400;
      const next = jest.fn();

      await registerUser(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

const expectedToken = "userToken";

jest.mock("jsonwebtoken", () => ({
  sign: () => expectedToken,
}));

describe("Given the loginUser function", () => {
  describe("When its called with an username and password corrects", () => {
    test("Then it should call the response method status with 200", async () => {
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
      User.findOne = jest.fn().mockResolvedValue(mockUser);

      const req = {
        body: {
          id: "1",
          name: "mariajo",
          username: "maria jose",
          password: "123456",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const next = jest.fn();
      const expectedResultvalue = 200;

      await loginUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(expectedResultvalue);
      expect(res.json).toHaveBeenCalledWith({ token: expectedToken });
    });
  });

  describe("when its invked with an incorrect username", () => {
    test("then it should call next", async () => {
      User.findOne = jest.fn().mockResolvedValue(!mockUser);

      const req = {
        body: {
          id: "1",
          name: "mariajo",
          username: "maria josee",
          password: "123456",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const next = jest.fn();

      await loginUser(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("when its invked with an incorrect password", () => {
    test("then it should call next", async () => {
      jest.spyOn(bcrypt, "compare").mockResolvedValue(false);
      User.findOne = jest.fn().mockResolvedValue(mockUser);

      const req = {
        body: {
          id: "1",
          name: "mariajo",
          username: "maria jose",
          password: "1111",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const next = jest.fn();

      await loginUser(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
