// Every fact here comes from Shlok's CV (ai-job-search/cv/shlok_singh_cv.tex).

export const contact = {
  email: 'shloksingh2805@gmail.com',
  linkedin: 'https://www.linkedin.com/in/i-am-shlok-singh',
  github: 'https://github.com/0shunya',
}

// The shared pattern across the five products: what goes in, what the model does,
// what code checks before anything ships, what comes out.
export const pipeline = [
  { name: 'AI Expense Tracker', input: 'Receipt or PDF', model: 'Gemini, strict schema', check: 'Decimal validators', result: 'Approved ledger' },
  { name: 'AI Phone Receptionist', input: 'A caller’s voice', model: 'Gemini, live audio', check: 'State machine', result: 'A booked slot' },
  { name: 'Deep Research Agent', input: 'A hard question', model: 'Parallel agents', check: 'Verbatim quotes', result: 'A cited report' },
  { name: 'DMI', input: 'Job listings', model: 'Local model draft', check: 'Human review', result: 'A tracked application' },
  { name: 'NotebookLLM Lite', input: 'Your documents', model: 'Local LLM, hybrid search', check: 'Citation check', result: 'An answer with its page' },
]

export const projects = [
  {
    name: 'AI Expense Tracker',
    preview: '/previews/expense.jpg',
    result: '99.7% key-field accuracy; 88 of 88 planted errors caught',
    live: 'https://ai-expense-tracker-eta-sandy.vercel.app/',
    code: 'https://github.com/0shunya/AI-Expense-Tracker',
  },
  {
    name: 'AI Phone Receptionist',
    preview: '/previews/phone.jpg',
    result: '33 of 33 scenarios; 0 double bookings',
    live: 'https://ai-phone-receptionist-delta.vercel.app/',
    code: 'https://github.com/0shunya/AI-Phone-Receptionist',
  },
  {
    name: 'Deep Research Agent',
    preview: '/previews/research.jpg',
    result: '21 of 22 answers correct; every citation quoted',
    live: 'https://deep-research-agent-plum.vercel.app/',
    code: 'https://github.com/0shunya/Deep-Research_Agent',
  },
  {
    name: 'DMI',
    preview: '/previews/dmi.jpg',
    result: 'Explainable job matching; JWT auth and CI',
    live: 'https://dmi-2ea.pages.dev/',
    code: 'https://github.com/0shunya/DMI',
  },
  {
    name: 'NotebookLLM Lite',
    preview: '/previews/nblm.jpg',
    result: 'Page-cited answers; no paid model APIs',
    live: 'https://notebookllm-lite.onrender.com/',
    code: 'https://github.com/0shunya/NoteBookLLM_Lite',
  },
]

export const receptionistFacts = [
  { term: 'Caller scenarios passed', value: '33 of 33' },
  { term: 'Double bookings, 104 calls', value: '0' },
  { term: 'Correct handoffs to a person', value: '6 of 6' },
  { term: 'Median server turn', value: '1.37', unit: 's' },
]

export const services = [
  {
    title: 'LLM features with an eval',
    line: 'Structured outputs, tool calls and agents, tested on a labelled set first.',
  },
  {
    title: 'Retrieval that cites',
    line: 'pgvector with full-text search; every answer points at its source.',
  },
  {
    title: 'Real-time voice',
    line: 'Streaming speech, barge-in and a state machine the model cannot break.',
  },
  {
    title: 'Schema to deployment',
    line: 'React, FastAPI, PostgreSQL and Docker, shipped with CI.',
  },
]

export const experience = [
  { role: 'Independent AI Engineer', where: 'Five deployed products, public code', when: 'Jul 2026 to now' },
  { role: 'Python Developer Intern', where: 'CodeHub Technologies, Virar', when: 'Jul to Sep 2024' },
]
