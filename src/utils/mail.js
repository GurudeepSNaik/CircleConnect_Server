const nodemailer = require('nodemailer');

async function sendMail(To, Subject, Body={},jobid=false,targetDate=new Date()) {
  let {heading="abv",subject="abv",button_label="abv",button_link="abv",subject_link="abv",bodyText,preButtoText="abv",loginemail="abv",loginpassword="abv"}=Body;
  subject=subject.replace("___","<br/>")
  const body=`<table
  width="600"
  align="center"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="width: 600px; margin: 0 auto; border: 1px solid #1b91ca"
>
  <tbody>
    <tr>
      <td colspan="2" valign="top" height="10" width="100%">
        <span
          style="
            background: #1b91ca;
            height: 10px;
            display: block;
            width: 100%;
          "
        ></span>
      </td>
    </tr>
    <tr>
      <td>
        <table
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            width: 100%;
            background: #f8f9fa;
            border-bottom: 1px solid #1b91ca;
          "
        >
          <tr>
            <td valin="top" width="50"></td>
            <td>
              <table
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="width: 100%"
              >
                <tr>
                  <td
                    valin="top"
                    height="100"
                    width="100%"
                    style="width: 100%; height: 100px"
                  ></td>
                </tr>
                <tr>
                  <td valin="top">
                    <span
                      style="
                        font-family: Arial, Helvetica, sans-serif;
                        display: block;
                        font-size: 30px;
                        line-height: 35px;
                        color: #464646;
                      "
                      >${heading ? heading:""}</span
                    >
                  </td>
                </tr>
                <tr>
                  <td
                    valin="top"
                    height="40"
                    width="100%"
                    style="width: 100%; height: 20px"
                  ></td>
                </tr>
                <tr>
                  <td valin="top">
                    <span
                      style="
                        font-family: Arial, Helvetica, sans-serif;
                        display: block;
                        font-size: 14px;
                        line-height: 30px;
                        color: #464646;
                        margin-bottom: 10px;
                      "
                    >
                      ${subject? subject:""}
                      <a href="" target="_blank" style="color: #1b91ca"
                        >${subject_link ? subject_link:"" }</a
                      ><br />
                    </span>
                  </td>
                </tr>
                <tr>
                  <td valin="top" align="left" width="100%">
                  <span
                  style="
                  font-family: Arial, Helvetica, sans-serif;
                  display: block;
                  font-size: 14px;
                  line-height: 30px;
                  color: #464646;
                  margin-bottom: 10px;
                  "
                >
                ${preButtoText ? preButtoText:""}
                  <a
                      href="${button_link ? button_link:""}"
                      target="_blank"
                      style="
                        font-family: Arial, Helvetica, sans-serif;
                        background-color: #1b91ca;
                        color: #fff;
                        font-size: 14px;
                        line-height: 30px;
                        padding: 10px 20px;
                        margin: 20px 0px;
                        text-decoration: none;
                      "
                      >${button_label ? button_label : ""}</a>
                </span>
                  </td>
                </tr>
                ${loginemail ? `<tr>
                    <td valin="top">
                      <span
                        style="
                        font-family: Arial, Helvetica, sans-serif;
                        display: block;
                        font-size: 14px;
                        line-height: 30px;
                        color: #464646;
                        margin-bottom: 10px;
                        "
                      >
                      ${loginemail ? loginemail : ""}
                       <br/>
                       ${loginpassword ? loginpassword : ""}
                      </span>
                    </td>
                  </tr>`:""}
                <tr>
                    <td valin="top">
                      <span
                        style="
                        font-family: Arial, Helvetica, sans-serif;
                        display: block;
                        font-size: 14px;
                        line-height: 30px;
                        color: #464646;
                        margin-bottom: 10px;
                        "
                      >
                      ${bodyText ? bodyText : ""}
                      </span>
                    </td>
                  </tr>

                <tr>
                  <td valin="top">
                    <span
                      style="
                      font-family: Arial, Helvetica, sans-serif;
                      display: block;
                      font-size: 14px;
                      line-height: 30px;
                      color: #464646;
                      margin-bottom: 10px;
                      "
                    >
                      Thank You <br style="margin:0px auto;"/>
                      Ferguson Cleaning Solutions
                    </span>
                  </td>
                </tr>
                <tr>
                  <td
                    valin="top"
                    height="100"
                    width="100%"
                    style="width: 100%; height: 100px"
                  ></td>
                </tr>
              </table>
            </td>
            <td valin="top" width="50"></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <table
          align="center"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="background: #fff; width: 100%"
        >
          <tbody>
            <tr>
              <td valin="top" width="20"></td>
              <td>
                <table
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="width: 100%"
                >
                  <tr>
                    <td
                      colspan="2"
                      valin="top"
                      height="20"
                      width="100%"
                      style="width: 100%; height: 20px"
                    ></td>
                  </tr>
                  <tr>
                    <td valin="top" width="50%">
                      <a
                        href="http://app.fergusoncleaningsolutions.co.uk/"
                        style="text-decoration: none"
                        ><img
                          width="250px"
                          src="http://app.fergusoncleaningsolutions.co.uk/static/media/logo.6745354931c4b0c147c2.png"
                          alt="logo"
                      /></a>
                    </td>
                    <td width="50%" valin="top">
                      <span
                        style="
                          font-family: Arial, Helvetica, sans-serif;
                          display: block;
                          font-size: 13px;
                          line-height: 20px;
                          color: #017dc0;
                        "
                        >Ferguson Cleaning Solutions<br />
                        <a
                          href="tel:01414742641"
                          style="
                            font-family: Arial, Helvetica, sans-serif;
                            font-size: 13px;
                            text-decoration: none;
                            color: #017dc0;
                            line-height: 20px;
                          "
                          ><span style="color: #017dc0"
                            >0141-474-2641</span
                          ></a
                        ><br />
                        <a
                          href="mailto:contact@fergusoncleaningsolutions.co.uk"
                          style="
                            font-family: Arial, Helvetica, sans-serif;
                            font-size: 13px;
                            text-decoration: none;
                            color: #017dc0;
                            line-height: 20px;
                          "
                          ><span style="color: #017dc0"
                            >contact@fergusoncleaningsolutions.co.uk</span
                          ></a
                        >
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td
                      colspan="2"
                      valin="top"
                      height="20"
                      width="100%"
                      style="width: 100%; height: 20px"
                    ></td>
                  </tr>
                </table>
              </td>
              <td valin="top" width="20"></td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`
      let mailTransporter=nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASS
        }
    })
      const mailData = {
        from:process.env.MAIL_USER,
        to: To,
        subject: Subject,
        html: body,
      };
      try {
        let res= await mailTransporter.sendMail(mailData);   
        console.log("Mail Sent");
        return res;
      } catch(err){
        console.log(err)
        return;
      }
}

module.exports = sendMail