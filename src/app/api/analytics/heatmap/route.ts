import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const snapshot = await db.collection("alerts")
      .where("userId", "==", userId)
      .get();
    
    const alerts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[];

    // Initialize 7x24 matrix (7 days, 24 hours)
    // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const matrix = Array.from({ length: 7 }, () => Array(24).fill(0));

    alerts.forEach(a => {
      const date = a.timestamp.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
      const day = date.getDay();
      const hour = date.getHours();
      matrix[day][hour]++;
    });

    return NextResponse.json({ matrix });
  } catch (error: any) {
    console.error("Heatmap API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
