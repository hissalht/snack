import { addComponent, addEntity, defineQuery, removeEntity } from 'bitecs'
import { Experience } from '../components/Experience'
import { Health } from '../components/Health'
import { Magnetable } from '../components/Magnetable'
import { Position } from '../components/Position'
import { Velocity } from '../components/Velocity'
import { SnackSystem } from '../SnackSystem'

const deathQuery = defineQuery([Health, Position])

export const DeathSystem: SnackSystem = world => {
  const ents = deathQuery(world)

  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i]
    if (Health.hp[eid] <= 0) {
      removeEntity(world, eid)

      // Spawn EXP orb
      const exp = addEntity(world)
      addComponent(world, Position, exp)
      addComponent(world, Experience, exp)
      addComponent(world, Velocity, exp)
      addComponent(world, Magnetable, exp)

      Position.x[exp] = Position.x[eid]
      Position.y[exp] = Position.y[eid]
    }
  }

  return world
}
