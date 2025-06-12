import { NextRequest, NextResponse } from "next/server";
import connect from "@/dbconfig/dbconfig";
import { ExpertApplication } from "@/models/experts";
import nodemailer from "nodemailer";
import { ExpertAvailability } from "@/models/ExpertAvailability";
export async function POST(req: NextRequest) {
  try {
    await connect();

    const { expertId } = await req.json();

    if (!expertId) {
      return NextResponse.json({
        success: false,
        error: "Missing expertId",
      });
    }

    const expert = await ExpertApplication.findById(expertId);
    if (!expert) {
      return NextResponse.json({
        success: false,
        error: "Expert not found",
      });
    }
    expert.status = "accepted";
    await expert.save();
    // Send email notification
    await sendCongratulationsEmail(expert.email, expert.fullName);

    return NextResponse.json({
      success: true,
      expert: expert,
    });
  } catch (error) {
    console.error("Error approving expert:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to approve expert",
    });
  }
}
// Email function
async function sendCongratulationsEmail(toEmail: string, fullName: string) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: `"Session HQ" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "🎉 You're Approved as an Expert!",
    html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb; color: #111;">
      <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">

        <h2 style="color: #10b981;">🎉 Congratulations, ${fullName}!</h2>
        <p style="font-size: 16px;">Your expert profile has been <strong>successfully approved</strong> on <strong>Session HQ</strong>.</p>

        <p style="font-size: 15px; line-height: 1.6;">
          You can now log in and start offering consultations to users who need your expertise.
          We’re thrilled to have you on board!
        </p>

        <div style="margin: 30px 0;">
          <a href="https://yourplatform.com/dashboard" 
             style="background-color: #10b981; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">
            Go to Your Dashboard
          </a>
        </div>

        <p style="font-size: 14px; color: #555;">
          Need help getting started? Check out our <a href="https://yourplatform.com/help" style="color: #10b981;">Getting Started Guide</a>.
        </p>

        <hr style="margin: 30px 0;" />

        <p style="font-size: 13px; color: #888;">
          You’re receiving this email because you registered as an expert on Session HQ.
        </p>

        <p style="font-size: 13px; color: #aaa;">
          © ${new Date().getFullYear()} Session HQ. All rights reserved.
        </p>

      </div>
    </div>
  `,
  };

  await transporter.sendMail(mailOptions);
}
export async function GET() {
  try {
    await connect();

    const experts = await ExpertApplication.find({ status: "pending" });

    return NextResponse.json({
      success: true,
      experts,
    });
  } catch (error) {
    console.error("Error fetching pending experts:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch pending experts",
    });
  }
}
