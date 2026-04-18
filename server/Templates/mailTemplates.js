export const mailTemplates = `
<!DOCTYPE html>

<html>
<head>
  <meta charset="UTF-8" />
  <title>Email Verification</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">

  <div style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:10px; padding:30px; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,0.1);">


<h2 style="color:#333; margin-bottom:10px;">Verify Your Email</h2>

<p style="color:#555; font-size:16px; line-height:1.5;">
  Thanks for signing up! Please confirm your email address by clicking the button below.
</p>

<a href="{url}" 
   style="display:inline-block; margin:20px 0; padding:12px 25px; background-color:#4CAF50; color:#ffffff; text-decoration:none; border-radius:5px; font-size:16px;">
   Verify Email
</a>

<p style="color:#777; font-size:14px; line-height:1.5;">
  If you did not create an account, no further action is required.
</p>

<hr style="border:none; border-top:1px solid #eee; margin:20px 0;" />

<p style="color:#aaa; font-size:12px;">
  If the button doesn't work, copy and paste this link into your browser:
</p>

<p style="word-break:break-all; color:#4CAF50; font-size:12px;">
  {{verification_link}}
</p>


  </div>

</body>
</html>
`;

export const otpverificationtemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Cinemaxx - OTP Verification</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f0fdf4;">

  <div style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 20px rgba(22,163,74,0.1);">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #15803d, #16a34a); padding:36px 30px; text-align:center;">
      <h1 style="color:#ffffff; margin:0; font-size:28px; letter-spacing:2px;">🎬 CINEMAXX</h1>
      <p style="color:#bbf7d0; margin:8px 0 0; font-size:14px;">Where Movies Meet Magic</p>
    </div>

    <!-- Body -->
    <div style="padding:36px 30px; text-align:center;">

      <h2 style="color:#15803d; margin-bottom:8px; font-size:22px;">Verify Your Identity</h2>
      <p style="color:#6b7280; font-size:15px; line-height:1.6; margin-bottom:24px;">
        Use the OTP below to complete your sign-in to Cinemaxx.<br/>
        This code is valid for <strong style="color:#15803d;">10 minutes</strong> only.
      </p>

      <!-- OTP Box -->
      <div style="display:inline-block; background:#f0fdf4; border:2px dashed #16a34a; border-radius:12px; padding:20px 48px; margin:10px 0 24px;">
        <p style="margin:0; font-size:13px; color:#6b7280; letter-spacing:1px; text-transform:uppercase;">Your OTP Code</p>
        <p style="margin:8px 0 0; font-size:42px; font-weight:bold; color:#15803d; letter-spacing:12px;">{otp}</p>
      </div>

      <p style="color:#6b7280; font-size:14px; line-height:1.6;">
        If you did not request this OTP, please ignore this email.<br/>
        Your account remains secure.
      </p>

      <hr style="border:none; border-top:1px solid #dcfce7; margin:28px 0;" />

      <!-- Footer Note -->
      <p style="color:#9ca3af; font-size:12px; line-height:1.6;">
        This is an automated message from Cinemaxx. Please do not reply to this email.
      </p>
      <p style="color:#16a34a; font-size:12px; font-weight:bold; margin-top:4px;">
        🎟️ Enjoy your movie experience!
      </p>
    </div>

    <!-- Footer Bar -->
    <div style="background:#f0fdf4; border-top:1px solid #dcfce7; padding:16px 30px; text-align:center;">
      <p style="margin:0; color:#9ca3af; font-size:11px;">
        &copy; 2026 Cinemaxx. All rights reserved. &nbsp;|&nbsp;
        <span style="color:#16a34a;">Terms of Use</span> &nbsp;|&nbsp;
        <span style="color:#16a34a;">Privacy Policy</span>
      </p>
    </div>

  </div>

</body>
</html>
`;
