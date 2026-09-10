import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json();
  if (!payload?.name || !payload?.guests || !payload?.attendance || !payload?.eventSelection) {
    return NextResponse.json({ error: "Please complete every field." }, { status: 400 });
  }

  const normalized = String(payload.name).trim().toLowerCase();
  const event = String(payload.eventSelection);
  const row = {
    name: String(payload.name).trim(),
    normalizedName: normalized,
    numberOfGuests: Number(payload.guests),
    attendance: payload.attendance,
    eventSelection: event,
    engagement: event === "Engagement" || event === "Both" ? "Yes" : "No",
    wedding: event === "Wedding" || event === "Both" ? "Yes" : "No",
    submissionTimestamp: new Date().toISOString(),
  };

  const endpoint = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (endpoint) {
    const result = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
      cache: "no-store",
    });
    if (!result.ok) return NextResponse.json({ error: "We couldn’t save your response. Please try again." }, { status: 502 });
    const sheetResponse = await result.json().catch(() => ({ ok: true }));
    if (sheetResponse?.ok === false) {
      return NextResponse.json({ error: sheetResponse.error || "A response for this guest already exists." }, { status: 409 });
    }
  }

  return NextResponse.json({ ok: true, demo: !endpoint });
}
