const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  getChecks,
  deleteCheck,
  createCheck,
} = require("../../controllers/checksController/checksController");

const router = express.Router();

const upload = multer({
  dest: path.join("uploads", "images"),
});

router.get("/", getChecks);
router.delete("/:idCheck", deleteCheck);
router.post("/", upload.single("image"), createCheck);

module.exports = router;
