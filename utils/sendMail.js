const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  port: 465, // true for 465, false for other ports
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
  secure: true,
  requireTLS: true,
});

module.exports = transporter;
// exports.sendMailFunc = (to, subject, html) => {
//   const mailOptions = {
//     from: process.env.MAIL_USERNAME,
//     to,
//     subject,
//     html,
//   };

//   transporter.sendMail(mailOptions);
// };
