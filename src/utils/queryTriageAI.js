/**
 * queryTriageAI.js
 * AI Query & Strategic Lead Analysis Engine for Jeeshan Purohit Studio
 * Analyzes incoming inquiries, classifies intent, generates actionable directives for Jeeshan,
 * and drafts professional client responses.
 */

export function analyzeQueryWithAI(queryData) {
  const {
    clientName = "Client",
    clientEmail = "",
    clientPhone = "",
    projectScope = "General Inquiry",
    budgetTier = "Flexible Discovery",
    meetingDate = "",
    meetingTime = "",
    timezone = "IST (UTC+5:30)",
    messageBrief = ""
  } = queryData;

  const combinedText = `${projectScope} ${messageBrief} ${budgetTier}`.toLowerCase();

  // 1. Archetype Determination
  let archetype = "Multidisciplinary Visual Direction";
  let recommendedPortfolio = [];
  let estimatedSprint = "2–3 Weeks Sprint";
  let disciplineCategory = "Design & Visual Strategy";

  if (
    combinedText.includes("brand") ||
    combinedText.includes("identity") ||
    combinedText.includes("guideline") ||
    combinedText.includes("logo") ||
    combinedText.includes("typography") ||
    combinedText.includes("deck")
  ) {
    archetype = "Brand Identity Architecture & Strategy";
    disciplineCategory = "Brand Systems";
    estimatedSprint = "2–3 Weeks";
    recommendedPortfolio = [
      "Metronix Entertainment Master Brand Guidelines & Brand Book",
      "Plutus World Adventure Park 5-Year Equity Framework",
      "TVSMUN Official Identity & Vector Placard System"
    ];
  } else if (
    combinedText.includes("motion") ||
    combinedText.includes("animation") ||
    combinedText.includes("2d") ||
    combinedText.includes("scientific") ||
    combinedText.includes("simulation") ||
    combinedText.includes("explainer") ||
    combinedText.includes("after effects")
  ) {
    archetype = "Motion Graphics & 2D Scientific Animation";
    disciplineCategory = "Motion Engineering";
    estimatedSprint = "1.5–3 Weeks";
    recommendedPortfolio = [
      "IIT Roorkee Virtual Labs Chemistry Simulations (Excellence Award)",
      "JIETMUN 2023 Kinetic 2D Intro Sequences",
      "Dynamic Logo Animation & Lower-Third Stings"
    ];
  } else if (
    combinedText.includes("video") ||
    combinedText.includes("after film") ||
    combinedText.includes("after-film") ||
    combinedText.includes("reel") ||
    combinedText.includes("edit") ||
    combinedText.includes("premiere") ||
    combinedText.includes("conclave")
  ) {
    archetype = "Commercial Video Editing & Conclave After-Films";
    disciplineCategory = "Cinema & Post-Production";
    estimatedSprint = "1–2 Weeks";
    recommendedPortfolio = [
      "Resonance Cultural Fest Flagship After-Film (Media Head)",
      "Ideaforage Foundations High-Paced Game Teasers",
      "VSupportU Lifestyle & Hospitality Social Reels Engine"
    ];
  } else if (
    combinedText.includes("ui") ||
    combinedText.includes("ux") ||
    combinedText.includes("figma") ||
    combinedText.includes("web") ||
    combinedText.includes("wireframe") ||
    combinedText.includes("prototype") ||
    combinedText.includes("app")
  ) {
    archetype = "UI/UX Architecture & Interactive Web Interfaces";
    disciplineCategory = "Product Design & Web Engineering";
    estimatedSprint = "2.5–4 Weeks";
    recommendedPortfolio = [
      "Jerrydotone Monolith Portfolio Architecture & Token System",
      "Figma Auto-Layout Component Libraries & Dark/Light Modes",
      "Spider-Persona Interactive 3D Turntable Interface"
    ];
  }

  // 2. Priority Scoring
  let priorityScore = 78;
  let priorityTier = "TIER-2 HIGH VALUE";

  if (budgetTier.includes("3,000") || budgetTier.includes("2L") || budgetTier.includes("Enterprise") || combinedText.includes("enterprise") || combinedText.includes("urgent")) {
    priorityScore = 95;
    priorityTier = "TIER-1 HIGH PRIORITY // COMMERCIAL DIRECTIVE";
  } else if (budgetTier.includes("1,000") || budgetTier.includes("50k") || budgetTier.includes("1.5L")) {
    priorityScore = 86;
    priorityTier = "TIER-2 HIGH VALUE DIRECTIVE";
  } else {
    priorityScore = 75;
    priorityTier = "STANDARD DISCOVERY LEAD";
  }

  // 3. Concrete Action Steps for Jeeshan
  const formattedMeetingSlot = meetingDate && meetingTime
    ? `${meetingDate} at ${meetingTime} ${timezone}`
    : "Proposed slot upon discovery confirmation";

  const actionSteps = [
    {
      num: "01",
      title: "CALENDAR & SCHEDULE LOCK",
      instruction: `Lock proposed Google Calendar slot (${formattedMeetingSlot}). Add client (${clientEmail}) and primary mail (jeeshandotone@gmail.com) to calendar invite with a Google Meet link.`
    },
    {
      num: "02",
      title: "PORTFOLIO DOSSIER DISPATCH",
      instruction: `Send tailored proof-of-work: attach ${recommendedPortfolio[0]} and highlight relevant case studies matching "${projectScope}".`
    },
    {
      num: "03",
      title: "DISCOVERY CALL BRIEF PREPARATION",
      instruction: `Prepare 3 core architectural questions: (1) Key deliverables format & release deadline, (2) Brand/target audience constraints, (3) Preferred technical review rounds.`
    },
    {
      num: "04",
      title: "COMMERCIAL STRUCTURE PROPOSAL",
      instruction: `Structure sprint terms: 50% upfront commitment, 50% upon final master asset sign-off. Estimated production sprint: ${estimatedSprint}.`
    }
  ];

  // 4. Drafted Response for Client
  const clientFirstName = clientName.split(" ")[0] || clientName;
  const meetingConfirmationSentence = meetingDate && meetingTime
    ? `I have penciled in our proposed discovery call for ${meetingDate} at ${meetingTime} (${timezone}). A Google Calendar invite with a Google Meet link has been generated.`
    : `I would love to schedule a concise 20-minute discovery call to run through your timeline and technical specs.`;

  const draftedResponse = `Hi ${clientFirstName},

Thank you for reaching out regarding ${projectScope}.

I reviewed your project brief:
"${messageBrief || "Project scope inquiry"}"

Your requirements align directly with my studio disciplines in ${archetype}. From building comprehensive brand systems at Metronix to engineering high-precision visual assets, I ensure disciplined execution with Swiss architectural rigor.

${meetingConfirmationSentence}

Looking forward to speaking with you and bringing this vision to life.

Best regards,

Jeeshan Purohit
Multidisciplinary Visual Designer & Creative Technologist
Mail: jeeshandotone@gmail.com | Phone: +91-9413564618
Portfolio: https://jeeshan.one`;

  return {
    timestamp: new Date().toISOString(),
    queryId: `JP-${Date.now().toString(36).toUpperCase()}`,
    clientName,
    clientEmail,
    clientPhone,
    projectScope,
    budgetTier,
    meetingDate,
    meetingTime,
    timezone,
    messageBrief,
    archetype,
    disciplineCategory,
    priorityTier,
    priorityScore,
    estimatedSprint,
    recommendedPortfolio,
    actionSteps,
    draftedResponse
  };
}
