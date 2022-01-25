import { defineQuery } from 'bitecs'
import { Magnet } from '../components/Magnet'
import { Magnetable } from '../components/Magnetable'
import { Position } from '../components/Position'
import { Velocity } from '../components/Velocity'
import { SnackSystem } from '../SnackSystem'
import { calculateDistance, minBy } from '../utils'

const magnetQuery = defineQuery([Magnet, Position])
const magnetableQuery = defineQuery([Magnetable, Position, Velocity])

export const MagnetSystem: SnackSystem = world => {
  const magnetables = magnetableQuery(world)

  for (let i = 0; i < magnetables.length; i++) {
    const eid = magnetables[i]
    const magnetableX = Position.x[eid]
    const magnetableY = Position.y[eid]

    const magnets = magnetQuery(world)

    const magnetsInRange = magnets.filter(
      magnetId =>
        calculateDistance(
          magnetableX,
          magnetableY,
          Position.x[magnetId],
          Position.y[magnetId]
        ) <= Magnet.maxDistance[magnetId]
    )

    if (!magnetsInRange.length) {
      // No magnet in range
      continue
    }

    const closestMagnet = minBy(magnetsInRange, magnetId =>
      calculateDistance(
        magnetableX,
        magnetableY,
        Position.x[magnetId],
        Position.y[magnetId]
      )
    )

    const angle = Math.atan2(
      Position.x[closestMagnet] - magnetableX,
      Position.y[closestMagnet] - magnetableY
    )

    Velocity.x[eid] = Math.sin(angle) * Magnet.speed[closestMagnet]
    Velocity.y[eid] = Math.cos(angle) * Magnet.speed[closestMagnet]
  }

  return world
}
