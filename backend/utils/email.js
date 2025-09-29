import nodemailer from 'nodemailer';

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",  // Gmail SMTP server
      port: 587,
      secure: false, // Use STARTTLS
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS  // your app password
      },
      connectionTimeout: 10000, // 10 seconds
      socketTimeout: 10000, // 10 seconds
      greetingTimeout: 5000, // 5 seconds
    });

    let lastError;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: subject,
          text: text,
        });
        console.log("Email sent successfully");
        return; // Success, exit retry loop
      } catch (error) {
        lastError = error;
        if (attempt === 2 || error.code !== 'ETIMEDOUT') {
          throw error; // No more retries or non-timeout error
        }
        console.log(`Email attempt ${attempt} failed, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s before retry
      }
    }
    throw lastError; // Fallback, though shouldn't reach here
  } catch (error) {
    console.log("Email not sent");
    console.error(error);
    throw new Error("Failed to send email: " + error.message);
  }
};

export default sendEmail;