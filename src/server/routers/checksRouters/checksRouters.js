const express = require("express");
const {
  getChecks,
  deleteCheck,
} = require("../../controllers/checksController/checksController");

const router = express.Router();

router.get("/", getChecks);
router.delete("/:idCheck", deleteCheck);

module.exports = router;
