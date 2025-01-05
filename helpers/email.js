import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
  const transporte = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICES || "gmail",
    secure: process.env.EMAIL_SECURE || false,
    port: process.env.EMAIL_PORT || 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const { nombre, email, token } = datos;

  try {
    await transporte.sendMail({
      from: "CampuHomeManager <noreply@CampuHomeManager.com>",
      to: email,
      subject: "Confirma tu cuenta en CampuHomeManager",
      text: `Hola ${nombre}, gracias por registrarte en CampuHomeManager. Para confirmar tu cuenta, haz clic en el siguiente enlace: ${
        process.env.BACKEND_URL
      }:${process.env.PORT ?? 8080}/auth/confirmar/${token}`,
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
        <h2 style="color: #333;">¡Hola ${nombre}!</h2>
        <p style="color: #555; line-height: 1.6;">
            Gracias por registrarte en <strong>CampuHomeManager</strong>. Estamos emocionados de tenerte como parte de nuestra comunidad.
        </p>
        <p style="color: #555; line-height: 1.6;">
            Por favor, confirma tu cuenta haciendo clic en el siguiente botón:
        </p>
        <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.BACKEND_URL}:${
        process.env.PORT ?? 8080
      }/auth/confirmar/${token}"
               style="display: inline-block; text-decoration: none; color: white; background-color: #007BFF; padding: 10px 20px; border-radius: 5px; font-size: 16px;">
                Confirmar Cuenta
            </a>
        </div>
        <p style="color: #555; line-height: 1.6;">
            Si no fuiste tú quien realizó este registro, ignora este correo.
        </p>
        <p style="color: #999; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} CampuHomeManager. Todos los derechos reservados.
        </p>
    </div>
    `,
    });
  } catch (error) {
    console.error(
      "Error al enviar el correo:",
      error.response || error.message
    );
  }
  console.log(
    `${process.env.BACKEND_URL}:${
      process.env.PORT ?? 8080
    }/auth/confirmar/${token}`
  );
};

const emailInicioSesion = async (datos) => {
  const transporte = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICES || "gmail",
    secure: process.env.EMAIL_SECURE || false,
    port: process.env.EMAIL_PORT || 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const { nombre, email } = datos;

  try {
    await transporte.sendMail({
      from: "CampuHomeManager <noreply@CampuHomeManager.com>",
      to: email,
      subject: "Inicio de sesión exitoso",
      text: `Hola ${nombre}, has iniciado sesión en tu cuenta de CampuHomeManager exitosamente. Si no fuiste tú, por favor cambia tu contraseña inmediatamente.`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
          <h2 style="color: #333;">Hola ${nombre}</h2>
          <p style="color: #555; line-height: 1.6;">
              Has iniciado sesión en tu cuenta de <strong>CampuHomeManager</strong> exitosamente.
          </p>
          <p style="color: #555; line-height: 1.6;">
              Si no fuiste tú, por favor <a href="${
                process.env.URL_APP
              }/auth/restablecer">cambia tu contraseña</a> inmediatamente.
          </p>
          <p style="color: #999; font-size: 12px; text-align: center;">
              © ${new Date().getFullYear()} CampuHomeManager. Todos los derechos reservados.
          </p>
      </div>
      `,
    });
  } catch (error) {
    console.error(
      "Error al enviar el correo de inicio de sesión exitoso:",
      error.response || error.message
    );
  }
};

const emailCuentaActivada = async (datos) => {
  const transporte = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICES || "gmail",
    secure: process.env.EMAIL_SECURE || false,
    port: process.env.EMAIL_PORT || 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const { nombre, email } = datos;

  try {
    await transporte.sendMail({
      from: "CampuHomeManager <noreply@CampuHomeManager.com>",
      to: email,
      subject: "¡Tu cuenta ha sido activada!",
      text: `Hola ${nombre}, tu cuenta en CampuHomeManager ha sido activada exitosamente. Ya puedes disfrutar de todos nuestros servicios.`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
          <h2 style="color: #333;">¡Hola ${nombre}!</h2>
          <p style="color: #555; line-height: 1.6;">
              Nos complace informarte que tu cuenta en <strong>CampuHomeManager</strong> ha sido activada exitosamente.
          </p>
          <p style="color: #555; line-height: 1.6;">
              Ya puedes iniciar sesión y disfrutar de todos nuestros servicios desde el siguiente enlace:
          </p>
          <div style="text-align: center; margin: 20px 0;">
              <a href="${process.env.URL_APP}/auth/login"
                 style="display: inline-block; text-decoration: none; color: white; background-color: #007BFF; padding: 10px 20px; border-radius: 5px; font-size: 16px;">
                  Iniciar Sesión
              </a>
          </div>
          <p style="color: #999; font-size: 12px; text-align: center;">
              © ${new Date().getFullYear()} CampuHomeManager. Todos los derechos reservados.
          </p>
      </div>
      `,
    });
  } catch (error) {
    console.error(
      "Error al enviar el correo de cuenta activada:",
      error.response || error.message
    );
  }
};
const emailRestablecerContrasena = async (datos) => {
  const transporte = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICES || "gmail",
    secure: process.env.EMAIL_SECURE || false,
    port: process.env.EMAIL_PORT || 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const { email, token , nombre} = datos;

  try {
    await transporte.sendMail({
      from: "CampuHomeManager <noreply@CampuHomeManager.com>",
      to: email,
      subject: "Restablecimiento de contraseña",
      text: `Hola ${nombre}, para restablecer tu contraseña haz clic en el siguiente enlace: ${
        process.env.BACKEND_URL
      }:${
        process.env.PORT ?? 8080
      }/auth/-/${token}. Si no solicitaste este cambio, ignora este correo.`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
          <h2 style="color: #333;">Hola ${nombre}</h2>
          <p style="color: #555; line-height: 1.6;">
              Recibimos una solicitud para restablecer tu contraseña en <strong>CampuHomeManager</strong>.
          </p>
          <p style="color: #555; line-height: 1.6;">
              Haz clic en el botón a continuación para cambiar tu contraseña:
          </p>
          <div style="text-align: center; margin: 20px 0;">
              <a href="${process.env.BACKEND_URL}:${
        process.env.PORT ?? 8080
      }/auth/cambiar-pass/${token}"
                 style="display: inline-block; text-decoration: none; color: white; background-color: #007BFF; padding: 10px 20px; border-radius: 5px; font-size: 16px;">
                  Restablecer Contraseña
              </a>
          </div>
          <p style="color: #555; line-height: 1.6;">
              Si no solicitaste este cambio, puedes ignorar este correo.
          </p>
          <p style="color: #999; font-size: 12px; text-align: center;">
              © ${new Date().getFullYear()} CampuHomeManager. Todos los derechos reservados.
          </p>
      </div>
      `,
    });

    console.log();
  } catch (error) {
    console.error(
      "Error al enviar el correo de restablecimiento de contraseña:",
      error.response || error.message
    );
  }
};

export {
  emailRegistro,
  emailCuentaActivada,
  emailRestablecerContrasena,
  emailInicioSesion,
};
