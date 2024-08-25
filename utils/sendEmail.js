import nodemailer from "nodemailer";
import { config } from "dotenv";

config()

// Configuration nodemailer
const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    tls: {
        rejectUnauthorized: false,
        minVersion: "TLSv1.2"
    },
    auth: {
        user: process.env.EMAIL_NODEMAILER,
        pass: process.env.PASSWORD_NODEMAILER
    },
    
});

//  Email for the admin
const welcomeAdmin = (email, name, password) => {
    transport.sendMail({
        from: process.env.EMAIL_NODEMAILER,
        to: email,
        subject: "Welcome Admin to your website",
        html: `<div>
        <h2>Welcome to Amazony! </h2>
        <h2> Dear ${name}</h2> 
        <p>To can enter in our website, please enter this email and this password :<p>       
        <p>email: ${email}</p>
        <p>password: ${password}</p>
        <p>Best regards.<p>
        <p>Your Amazony Team</p>
        </div>
        `
    });
};

// Email for user when to forget password
const emailForgotPassword = (email, name, token, userId) => {
    transport.sendMail({
        from: process.env.EMAIL_NODEMAILER,
        to: email,
        subject: "Reset Password",
        html: `<div>
        <h1>Reset Password!</h1>
        <h2>Hello ${name},<h2>
        <p>Somebody requested a new password for the account associated with your email.</p>
        <p>No changes have been made to your account yet.</p>
        <p>You can reset your password by clicking the link below:<p>
        <a href=${process.env.BASE_URL}/auth/requestResetPassword?token=${token}&id=${userId}/>Click hier to reset your password </a>
        <p>If you did not request a new password, please let us know immediately by replying to this email.</p>
        <p>Yours,</p>
        <p>The Fly-Delivery team</p>
        </div>
        `
    })
        .catch(err => console.log(err))
};

// Email for user to reset password
const emailResetPassword = (email, name) => {
    transport.sendMail({
        from: process.env.EMAIL_NODEMAILER,
        to: email,
        subject: "Password change confirmation",
        html: `<div>
        <h2> Dear ${name}</h2>
        <h2>Your password has been changed successfully. </h2>
        <p>This is to confirm that the password for your account has been successfully changed. Your account is now secured with the new password that you have set.</p>
        <p>If you did not change your password, please contact us immediately to report any unauthorized access to your account.</p>
        <p>Thank you for using our service.<p>     
        <p>With best regards<p>
        <p>Your Fly-Delivery Team</p>
        </div>
        `
    });
};

// Email to the user when registering for this application
const welcome = (email, name) => {
    transport.sendMail({
        from: process.env.EMAIL_NODEMAILER,
        to: email,
        subject: "Welcome our website",
        html: `<div>
        <h2>Welcome to Amazony! </h2>
        <h2> Dear ${name}</h2>        
        <p>We wanted to take a moment to welcome you to Amazony. We are excited to have you as a client and appreciate your trust in us.</p>
        <p>As a new client, you can expect to receive top-notch customer service, high-quality products and services, and timely communication from us. We are committed to meeting and exceeding your expectations.</p>
        <p>Thank you again for choosing Amazony. We look forward to working with you!<p>     
        <p>Best regards.<p>
        <p>Your Fly-Delivery Team</p>
        </div>
        `
    });
};

// Email for the payement
const payOrderEmailTemplate = (email, order) => {
    transport.sendMail({
        from: process.env.EMAIL_NODEMAILER,
        to: email,
        subject: "Thanks for shopping with us",
        html: `<div>
         <p>
    Hi ${order.shippingAddress.fullName},</p>
    <p>We have finished processing your order.</p>
    <h2>[Order ${order._id}] (${order.createdAt.toString().substring(0, 10)})</h2>
    <table>
    <thead>
    <tr>
    <td colspan="2"><strong>Product</strong></td>
    <td ><strong align="right">Price</strong></td>
    </thead>
    <tbody>
    ${order.orderItems
            .map(
                (item) => `
      <tr>
      <td colspan="2">${item.name}</td>
      <td align="right"> $${item.price.toFixed(2)}</td>
      </tr>
    `
            )
            .join('\n')}
    </tbody>
    <tfoot>
    <tr>
    <td colspan="2">Items Price:</td>
    <td align="right"> $${order.itemsPrice.toFixed(2)}</td>
    </tr>
    <tr>
    <td colspan="2">Shipping Price:</td>
    <td align="right"> $${order.shippingPrice.toFixed(2)}</td>
    </tr>
    <tr>
    <td colspan="2">Quantity:</td>
    <td align="right"> $${order.numberOfPieces.toFixed(2)}</td>
    </tr>
    <tr>
    <td colspan="2"><strong>Total Price:</strong></td>
    <td align="right"><strong> $${order.totalPrice.toFixed(2)}</strong></td>
    </tr>
    <tr>
    <td colspan="2">Payment Method:</td>
    <td align="right">${order.paymentMethod}</td>
    </tr>
    </table>
  
    <h2>Shipping address</h2>
    <p>
    ${order.shippingAddress.fullName},<br/>
    ${order.shippingAddress.address},<br/>
    ${order.shippingAddress.city},<br/>
    ${order.shippingAddress.country},<br/>
    ${order.shippingAddress.postalCode}<br/>
    </p>
    <hr/>
    <p>
    Thanks for shopping with us.
    </p>
        </div>
        `
    });
   
};

export { welcomeAdmin, emailForgotPassword, emailResetPassword, welcome, payOrderEmailTemplate };