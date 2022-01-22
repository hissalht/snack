import { defineQuery } from 'bitecs'
import { Controlled } from '../components/Controlled'
import { Direction } from '../components/Direction'
import { Velocity } from '../components/Velocity'
import { SnackSystem } from '../SnackSystem'

const steeringQuery = defineQuery([Velocity, Direction, Controlled])

const STEERING_SPEED = 5
const MOVEMENT_SPEED = 100

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

    let angleMod = 0

    if (left && !right) {
      angleMod = STEERING_SPEED * delta * -1
    } else if (!left && right) {
      angleMod = STEERING_SPEED * delta
    }

    Direction.angle[eid] += angleMod
    Velocity.x[eid] = Math.cos(Direction.angle[eid]) * MOVEMENT_SPEED
    Velocity.y[eid] = Math.sin(Direction.angle[eid]) * MOVEMENT_SPEED
  }

  return world
}
