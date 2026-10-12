import type { Plan } from '../domain/pricing'

export const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'A little less admin. A lot more momentum.',
    monthlyCents: 2900,
    includedSeats: 5,
    includedRuns: 1000,
    extraSeatCents: 500,
    extraRunBlockCents: 800,
    features: [
      'Unlimited workflows',
      'All standard connections',
      '7-day activity history',
      'Email support',
    ],
  },
  {
    id: 'team',
    name: 'Team',
    description: 'For teams finding their flow together.',
    monthlyCents: 7900,
    includedSeats: 15,
    includedRuns: 5000,
    extraSeatCents: 400,
    extraRunBlockCents: 600,
    features: [
      'Everything in Starter',
      'Human approval steps',
      '30-day activity history',
      'Shared workflow library',
    ],
    featured: true,
  },
  {
    id: 'studio',
    name: 'Studio',
    description: 'More moving parts. One shared rhythm.',
    monthlyCents: 19900,
    includedSeats: 40,
    includedRuns: 20000,
    extraSeatCents: 300,
    extraRunBlockCents: 400,
    features: [
      'Everything in Team',
      'Workspace permissions',
      '90-day activity history',
      'Priority support',
    ],
  },
]
