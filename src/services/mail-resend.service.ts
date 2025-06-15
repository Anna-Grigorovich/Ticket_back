import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {IAttachment} from './mail.interfaces';
import {Resend} from "resend";
import * as fs from "fs";

@Injectable()
export class MailResendService implements OnModuleInit {
    private logger = new Logger('Email service');
    private resend: Resend;

    constructor(private configService: ConfigService) {
    }

    onModuleInit() {
        const apiKey = this.configService.get<string>('RESEND_API_KEY');
        this.resend = new Resend(apiKey);
    }

    async sendMail(from: string, to: string, text: string, attachments: IAttachment[]): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const resendAttachments = attachments.map(att => ({
                    filename: att.filename,
                    content: fs.readFileSync(att.path),
                }));
                const res = await this.resend.emails.send({
                    from,
                    to,
                    subject: 'Твій квиток',
                    html: `<p>${text}</p>`,
                    attachments: resendAttachments,
                });
                this.logger.log('Email sent: ' + JSON.stringify(res));
                resolve();
            } catch (error) {
                this.logger.error('Email error: ' + JSON.stringify(error));
                resolve();
            }
        });
    }
}