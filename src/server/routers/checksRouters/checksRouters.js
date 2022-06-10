const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  getChecks,
  deleteCheck,
  createCheck,
  getOneCheck,
} = require("../../controllers/checksController/checksController");
const firebaseUploads = require("../../middlewares/firebase/firebase");

const router = express.Router();

const upload = multer({
  dest: path.join("uploads", "images"),
  limits: {
    fieldSize: 8000000,
  },
});
router.get("/", getChecks);
router.delete("/:idCheck", deleteCheck);
router.post("/", upload.single("image"), firebaseUploads, createCheck);
router.get("/:idCheck", getOneCheck);

module.exports = router;
