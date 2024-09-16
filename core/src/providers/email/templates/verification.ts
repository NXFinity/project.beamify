import { Injectable } from '@nestjs/common';

@Injectable()
export class Verification {
    getVerificationEmailTemplate(
        user: { username: string },
        url: string,
        verificationToken: string,
    ): string {
        return `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Account Verification</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  color: #333;
              }
              .header {
                  background-color: #f8f8f8;
                  padding: 20px;
                  text-align: center;
              }
              .content {
                  margin: 20px;
                  text-align: center;
              }
              .footer {
                  background-color: #f8f8f8;
                  padding: 20px;
                  text-align: center;
                  font-size: 0.8em;
                  color: #666;
              }
              .button {
                  display: inline-block;
                  padding: 10px 20px;
                  margin: 20px 0;
                  color: #fff;
                  background-color: rgba(223, 0, 255, 0.38);
                  text-decoration: none;
              }
          </style>
      </head>
      <body>
      <div class="header">
          <img src="cid:beamifyLogo" alt="Company Logo" width="100" height="100">
      </div>
      <div class="content">
          <h1>Welcome to Beamify, ${user.username}!</h1>
          <p>Please click the button below to verify your account:</p>
          <a href="${url}" class="button">Verify Account</a>
          <p>Or copy your token: <b>  <br>
                  ${verificationToken} </b> <br>
              and visit <a href="https://beamify.me/verify">Verify Me</a> </p>
      </div>
      <div class="footer">
          <p><a href="https://beamify.me">Beamify Me</a> | <a href="https://beamify.me/about">About Us</a> | <a href="https://beamify.me/contact">Contact Us</a></p>
          <p>Follow us on:</p>
          <p>
              <a href="https://twitter.com/beamifyme">Twitter</a>
          </p>
      </div>
      </body>
      </html>
    `;
    }
}
