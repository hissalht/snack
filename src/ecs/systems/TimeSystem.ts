import { MAX_TIME_DELTA } from '../../constants'
import { SnackSystem } from '../SnackSystem'

/** Update the `time` property of the world. */
export const TimeSystem: SnackSystem = world => {
  const { time } = world
  const now = performance.now()

  let delta = (now - time.then) * 0.001
  // prevent huge deltas in case of lags, the game will slow down instead of "jumping" around
  delta = Math.min(delta, MAX_TIME_DELTA)

  time.delta = delta
  time.elapsed += delta
  time.then = now
  return world
}
