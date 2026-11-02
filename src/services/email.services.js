const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection
// transporter.verify((error, success) => {
//   if (error) {
//     console.error("Error connecting to email server:", error);
//   } else {
//     console.log("Email server is ready to send messages");
//   }
// });

const sendEmail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from:`"Backend-ledger"<${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  return await transporter.sendMail(mailOptions);
};

async function sendRegistrationEmail(userEmail, name) {
  const subject = "Welcome to Backend Ledger!";

  const text = `Hello ${name},

Thank you for registering at Backend Ledger.
We're excited to have you on board!

Best regards,
The Backend Ledger Team`;

  const html = `
    <h2>Hello ${name},</h2>
    <p>Thank you for registering at Backend Ledger.</p>
    <p>We're excited to have you on board!</p>
    <br>
    <p>Best regards,<br>The Backend Ledger Team</p>
  `;

await sendEmail({
  to: userEmail,
  subject,
  text,
  html,
  

});
console.log("Sending registration email...");

}

 async function sendTransactionEmail(){
    async function sendTransactionEmail(userEmail, name, amount, toAccount) {
  const subject = "Transaction Successful!";

  const text = `Hello ${name},

Your transaction of ₹${amount} has been successfully transferred to account ${toAccount}.

Thank you for banking with us.

Regards,
Secure Bank Team`;

  const html = `
    <h2>Transaction Successful ✅</h2>

    <p>Hello <strong>${name}</strong>,</p>

    <p>
      Your transaction of <strong>₹${amount}</strong> has been successfully
      transferred to account <strong>${toAccount}</strong>.
    </p>

    <p>
      <strong>Status:</strong> Success
    </p>

    <p>
      Thank you for banking with us.
    </p>

    <br>

    <p>
      Regards,<br>
      <strong>Secure Bank Team</strong>
    </p>
  `;

  await sendEmail(userEmail, subject, text, html);
}
 }

   async function sendTransactionfailEmail(){
    async function sendTransactionEmail(userEmail, name, amount, toAccount) {
  const subject = "Transaction Successful!";

  const text = `Hello ${name},

Your transaction of ₹${amount} has been successfully transferred to account ${toAccount}.

Thank you for banking with us.

Regards,
Secure Bank Team`;

  const html = `
    <h2>Transaction Failed ✅</h2>

    <p>Hello <strong>${name}</strong>,</p>

    <p>
      Your transaction of <strong>₹${amount}</strong> has been successfully
      transferred to account <strong>${toAccount}</strong>.
    </p>

    <p>
      <strong>Status:</strong> Success
    </p>

    <p>
      Thank you for banking with us.
    </p>

    <br>

    <p>
      Regards,<br>
      <strong>Secure Bank Team</strong>
    </p>
  `;

  await sendEmail(userEmail, subject, text, html);
}
 }


module.exports = {
  sendEmail,
  sendRegistrationEmail,
    sendTransactionEmail,
      sendTransactionfailEmail
};