const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'jimmie.larkin18@ethereal.email',
      pass: 'P1WyCEF5VT9uvGpJtu'
  }
});

module.exports = transporter;