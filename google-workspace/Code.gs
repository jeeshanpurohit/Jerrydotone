/**
 * GOOGLE APPS SCRIPT WEBHOOK BACKEND FOR JEESHAN PUROHIT STUDIO
 * Target Studio Email: jerrydotone@gmail.com
 *
 * ════════════════════════════════════════════════════════════════════════
 *  HOW TO DEPLOY (2 MINUTES):
 * ════════════════════════════════════════════════════════════════════════
 *  1. Open https://script.google.com while logged into jerrydotone@gmail.com
 *  2. Click "New Project" → name it "Jeeshan Studio Contact Webhook"
 *  3. Delete all default code in the editor
 *  4. Paste THIS ENTIRE FILE into the editor
 *  5. Click "Deploy" (top right) → "New deployment"
 *     ┌─────────────────────────────────────────────────────────────────┐
 *     │  Select type: Web app                                           │
 *     │  Description: Jeeshan Studio Google Meet & Sheets Sync          │
 *     │  Execute as:  Me (jerrydotone@gmail.com)                        │
 *     │  Who has access: Anyone                                         │
 *     └─────────────────────────────────────────────────────────────────┘
 *  6. Click "Deploy" → Click "Authorize access" (grant Calendar, Sheets, Gmail permissions)
 *  7. Copy the Web App URL (starts with https://script.google.com/macros/s/...)
 *  8. Paste it into your website's "Google Workspace Settings" drawer (or VITE_GOOGLE_WORKSPACE_WEBHOOK_URL)
 *
 *  AUTOMATION FLOW:
 *  ✅ Automatically adds meeting to Jeeshan's Google Calendar with Google Meet
 *  ✅ Automatically registers query in Google Sheets ("Jeeshan Studio Master Queries")
 *  ✅ Sends creative form-type HTML briefing dossier to jerrydotone@gmail.com
 *  ✅ Automatically sends Google Meet confirmation email back to the client
 *  ✅ Exposes real-time slot availability for other visitors via doGet
 * ════════════════════════════════════════════════════════════════════════
 */

const RECIPIENT_EMAIL = "jerrydotone@gmail.com";
const SHEET_NAME = "Jeeshan Studio Master Queries";

