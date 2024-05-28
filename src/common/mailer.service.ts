import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { timeStamp } from "console";
import * as nodemailer from 'nodemailer';
import { SendMailDto } from "./dto/mail.interface";
import Mail from "nodemailer/lib/mailer";

@Injectable()
export class MailerService {
  constructor(private readonly configService:ConfigService){}

  mailTransport(){
    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: true,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD')
      }

    });

    return transporter;
  }

  async sendMail(dto:SendMailDto) {
    const {from, recipients, subject, html, placeholderReplacements, attachments} = dto;

    const transport = this.mailTransport();

    const options: Mail.Options = {
      from: from ?? {
        name: this.configService.get<string>('APP_NAME'),
        address: this.configService.get<string>('DEFAULT_MAIL_FROM'),
      },
      to: recipients,
      subject,
      html,
      attachments
    }

    try {
      const result = transport.sendMail(options);

      return result;
    }catch(error){
      console.log('Error:' + error)
    }
    
  }
}