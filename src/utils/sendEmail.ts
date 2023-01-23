import * as nodemailer from 'nodemailer';


export async function sendEmail(toEmail: string, subject: string, message: string,) {

    let transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.FROM_EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    try {
        let info = await transporter.sendMail({
            from: process.env.FROM_EMAIL,
            to: toEmail,
            subject,
            text: message,
        });

        console.log("Message sent: %s", info.messageId);

        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    } catch (err) {
        console.log(err)
    }

}