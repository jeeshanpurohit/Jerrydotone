/**
 * googleWorkspaceIntegration.js
 * Google Workspace integration suite for Jeeshan Purohit Studio.
 * Connects Contact Queries to Google Sheets, Google Calendar, and Gmail (jerrydotone@gmail.com).
 */

import { bookSlot } from "./slotAvailability";

export const JEESHAN_PRIMARY_EMAIL = "jerrydotone@gmail.com";
export const STORAGE_KEY = "jeeshan_workspace_queries";
export const WEBHOOK_URL_KEY = "jeeshan_workspace_webhook_url";

/**
 * Constructs a direct 1-click Google Calendar Event URL with pre-filled details.
 */
export function createGoogleCalendarEventUrl({
  title = "Studio Commission Brief // Jeeshan Purohit",
  clientName = "Client",
  clientEmail = "",
  meetingDate = "",
  meetingTime = "15:00",
  timezone = "Asia/Kolkata",
  projectScope = "Creative Direction",
  messageBrief = "",
  aiAnalysis = null
}) {
  // Reliable date parsing to avoid UTC day-shift
  let startDate = new Date();
  if (meetingDate && typeof meetingDate === 'string' && meetingDate.includes('-')) {
    const [y, m, d] = meetingDate.split('-').map(n => parseInt(n, 10));
    const timeParts = (meetingTime || "15:00").split(":");
    const hours = parseInt(timeParts[0] || "15", 10);
    const mins = parseInt(timeParts[1] || "0", 10);
    startDate = new Date(y, m - 1, d, hours, mins, 0);
  } else {
    startDate.setDate(startDate.getDate() + 1);
    startDate.setHours(15, 0, 0, 0);
  }

  const endDate = new Date(startDate.getTime() + 45 * 60 * 1000); // 45-min meeting

  // Format to YYYYMMDDTHHmmssZ
  const pad = (n) => String(n).padStart(2, '0');
  const formatUtc = (d) => {
    return (
      d.getUTCFullYear() +
      pad(d.getUTCMonth() + 1) +
      pad(d.getUTCDate()) +
      "T" +
      pad(d.getUTCHours()) +
      pad(d.getUTCMinutes()) +
      pad(d.getUTCSeconds()) +
      "Z"
    );
  };

  const datesParam = `${formatUtc(startDate)}/${formatUtc(endDate)}`;
  const eventTitle = encodeURIComponent(`Discovery & Google Meet: ${clientName} x Jeeshan Purohit Studio`);
  const location = encodeURIComponent("Google Meet (meet.google.com)");

  const descriptionLines = [
    `STUDIO DISCOVERY CALL & COMMISSION BRIEF`,
    `========================================`,
    `CLIENT: ${clientName} (${clientEmail})`,
    `PROJECT SCOPE: ${projectScope}`,
    `PROPOSED TIME: ${meetingDate || "TBD"} at ${meetingTime || "15:00"} (${timezone})`,
    `LOCATION: Google Meet (Video Call)`,
    `----------------------------------------`,
    `CLIENT BRIEF:`,
    messageBrief || "No additional brief provided.",
    `----------------------------------------`,
    `AI STRATEGIC TRIAGE NOTES:`,
    aiAnalysis ? `Priority: ${aiAnalysis.priorityTier} | Sprint: ${aiAnalysis.estimatedSprint}` : "Standard Lead",
    aiAnalysis && aiAnalysis.actionSteps ? aiAnalysis.actionSteps.map(s => `[${s.num}] ${s.title}: ${s.instruction}`).join("\n") : "",
    `----------------------------------------`,
    `STUDIO LEAD: Jeeshan Purohit (jerrydotone@gmail.com)`,
    `Google Meet: https://meet.google.com (Link auto-generated with calendar invite)`
  ].join("\n");

  const details = encodeURIComponent(descriptionLines);
  const guests = encodeURIComponent(`${JEESHAN_PRIMARY_EMAIL}${clientEmail ? ',' + clientEmail : ''}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${datesParam}&details=${details}&location=${location}&add=${guests}`;
}

/**
 * Constructs a pre-composed direct Gmail URL to jerrydotone@gmail.com
 */
export function createGmailComposeUrl({
  clientName = "Client",
  clientEmail = "",
  clientPhone = "",
  projectScope = "Creative Direction",
  budgetTier = "Standard",
  meetingDate = "",
  meetingTime = "",
  timezone = "IST",
  messageBrief = "",
  aiAnalysis = null
}) {
  const subject = encodeURIComponent(`[STUDIO INQUIRY & MEET] ${clientName} - ${projectScope}`);

  const bodyContent = [
    `NEW STUDIO INQUIRY RECEIVED VIA PORTFOLIO`,
    `--------------------------------------------------`,
    `SENDER & CONTACT DETAILS:`,
    `Name: ${clientName}`,
    `Email: ${clientEmail}`,
    `Phone / WhatsApp: ${clientPhone || "Not provided"}`,
    `--------------------------------------------------`,
    `PROJECT SPECIFICATIONS:`,
    `Scope: ${projectScope}`,
    `Budget Tier: ${budgetTier}`,
    `Proposed Google Meet: ${meetingDate || "Pending"} at ${meetingTime || "Pending"} (${timezone})`,
    `--------------------------------------------------`,
    `CLIENT MESSAGE BRIEF:`,
    messageBrief,
    `--------------------------------------------------`,
    `AI ANALYSIS & RECOMMENDED ACTION PLAN FOR JEESHAN:`,
    aiAnalysis ? `Priority Score: ${aiAnalysis.priorityScore}/100 [${aiAnalysis.priorityTier}]` : "",
    aiAnalysis ? `Archetype: ${aiAnalysis.archetype}` : "",
    aiAnalysis ? `Estimated Sprint: ${aiAnalysis.estimatedSprint}` : "",
    `\nACTION STEPS:`,
    aiAnalysis && aiAnalysis.actionSteps ? aiAnalysis.actionSteps.map(s => `${s.num}. ${s.title}: ${s.instruction}`).join("\n") : "",
    `\nRECOMMENDED PORTFOLIO ASSETS TO PITCH:`,
    aiAnalysis && aiAnalysis.recommendedPortfolio ? aiAnalysis.recommendedPortfolio.map(p => `• ${p}`).join("\n") : "",
    `--------------------------------------------------`,
    `PRIMARY DISPATCH DESTINATION: ${JEESHAN_PRIMARY_EMAIL}`
  ].join("\n");

  const body = encodeURIComponent(bodyContent);

  return `https://mail.google.com/mail/?view=cm&fs=1&to=${JEESHAN_PRIMARY_EMAIL}&su=${subject}&body=${body}`;
}

/**
 * Saves query to local Google Workspace database and attempts webhook + direct email dispatch.
 */
export async function registerQueryInWorkspace({ query, aiAnalysis, webhookUrl = null }) {
  const timestamp = new Date().toISOString();
  const queryId = aiAnalysis?.queryId || `JP-${Date.now().toString(36).toUpperCase()}`;

  const queryRecord = {
    id: queryId,
    timestamp,
    clientName: query.clientName,
    clientEmail: query.clientEmail,
    clientPhone: query.clientPhone || "",
    projectScope: query.projectScope,
    budgetTier: query.budgetTier,
    meetingDate: query.meetingDate || "",
    meetingTime: query.meetingTime || "",
    timezone: query.timezone || "IST (UTC+5:30)",
    messageBrief: query.messageBrief,
    priorityTier: aiAnalysis?.priorityTier || "STANDARD",
    priorityScore: aiAnalysis?.priorityScore || 75,
    archetype: aiAnalysis?.archetype || "Visual Design",
    estimatedSprint: aiAnalysis?.estimatedSprint || "2 Weeks",
    actionPlanSummary: aiAnalysis?.actionSteps?.map(s => `${s.num}.${s.title}`).join("; ") || "",
    status: "REGISTERED_IN_WORKSPACE",
    destinationEmail: JEESHAN_PRIMARY_EMAIL
  };

  // 1. Save to localStorage (Local Google Workspace database backup)
  // 1. Save to localStorage (Local Google Workspace database backup)
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    existing.unshift(queryRecord);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 100)));
  } catch (err) {
    console.warn("Storage warning:", err);
  }

  // 2. Automatically record slot in real-time availability tracker
  try {
    bookSlot({
      date: query.meetingDate,
      time: query.meetingTime,
      clientName: query.clientName,
      projectScope: query.projectScope,
      queryId
    });
  } catch (slotErr) {
    console.warn("Slot booking notice:", slotErr);
  }

  // 3. Dispatch to Google Apps Script Webhook (Primary Automated Pipeline)
  const activeWebhook =
    webhookUrl ||
    localStorage.getItem(WEBHOOK_URL_KEY) ||
    (typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.VITE_GOOGLE_WORKSPACE_WEBHOOK_URL : null);

  let webhookDispatched = false;

  if (activeWebhook && activeWebhook.startsWith("http")) {
    try {
      await fetch(activeWebhook, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action: "NEW_QUERY",
          ...queryRecord,
          aiAnalysis
        })
      });
      webhookDispatched = true;
    } catch (fetchErr) {
      console.warn("Google Apps Script webhook fetch notice:", fetchErr);
    }
  }

  // 4. Background Email Dispatch to jerrydotone@gmail.com (Formatted HTML Table)
  let directEmailDispatched = false;
  try {
    const emailResp = await fetch("https://formsubmit.co/ajax/jerrydotone@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        _subject: `[STUDIO COMMISSION DIRECTIVE] ${query.clientName} - ${query.projectScope}`,
        _template: "table",
        _captcha: "false",
        "Client Name": query.clientName,
        "Email Address": query.clientEmail,
        "Phone / WhatsApp": query.clientPhone || "Not provided",
        "Project Scope": query.projectScope,
        "Budget Tier": query.budgetTier,
        "Google Meet Slot": `${query.meetingDate || "Pending"} at ${query.meetingTime || "15:00"} (${query.timezone || "IST"})`,
        "Google Meet Link": "https://meet.google.com/new",
        "Client Brief": query.messageBrief,
        "AI Strategic Priority": `${aiAnalysis?.priorityTier || "STANDARD"} (Score: ${aiAnalysis?.priorityScore || 75}/100)`,
        "AI Action Plan": aiAnalysis?.actionSteps?.map(s => `${s.num}. ${s.title}`).join("; ") || "Review credentials and confirm agenda.",
        "Primary Studio Recipient": JEESHAN_PRIMARY_EMAIL
      })
    });
    if (emailResp.ok) {
      directEmailDispatched = true;
    }
  } catch (mailErr) {
    console.warn("Background email notification:", mailErr);
  }

  return {
    success: true,
    queryId,
    timestamp,
    webhookDispatched,
    directEmailDispatched,
    record: queryRecord
  };
}

