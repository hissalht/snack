import { addComponent, addEntity, defineQuery } from 'bitecs'
import {
  HIGHROLLER_BULLET_DAMAGE,
  HIGHROLLER_BULLET_SPEED,
} from '../../constants'
import { Bounce } from '../components/Bounce'
import { Cooldown } from '../components/Cooldown'
import { Damage } from '../components/Damage'
import { HighRoller } from '../components/HighRoller'
import { Position } from '../components/Position'
import { Projectile } from '../components/Projectile'
import { Velocity } from '../components/Velocity'
import { SnackSystem } from '../SnackSystem'

const unitsQuery = defineQuery([HighRoller, Cooldown, Position])

/**
 * Handles the behavior of the *High Roller* class of snake unit.
 */
export const HighRollerSystem: SnackSystem = world => {
  const {
    time: { delta },
  } = world

  const ents = unitsQuery(world)

  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i]

    Cooldown.value[eid] -= delta

    if (Cooldown.value[eid] <= 0) {
      Cooldown.value[eid] = Cooldown.default[eid]

      // spawn new bullet
      const projectile = addEntity(world)
      addComponent(world, Projectile, projectile)
      addComponent(world, Position, projectile)
      addComponent(world, Velocity, projectile)
      addComponent(world, Bounce, projectile)
      addComponent(world, Damage, projectile)

      // Set bullet velocity
      const angle = Math.random() * Math.PI * 2
      Velocity.x[projectile] = Math.cos(angle) * HIGHROLLER_BULLET_SPEED
      Velocity.y[projectile] = Math.sin(angle) * HIGHROLLER_BULLET_SPEED

      // Set bullet position
      Position.x[projectile] = Position.x[eid] + Math.cos(angle) * 10
      Position.y[projectile] = Position.y[eid] + Math.sin(angle) * 10

      // Set max number of bounces
      Bounce.max[projectile] = 1

      // Set bullet damage
      Damage.value[projectile] = HIGHROLLER_BULLET_DAMAGE
    }
  }

  return world
}
