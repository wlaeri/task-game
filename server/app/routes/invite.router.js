const router = new require('express').Router();
const nodemailer = require('nodemailer');
const swig = require('swig');
const path = require('path');


router.post('/', function(req,res,next){
    let friend = req.body.user.firstName + ' ' + req.body.user.lastName;
    let template = swig.compileFile(path.join(__dirname, '/invite.html'));
    let output = template({
        friend: friend
    });
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'gamr12344321@gmail.com', // Your email id
            pass: 'KevinSp@cey!' // Your password
        }
    });
    let mailOptions = {
        from: '"GAMR" <gamr@gamr.life>', // sender address
        to: req.body.emails, // list of receivers
        subject: friend + ' wants you to join GAMR', // Subject line
        text: 'Gamify everything. Sign up to play GAMR.', // plaintext body
        html: output // html body
    };
    return transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
            return res.json(info.response)
        }
    });
})

module.exports = router;