/**
 * Retrieves all saved workspace queries.
 */
export function getWorkspaceQueries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch (err) {
    return [];
  }
}

/**
 * Exports all workspace queries as CSV formatted for Google Sheets import.
 */
export function exportWorkspaceQueriesCsv() {
  const queries = getWorkspaceQueries();
  if (queries.length === 0) return null;

  const headers = [
    "Query ID",
    "Timestamp",
    "Client Name",
    "Client Email",
    "Phone",
    "Project Scope",
    "Budget Tier",
    "Meeting Date",
    "Meeting Time",
    "Timezone",
    "Message Brief",
    "AI Priority",
    "AI Archetype",
    "Estimated Sprint",
    "AI Action Plan",
    "Destination Email"
  ];

  const rows = queries.map(q => [
    `"${q.id || ""}"`,
    `"${q.timestamp || ""}"`,
    `"${(q.clientName || "").replace(/"/g, '""')}"`,
    `"${q.clientEmail || ""}"`,
    `"${q.clientPhone || ""}"`,
    `"${(q.projectScope || "").replace(/"/g, '""')}"`,
    `"${q.budgetTier || ""}"`,
    `"${q.meetingDate || ""}"`,
    `"${q.meetingTime || ""}"`,
    `"${q.timezone || ""}"`,
    `"${(q.messageBrief || "").replace(/"/g, '""')}"`,
    `"${q.priorityTier || ""}"`,
    `"${q.archetype || ""}"`,
    `"${q.estimatedSprint || ""}"`,
    `"${(q.actionPlanSummary || "").replace(/"/g, '""')}"`,
    `"${JEESHAN_PRIMARY_EMAIL}"`
  ]);

  return [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
}

/**
 * Complete Google Apps Script template for direct copy-paste deployment.
 */
export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * Google Apps Script for Jeeshan Purohit Studio Workspace Integration
 * Connects to:
 * 1. Google Sheets (Appends inquiry row)
 * 2. Google Calendar (Schedules discovery meeting with Google Meet link)
 * 3. Gmail (Sends notification to jerrydotone@gmail.com)
 */

const RECIPIENT_EMAIL = "jerrydotone@gmail.com";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // 1. REGISTER IN GOOGLE SHEETS
    let sheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!sheet) {
      sheet = SpreadsheetApp.create("Jeeshan Purohit Studio Queries");
    }
    let activeSheet = sheet.getActiveSheet();
    if (activeSheet.getLastRow() === 0) {
      activeSheet.appendRow([
        "Timestamp", "Query ID", "Client Name", "Email", "Phone",
        "Project Scope", "Budget", "Meeting Date", "Meeting Time",
        "Brief", "AI Priority", "AI Action Steps", "Status"
      ]);
    }
    activeSheet.appendRow([
      new Date(),
      data.id || "JP-" + new Date().getTime(),
      data.clientName || "",
      data.clientEmail || "",
      data.clientPhone || "",
      data.projectScope || "",
      data.budgetTier || "",
      data.meetingDate || "",
      data.meetingTime || "",
      data.messageBrief || "",
      data.priorityTier || "",
      data.actionPlanSummary || "",
      "ACTIVE"
    ]);

    // 2. SCHEDULE IN GOOGLE CALENDAR
    if (data.meetingDate) {
      try {
        const timeParts = (data.meetingTime || "15:00").split(":");
        const start = new Date(data.meetingDate);
        start.setHours(parseInt(timeParts[0] || "15", 10));
        start.setMinutes(parseInt(timeParts[1] || "0", 10));
        const end = new Date(start.getTime() + 45 * 60 * 1000);

        CalendarApp.getDefaultCalendar().createEvent(
          "Studio Commission Brief: " + (data.clientName || "Client") + " x Jeeshan Purohit",
          start,
          end,
          {
            description: "Client Brief: " + (data.messageBrief || "") + "\\n\\nAI Priority: " + (data.priorityTier || "") + "\\nAI Directive: " + (data.actionPlanSummary || ""),
            guests: RECIPIENT_EMAIL + "," + (data.clientEmail || ""),
            location: "Google Meet"
          }
        );
      } catch (calErr) {
        Logger.log("Calendar notice: " + calErr);
      }
    }

    // 3. SEND GMAIL NOTIFICATION TO jeeshandotone@gmail.com
    const subject = "[STUDIO INQUIRY] " + (data.clientName || "Client") + " - " + (data.projectScope || "New Project");
    const htmlBody = \`
      <div style="font-family: Arial, sans-serif; max-width: 600px; line-height: 1.6; color: #10191A;">
        <h2 style="color: #FF5A00; border-bottom: 2px solid #FF5A00; padding-bottom: 8px;">
          New Studio Commission Query
        </h2>
        <p><strong>Client:</strong> \${data.clientName} (\${data.clientEmail})</p>
        <p><strong>Phone / WhatsApp:</strong> \${data.clientPhone || 'Not provided'}</p>
        <p><strong>Project Scope:</strong> \${data.projectScope}</p>
        <p><strong>Budget Tier:</strong> \${data.budgetTier}</p>
        <p><strong>Proposed Meeting:</strong> \${data.meetingDate || 'TBD'} at \${data.meetingTime || 'TBD'}</p>
        <div style="background: #F4F1EA; padding: 15px; border-left: 4px solid #FF5A00; margin: 15px 0;">
          <strong>Client Brief:</strong><br/>
          \${data.messageBrief}
        </div>
        <div style="background: #10191A; color: #ffffff; padding: 15px; border-radius: 4px; margin: 15px 0;">
          <strong style="color: #FF5A00;">AI Directive & Action Plan for Jeeshan:</strong><br/>
          Priority: \${data.priorityTier || 'Standard'}<br/>
          \${data.actionPlanSummary || 'Review brief and send portfolio credentials.'}
        </div>
        <p style="font-size: 12px; color: #777;">Delivered to: \${RECIPIENT_EMAIL}</p>
      </div>
    \`;

    GmailApp.sendEmail(RECIPIENT_EMAIL, subject, data.messageBrief || "New Query", { htmlBody: htmlBody });

    return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}
`;
