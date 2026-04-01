const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME || 'Exam System'} <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

exports.sendCredentials = async (email, password, name, loginId = null) => {
  const loginInfoText = loginId ? `\nLogin ID (Reg No / Emp ID): ${loginId}\nEmail: ${email}` : `\nEmail: ${email}`;
  const message = `Dear ${name || 'User'},\n\nWelcome to the Automated Examination System.\n\nYour credentials are:${loginInfoText}\nPassword: ${password}\n\nPlease login and change your password.`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2>Welcome, ${name || 'User'}</h2>
      <p>Your account has been created successfully. Here are your login credentials:</p>
      <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
        ${loginId ? `<p><strong>Login ID (Reg No/Emp ID):</strong> ${loginId}</p>` : ''}
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
      </div>
      <p>You can use either your Email or Login ID to sign in. Please change your password after logging in for security.</p>
    </div>
  `;

  await sendEmail({
    email,
    subject: 'Your Account Credentials',
    message,
    html,
  });
};

exports.sendExamLink = async (email, examName, examLink) => {
  const message = `You have been invited to take the exam: ${examName}.\n\nExam Link: ${examLink}`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2>Exam Invitation</h2>
      <p>You have been invited to take the following exam: <strong>${examName}</strong></p>
      <a href="${examLink}" style="display: inline-block; padding: 12px 24px; background: #007bff; color: #fff; text-decoration: none; border-radius: 5px; margin: 20px 0;">Start Exam</a>
      <p>If the button doesn't work, copy and paste this link: ${examLink}</p>
    </div>
  `;

  await sendEmail({
    email,
    subject: `Exam Invitation: ${examName}`,
    message,
    html,
  });
};

exports.sendPasswordChangeOtp = async (email, name, otp) => {
  const message = `Dear ${name || 'User'},\n\nYour OTP for password change is: ${otp}\nThis OTP is valid for 10 minutes.`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2>Password Change Request</h2>
      <p>Dear ${name || 'User'},</p>
      <p>We received a request to change your password. Please use the following OTP to complete the process:</p>
      <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <h1 style="letter-spacing: 5px; color: #007bff; margin: 0;">${otp}</h1>
      </div>
      <p><strong>Note:</strong> This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
    </div>
  `;

  await sendEmail({
    email,
    subject: 'OTP for Password Change',
    message,
    html,
  });
};

exports.sendPasswordChangeSuccess = async (email, name) => {
  const message = `Dear ${name || 'User'},\n\nYour password has been changed successfully.`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2>Password Changed Successfully</h2>
      <p>Dear ${name || 'User'},</p>
      <p>Your password has been successfully updated. If you did not make this change, please contact your administrator immediately.</p>
    </div>
  `;

  await sendEmail({
    email,
    subject: 'Password Changed Successfully',
    message,
    html,
  });
};

exports.sendForgotPassword = async (email, name, newPassword) => {
  const message = `Dear ${name || 'User'},\n\nWe received a request to reset your password.\nYour new temporary password is: ${newPassword}\n\nPlease login and change your password immediately for security purposes.`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #0f172a;">Password Recovery</h2>
      <p>Dear ${name || 'User'},</p>
      <p>We received a request to recover your account access. A secure temporary password has been generated for you.</p>
      <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid #e2e8f0; text-align: center;">
        <p style="text-transform: uppercase; font-size: 10px; font-weight: bold; color: #64748b; margin-top: 0; letter-spacing: 2px;">Temporary Password</p>
        <h1 style="letter-spacing: 3px; color: #2563eb; margin: 0; font-family: monospace;">${newPassword}</h1>
      </div>
      <p style="color: #64748b; font-size: 13px;"><strong>Critical Security Notice:</strong> Please sign in with this temporary password and immediately navigate to your Settings to establish a new permanent password.</p>
    </div>
  `;

  await sendEmail({
    email,
    subject: 'ExamCore Account Recovery',
    message,
    html,
  });
};

exports.sendDepartmentExamNotification = async (email, name, role, examName, subject, scheduledDate, duration, departmentName) => {
  const formattedDate = new Date(scheduledDate).toLocaleString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const roleTitle = role === 'staff' ? 'Faculty Member' : 'Student';

  const message = `Dear ${name},\n\nA new exam has been scheduled for the ${departmentName} department.\n\nExam Details:\nName: ${examName}\nSubject: ${subject}\nScheduled Date: ${formattedDate}\nDuration: ${duration} minutes\n\nPlease ensure you are prepared.\n\nBest Regards,\nExam Administration`;

  const html = `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #0f172a; padding: 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">New Exam Scheduled</h1>
      </div>
      
      <div style="padding: 32px 24px; background-color: #ffffff;">
        <p style="font-size: 16px; line-height: 1.6; margin-top: 0;">Dear <strong>${name}</strong>,</p>
        <p style="font-size: 16px; line-height: 1.6; color: #475569;">
          As a registered ${roleTitle} in the <strong>${departmentName}</strong> department, please be advised that a new mandatory examination has been scheduled to your academic calendar.
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-top: 0; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Examination Details</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 500; width: 120px;">Exam Name:</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${examName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Subject:</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${subject}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Schedule:</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Duration:</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${duration} Minutes</td>
            </tr>
          </table>
        </div>

        <p style="font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 0;">
          ${role === 'staff' ? 
            'Please verify you have the necessary system monitoring tools prepared for invigilation prior to the start time.' : 
            'Please ensure you are logged into the portal at least 15 minutes before the scheduled start time. Ensure you have a stable internet connection and necessary resources available.'}
        </p>
      </div>

      <div style="background-color: #f1f5f9; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="font-size: 13px; color: #64748b; margin: 0;">
          This is an automated notification from the Academic Examination System.<br>Please do not reply directly to this email.
        </p>
      </div>
    </div>
  `;

  await sendEmail({
    email,
    subject: `Scheduled Examination: ${examName} [${departmentName}]`,
    message,
    html,
  });
};
