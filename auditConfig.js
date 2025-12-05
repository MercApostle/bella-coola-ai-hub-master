// auditConfig.js
// Lite Business Audit – core questions only

export const AUDIT_QUESTIONS = [
  {
    id: "business_name",
    label: "Business name",
    type: "text",
    required: true
  },
  {
    id: "contact_name",
    label: "Your name",
    type: "text",
    required: true
  },
  {
    id: "contact_email",
    label: "Best email",
    type: "email",
    required: true
  },
  {
    id: "location",
    label: "Location (City / Region)",
    type: "text",
    required: true
  },
  {
    id: "industry",
    label: "Industry",
    type: "select",
    required: true,
    options: [
      "Trades & Home Services",
      "Tourism & Hospitality",
      "Restaurants & Food Services",
      "Retail & Local Shops",
      "Forestry & Natural Resources",
      "Fishing & Marine Services",
      "Transportation & Logistics",
      "Health & Personal Services",
      "Community & Nonprofit Services",
      "Other"
    ]
  },
  {
    id: "team_size",
    label: "Team size (including you)",
    type: "number",
    required: false
  },
  {
    id: "monthly_leads_estimate",
    label: "Roughly how many new leads/inquiries per month?",
    type: "text",
    required: false
  },
  {
    id: "lead_response_time",
    label: "How quickly do you usually respond to new inquiries?",
    type: "select",
    required: false,
    options: [
      "Within minutes",
      "Within a few hours",
      "Same day",
      "Next day",
      "More than 1 day"
    ]
  },
  {
    id: "primary_bottleneck_area",
    label: "Which area feels most time-consuming or frustrating?",
    type: "select",
    required: true,
    options: [
      "Leads & follow-up",
      "Customer communication",
      "Scheduling & booking",
      "Admin / paperwork",
      "Staff coordination",
      "Other"
    ]
  },
  {
    id: "main_pain_point",
    label: "What is your single biggest frustration in the business right now?",
    type: "textarea",
    required: true
  },
  {
    id: "first_automation_choice",
    label: "If we could automate ONE thing first, what would you choose?",
    type: "textarea",
    required: false
  },
  {
    id: "preferred_followup_channel",
    label: "How would you prefer to continue this conversation?",
    type: "select",
    required: false,
    options: ["Call", "Video call", "Email only", "In-person (if local)"]
  }
];

