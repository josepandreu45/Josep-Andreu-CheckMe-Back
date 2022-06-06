const Check = require("../../../database/models/Check");

const getChecks = async (req, res, next) => {
  try {
    const checks = await Check.find();
    res.status(200).json({ checks });
  } catch (error) {
    error.code = 404;
    error.customMessage = "Checks not found";

    next(error);
  }
};

const deleteCheck = async (req, res, next) => {
  const { idCheck } = req.params;

  try {
    await Check.findByIdAndDelete(idCheck);

    res.status(200).json({ msg: "Check deleted" });
  } catch (error) {
    error.customMessage = "No check with that id found";
    error.code = 404;

    next(error);
  }
};

module.exports = { getChecks, deleteCheck };
