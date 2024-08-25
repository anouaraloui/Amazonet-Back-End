
import { config } from "dotenv";
import formData from ('form-data');
import Mailgun from ('mailgun.js');
config();

// export const mailgun = () =>
//     mailgunJs({
//         apiKey: process.env.MAILGUN_API_KEY,
//         domain: process.env.MAILGUN_DOMAIN
// });


  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY });
  
  mg.messages.create('sandbox-123.mailgun.org', {
  	from: `Amazony Team <${process.env.EMAIL}>`,
  	to: ["alouianwer21@gmail.com"],
  	subject: "Hello",
  	text: "Testing some Mailgun awesomeness!",
  	html: "<h1>Testing some Mailgun awesomeness!</h1>"
  })
  .then(msg => console.log(msg)) // logs response data
  .catch(err => console.log(err)); // logs any error

