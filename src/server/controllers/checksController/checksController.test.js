const Check = require("../../../database/models/Check");
const listOfCheksMock = require("../../../mocks/checksMocks");
const { getChecks } = require("./checksController");

describe("Given a getChecks controller", () => {
  describe("When it's invoqued with a response", () => {
    test("Then it should call the response's status method with 200 and the json method with a list of checks", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Check.find = jest.fn().mockResolvedValue(listOfCheksMock);

      await getChecks(null, res, null);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ checks: listOfCheksMock });
    });
  });

  describe("When it's invoqued with next function and the find method fails", () => {
    test("Then it should call next with an 404 error and the message: 'notes not found'", async () => {
      const next = jest.fn();
      const error = { code: 404, customMessage: "notes not found" };

      Check.find = jest.fn().mockRejectedValue({});

      await getChecks(null, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
