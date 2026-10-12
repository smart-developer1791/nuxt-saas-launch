export type BillingCycle = 'monthly' | 'annual'

export interface Plan {
  id: string
  name: string
  description: string
  monthlyCents: number
  includedSeats: number
  includedRuns: number
  extraSeatCents: number
  extraRunBlockCents: number
  features: string[]
  featured?: boolean
}

export interface Quote {
  planId: string
  seats: number
  runs: number
  cycle: BillingCycle
  baseCents: number
  seatsCents: number
  runsCents: number
  additionalSeats: number
  additionalRunBlocks: number
  discountCents: number
  monthlyCents: number
  billedCents: number
}

export function estimatePlan(plan: Plan, seats: number, runs: number, cycle: BillingCycle): Quote {
  if (!Number.isInteger(seats) || seats < 1 || seats > 100) {
    throw new RangeError('Team size must be a whole number between 1 and 100.')
  }
  if (!Number.isInteger(runs) || runs < 0 || runs > 50000) {
    throw new RangeError('Monthly runs must be a whole number between 0 and 50,000.')
  }
  const additionalSeats = Math.max(0, seats - plan.includedSeats)
  const additionalRunBlocks = Math.ceil(Math.max(0, runs - plan.includedRuns) / 1000)
  const seatsCents = additionalSeats * plan.extraSeatCents
  const runsCents = additionalRunBlocks * plan.extraRunBlockCents
  const subtotal = plan.monthlyCents + seatsCents + runsCents
  const monthlyCents = cycle === 'annual' ? Math.round((subtotal * 80) / 100) : subtotal
  return {
    planId: plan.id,
    seats,
    runs,
    cycle,
    baseCents: plan.monthlyCents,
    seatsCents,
    runsCents,
    additionalSeats,
    additionalRunBlocks,
    discountCents: subtotal - monthlyCents,
    monthlyCents,
    billedCents: cycle === 'annual' ? monthlyCents * 12 : monthlyCents,
  }
}

export function recommendPlan(plans: Plan[], seats: number, runs: number, cycle: BillingCycle) {
  if (!plans.length) throw new RangeError('At least one plan is required.')
  return plans.reduce((best, plan) =>
    estimatePlan(plan, seats, runs, cycle).monthlyCents <
    estimatePlan(best, seats, runs, cycle).monthlyCents
      ? plan
      : best,
  )
}

export function formatMoney(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100)
}
