import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Get all alerts for the user
    const alertsSnapshot = await db
      .collection("alerts")
      .where("userId", "==", userId)
      .get();

    const alerts = alertsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[];

    const activeAlerts = alerts.filter(a => a.status === "active").length;
    const resolvedAlerts = alerts.filter(a => a.status === "resolved");
    
    // Calculate average duration in ms
    let totalDuration = 0;
    let resolvedWithDuration = 0;

    resolvedAlerts.forEach(a => {
      if (a.timestamp && (a.resolvedAt || a.lastUpdated)) {
        const start = new Date(a.timestamp.toDate ? a.timestamp.toDate() : a.timestamp).getTime();
        const end = new Date(a.resolvedAt?.toDate ? a.resolvedAt.toDate() : (a.lastUpdated || a.timestamp)).getTime();
        const duration = end - start;
        if (duration > 0) {
          totalDuration += duration;
          resolvedWithDuration++;
        }
      }
    });

    const avgDuration = resolvedWithDuration > 0 ? totalDuration / resolvedWithDuration : 0;

    // Get total contacts
    const contactsSnapshot = await db
      .collection("users")
      .doc(userId)
      .collection("contacts")
      .get();
    
    const totalContacts = contactsSnapshot.size;

    // Get total evidence
    const totalEvidence = alerts.reduce((acc, a) => acc + (a.evidenceUrls?.length || 0), 0);

    // Last alert timestamp
    const sortedAlerts = [...alerts].sort((a, b) => {
      const timeA = new Date(a.timestamp?.toDate ? a.timestamp.toDate() : a.timestamp).getTime();
      const timeB = new Date(b.timestamp?.toDate ? b.timestamp.toDate() : b.timestamp).getTime();
      return timeB - timeA;
    });
    
    const lastAlertAt = sortedAlerts.length > 0 ? sortedAlerts[0].timestamp : null;

    return NextResponse.json({
      totalAlerts: alerts.length,
      activeAlerts,
      avgDuration,
      totalContacts,
      totalEvidence,
      lastAlertAt
    });
  } catch (error: any) {
    console.error("Summary API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
