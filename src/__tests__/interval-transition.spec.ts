import { IntervalTransition } from '../transitions'

class TestIntervalTransition extends IntervalTransition {
  protected doUpdate(): void {}
}

describe('IntervalTransition', () => {
  const transitionInterval = 1000

  it('is not finished before first update', () => {
    const transition = new TestIntervalTransition(transitionInterval)
    expect(transition.isFinished).toBe(false)
  })

  it('is finished after the transition interval', () => {
    const transition = new TestIntervalTransition(transitionInterval)
    const startTime = 100

    transition.update(startTime)
    expect(transition.isFinished).toBe(false)

    transition.update(startTime + transition.interval - 1)
    expect(transition.isFinished).toBe(false)

    transition.update(startTime + transition.interval)
    expect(transition.isFinished).toBe(true)

    transition.update(startTime + transition.interval + 1)
    expect(transition.isFinished).toEqual(true)
  })
})
