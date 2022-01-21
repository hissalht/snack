import { addComponent, addEntity, createWorld, IWorld, pipe } from 'bitecs'

import './style.css'
import { TimeSystem } from './ecs/systems/TimeSystem'
import { createSnackWorld } from './ecs/SnackWorld'
import { Position } from './ecs/components/Position'
import { Velocity } from './ecs/components/Velocity'
import { RenderingSystem } from './ecs/systems/RenderingSystem'
import { MovementSystem } from './ecs/systems/MovementSystem'

function getContext(): CanvasRenderingContext2D {
  const canvas = document.querySelector<HTMLCanvasElement>('#app')!
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Cannot initialize rendering context')
  }

  return ctx
}

function main() {
  const ctx = getContext()

  ctx.beginPath()
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  const pipeline = pipe(MovementSystem, RenderingSystem(ctx), TimeSystem)

  const world = createSnackWorld()
  const eid = addEntity(world)
  addComponent(world, Position, eid)
  addComponent(world, Velocity, eid)

  Velocity.x[eid] = 5
  Velocity.y[eid] = 10

  function loop() {
    pipeline(world)

    requestAnimationFrame(loop)
  }

  requestAnimationFrame(loop)
}

main()
