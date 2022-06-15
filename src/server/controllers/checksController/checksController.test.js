const Check = require("../../../database/models/Check");
const User = require("../../../database/models/User");
const listOfCheksMock = require("../../../mocks/checksMocks");
const { mockUser } = require("../../../mocks/userMocks");
const {
  getChecks,
  deleteCheck,
  createCheck,
  getOneCheck,
} = require("./checksController");

describe("Given a getChecks controller", () => {
  describe("When it's invoqued with a response", () => {
    test("Then it should call the response's status method with 200 and the json method with a list of checks", async () => {
      const req = { params: { userId: "mockId" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne = jest.fn().mockReturnValue(mockUser);

      Check.find = jest.fn().mockResolvedValue(listOfCheksMock);

      await getChecks(req, res, null);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ checks: listOfCheksMock });
    });
  });

  describe("When it's invoqued with next function and the find method fails", () => {
    test("Then it should call next with an 404 error and the message: 'Checks not found'", async () => {
      const next = jest.fn();
      const error = { code: 404, customMessage: "Checks not found" };
      const req = { params: { userId: "mockId" } };

      User.findOne = jest.fn().mockReturnValue(mockUser);
      Check.find = jest.fn().mockRejectedValue({});

      await getChecks(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a deleteCheck controller", () => {
  describe("When it's invoqued with a response and a request with an id to delete", () => {
    test("Then it should call the response's status method with 200 and the json method with a 'Check deleted' message", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const req = { params: { idCheck: 40 } };

      Check.findByIdAndDelete = jest.fn().mockResolvedValue();

      await deleteCheck(req, res, null);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ msg: "Check deleted" });
    });
  });

  describe("When it's invoqued with a response and a request with a invalid id to delete", () => {
    test("Then it should call the response's status method with 404 and the json method with a 'No check with that id found' message", async () => {
      const next = jest.fn();
      const req = { params: { userId: 1, idCheck: 55 } };
      const expectedError = {
        customMessage: "No check with that id found",
        code: 404,
      };

      Check.findByIdAndDelete = jest.fn().mockRejectedValue({});
      await deleteCheck(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a createNote controller", () => {
  const title = "title";
  const times = 1;
  const description = "description";
  const username = "josep";
  const image = "";
  const imageBackup = "";
  const date = "";

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const req = {
    checkId: "1",
    body: {
      title,
      times,
      description,
      image,
      imageBackup,
      owner: username,
      date,
    },
  };
  describe("When it's invoqued with a user Id, a title, content and category", () => {
    test("Then it should call the response's status method with 201 and the new object created", async () => {
      const expectedObjectCreated = {
        title,
        times,
        description,
        owner: username,
        image,
        imageBackup,
        date,
      };

      User.findOne = jest.fn().mockResolvedValue({ username, newCheck: {} });
      Check.create = jest.fn().mockResolvedValue(expectedObjectCreated);
      User.findByIdAndUpdate = jest.fn().mockResolvedValue({});

      await createCheck(req, res, null);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe("When it's invoqued with a user Id, a title, content, a category, a next function and the create method fails", () => {
    test("Then it should call the response's status method with 409 and a error message", async () => {
      const next = jest.fn();
      const error = {
        customMessage: "Error creating check",
        code: 400,
      };

      User.findById = jest.fn().mockResolvedValue({ username });
      Check.create = jest.fn().mockRejectedValue({});

      await createCheck(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a getNote controller", () => {
  const req = {
    params: { idCheck: "1" },
  };
  describe("When it's invoqued with a response and a id of a check to find", () => {
    test("Then it should call the response's status method with 200 and the json method with a check", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Check.findById = jest.fn().mockResolvedValue(listOfCheksMock[0]);

      await getOneCheck(req, res, null);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(listOfCheksMock[0]);
    });
  });
});
