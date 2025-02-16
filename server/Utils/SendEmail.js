const nodeMailer = require("nodemailer");

const SendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    html: options.isHtml ? options.message : undefined, // Use 'html' if HTML content is provided
    text: !options.isHtml ? options.message : undefined, // Fallback to 'text' if not sending HTML
  };

  await transporter.sendMail(mailOptions);
};

module.exports = SendEmail;
