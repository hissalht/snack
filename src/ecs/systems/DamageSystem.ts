import { defineQuery, removeEntity } from 'bitecs'
import { BULLET_RADIUS, ENNEMY_RADIUS } from '../../constants'
import { Damage } from '../components/Damage'
import { Ennemy } from '../components/Ennemy'
import { Health } from '../components/Health'
import { Position } from '../components/Position'
import { SnackSystem } from '../SnackSystem'
import { calculateDistance } from '../utils'

const damageQuery = defineQuery([Damage, Position])
const damageableQuery = defineQuery([Health, Position, Ennemy])

export const DamageSystem: SnackSystem = world => {
  const damages = damageQuery(world)
  const damageables = damageableQuery(world)

  for (let i = 0; i < damages.length; i++) {
    const damageId = damages[i]

    const damageX = Position.x[damageId]
    const damageY = Position.y[damageId]

    for (let j = 0; j < damageables.length; j++) {
      const damageableId = damageables[j]

      const damageableX = Position.x[damageableId]
      const damageableY = Position.y[damageableId]

      const distance = calculateDistance(
        damageX,
        damageY,
        damageableX,
        damageableY
      )

      if (distance < ENNEMY_RADIUS + BULLET_RADIUS) {
        Health.hp[damageableId] -= Damage.value[damageId]
        removeEntity(world, damageId)
      }
    }
  }

  return world
}
