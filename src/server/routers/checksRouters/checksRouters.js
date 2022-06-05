const express = require("express");
const {
  getChecks,
} = require("../../controllers/checksController/checksController");

const router = express.Router();

router.get("/", getChecks);

module.exports = router;
