const nodemailer = require('nodemailer')
class MailService { 
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            } 
        })
    }
    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Activate account' + process.env.API_URL,
            text: '',
            html:
            `
                <div>
                    <h1>To activate, follow the link</h1>
                    <a href="${link}">${link}</a>
                </div>
            `
        })
    }

    async sendForgotmail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Forgot email' + process.env.API_URL,
            text: '',
            html:
            `
                <div>
                    <h1>Click the following link to reset your password</h1>
                    <a href="${link}">${link}</a>
                </div>
            `
        })
    }
}

module.exports = new MailService()