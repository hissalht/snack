import { defineQuery } from 'bitecs'

import { Position } from '../components/Position'
import { SnackSystem } from '../SnackSystem'

const renderingQuery = defineQuery([Position])

/**
 * @param ctx Canvas rendering context
 * @returns A system handling rendering withing the given context
 */
export function RenderingSystem(ctx: CanvasRenderingContext2D): SnackSystem {
  return world => {
    const ents = renderingQuery(world)

    ctx.beginPath()
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    for (let i = 0; i < ents.length; i++) {
      const eid = ents[i]

      ctx.beginPath()
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(Position.x[eid], Position.y[eid], 10, 10)
    }

    return world
  }
}
