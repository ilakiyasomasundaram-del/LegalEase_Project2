const labels = {
  rental: "RENTAL AGREEMENT",
  employment: "EMPLOYMENT AGREEMENT",
  nda: "NON-DISCLOSURE AGREEMENT",
  affidavit: "AFFIDAVIT",
  authorization: "AUTHORIZATION LETTER",
  notice: "GENERAL LEGAL NOTICE"
};

const fields = {
  rental: [
    ["landlordName","Landlord"],["tenantName","Tenant"],["propertyAddress","Property Address"],
    ["monthlyRent","Monthly Rent"],["securityDeposit","Security Deposit"],["leaseStartDate","Lease Start Date"],
    ["leaseEndDate","Lease End Date"],["paymentDueDate","Payment Due Date"],
    ["maintenanceResponsibilities","Maintenance Responsibilities"],["noticePeriod","Notice Period"],["additionalTerms","Additional Terms"]
  ],
  employment: [
    ["employerName","Employer / Company"],["employeeName","Employee"],["jobTitle","Job Title"],
    ["employmentStartDate","Employment Start Date"],["salary","Salary"],["workLocation","Work Location"],
    ["workingHours","Working Hours"],["probationPeriod","Probation Period"],["leavePolicy","Leave Policy"],
    ["noticePeriod","Notice Period"],["additionalTerms","Additional Terms"]
  ],
  nda: [
    ["disclosingParty","Disclosing Party"],["receivingParty","Receiving Party"],["purpose","Purpose"],
    ["confidentialInformation","Confidential Information"],["duration","Duration"],
    ["permittedDisclosures","Permitted Disclosures"],["governingJurisdiction","Governing Jurisdiction"],["additionalTerms","Additional Terms"]
  ],
  affidavit: [
    ["declarantName","Declarant Name"],["address","Address"],["dateOfBirth","Date of Birth"],
    ["purpose","Purpose"],["statement","Statement / Declaration"],["location","Location"],["date","Date"]
  ],
  authorization: [
    ["authorizerName","Authorizing Person"],["authorizedName","Authorized Person"],["purpose","Purpose"],
    ["scope","Scope of Authorization"],["validFrom","Valid From"],["validUntil","Valid Until"],["additionalInstructions","Additional Instructions"]
  ],
  notice: [
    ["senderName","Sender Name"],["recipientName","Recipient Name"],["subject","Subject"],
    ["issueDescription","Description of Issue"],["requiredAction","Required Action"],
    ["deadline","Deadline"],["contactInformation","Contact Information"],["additionalDetails","Additional Details"]
  ]
};

function fallback(type, data) {
  const title = labels[type] || "LEGAL DOCUMENT";
  const list = fields[type] || [];
  let body = `${title}\n\nThis document draft has been prepared from the information supplied through LegalEase.\n\n`;
  list.forEach(([key, label], i) => {
    body += `${i + 1}. ${label.toUpperCase()}\n${data[key] || "[Not provided]"}\n\n`;
  });
  body += "GENERAL TERMS\n\nThe parties should review all terms, applicable requirements, dates, names and jurisdiction-specific provisions before using this document.\n\n";
  body += "DISCLAIMER\n\nLegalEase provides document drafts for informational and educational purposes only. It does not provide legal advice and does not guarantee that a generated document is legally valid or suitable for a particular situation. Consult a qualified legal professional before relying on this document.";
  return body;
}

export async function generateLegalDocument(type, data) {
  // Optional OpenAI integration can be added here. The fallback guarantees that
  // the project works without an API key.
  return fallback(type, data);
}