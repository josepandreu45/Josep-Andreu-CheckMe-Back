const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { error404, generalError } = require("./middlewares/errors/errors");
const usersRouters = require("./routers/usersRouters/usersRouters");
const auth = require("./middlewares/auth/auth");
const checksRouters = require("./routers/checksRouters/checksRouters");

const app = express();

app.disable("x-powered-by");
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use(express.static("uploads"));

app.use("/users", usersRouters);
app.use("/checks", auth, checksRouters);

app.use(error404);
app.use(generalError);

module.exports = app;
