export const site = {
  name: 'Relay',
  title: 'Relay — Good work. Less busywork.',
  description:
    'A calmer way to work. Explore simple team automations, connect your everyday tools, and find the right Relay plan for your team.',
  email: 'hello@relay.example.com',
  navigation: [
    { label: 'Product', href: '#product' },
    { label: 'Workflows', href: '#workflows' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ],
}

export const features = [
  {
    icon: 'route',
    number: '01',
    title: 'Your process. On repeat.',
    description:
      'Turn the steps you repeat every week into a workflow. Start with a trigger, add your actions, and let the small things take care of themselves.',
  },
  {
    icon: 'layers',
    number: '02',
    title: 'Make your tools a team.',
    description:
      'Move context between the places you already work. A new form can become a project, a checklist, and a timely heads-up.',
  },
  {
    icon: 'shield',
    number: '03',
    title: 'Keep people in the loop.',
    description:
      'Add an approval wherever a decision needs a human. See what happened at every step, so nothing disappears into a black box.',
  },
]

export const integrations = [
  { name: 'Slack', letter: '#', color: '#5b3a66', purpose: 'Keep everyone in the loop' },
  { name: 'Notion', letter: 'N', color: '#20251f', purpose: 'Put context in the right place' },
  { name: 'Linear', letter: '↗', color: '#6059b8', purpose: 'Give work a clear next step' },
  { name: 'Gmail', letter: 'M', color: '#b24b36', purpose: 'Send a thoughtful follow-up' },
  { name: 'Sheets', letter: '▤', color: '#23704c', purpose: 'Keep the details together' },
  { name: 'Calendar', letter: '31', color: '#356aaf', purpose: 'Make room for what matters' },
]

export const faqs = [
  {
    question: 'Do I need to know how to code?',
    answer:
      'No. The idea is simple: choose the event that starts a workflow, then connect the actions that follow. The interactive examples on this page show that pattern with everyday team tasks.',
  },
  {
    question: 'What counts as a workflow run?',
    answer:
      'A run is one complete execution of a workflow, regardless of the number of steps. The plans and calculator on this page use monthly runs, with additional capacity priced in blocks of 1,000.',
  },
  {
    question: 'How does annual billing work?',
    answer:
      'Annual pricing is 20% below the monthly equivalent. The calculator shows the equivalent monthly cost and the total charged for a year, including your selected seats and run capacity.',
  },
  {
    question: 'Can a workflow pause for an approval?',
    answer:
      'Yes. A human approval can sit between automated steps. In the approval demo, you can review the sample request and approve it or send it back before the workflow continues.',
  },
  {
    question: 'Can I connect my accounts in this preview?',
    answer:
      'This preview uses sample workflows and illustrative integrations. You can run the demos and download a plan brief. Connecting accounts or starting a subscription requires a live Relay service.',
  },
  {
    question: 'What happens when I choose a plan?',
    answer:
      'You get a clear summary of the plan, team size, run capacity, and billing estimate. Download the summary as a JSON brief to keep or share with your team. No account or payment is created.',
  },
]
