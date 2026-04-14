import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { format, eachDayOfInterval, isSameDay, startOfDay, endOfDay } from "date-fns";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const startDateStr = searchParams.get("startDate");
    const endDateStr = searchParams.get("endDate");
    const status = searchParams.get("status"); // all, active, resolved

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const startDate = startDateStr ? new Date(startDateStr) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default 30 days
    const endDate = endDateStr ? new Date(endDateStr) : new Date();

    let query = db.collection("alerts")
      .where("userId", "==", userId)
      .where("timestamp", ">=", startDate)
      .where("timestamp", "<=", endDate);

    if (status && status !== "all") {
      query = query.where("status", "==", status);
    }

    const snapshot = await query.orderBy("timestamp", "asc").get();
    const alerts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[];

    // Group by day
    const days = eachDayOfInterval({ start: startOfDay(startDate), end: endOfDay(endDate) });
    const timeSeries = days.map(day => {
      const count = alerts.filter(a => {
        const alertDate = a.timestamp.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
        return isSameDay(alertDate, day);
      }).length;

      return {
        date: format(day, "MMM dd"),
        fullDate: day.toISOString(),
        count
      };
    });

    return NextResponse.json({ timeSeries, alerts });
  } catch (error: any) {
    console.error("Incidents API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
