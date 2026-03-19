import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {

  const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

  const mailOptions = {
    from: "nimbarteisha@gmail.com",
    to: to,
    subject: subject,
    text: text
  };

  await transporter.sendMail(mailOptions);
  console.log("Email sent successfully");
};

export default sendEmail;