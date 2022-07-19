import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import Mail from 'nodemailer/lib/mailer';

dotenv.config({ path: `${__dirname}/../../.env` });

const sendMail = async (
  receiver: string[],
  subject: string,
  content: string,
  isHTML: boolean = false,
) => {
  let transport;

  if (process.env.NODE_ENV === 'development') {
    transport = nodemailer.createTransport({
      port: 1025,
    });
  } else {
    transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_HOST_USER,
        pass: process.env.EMAIL_HOST_PASSWORD,
      },
    });
  }

  const option: Mail.Options = {
    from: process.env.EMAIL_HOST_USER,
    to: receiver.reduce((a, b, i) => {
      let result = a;
      if (i !== receiver.length - 1) {
        result += `${b}, `;
        return result;
      }
      return result + b;
    }),
    subject,
  };

  if (!isHTML) option.text = content;
  else option.html = content;

  const info = await transport.sendMail(option);

  return info.response;
};

export const sendResetEmail = async (email: string, UID: string, token: string) => {
  const content = `Reset your password at ${process.env.FRONTEND_URL}reset-password/${UID}/${token}`;
  await sendMail([email], 'Reset your password', content);
};
