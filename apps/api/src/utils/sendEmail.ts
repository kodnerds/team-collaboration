import { mg } from "./mailgun";
import envConfig from '../config/envConfig';

export const sendEmail = async (to: string, subject: string, html: string) => {
  await mg.messages.create(envConfig.MAILGUN_DOMAIN!, {
    from: `Team-Colaboration App <noreply@${envConfig.MAILGUN_DOMAIN}>`,
    to,
    subject,
    html,
  });
};
