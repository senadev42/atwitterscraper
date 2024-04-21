import mailgun from "mailgun-js";
import dotenv from "dotenv";
dotenv.config();

export const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});