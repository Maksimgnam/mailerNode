require('dotenv').config()
console.log(process.env.Email)
console.log(process.env.Password)


let fs = require('fs')





let nodemailer = require('nodemailer');
let express = require('express')
let path = require('path')

let multer = require('multer')

let bodyParser = require('body-parser')
let port = 3000;
const app = express()
const upload = multer({ dest: 'files/' });
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
app.use(express.urlencoded({
    extended: true
}))

app.use(express.static(path.resolve(__dirname, './')))

let mails;
app.post('/sendFile', upload.single('dataFile'), (req, res) => {
    fs.readFile(req.file.path, (error, data) => {
        if (error) {
            console.log(error)
        }
        mails = data.toString().split('\n').join(',');
        console.log(mails);
    });
});

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.Email,
        pass: process.env.Password
    }
});

app.post('/send', async (res, req) => {
    let content = res.body.name;
    console.log(content)

    let mailOptions = {
        from: 'youremail@.com',
        to: mails,
        subject: 'Mailer',
        text: content
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });



})




app.listen(port, () => {
    console.log(`server on port  ${port}`)
})



