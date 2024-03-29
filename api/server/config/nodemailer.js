const nodemailer = require("nodemailer");
const MAIL_USER = process.env.MAIL_USER || require("./secrets.json").MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS || require("./secrets.json").MAIL_PASS;
const MAIL_HOST = process.env.MAIL_HOST || require("./secrets.json").MAIL_HOST;

const { emailRegex } = require("../../shared");
const LINK = process.env.NODE_ENV === "production" ? `https://${process.env.FQDN}` : `http://localhost:${process.env.PORT || 3000}`;

const body = (address, token) => `
<body>
<h1>Hello from ProjectKanri.</h1>
<h2>A password reset was requested for ${address}.</h2>
<p>If this was you, please <a href="${LINK}/resetpass/${token}">go to this link to reset your password</a>. If this was not you, please ignore this email.</p>
</body>
`;

const transporter = nodemailer.createTransport({
	auth: {
		user: MAIL_USER,
		pass: MAIL_PASS
	},
	host: MAIL_HOST
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
		<p>An account was made at <a href="${LINK}">ProjectKanri</a> under the email address <b>${address}</b>.</p>
		<p>Please <a href=${LINK}/login?token=${token}>click this link to verify your account</a>. If this was not you, <strong>please ignore this email</strong>.</p>
		<p>This link will expire in 1 day.</p>
	</body>
	`;
	if (!emailRegex.test(address)) throw new Error("Must be valid email address.");

	console.log("Trying to send email to " + address);
	try {
		const result = await transporter.sendMail({
			from: `"ProjectKanri" <projectkanriteam@gmail.com>`,
			to: address,
			subject: `Verify Your ProjectKanri Account`,
			html: body
		});
		return result;
	} catch (err) {
		console.log(`Error sending email to ${address}: ${err}`);
	}
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

	console.log("Trying to send email to " + address);
	try {
		const result = await transporter.sendMail({
			from: `"ProjectKanri" <projectkanriteam@gmail.com>`,
			to: address,
			subject: `Project Invite from ${name}`,
			html: body
		});
		return result;
	} catch (err) {
		console.log(`Error sending email to ${address}: ${err}`);
	}
};

module.exports = { sendResetEmail, sendVerifyEmail, sendInviteEmail };
