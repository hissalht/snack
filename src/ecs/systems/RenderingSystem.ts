import { defineQuery } from 'bitecs'
import {
  BACKGROUND_COLOR,
  BLOCK_HEIGHT,
  BLOCK_WIDTH,
  BULLET_COLOR,
  BULLET_RADIUS,
  COOLDOWN_COLOR,
  COOLDOWN_RADIUS,
  ENNEMY_COLOR,
  ENNEMY_RADIUS,
  HEALTHBAR_HEIGHT,
  HEALTHBAR_HP_COLOR,
  HEALTHBAR_MISSING_HP_COLOR,
  HEALTHBAR_OFFSET,
  HEALTHBAR_WIDTH,
  INPUT_VIEWER_COLOR,
  INPUT_VIEWER_COLOR_PRESSED,
  UNIT_COLOR,
} from '../../constants'
import { Cooldown } from '../components/Cooldown'
import { Direction } from '../components/Direction'
import { Ennemy } from '../components/Ennemy'
import { Experience } from '../components/Experience'
import { Health } from '../components/Health'

import { Position } from '../components/Position'
import { Projectile } from '../components/Projectile'
import { Unit } from '../components/Unit'
import { SnackSystem } from '../SnackSystem'

const unitsQuery = defineQuery([Unit, Position, Direction])
const bulletsQuery = defineQuery([Projectile, Position])
const ennemiesQuery = defineQuery([Ennemy, Position])
const cooldownQuery = defineQuery([Cooldown, Position])
const expQuery = defineQuery([Experience, Position])

const healthQuery = defineQuery([Health, Position])

/**
 * @param ctx Canvas rendering context
 * @returns A system handling rendering withing the given context
 */
export function RenderingSystem(ctx: CanvasRenderingContext2D): SnackSystem {
  return world => {
    const { inputs } = world

    // Clear canvas
    ctx.beginPath()
    ctx.fillStyle = BACKGROUND_COLOR
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    const units = unitsQuery(world)
    for (let i = 0; i < units.length; i++) {
      const eid = units[i]

      const w = BLOCK_WIDTH
      const h = BLOCK_HEIGHT
      const x = Position.x[eid]
      const y = Position.y[eid]
      const angle = Direction.angle[eid]

      ctx.save()
      ctx.beginPath()
      ctx.fillStyle = UNIT_COLOR
      ctx.translate(x, y)
      ctx.rotate(angle)
      ctx.translate(-x, -y)
      ctx.fillRect(x - w / 2, y - h / 2, w, h) // Draw rectangle centered on entity position
      ctx.restore()

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

    const bullets = bulletsQuery(world)
    for (let i = 0; i < bullets.length; i++) {
      const eid = bullets[i]
      const x = Position.x[eid]
      const y = Position.y[eid]

      ctx.beginPath()
      ctx.fillStyle = BULLET_COLOR
      ctx.arc(x, y, BULLET_RADIUS, 0, Math.PI * 2)
      ctx.fill()
    }

    const ennemies = ennemiesQuery(world)
    for (let i = 0; i < ennemies.length; i++) {
      const eid = ennemies[i]

      const x = Position.x[eid]
      const y = Position.y[eid]

      ctx.beginPath()
      ctx.fillStyle = ENNEMY_COLOR
      ctx.arc(x, y, ENNEMY_RADIUS, 0, Math.PI * 2)
      ctx.fill()
    }

    const healthEntities = healthQuery(world)
    for (let i = 0; i < healthEntities.length; i++) {
      const eid = healthEntities[i]

      const x = Position.x[eid]
      const y = Position.y[eid]

      if (Health.hp[eid] >= Health.max[eid]) {
        // Skip rendering when full health
        continue
      }

      ctx.beginPath()
      ctx.fillStyle = HEALTHBAR_MISSING_HP_COLOR
      ctx.fillRect(
        x - HEALTHBAR_WIDTH / 2,
        y + HEALTHBAR_OFFSET,
        HEALTHBAR_WIDTH,
        HEALTHBAR_HEIGHT
      )

      if (Health.hp[eid] > 0) {
        ctx.beginPath()
        ctx.fillStyle = HEALTHBAR_HP_COLOR
        ctx.fillRect(
          x - HEALTHBAR_WIDTH / 2,
          y + HEALTHBAR_OFFSET,
          HEALTHBAR_WIDTH * (Health.hp[eid] / Health.max[eid]),
          HEALTHBAR_HEIGHT
        )
      }
    }

    // Draw cooldowns
    const cooldownEntities = cooldownQuery(world)
    for (let i = 0; i < cooldownEntities.length; i++) {
      const eid = cooldownEntities[i]

      const x = Position.x[eid]
      const y = Position.y[eid]
      const angle = (Cooldown.value[eid] / Cooldown.default[eid]) * Math.PI * 2

      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.fillStyle = COOLDOWN_COLOR
      ctx.arc(x, y, COOLDOWN_RADIUS, Math.PI * 1.5, Math.PI * 1.5 + angle)
      ctx.fill()
    }

    // Draw EXP orbs
    const exps = expQuery(world)
    for (let i = 0; i < exps.length; i++) {
      const eid = exps[i]
      const x = Position.x[eid]
      const y = Position.y[eid]

      ctx.beginPath()
      ctx.fillStyle = 'green'
      ctx.arc(x, y, 2, 0, Math.PI * 2)
      ctx.fill()
    }

    // EXP bar
    const { experience } = world
    const progressEl = document.querySelector<HTMLProgressElement>('progress')!
    progressEl.value = experience

    // Left button
    ctx.beginPath()
    ctx.fillStyle = INPUT_VIEWER_COLOR
    if (inputs.left) ctx.fillStyle = INPUT_VIEWER_COLOR_PRESSED
    ctx.fillRect(ctx.canvas.width - 40, ctx.canvas.height - 20, 18, 18)

    // Right button
    ctx.beginPath()
    ctx.fillStyle = INPUT_VIEWER_COLOR
    if (inputs.right) ctx.fillStyle = INPUT_VIEWER_COLOR_PRESSED
    ctx.fillRect(ctx.canvas.width - 20, ctx.canvas.height - 20, 18, 18)

    return world
  }
}
