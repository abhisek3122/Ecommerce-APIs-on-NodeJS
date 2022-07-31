var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

function sendMail(to, subject, html) {

  var options = {
    auth: {
      api_key: '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' //Dummy API Key - As Sendgrid is a paid service
    }
  }

  let transporter = nodemailer.createTransport(sgTransport(options)); 

  let mailOptions = {
    from: 'support@company.com',
    to: to,
    subject: subject,
    html: html,
  };

  transporter.sendMail(mailOptions, function(err, info){
      if (err ){
        console.log("test");
        console.log(err);
      }
      else {
        console.log('Message sent: ' + info.response);
      }
  });

}

module.exports = sendMail;
