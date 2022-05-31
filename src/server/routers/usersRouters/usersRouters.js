const express = require("express");
const {
  registerUser,
} = require("../../controllers/usersControllers/usersControllers");

const router = express.Router();

router.post("/register", registerUser);

module.exports = router;
