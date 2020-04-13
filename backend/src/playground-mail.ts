import nodemailer from "nodemailer";
import "./env";

async function testMail() {
  const transport = nodemailer.createTransport({
    host: "smtp.yandex.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.TIMEIT_EMAIL_USER,
      pass: process.env.TIMEIT_EMAIL_PASS
    }
  });

  const info = await transport.sendMail({
    from: '"Jaime de TimeIt" <jaime@jamezrin.name>',
    to: "jamezrin.contact@gmail.com",
    subject: "Prueba con nodemailer",
    text: 'Hola mundo, enlace a Google: https://google.com/',
    html: 'Hola mundo, <a href="https://google.com/">enlace a Google</a>'
  })

  console.log(info)
}

testMail().catch(console.error);