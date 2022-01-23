import { defineQuery, removeEntity } from 'bitecs'
import { BULLET_RADIUS, ENNEMY_RADIUS } from '../../constants'
import { Damage } from '../components/Damage'
import { Ennemy } from '../components/Ennemy'
import { Health } from '../components/Health'
import { Position } from '../components/Position'
import { SnackSystem } from '../SnackSystem'

function calculateDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const dx = Math.abs(x1 - x2)
  const dy = Math.abs(y1 - y2)
  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
}

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
