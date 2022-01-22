import { defineQuery } from 'bitecs'
import { Direction } from '../components/Direction'

import { Position } from '../components/Position'
import { Unit } from '../components/Unit'
import { SnackSystem } from '../SnackSystem'

const unitsQuery = defineQuery([Unit, Position, Direction])

const BLOCK_WIDTH = 12
const BLOCK_HEIGHT = 10

/**
 * @param ctx Canvas rendering context
 * @returns A system handling rendering withing the given context
 */
export function RenderingSystem(ctx: CanvasRenderingContext2D): SnackSystem {
  return world => {
    const { inputs } = world

    const ents = unitsQuery(world)

    ctx.beginPath()
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    for (let i = 0; i < ents.length; i++) {
      const eid = ents[i]

      const w = BLOCK_WIDTH
      const h = BLOCK_HEIGHT
      const x = Position.x[eid]
      const y = Position.y[eid]
      const angle = Direction.angle[eid]

      ctx.beginPath()
      ctx.fillStyle = '#ffffff'
      ctx.translate(x, y)
      ctx.rotate(angle)
      ctx.translate(-x, -y)
      ctx.fillRect(x - w / 2, y - h / 2, w, h) // Draw rectangle centered on entity position
      ctx.resetTransform()

      // // Draw entity position cross
      // ctx.beginPath()
      // ctx.strokeStyle = '#0088ff88'
      // ctx.lineWidth = 2
      // ctx.moveTo(x - 10, y)
      // ctx.lineTo(x + 10, y)
      // ctx.moveTo(x, y - 10)
      // ctx.lineTo(x, y + 10)
      // ctx.stroke()
    }

    ctx.beginPath()
    ctx.fillStyle = '#ffffff88'
    if (inputs.left) ctx.fillStyle = '#ffffff'
    ctx.fillRect(ctx.canvas.width - 40, ctx.canvas.height - 20, 18, 18)

    ctx.beginPath()
    ctx.fillStyle = '#ffffff88'
    if (inputs.right) ctx.fillStyle = '#ffffff'
    ctx.fillRect(ctx.canvas.width - 20, ctx.canvas.height - 20, 18, 18)

    return world
  }
}
