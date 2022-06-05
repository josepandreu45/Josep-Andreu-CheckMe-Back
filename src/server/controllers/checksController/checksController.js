const Check = require("../../../database/models/Check");

const getChecks = async (req, res, next) => {
  try {
    const checks = await Check.find();
    res.status(200).json({ checks });
  } catch (error) {
    error.code = 404;
    error.customMessage = "notes not found";

    next(error);
  }
};

module.exports = { getChecks };
