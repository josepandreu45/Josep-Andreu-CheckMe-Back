const encryptPassword = require("../../utils/encryptPassword");

const User = require("../../database/models/User");

const registerUser = async (req, res, next) => {
  const { username, password } = req.body;
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
      username,
      password: encryptedPassword,
    });
    res
      .status(201)
      .json({ user: { username: newUser.username, id: newUser.id } });
  } catch (error) {
    error.statusCode = 400;
    error.customMessage = "wrong user data";
  }
};

module.exports = { registerUser };
