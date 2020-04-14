import nodemailer from 'nodemailer';
import './env';

async function testMail() {
  const transport = nodemailer.createTransport({
    host: process.env.TIMEIT_EMAIL_HOST,
    port: parseInt(process.env.TIMEIT_EMAIL_PORT),
    secure: parseInt(process.env.TIMEIT_EMAIL_PORT) === 465,
    auth: {
      user: process.env.TIMEIT_EMAIL_USER,
      pass: process.env.TIMEIT_EMAIL_PASS,
    },
  });

  const info = await transport.sendMail({
    from: '"Jaime de TimeIt" <jaime@jamezrin.name>',
    to: 'jamezrin.contact@gmail.com',
    subject: 'Prueba con nodemailer',
    text: 'Hola mundo, enlace a Google: https://google.com/',
    html: 'Hola mundo, <a href="https://google.com/">enlace a Google</a>',
  });

  console.log(info);
}

testMail().catch(console.error);
