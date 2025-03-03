import {Injectable, Logger, OnModuleInit} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import * as nodemailer from 'nodemailer';
import {IAttachment} from "./mail.interfaces";

@Injectable()
export class EmailService implements OnModuleInit {
    private transporter;
    protected logger = new Logger('Email service');

    constructor(private configService: ConfigService) {
    }

    onModuleInit() {
        this.transporter = nodemailer.createTransport(this.configService.get('mail'));
    }

    async sendMail(from: string, to: string, text: string, attachments: IAttachment[]): Promise<void> {
        let mailOptions = {
            from,
            to,
            subject: 'Твій квиток',
            text: text,
            attachments
        };
        return new Promise((resolve, reject) => {
            this.transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    this.logger.error('Email error: ' + error);
                    return reject(JSON.stringify(error));
                }

                this.logger.log('Email sent: ' + JSON.stringify(info));
                resolve(info);
            });
        });

    }

}