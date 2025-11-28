import formData from "form-data";
import Mailgun from "mailgun.js";
import envConfig from '../config/envConfig';

const mailgun = new Mailgun(formData);

export const mg = mailgun.client({
  username: "api",
  key: envConfig.MAILGUN_API_KEY!,
});