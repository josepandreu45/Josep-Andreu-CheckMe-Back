const express = require("express");
const { validate } = require("express-validation");
const {
  credentialsRegisterSchema,
} = require("../../../schemas/userCredentialsSchema");
const {
  registerUser,
} = require("../../controllers/usersControllers/usersControllers");

const router = express.Router();

router.post("/register", validate(credentialsRegisterSchema), registerUser);

module.exports = router;
