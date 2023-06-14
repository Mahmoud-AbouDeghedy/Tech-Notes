const path = require("path");

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const { logger, logEvents } = require("./middleware/logger");
const { errorHandler } = require("./middleware/errorHandler");
const { corsOptions } = require("./config/corsOptions");
const connectDB = require("./config/dbConnection");

const app = express();

connectDB();

app.use(logger);

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));
app.use("/users", require("./routes/userRoutes"));
app.use("/notes", require("./routes/noteRoutes"));

app.all("*", (req, res) => {
	if (req.accepts("html"))
		res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
	else if (req.accepts("json")) res.status(404).json({ error: "Not found" });
	else res.status(404).type("txt").send("404 Not found");
});
app.use(errorHandler);

const PORT = process.env.PORT || 3500;

mongoose.connection.once("open", () => {
	console.log("Connected to DB");
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
});

mongoose.connection.on("error", (err) => {
	console.log(err);
	logEvents(
		`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
		"mongoError.log"
	);
});
