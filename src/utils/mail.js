const nodemailer = require("nodemailer");

async function sendMail(To = "", Subject = "", heading = "", body = "") {
//   const mailbody = `
//   <div 
//     style="
//       display: flex; 
//       justify-content: center; 
//       align-items: center;
//       margin:auto;
//     "
//   >
//   <div
//     style="
//       border: 1px solid #eb4097;
//       background-color: #f8f9fa;
//       width: 40%;
//       height: 550px;
//       border-radius: 2px;
//     "
//   >
//     <div
//       style="
//         display: flex;
//         justify-content: center;
//         width: 100%;
//         height: 10px;
//         background-color: #eb4097;
//       "
//     ></div>
//     <div
//       style="
//         display: flex;
//         flex-direction: column;
//         justify-content: flex-start;
//         align-items: flex-start;
//         font-family: Arial, Helvetica, sans-serif;
//         color: #464646;
//         height:80%;
//         box-sizing: content-box;
//       "
//     >
//       <h1 style="padding: 20px">${heading}</h1>
//       <div style="padding: 20px">${body}</div>
//     </div>
//     <div
//       style="
//         display: flex;
//         justify-content: space-evenly;
//         align-items: center;
//         height: 100px;
//         width: 100%;
//         background: #fff;
//         border-top: 1px solid #eb4097;
//         border-bottom: 1px solid #eb4097;
//       "
//     >
//       <div>
//         <a href="http://156.67.218.225:3000" style="text-decoration: none"
//           ><img
//             width="100px"
//             src="http://156.67.218.225:3000/assets/CirclesConnect.png"
//             alt="logo"
//         /></a>
//       </div>
//       <div>
//         <span
//         style="
//           font-family: Arial, Helvetica, sans-serif;
//           display: block;
//           font-size: 13px;
//           line-height: 20px;
//           color: #017dc0;
//         "
//         >Circles Connect<br />
//         <a
//           href="tel:0000000000"
//           style="
//             font-family: Arial, Helvetica, sans-serif;
//             font-size: 13px;
//             text-decoration: none;
//             color: #017dc0;
//             line-height: 20px;
//           "
//           ><span style="color: #017dc0"
//             >0000-000-000</span
//           ></a
//         ><br />
//         <a
//           href="mailto:circlesconnect.appwork@gmail.com"
//           style="
//             font-family: Arial, Helvetica, sans-serif;
//             font-size: 13px;
//             text-decoration: none;
//             color: #017dc0;
//             line-height: 20px;
//           "
//           ><span style="color: #017dc0"
//             >circlesconnect.appwork@gmail.com</span
//           ></a
//         >
//       </span>
//       </div>
//     </div>
//   </div>
// </div>`;
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
  const mailData = {
    from: process.env.MAIL_USER,
    to: To,
    subject: Subject,
    html: body,
  };
  try {
    let res = await mailTransporter.sendMail(mailData);
    console.log("Mail Sent");
    return res;
  } catch (err) {
    console.log(err);
    return;
  }
}

module.exports = sendMail;
