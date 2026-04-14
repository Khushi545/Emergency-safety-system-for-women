import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { alertId, userId, evidenceUrl, type } = await req.json();

    // 1. Get User and Contacts
    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.data();

    const contactsSnapshot = await db
      .collection("users")
      .doc(userId)
      .collection("contacts")
      .get();

    const contacts = contactsSnapshot.docs.map(doc => doc.data());

    if (contacts.length === 0) {
      return NextResponse.json({ message: "No contacts to notify" }, { status: 200 });
    }

    // 2. Notify each contact via Email
    const notifications = contacts.map(async (contact) => {
      if (contact.email) {
        return sgMail.send({
          to: contact.email,
          from: process.env.SENDGRID_FROM_EMAIL || "khushikhatri520@gmail.com",
          subject: `NEW EVIDENCE: Emergency Alert from ${userData?.name || "StaySafe User"}`,
          text: `New photo evidence captured. View here: ${evidenceUrl}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e9e4f7; border-radius: 16px; max-width: 600px; margin: auto;">
              <h2 style="color: #ef4444; text-align: center;">NEW PHOTO EVIDENCE</h2>
              <p>Hello,</p>
              <p>A new <strong>Photo Evidence</strong> has been uploaded for the current emergency alert triggered by <strong>${userData?.name}</strong>.</p>
              
              <div style="margin: 30px 0; padding: 20px; background: #f9f7ff; border-radius: 12px; text-align: center;">
                <img src="${evidenceUrl}" alt="Evidence" style="max-width: 100%; border-radius: 8px; margin-bottom: 15px; border: 1px solid #e9e4f7;" />
                <div style="margin-top: 15px;">
                  <a href="${evidenceUrl}" style="background: #9b7fd4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                    VIEW FULL IMAGE
                  </a>
                </div>
              </div>

              <p style="color: #7b6a9b; font-size: 12px; text-align: center; border-top: 1px solid #e9e4f7; padding-top: 20px; margin-top: 30px;">
                StaySafe Emergency System - Real-time Protection
              </p>
            </div>
          `,
        }).catch(err => console.error(`Evidence Email Error for ${contact.email}:`, err));
      }
    });

    await Promise.all(notifications);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Evidence API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
