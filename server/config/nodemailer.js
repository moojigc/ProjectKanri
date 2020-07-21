const nodemailer = require("nodemailer");
const MAIL_USER = process.env.MAIL_USER || require("./secrets.json").MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS || require("./secrets.json").MAIL_PASS;
const { emailRegex } = require("../../shared");
const LINK = process.env.NODE_ENV === "production" ? "https://projectkanri.herokuapp.com" : "http://localhost:3000";

const body = (address, token) => `
<body>
<h1>Hello from ProjectKanri.</h1>
<h2>A password reset was requested for ${address}.</h2>
<p>If this was you, please <a href="${LINK}/resetpass/${token}">go to this link to reset your password</a>. If this was not you, please ignore this email.</p>
</body>
`;

const transporter = nodemailer.createTransport({
	service: "Gmail",
	auth: {
		user: MAIL_USER,
		pass: MAIL_PASS
	}
});

/**
 * Handle sending pass reset emails to users
 * @param {Object} options
 * @param {string} options.address
 * @param {string} options.token
 */
const sendResetEmail = async ({ address, token }) => {
	if (!emailRegex.test(address)) throw new Error("Must be valid email address.");

	let info = await transporter.sendMail({
		from: `"ProjectKanri" <projectkanriteam@gmail.com>`,
		to: address,
		subject: "Forgot your password?",
		html: body(address, token)
	});
	return info.messageId;
};

/**
 * Handle sending verification emails to users
 * @param {Object} options
 * @param {string} options.address
 * @param {string} options.token
 */
const sendVerifyEmail = async ({ address, token }) => {
	let body = `
	<body>
		<h1>Hello from ProjectKanri.</h1>
		<h2>An account was made at projectkanri.herokuapp.com under the email address <b>${address}</b>.</h2>
		<p>Please <a href=${LINK}/login/${token}>click this link to verify your account</a>. If this was not you, <strong>please ignore this email</strong>.</p>
		<p>This link will expire in 1 day.</p>
	</body>
	`;
	if (!emailRegex.test(address)) throw new Error("Must be valid email address.");
	let info = await transporter.sendMail({
		from: `"ProjectKanri" <projectkanriteam@gmail.com>`,
		to: address,
		subject: "Verify your ProjectKanri account",
		html: body
	});
	return info;
};

const sendInviteEmail = async ({ address, token, name }) => {
	let body = `
	<body style="font-family: Helvetica, Arial, sans-serif;">
		<h1>Hello from ProjectKanri.</h1>
		<h2>You have been invited to collaborate in a project by ${name}.</h2>
		<p>Please <a href=${LINK}/accept-invite/${token}>click this link to accept the invitation.</a></p>
		<p>This link will expire in 1 week.</p>
	</body>`;
	if (!emailRegex.test(address)) throw new Error("Must be valid email address.");
	return await transporter.sendMail({
		from: `"ProjectKanri" <projectkanriteam@gmail.com>`,
		to: address,
		subject: `Project Invite from ${name}`,
		html: body
	});
};

module.exports = { sendResetEmail, sendVerifyEmail, sendInviteEmail };
