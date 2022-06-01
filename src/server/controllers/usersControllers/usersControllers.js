const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const encryptPassword = require("../../../utils/encryptPassword");

const User = require("../../../database/models/User");

const registerUser = async (req, res, next) => {
  const { name, username, password } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    const error = new Error();
    error.statusCode = 409;
    error.customMessage = "this user already exists";

    next(error);
  }
  const encryptedPassword = await encryptPassword(password);

  try {
    const newUser = await User.create({
      name,
      username,
      password: encryptedPassword,
    });
    res
      .status(201)
      .json({ user: { name: newUser.name, username: newUser.username } });
  } catch {
    const error = new Error();
    error.statusCode = 400;
    error.customMessage = "wrong user data";

    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    const error = new Error();
    error.statusCode = 401;
    error.customMessage = "usuario o contraseña incorrectos";

    next(error);
  } else {
    const userData = {
      id: user.id,
      username: user.username,
    };

    const rightPassword = await bcrypt.compare(password, user.password);

    if (!rightPassword) {
      const error = new Error();
      error.statusCode = 401;
      error.customMessage = "usuario o contraseña incorrectos";

      next(error);
    } else {
      const token = jwt.sign(userData, process.env.JWT_SECRET);
      res.status(200).json({ token });
    }
  }
};

module.exports = { registerUser, loginUser };
