const SHEET_NAME = 'RSVP';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
    if (!sheet) return response({ ok: false, error: 'RSVP sheet not found.' });

    const normalized = String(data.normalizedName || data.name || '').trim().toLowerCase();
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const existing = sheet.getRange(2, 8, lastRow - 1, 1).getValues().flat();
      if (existing.some(name => String(name).trim().toLowerCase() === normalized)) {
        return response({ ok: false, duplicate: true, error: 'A response for this guest already exists.' });
      }
    }

    sheet.appendRow([
      data.name,
      data.numberOfGuests,
      data.attendance,
      data.eventSelection,
      data.engagement,
      data.wedding,
      data.submissionTimestamp || new Date().toISOString(),
      normalized,
    ]);
    return response({ ok: true });
  } catch (error) {
    return response({ ok: false, error: String(error) });
  }
}

function response(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
