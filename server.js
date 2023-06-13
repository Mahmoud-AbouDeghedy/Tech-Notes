const path = require("path");

const express = require("express");

const app = express();

app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", require("./routes/root"));
app.all("*", (req, res) => {
	if (req.accepts("html"))
		res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
	else if (req.accepts("json")) res.status(404).json({ error: "Not found" });
	else res.status(404).type("txt").send("404 Not found");
});

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
