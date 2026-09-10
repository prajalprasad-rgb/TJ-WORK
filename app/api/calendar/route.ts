import { weddingData as d, type EventKey } from "../../config";

function escapeIcs(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

function compactUtc(value: Date) {
  return value.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function GET(request: Request) {
  const eventKey = new URL(request.url).searchParams.get("event");
  if (eventKey !== "engagement" && eventKey !== "wedding") {
    return Response.json({ error: "Unknown calendar event." }, { status: 400 });
  }

  const type: EventKey = eventKey;
  const event = d[type];
  const ceremony = type === "engagement" ? d.engagement.ceremony : d.wedding.church;
  const eventName = type === "engagement" ? "Engagement" : "Wedding";
  const start = new Date(event.date);
  const end = new Date(start.getTime() + (type === "engagement" ? 4 : 6) * 60 * 60 * 1000);
  const title = `${d.bride.firstName} & ${d.groom.firstName} — ${eventName} Ceremony & Reception`;
  const location = `${ceremony.name}, ${ceremony.address}; reception at ${event.reception.name}, ${event.reception.address}`;
  const description = `Celebrate the ${eventName.toLowerCase()} of ${d.bride.fullName} and ${d.groom.fullName}.`;
  const uid = `${type}-${start.getTime()}@wedify`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedify//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${compactUtc(new Date())}`,
    `DTSTART:${compactUtc(start)}`,
    `DTEND:${compactUtc(end)}`,
    `SUMMARY:${escapeIcs(title)}`,
    `DESCRIPTION:${escapeIcs(description)}`,
    `LOCATION:${escapeIcs(location)}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ];
  const filename = `${d.bride.firstName.toLowerCase()}-${d.groom.firstName.toLowerCase()}-${type}.ics`;

  return new Response(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
