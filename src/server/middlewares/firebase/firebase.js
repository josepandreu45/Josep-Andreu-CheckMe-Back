const { initializeApp } = require("firebase/app");

const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");

const fs = require("fs");
const path = require("path");

const firebaseUploads = async (req, res, next) => {
  const { file } = req;

  const firebaseConfig = {
    apiKey: "AIzaSyDZBmwlFh42hPqFPjAy_US4ONIxPPDXwFc",
    authDomain: "checkme-josep-andreu.firebaseapp.com",
    projectId: "checkme-josep-andreu",
    storageBucket: "checkme-josep-andreu.appspot.com",
    messagingSenderId: "502118554774",
    appId: "1:502118554774:web:293c5a60c2819172d736b7",
  };

  const firebaseApp = initializeApp(firebaseConfig);

  const newImageName = file ? `${Date.now()}${file.originalname}` : "";

  if (file) {
    await fs.rename(
      path.join("uploads", "images", file.filename),
      path.join("uploads", "images", newImageName),
      async (error) => {
        if (error) {
          next(error);
          return;
        }

        await fs.readFile(
          path.join("uploads", "images", newImageName),
          async (readError, readFile) => {
            if (readError) {
              next(readError);
              return;
            }

            const storage = getStorage(firebaseApp);

            const storageRef = ref(storage, newImageName);

            await uploadBytes(storageRef, readFile);

            const firebaseImageURL = await getDownloadURL(storageRef);

            req.imgBackup = firebaseImageURL;
            req.img = path.join("images", newImageName);

            next();
          }
        );
      }
    );
  } else {
    req.imgBackup = "";
    req.img = "";
    next();
  }
};

module.exports = firebaseUploads;
