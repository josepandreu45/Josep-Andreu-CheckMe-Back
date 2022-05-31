const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { error404, generalError } = require("./middlewares/errors");
const usersRouters = require("./routers/usersRouters/usersRouters");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/users", usersRouters);

app.use(error404);
app.use(generalError);

module.exports = app;
