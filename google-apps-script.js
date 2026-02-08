/**
 * Google Apps Script Backend for Lead Collection
 * 
 * This script should be deployed as a Web App in Google Apps Script.
 * It receives lead data, validates the email, and appends it to the active Google Sheet.
 */

function doPost(e) {
  try {
    // Parse the incoming JSON data
    var data = JSON.parse(e.postData.contents);
    var email = data.email;
    var name = data.name || "";
    var sheetName = data.sheetName || "";

    // Server-side validation
    if (!email || !validateEmail(email)) {
      return createJsonResponse("error", "Invalid or missing email address.");
    }

    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet;

    // If sheetName is provided, use/create that sheet. Otherwise, use active sheet.
    if (sheetName) {
      sheet = spreadsheet.getSheetByName(sheetName);
      if (!sheet) {
        sheet = spreadsheet.insertSheet(sheetName);
        // Add headers for new sheet
        sheet.appendRow(["Email", "Name", "Timestamp"]);
        sheet.getRange(1, 1, 1, 3).setFontWeight("bold");
      }
    } else {
      sheet = spreadsheet.getActiveSheet();
    }

    var timestamp = new Date();

    // Append data: Email (A), Name (B), Timestamp (C)
    sheet.appendRow([email, name, timestamp]);

    return createJsonResponse("success", "Lead successfully saved to Google Sheets.");
  } catch (err) {
    return createJsonResponse("error", "Server error: " + err.toString());
  }
}

/**
 * Standard email validation logic
 */
function validateEmail(email) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Helper to return a JSON response for the frontend
 */
function createJsonResponse(status, message) {
  var output = {
    "result": status,
    "message": message
  };
  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Setup function to initialize headers if needed
 */
function setupSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange(1, 1).setValue("Email ID");
  sheet.getRange(1, 2).setValue("Capture Date");
  sheet.getRange(1, 1, 1, 2).setFontWeight("bold");
}
