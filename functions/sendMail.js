const functions = require("firebase-functions");
const sgMail = require("@sendgrid/mail");


const SENDGRID_API_KEY = functions.config().sendgrid.key;
sgMail.setApiKey(SENDGRID_API_KEY);


exports.sendMail = functions.https.onRequest(async (req, res) => {
  try {
    const { name, email, message } = req.body;

    
    if (!email || !message) {
      return res.status(400).send({ error: "Missing required fields" });
    }

    const msg = {
      to: "admin@menshealthnfp.org", 
      from: "noreply@menshealthnfp.org", 
      subject: `New Volunteer Form Submission from ${name || "Anonymous"}`,
      text: `Email: ${email}\nMessage:\n${message}`,
      html: `<h3>Volunteer Form Submission</h3>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong><br>${message}</p>`,
    };

    await sgMail.send(msg);
    res.status(200).send({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("SendMail error:", err);
    res.status(500).send({ error: err.message });
  }
});
