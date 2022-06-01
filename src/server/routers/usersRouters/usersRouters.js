const express = require("express");
const { validate } = require("express-validation");
const {
  credentialsRegisterSchema,
  credentialsLoginSchema,
} = require("../../../schemas/userCredentialsSchema");
const {
  registerUser,
  loginUser,
} = require("../../controllers/usersControllers/usersControllers");

const router = express.Router();

router.post("/register", validate(credentialsRegisterSchema), registerUser);
router.post("/login", validate(credentialsLoginSchema), loginUser);

module.exports = router;
