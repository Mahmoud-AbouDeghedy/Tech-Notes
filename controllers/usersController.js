const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const User = require("../models/User");
const Note = require("../models/Note");

exports.getAllUsers = asyncHandler(async (req, res) => {
	const users = await User.find().select("-password").lean();

	if (!users?.length)
		return res.status(400).json({ message: "No users found" });

	res.json(users);
});

exports.createNewUser = asyncHandler(async (req, res) => {
	const { username, password, roles } = req.body;
	if (!username || !password || !Array.isArray(roles) || !roles.length)
		return res.status(400).json({ message: "All fields are required!!" });

	const duplicate = await User.findOne({ username }).lean().exec();
	if (duplicate) return res.status(409).json({ message: "Duplicate username" });

	const hashedPassword = await bcrypt.hash(password, 10);

	const userObject = { username, password: hashedPassword, roles };

	const user = await User.create(userObject);

	if (user)
		res
			.status(201)
			.json({ message: `New user: ${username} created successfully!` });
	else res.status(400).json({ message: "Invalid user data received!" });
});

exports.updateUser = asyncHandler(async (req, res) => {
	const { id, username, roles, active, password } = req.body;
	if (
		!id ||
		!username ||
		!Array.isArray(roles) ||
		!roles.length ||
		typeof active !== "boolean"
	)
		return res
			.status(400)
			.json({ message: "All fields except password are required!!" });

	const user = await User.findById(id).exec();
	if (!user) return res.status(400).json({ message: "User not found!" });

	const duplicate = await User.findOne({ username }).lean().exec();
	if (duplicate && duplicate?._id.toString() !== id)
		return res.status(409).json({ message: "Duplicate username" });

	user.roles = roles;
	user.active = active;
	user.username = username;

	if (password) user.password = await bcrypt.hash(password, 10);

	const updatedUser = await user.save();
	res.json({ message: `${updatedUser.username} updated!` });
});

exports.deleteUser = asyncHandler(async (req, res) => {
	const { id } = req.body;
	if (!id) return res.status(400).json({ message: "User ID is required!" });

	const note = await Note.findOne({ user: id }).lean().exec();
	if (note)
		return res
			.status(400)
			.json({ message: "User has assigned notes, cannot delete!" });

	const user = await User.findById(id).exec();
	if (!user) return res.status(400).json({ message: "User not found!" });

	const result = await user.deleteOne();
	const reply = `User ${result.username} with ID ${result.id} has been deleted`;
	res.json({ reply });
});
