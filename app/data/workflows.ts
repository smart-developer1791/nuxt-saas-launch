export interface WorkflowStep {
  tool: string
  label: string
  detail: string
  color: string
  approval?: boolean
}

export interface Workflow {
  id: string
  label: string
  title: string
  description: string
  savedMinutes: number
  steps: WorkflowStep[]
}

export const workflows: Workflow[] = [
  {
    id: 'onboarding',
    label: 'Client onboarding',
    title: 'A warm welcome. Without the busywork.',
    description: 'One signed contract becomes a project, a welcome email, and a team heads-up.',
    savedMinutes: 24,
    steps: [
      {
        tool: 'Form',
        label: 'Contract signed',
        detail: 'Northstar Studio · Website project',
        color: '#ede4d2',
      },
      {
        tool: 'Notion',
        label: 'Create client workspace',
        detail: 'Project brief + onboarding checklist',
        color: '#e6e8e0',
      },
      {
        tool: 'Gmail',
        label: 'Send a welcome email',
        detail: 'A personal hello and the next steps',
        color: '#f5ded5',
      },
      {
        tool: 'Slack',
        label: 'Let the team know',
        detail: '#new-projects · Ready for kickoff',
        color: '#e9def0',
      },
    ],
  },
  {
    id: 'handoff',
    label: 'Project handoff',
    title: 'The next step already knows what to do.',
    description:
      'A finished design moves straight into the delivery process, with context attached.',
    savedMinutes: 18,
    steps: [
      {
        tool: 'Linear',
        label: 'Design marked complete',
        detail: 'Homepage refresh · Design approved',
        color: '#e5e1fa',
      },
      {
        tool: 'Notion',
        label: 'Attach the handoff brief',
        detail: 'Assets, notes, and acceptance criteria',
        color: '#e6e8e0',
      },
      {
        tool: 'Linear',
        label: 'Create implementation task',
        detail: 'Assigned to the delivery team',
        color: '#e5e1fa',
      },
      {
        tool: 'Slack',
        label: 'Share the next step',
        detail: '#delivery · Everything in one place',
        color: '#e9def0',
      },
    ],
  },
  {
    id: 'approval',
    label: 'Team approvals',
    title: 'Automate the admin. Keep the judgment.',
    description: 'Collect the request, get a human decision, and give everyone a clear answer.',
    savedMinutes: 12,
    steps: [
      {
        tool: 'Form',
        label: 'Equipment request received',
        detail: 'Alex Morgan · Monitor · $320',
        color: '#ede4d2',
      },
      {
        tool: 'Review',
        label: 'Team lead approval',
        detail: 'Budget available · Your decision',
        color: '#d7efa6',
        approval: true,
      },
      {
        tool: 'Sheets',
        label: 'Update equipment tracker',
        detail: 'Approved request added to the queue',
        color: '#dceee0',
      },
      {
        tool: 'Gmail',
        label: 'Send the decision',
        detail: 'Requester gets a clear next step',
        color: '#f5ded5',
      },
    ],
  },
]
