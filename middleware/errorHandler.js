const { logEvents } = require("./logger");

exports.errorHandler = (err, req, res, next) => {
	logEvents(
		`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
		"errors.log"
	);
	console.log(err.stack);

	const statusCode = res.statusCode ? res.statusCode : 500;
	res.status(statusCode).json({ message: err.message });
};
