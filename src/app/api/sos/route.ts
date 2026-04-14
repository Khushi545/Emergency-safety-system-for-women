import { NextResponse } from "next/server";
import { db, auth } from "@/lib/firebase-admin";
import sgMail from "@sendgrid/mail";

// Set up SendGrid (has a 100% free tier for 100 emails/day)
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { alertId, userId, location } = await req.json();

    // 1. Get User and Contacts
    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.data();

    const contactsSnapshot = await db
      .collection("users")
      .doc(userId)
      .collection("contacts")
      .get();

    const contacts = contactsSnapshot.docs.map(doc => doc.data());
    console.log(`Found ${contacts.length} contacts for SOS alert`);

    if (contacts.length === 0) {
      console.log("No contacts found. Skipping notifications.");
      return NextResponse.json({ message: "No contacts to notify" }, { status: 200 });
    }

    const mapsLink = location
      ? `https://www.google.com/maps?q=${location.lat},${location.lng}`
      : "Location not available";

    const alertMessage = `EMERGENCY ALERT: ${userData?.name || "User"} needs help! Live location: ${mapsLink}`;

    // 2. Notify each contact via Email (using SendGrid's free tier)
    const notifications = contacts.map(async (contact) => {
      const promises = [];

      if (contact.email) {
        console.log(`Sending email to ${contact.email}...`);
        promises.push(
          sgMail.send({
            to: contact.email,
            from: process.env.SENDGRID_FROM_EMAIL || "khushikhatri520@gmail.com",
            subject: "URGENT: Emergency Help Request from " + (userData?.name || "StaySafe User"),
            text: alertMessage,
            html: `
              <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e9e4f7; border-radius: 16px;">
                <h2 style="color: #9b7fd4;">EMERGENCY ALERT</h2>
                <p>Hello,</p>
                <p><strong>${userData?.name}</strong> has triggered an emergency alert and needs immediate assistance.</p>
                <div style="margin: 20px 0; padding: 15px; background: #f9f7ff; border-radius: 12px; font-weight: bold; text-align: center;">
                  <a href="${mapsLink}" style="color: #f4a7c3; text-decoration: none; font-size: 18px;">VIEW LIVE LOCATION</a>
                </div>
                <p style="color: #7b6a9b; font-size: 12px;">This alert was sent automatically by the StaySafe Emergency System.</p>
              </div>
            `,
          }).catch(err => console.error(`SendGrid Error for ${contact.email}:`, err))
        );
      }

      return Promise.all(promises);
    });

    await Promise.all(notifications);

    // 3. Update alert doc
    await db.collection("alerts").doc(alertId).update({
      contactsNotifiedCount: contacts.length,
      notificationsSent: true,
      lastUpdated: new Date().toISOString()
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("SOS API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
