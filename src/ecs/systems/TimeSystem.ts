import { SnackSystem } from '../SnackSystem'

/** Update the `time` property of the world. */
export const TimeSystem: SnackSystem = world => {
  const { time } = world
  const now = performance.now()
  const delta = (now - time.then) * 0.001
  time.delta = delta
  time.elapsed += delta
  time.then = now
  return world
}
