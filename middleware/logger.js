const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const { v4: uuid } = require("uuid");
const { format } = require("date-fns");

const logEvents = async (msg, logFileName) => {
	const dateTime = format(new Date(), "yyyy-MM-dd\tHH:mm:ss");
	const logMsg = `${dateTime}\t${uuid()}\t${msg}\n`;

	try {
		if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
			await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
		}
		await fsPromises.appendFile(
			path.join(__dirname, "..", "logs", logFileName),
			logMsg
		);
	} catch (err) {
		console.log(err);
	}
};

const logger = (req, res, next) => {
	const msg = `${req.method}\t${req.url}\t${req.headers.origin}`;
	logEvents(msg, "requests.log");
	console.log(`${req.method} ${req.path}`);
	next();
};

module.exports = { logger, logEvents };
