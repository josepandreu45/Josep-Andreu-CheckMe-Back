const path = require("path");
const fs = require("fs");
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

const createCheck = async (req, res, next) => {
  const { title, times, description } = req.body;
  const { file } = req;

  const newImage = `${Date.now()}${file.originalname}`;

  try {
    fs.rename(
      path.join("uploads", "images", file.filename),
      path.join("uploads", "images", newImage),
      async (error) => {
        if (error) {
          next(error);
        }
      }
    );

    const newCheck = await Check.create({
      title,
      times,
      description,
      image: file ? path.join("uploads", "images") : "",
    });

    res.status(201).json({ newCheck });
  } catch (error) {
    error.customMessage = "Error creating check";
    error.code = 400;

    next(error);
  }
};

module.exports = { getChecks, deleteCheck, createCheck };
