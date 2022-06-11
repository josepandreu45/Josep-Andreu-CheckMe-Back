const Check = require("../../../database/models/Check");
const User = require("../../../database/models/User");

const getChecks = async (req, res, next) => {
  const { userId } = req;
  try {
    const { username } = await User.findOne({ _id: userId });
    const checks = await Check.find({ owner: username });
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

const createCheck = async (req, res, next) => {
  const { title, times, description, owner } = req.body;
  const { img, imgBackup } = req;

  try {
    const newCheck = await Check.create({
      title,
      times,
      description,
      image: img,
      imageBackup: imgBackup,
      owner,
    });

    res.status(201).json({ newCheck });
  } catch (error) {
    error.customMessage = "Error creating check";
    error.code = 400;

    next(error);
  }
};

const getOneCheck = async (req, res) => {
  const { idCheck } = req.params;
  const check = await Check.findById(idCheck);
  res.status(200).json(check);
};

const editCheck = async (req, res) => {
  const { idCheck } = req.params;
  const { title, times, description } = req.body;
  const { img, imgBackup } = req;

  try {
    const checkToEdit = await Check.findById(idCheck);
    const checkEdited = {
      title,
      times,
      description,
      image: img,
      imageBackup: imgBackup,
      owner: checkToEdit.owner,
    };
    const newCheck = await Check.findByIdAndUpdate(idCheck, checkEdited, {
      new: true,
    });
    res.status(200).json(newCheck);
  } catch (error) {
    error.customMessage = "Check not found";
    error.code = 400;
  }
};

module.exports = {
  getChecks,
  deleteCheck,
  createCheck,
  getOneCheck,
  editCheck,
};
