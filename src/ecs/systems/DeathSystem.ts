import { defineQuery, removeEntity } from 'bitecs'
import { Health } from '../components/Health'
import { SnackSystem } from '../SnackSystem'

const deathQuery = defineQuery([Health])

export const DeathSystem: SnackSystem = world => {
  const ents = deathQuery(world)

  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i]
    if (Health.hp[eid] <= 0) {
      removeEntity(world, eid)
    }
  }

  return world
}
