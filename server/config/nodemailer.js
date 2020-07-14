const nodemailer = require("nodemailer");
const MAIL_USER = process.env.MAIL_USER || require("./secrets.json").MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS || require("./secrets.json").MAIL_PASS;

const body = (address, token) => `
<body>
<h1>Hello from ProjectKanri.</h1>
<h2>A password reset was requested for ${address}.</h2>
<p>If this was you, please go to this link to reset your password: 
http://localhost:3000/resetpass/${token}. If this was not you, please ignore this email.</p>
</body>
`;

/**
 * Handle sending emails to users
 * @param {Object} options
 * @param {string} options.address
 * @param {string} options.token
 */
module.exports = async ({ address, token }) => {
	if (!/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(address))
		throw new Error("Must be valid email address.");
	let transporter = nodemailer.createTransport({
		service: "Gmail",
		auth: {
			user: MAIL_USER,
			pass: MAIL_PASS
		}
	});

	let info = await transporter.sendMail({
		from: `"ProjectKanri" <projectkanriteam@gmail.com>`,
		to: address,
		subject: "Forgot your password?",
		html: body(address, token)
	});
	return info.messageId;
};
