const { allowedOrigins } = require("./allowedOrigins");

exports.corsOptions = {
	origin: (origin, cb) => {
		if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
			cb(null, true);
		} else {
			cb(new Error("Not allowed by CORS"));
		}
	},
	credentials: true,
	optionsSuccessStatus: 200,
};
