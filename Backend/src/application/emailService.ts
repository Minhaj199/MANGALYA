import nodemailer,{Transporter} from 'nodemailer'
import { IEmailService } from '../domain/interface/email'
import dotenv from 'dotenv'
dotenv.config()
export class EmailService implements IEmailService{
    private transporter: Transporter;
    private userName:string|undefined
    private password:string|undefined
    constructor() {
         this.userName=process.env.GOOGLE_USERNAME
        this.password=process.env.GOOGLE_PASSWORD
        console.log(this.password,this.userName)
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.userName,
                pass: this.password,
            },
        });
    }

    async sendEmail(to: string, subject: string, body: string): Promise<void> {
        const mailOptions = {
            from: this.userName,
            to,
            subject,
            html: body,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email');
        }
    }
}