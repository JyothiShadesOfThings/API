var nodemailer = require('nodemailer');

module.exports.SendEmail = async (req,res)=>{
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'paragsoni.agile@gmail.com',
        pass: '@Bolonebha12'
    }
});

const mailOptions = {
    from: 'shadesofthings@gmail.com', // sender address
    to: 'ashwitha93@gmail.com', // list of receivers
    subject: 'SOT testing email', // Subject line
    html: '<p>SOT testing email</p>'// plain text body
};



transporter.sendMail(mailOptions, function (err, info) {
    if (err)
        console.log(err)
    else
        console.log(info);
});
}