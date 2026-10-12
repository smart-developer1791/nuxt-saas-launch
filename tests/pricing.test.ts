import assert from 'node:assert/strict'
import test from 'node:test'
import { estimatePlan, recommendPlan, type Plan } from '../app/domain/pricing.ts'

const starter: Plan = {
  id: 'starter',
  name: 'Starter',
  description: '',
  monthlyCents: 2900,
  includedSeats: 5,
  includedRuns: 1000,
  extraSeatCents: 500,
  extraRunBlockCents: 800,
  features: [],
}
const team: Plan = {
  ...starter,
  id: 'team',
  name: 'Team',
  monthlyCents: 7900,
  includedSeats: 15,
  includedRuns: 5000,
  extraSeatCents: 400,
  extraRunBlockCents: 600,
}

test('included seats and runs do not add a charge', () => {
  const quote = estimatePlan(starter, 5, 1000, 'monthly')
  assert.equal(quote.monthlyCents, 2900)
  assert.equal(quote.additionalSeats, 0)
  assert.equal(quote.additionalRunBlocks, 0)
})
test('the first run above capacity starts one block, not a fractional charge', () => {
  assert.equal(estimatePlan(starter, 5, 1001, 'monthly').runsCents, 800)
  assert.equal(estimatePlan(starter, 5, 2000, 'monthly').runsCents, 800)
  assert.equal(estimatePlan(starter, 5, 2001, 'monthly').runsCents, 1600)
})
test('annual billing discounts the complete estimate and charges twelve months', () => {
  const quote = estimatePlan(starter, 7, 1500, 'annual')
  assert.equal(quote.monthlyCents, 3760)
  assert.equal(quote.discountCents, 940)
  assert.equal(quote.billedCents, 45120)
})
test('recommendation compares the complete cost, including extra capacity', () => {
  assert.equal(recommendPlan([starter, team], 1, 0, 'monthly').id, 'starter')
  assert.equal(recommendPlan([starter, team], 15, 3000, 'monthly').id, 'team')
})
test('invalid sizes are rejected instead of creating misleading estimates', () => {
  for (const seats of [0, -1, 101, 1.5, NaN])
    assert.throws(() => estimatePlan(starter, seats, 1000, 'monthly'), RangeError)
  for (const runs of [-1, 50001, 10.5, Infinity])
    assert.throws(() => estimatePlan(starter, 5, runs, 'annual'), RangeError)
  assert.throws(() => recommendPlan([], 5, 1000, 'monthly'), RangeError)
})
