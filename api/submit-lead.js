// Phase 3: wire to Lead Mailbox CRM
// Expected POST body (JSON) from form.js submitLead():
//   goal, state, timeline, price, agent,
//   firstName, lastName, email, phone, consent (bool),
//   source, submittedAt, page

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // TODO Phase 3: validate required fields, sanitize before logging
  // TODO Phase 3: POST to Lead Mailbox API/webhook endpoint
  // TODO Phase 3: capture UTM params from query string and forward to CRM
  // NOTE: Do NOT log PII (email, phone) to Vercel function logs

  return res.status(200).json({ status: 200, body: 'OK' });
}
