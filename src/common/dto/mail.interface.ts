import { Address, Attachment } from "nodemailer/lib/mailer";

export type SendMailDto = {
  from?: Address,
  recipients: Address[],
  subject:string,
  html:string,
  text?: string,
  placeholderReplacements?:Record<string,string>
  attachments?: Attachment[]
}