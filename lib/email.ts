import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
	const verificationUrl = `${process.env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}`;

	await resend.emails.send({
		from: process.env.EMAIL_FROM || "noreply@yourdomain.com",
		to: email,
		subject: "Verify your Hytopia account",
		html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Hytopia!</h2>
        <p style="color: #666; font-size: 16px;">Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #5865F2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
        </div>
        <p style="color: #999; font-size: 14px;">This link will expire in 24 hours.</p>
        <p style="color: #999; font-size: 14px;">If you didn't create this account, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">© 2026 Hytopia. Not affiliated with Hypixel Studios.</p>
      </div>
    `,
	});
}
