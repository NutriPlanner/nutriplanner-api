const { sendMail } = require('../utils/mailer');

/**
 * Send reset password email
 * @param {string} to
 * @param {string} code
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, code) => {
  const subject = 'Solicitud cambio de contraseña';
  const text = `Código de autorización: ${code}`;
  await sendMail({ to, subject, text });
};

module.exports = {
  sendResetPasswordEmail,
};
