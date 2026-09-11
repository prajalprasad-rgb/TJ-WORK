const SHEET_NAME = 'RSVP';
const HEADERS = ['Name', 'Number of Guests', 'Attendance', 'Event Selection', 'Engagement', 'Wedding', 'Submission Timestamp', 'Normalized Name'];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const spreadsheet = SpreadsheetApp.getActive();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.getSheets()[0];
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);

    const normalized = String(data.normalizedName || data.name || '').trim().toLowerCase();
    const lock = LockService.getDocumentLock();
    lock.waitLock(10000);
    try {
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
    } finally {
      lock.releaseLock();
    }
    return response({ ok: true });
  } catch (error) {
    return response({ ok: false, error: String(error) });
  }
}

function response(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
