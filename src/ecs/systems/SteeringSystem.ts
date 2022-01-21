import { defineQuery } from 'bitecs'
import { Controlled } from '../components/Controlled'
import { Velocity } from '../components/Velocity'
import { SnackSystem } from '../SnackSystem'

const steeringQuery = defineQuery([Velocity, Controlled])

const STEERING_SPEED = 5

export const SteeringSystem: SnackSystem = world => {
  const {
    inputs: { left, right },
  } = world
  const {
    time: { delta },
  } = world

  const ents = steeringQuery(world)

  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i]

    if (left && !right) {
      Velocity.angle[eid] -= STEERING_SPEED * delta
    } else if (!left && right) {
      Velocity.angle[eid] += STEERING_SPEED * delta
    }
  }

  return world
}
