import { addComponent, addEntity, defineQuery } from 'bitecs'
import { Bounce } from '../components/Bounce'
import { HighRoller } from '../components/HighRoller'
import { Position } from '../components/Position'
import { Projectile } from '../components/Projectile'
import { Velocity } from '../components/Velocity'
import { SnackSystem } from '../SnackSystem'

const SHOT_COOLDOWN = 1 // shoot every 1.0 seconds
const BULLET_SPEED = 100

const unitsQuery = defineQuery([HighRoller, Position])

export const ShootingSystem: SnackSystem = world => {
  const {
    time: { delta },
  } = world

  const ents = unitsQuery(world)

  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i]

    HighRoller.cooldown[eid] -= delta

    if (HighRoller.cooldown[eid] <= 0) {
      HighRoller.cooldown[eid] = SHOT_COOLDOWN

      const projectile = addEntity(world)
      addComponent(world, Projectile, projectile)
      addComponent(world, Position, projectile)
      addComponent(world, Velocity, projectile)
      addComponent(world, Bounce, projectile)

      // Set bullet position
      Position.x[projectile] = Position.x[eid]
      Position.y[projectile] = Position.y[eid]

      // Set bullet velocity
      const angle = Math.random() * Math.PI * 2
      Velocity.x[projectile] = Math.cos(angle) * BULLET_SPEED
      Velocity.y[projectile] = Math.sin(angle) * BULLET_SPEED
    }
  }

  return world
}
