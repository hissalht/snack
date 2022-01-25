import { defineQuery, removeEntity } from 'bitecs'
import { Experience } from '../components/Experience'
import { Position } from '../components/Position'
import { Unit } from '../components/Unit'
import { SnackSystem } from '../SnackSystem'
import { calculateDistance } from '../utils'

const orbsQuery = defineQuery([Experience, Position])
const unitsQuery = defineQuery([Unit, Position])

export const ExperienceSystem: SnackSystem = world => {
  const orbs = orbsQuery(world)
  for (let i = 0; i < orbs.length; i++) {
    const orbId = orbs[i]

    const units = unitsQuery(world)
    for (let j = 0; j < units.length; j++) {
      const unitId = units[j]

      const distance = calculateDistance(
        Position.x[orbId],
        Position.y[orbId],
        Position.x[unitId],
        Position.y[unitId]
      )

      if (distance < 5) {
        removeEntity(world, orbId)
        world.experience += 1
        break
      }
    }
  }

  return world
}
