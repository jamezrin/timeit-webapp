import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

class Mailer {
  private mailer: Mail;

  constructor() {
    this.mailer = nodemailer.createTransport({
      host: process.env.TIMEIT_EMAIL_HOST,
      port: parseInt(process.env.TIMEIT_EMAIL_PORT),
      secure: parseInt(process.env.TIMEIT_EMAIL_PORT) === 465,
      auth: {
        user: process.env.TIMEIT_EMAIL_USER,
        pass: process.env.TIMEIT_EMAIL_PASS,
      },
    });
  }

  sendAccountConfirmation() {}

  private static instance: Mailer;

  public static getInstance(): Mailer {
    if (!Mailer.instance) {
      Mailer.instance = new Mailer();
    }

    return Mailer.instance;
  }
}

export default Mailer;