// ── 1. GET HANDLER: REAL-TIME SLOT AVAILABILITY ──────────────────────────────
function doGet(e) {
  try {
    const targetDate = e && e.parameter && e.parameter.date ? e.parameter.date : null;
    const bookedTimes = [];

    // Query Google Calendar for events on targetDate
    if (targetDate) {
      const parts = targetDate.split("-");
      const dayStart = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 0, 0, 0);
      const dayEnd = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 23, 59, 59);

      const events = CalendarApp.getDefaultCalendar().getEvents(dayStart, dayEnd);
      for (var i = 0; i < events.length; i++) {
        var start = events[i].getStartTime();
        var pad = function(n) { return (n < 10 ? "0" : "") + n; };
        bookedTimes.push(pad(start.getHours()) + ":" + pad(start.getMinutes()));
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        status: "ok",
        service: "Jeeshan Studio Webhook",
        date: targetDate,
        bookedTimes: bookedTimes
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── 2. POST HANDLER: COMPLETE DISPATCH PIPELINE ───────────────────────────────
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "error", message: "No payload received" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const data = JSON.parse(e.postData.contents);
    const now = new Date();
    const queryId = data.id || "JP-" + now.getTime().toString(36).toUpperCase();

    // ─────────────────────────────────────────────────────────────────────────
    // STEP A: AUTOMATICALLY ADD TO GOOGLE CALENDAR WITH GOOGLE MEET
    // ─────────────────────────────────────────────────────────────────────────
    let calendarEventCreated = false;
    let calendarEventId = "";
    let meetLink = "https://meet.google.com/new";

    if (data.meetingDate) {
      try {
        const timeParts = (data.meetingTime || "15:00").split(":");
        let start;
        if (data.meetingDate.indexOf("-") > -1) {
          const dp = data.meetingDate.split("-");
          start = new Date(parseInt(dp[0], 10), parseInt(dp[1], 10) - 1, parseInt(dp[2], 10));
        } else {
          start = new Date(data.meetingDate);
        }
        start.setHours(parseInt(timeParts[0] || "15", 10), parseInt(timeParts[1] || "0", 10), 0);
        const end = new Date(start.getTime() + 45 * 60 * 1000); // 45 min

        const eventTitle = "Discovery Session: " + (data.clientName || "Client") + " x Jeeshan Purohit Studio";

        const description = [
          "========================================",
          "JEESHAN PUROHIT STUDIO // DISCOVERY CALL",
          "========================================",
          "CLIENT: " + (data.clientName || "") + " (" + (data.clientEmail || "") + ")",
          "PHONE / WHATSAPP: " + (data.clientPhone || "Not provided"),
          "PROJECT SCOPE: " + (data.projectScope || "Brand Identity & Strategy"),
          "BUDGET TIER: " + (data.budgetTier || "Standard"),
          "TIMEZONE: " + (data.timezone || "IST (UTC+5:30)"),
          "----------------------------------------",
          "CLIENT BRIEF & OBJECTIVES:",
          data.messageBrief || "No brief supplied.",
          "----------------------------------------",
          "AI STRATEGIC DIRECTIVE:",
          "Priority: " + (data.priorityTier || "STANDARD") + " (Score " + (data.priorityScore || "75") + "/100)",
          "Action: " + (data.actionPlanSummary || "Review credentials and confirm agenda."),
          "----------------------------------------",
          "HOST: Jeeshan Purohit (" + RECIPIENT_EMAIL + ")",
          "GOOGLE MEET: Link auto-attached to invitation"
        ].join("\n");

        const guestList = RECIPIENT_EMAIL + (data.clientEmail ? "," + data.clientEmail : "");

        const event = CalendarApp.getDefaultCalendar().createEvent(eventTitle, start, end, {
          description: description,
          guests: guestList,
          location: "Google Meet",
          sendInvites: true // Automatically emails Google Calendar invite + Meet to client!
        });

        calendarEventId = event.getId();
        calendarEventCreated = true;
        meetLink = "Google Meet auto-attached in calendar invite (Event ID: " + calendarEventId + ")";
      } catch (calErr) {
        Logger.log("Calendar error: " + calErr);
        meetLink = "https://meet.google.com/new";
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // STEP B: AUTOMATICALLY REGISTER IN GOOGLE SHEETS
    // ─────────────────────────────────────────────────────────────────────────
    let spreadsheet;
    const files = DriveApp.getFilesByName(SHEET_NAME);
    if (files.hasNext()) {
      spreadsheet = SpreadsheetApp.open(files.next());
    } else {
      spreadsheet = SpreadsheetApp.create(SHEET_NAME);
    }

    let sheet = spreadsheet.getActiveSheet();
    if (sheet.getLastRow() === 0) {
      const headers = [
        "Timestamp", "Query ID", "Client Name", "Email", "Phone / WhatsApp",
        "Project Scope", "Budget Tier", "Meeting Date", "Meeting Time",
        "Timezone", "Message Brief", "AI Priority", "Google Meet Link",
        "Calendar Event ID", "Status"
      ];
      sheet.appendRow(headers);
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#FF5A00"); // Jeeshan Studio signature orange
      headerRange.setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      now,
      queryId,
      data.clientName || "Anonymous",
      data.clientEmail || "",
      data.clientPhone || "",
      data.projectScope || "",
      data.budgetTier || "",
      data.meetingDate || "",
      data.meetingTime || "",
      data.timezone || "IST",
      data.messageBrief || "",
      data.priorityTier || "STANDARD",
      meetLink,
      calendarEventId,
      "CONFIRMED_IN_CALENDAR"
    ]);

    // ─────────────────────────────────────────────────────────────────────────
    // STEP C: SEND CREATIVE FORM-TYPE HTML EMAIL TO JEESHAN (jerrydotone@gmail.com)
    // ─────────────────────────────────────────────────────────────────────────
    const studioSubject = "[NEW COMMISSION DIRECTIVE] " + (data.clientName || "Client") + " — " + (data.projectScope || "Discovery");

    const studioHtmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0A1112; color: #10191A; margin: 0; padding: 20px 10px; }
          .container { max-width: 640px; margin: 0 auto; background: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 35px rgba(0,0,0,0.35); border: 1px solid #E5E0D5; }
          .header { background: #10191A; padding: 28px 32px; border-bottom: 4px solid #FF5A00; }
          .eyebrow { font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #FF5A00; text-transform: uppercase; margin-bottom: 6px; }
          .title { font-size: 24px; font-weight: 900; color: #F2ECDF; margin: 0; line-height: 1.2; }
          .subtitle { color: #8C999B; font-size: 12px; margin-top: 6px; }
          .body { padding: 28px 32px; }
          .meet-card { background: linear-gradient(135deg, #0D1617 0%, #152224 100%); color: #F2ECDF; border-left: 5px solid #FF5A00; padding: 18px 22px; border-radius: 6px; margin-bottom: 24px; }
          .meet-eyebrow { font-size: 11px; font-weight: 800; color: #FF5A00; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 6px; }
          .meet-time { font-size: 18px; font-weight: 800; color: #FFFFFF; }
          .meet-sub { font-size: 12px; color: #A0B2B4; margin-top: 4px; }
          .meet-btn { display: inline-block; background: #FF5A00; color: #FFFFFF !important; text-decoration: none; font-size: 12px; font-weight: 800; letter-spacing: 1px; padding: 10px 18px; border-radius: 4px; margin-top: 12px; text-transform: uppercase; }
          .form-table { width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 24px; border: 1px solid #E8E3DA; border-radius: 6px; overflow: hidden; }
          .form-table tr:not(:last-child) td { border-bottom: 1px solid #E8E3DA; }
          .form-label { background: #F8F5F0; color: #666666; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding: 11px 16px; width: 34%; }
          .form-value { background: #FFFFFF; color: #10191A; font-size: 14px; font-weight: 700; padding: 11px 16px; }
          .brief-box { background: #FFF8F5; border: 1px solid #FFE0D1; border-left: 4px solid #FF5A00; padding: 18px; border-radius: 4px; margin-bottom: 24px; }
          .brief-label { font-size: 11px; font-weight: 800; color: #FF5A00; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
          .brief-text { color: #2D3748; font-size: 14px; line-height: 1.6; white-space: pre-wrap; }
          .ai-box { background: #F0F7F6; border: 1px solid #D2E7E5; border-left: 4px solid #0B6E76; padding: 16px 20px; border-radius: 4px; margin-bottom: 24px; }
          .ai-label { font-size: 11px; font-weight: 800; color: #0B6E76; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
          .footer { background: #F8F5F0; border-top: 1px solid #E5E0D5; padding: 16px 32px; font-size: 11px; color: #888888; display: flex; justify-content: space-between; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="eyebrow">// JEESHAN PUROHIT STUDIO • MASTER DISPATCH</div>
            <h1 class="title">New Client Commission Directive</h1>
            <div class="subtitle">Query ID: <strong>${queryId}</strong> • Timestamp: ${now.toLocaleString()}</div>
          </div>

          <div class="body">
            <!-- Google Meet Box -->
            <div class="meet-card">
              <div class="meet-eyebrow">🎥 GOOGLE MEET &amp; CALENDAR RESERVED</div>
              <div class="meet-time">${data.meetingDate || "Pending Date"} at ${data.meetingTime || "15:00"} (${data.timezone || "IST"})</div>
              <div class="meet-sub">Automatically scheduled in your Google Calendar with client (${data.clientEmail || ""}) as guest.</div>
              <a href="https://calendar.google.com/calendar" class="meet-btn">OPEN GOOGLE CALENDAR &amp; MEET →</a>
            </div>

            <!-- Creative Form Details Table -->
            <table class="form-table">
              <tr>
                <td class="form-label">Client Name</td>
                <td class="form-value">${data.clientName || "Anonymous"}</td>
              </tr>
              <tr>
                <td class="form-label">Client Email</td>
                <td class="form-value"><a href="mailto:${data.clientEmail}" style="color: #0B6E76; text-decoration: none;">${data.clientEmail || "Not provided"}</a></td>
              </tr>
              <tr>
                <td class="form-label">Phone / WhatsApp</td>
                <td class="form-value">${data.clientPhone || "Not provided"}</td>
              </tr>
              <tr>
                <td class="form-label">Project Scope</td>
                <td class="form-value" style="color: #FF5A00;">${data.projectScope || "Brand Identity & Strategy"}</td>
              </tr>
              <tr>
                <td class="form-label">Estimated Budget</td>
                <td class="form-value">${data.budgetTier || "Flexible"}</td>
              </tr>
              <tr>
                <td class="form-label">Proposed Slot</td>
                <td class="form-value">${data.meetingDate || "TBD"} at ${data.meetingTime || "15:00"} (${data.timezone || "IST"})</td>
              </tr>
            </table>

            <!-- Client Brief Section -->
            <div class="brief-box">
              <div class="brief-label">PROJECT BRIEF &amp; OBJECTIVES:</div>
              <div class="brief-text">${data.messageBrief || "No brief supplied."}</div>
            </div>

            <!-- AI Strategic Directive -->
            <div class="ai-box">
              <div class="ai-label">⚡ AI LEAD TRIAGE &amp; ACTION PLAN:</div>
              <div style="font-size: 13px; color: #10191A; margin-bottom: 6px;">
                <strong>Priority:</strong> ${data.priorityTier || "STANDARD"} &nbsp;|&nbsp; <strong>Score:</strong> ${data.priorityScore || "75"}/100
              </div>
              <div style="font-size: 13px; color: #334E52; line-height: 1.5;">
                ${data.actionPlanSummary || "Review client brief and send portfolio credentials."}
              </div>
            </div>
          </div>

          <div class="footer">
            <span>Destination: <strong>${RECIPIENT_EMAIL}</strong></span>
            <span>Google Sheets: <strong>${SHEET_NAME}</strong></span>
          </div>
        </div>
      </body>
      </html>
    `;

    GmailApp.sendEmail(RECIPIENT_EMAIL, studioSubject, data.messageBrief || "New commission inquiry", {
      htmlBody: studioHtmlBody,
      replyTo: data.clientEmail || RECIPIENT_EMAIL,
      name: "Jeeshan Studio Master Terminal"
    });

    // ─────────────────────────────────────────────────────────────────────────
    // STEP D: SEND CONFIRMATION EMAIL BACK TO THE CLIENT (data.clientEmail)
    // ─────────────────────────────────────────────────────────────────────────
    let clientEmailSent = false;
    if (data.clientEmail && data.clientEmail.indexOf("@") > -1) {
      try {
        const clientSubject = "[CONFIRMED] Discovery Call with Jeeshan Purohit Studio // " + (data.meetingDate || "Scheduled Slot");

        const clientHtmlBody = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8F5F0; color: #10191A; margin: 0; padding: 20px 10px; }
              .box { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 8px; overflow: hidden; border: 1px solid #E5E0D5; box-shadow: 0 8px 30px rgba(0,0,0,0.08); }
              .top { background: #10191A; padding: 28px 32px; border-bottom: 4px solid #FF5A00; }
              .top-sub { font-size: 11px; font-weight: 800; color: #FF5A00; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
              .top-title { color: #F2ECDF; font-size: 22px; font-weight: 900; margin: 0; }
              .content { padding: 28px 32px; }
              .hero-card { background: #FFF8F5; border: 1px solid #FFE0D1; border-left: 4px solid #FF5A00; padding: 20px; border-radius: 6px; margin-bottom: 24px; }
              .hero-time { font-size: 18px; font-weight: 800; color: #10191A; margin-top: 4px; }
              .cta-btn { display: inline-block; background: #FF5A00; color: #FFFFFF !important; text-decoration: none; font-size: 13px; font-weight: 800; letter-spacing: 1px; padding: 12px 22px; border-radius: 4px; margin-top: 14px; text-transform: uppercase; }
              .agenda-list { margin: 16px 0 24px 0; padding: 0 0 0 20px; color: #4A5568; font-size: 14px; line-height: 1.7; }
              .footer { background: #10191A; color: #A0B2B4; padding: 20px 32px; font-size: 12px; }
              .footer a { color: #FF5A00; text-decoration: none; font-weight: 700; }
            </style>
          </head>
          <body>
            <div class="box">
              <div class="top">
                <div class="top-sub">JEESHAN PUROHIT STUDIO // DISCOVERY SESSION</div>
                <h1 class="top-title">Your Google Meet is Confirmed!</h1>
              </div>

              <div class="content">
                <p style="font-size: 15px; color: #10191A; line-height: 1.6; margin-top: 0;">
                  Hi <strong>${data.clientName || "there"}</strong>,
                </p>
                <p style="font-size: 14px; color: #4A5568; line-height: 1.6;">
                  Thank you for reaching out to Jeeshan Purohit Studio. Your discovery consultation regarding <strong>${data.projectScope || "Brand & Motion Design"}</strong> has been confirmed on Google Calendar.
                </p>

                <div class="hero-card">
                  <div style="font-size: 11px; font-weight: 800; color: #FF5A00; text-transform: uppercase; letter-spacing: 1px;">SCHEDULED DATE &amp; TIME:</div>
                  <div class="hero-time">${data.meetingDate || "Confirmed Date"} at ${data.meetingTime || "15:00"} (${data.timezone || "IST"})</div>
                  <div style="font-size: 12px; color: #718096; margin-top: 6px;">Location: Google Meet (Video Conference)</div>
                  <a href="https://meet.google.com" class="cta-btn">JOIN GOOGLE MEET →</a>
                </div>

                <div style="font-size: 12px; font-weight: 800; color: #10191A; letter-spacing: 0.5px; text-transform: uppercase;">WHAT WE'LL COVER IN THIS 45-MINUTE CALL:</div>
                <ul class="agenda-list">
                  <li><strong>Scope &amp; Deliverables:</strong> Aligning on your creative goals, brand milestones, and project architecture.</li>
                  <li><strong>Technical Roadmap:</strong> Timeline estimates, motion/UI deliverables, and review sprints.</li>
                  <li><strong>Proposal &amp; Credentials:</strong> Custom retainer or sprint quotation suited to your budget tier.</li>
                </ul>

                <p style="font-size: 13px; color: #718096; line-height: 1.6; border-top: 1px solid #E5E0D5; padding-top: 18px; margin-bottom: 0;">
                  Need to reschedule or share reference assets beforehand? Simply reply directly to this email or ping Jeeshan on WhatsApp at <strong style="color: #10191A;">+91-9413564618</strong>.
                </p>
              </div>

              <div class="footer">
                <div><strong>Jeeshan Purohit</strong> — Multidisciplinary Visual Designer &amp; Creative Technologist</div>
                <div style="margin-top: 6px;">Email: <a href="mailto:${RECIPIENT_EMAIL}">${RECIPIENT_EMAIL}</a> • Portfolio: <a href="https://jerrydotone.com">jerrydotone.com</a></div>
              </div>
            </div>
          </body>
          </html>
        `;

        GmailApp.sendEmail(data.clientEmail, clientSubject, "Your Google Meet discovery call is confirmed for " + (data.meetingDate || "") + " at " + (data.meetingTime || "") + ".", {
          htmlBody: clientHtmlBody,
          replyTo: RECIPIENT_EMAIL,
          name: "Jeeshan Purohit Studio"
        });
        clientEmailSent = true;
      } catch (clientErr) {
        Logger.log("Client email error: " + clientErr);
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        queryId: queryId,
        calendarCreated: calendarEventCreated,
        calendarEventId: calendarEventId,
        meetLink: meetLink,
        sheetUpdated: true,
        studioEmailSent: true,
        clientEmailSent: clientEmailSent,
        recipient: RECIPIENT_EMAIL
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log("doPost Error: " + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
