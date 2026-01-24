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
    
    // Server-side validation
    if (!email || !validateEmail(email)) {
      return createJsonResponse("error", "Invalid or missing email address.");
    }

    // Get the active sheet and append the email in the first column
    // The requirement is strictly the first column.
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var timestamp = new Date();
    
    sheet.appendRow([email, timestamp]);

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
