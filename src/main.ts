import { addComponent, addEntity, pipe } from 'bitecs'

import './style.css'
import { TimeSystem } from './ecs/systems/TimeSystem'
import { createSnackWorld } from './ecs/SnackWorld'
import { Position } from './ecs/components/Position'
import { Velocity } from './ecs/components/Velocity'
import { RenderingSystem } from './ecs/systems/RenderingSystem'
import { MovementSystem } from './ecs/systems/MovementSystem'
import { InputSystem } from './ecs/systems/InputSystem'
import { Controlled } from './ecs/components/Controlled'
import { SteeringSystem } from './ecs/systems/SteeringSystem'
import { Unit } from './ecs/components/Unit'
import { Leader, POSITION_HISTORY_LENGTH } from './ecs/components/Leader'
import { SnakeSystem } from './ecs/systems/SnakeSystem'

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

  const pipeline = pipe(
    InputSystem(document.body),
    SteeringSystem,
    MovementSystem,
    SnakeSystem,
    RenderingSystem(ctx),
    TimeSystem
  )

  const world = createSnackWorld()
  addEntity(world)

  const eid = addEntity(world)
  addComponent(world, Unit, eid)
  addComponent(world, Leader, eid)
  addComponent(world, Position, eid)
  addComponent(world, Velocity, eid)
  addComponent(world, Controlled, eid)

  Velocity.angle[eid] = Math.PI + Math.PI / 8
  Velocity.speed[eid] = 100

  Position.x[eid] = 128
  Position.y[eid] = 128

  for (let i = 0; i < POSITION_HISTORY_LENGTH; i++) {
    Leader.previousPositions.x[eid][i] = 128
    Leader.previousPositions.y[eid][i] = 128
  }

  for (let i = 0; i < 5; i++) {
    const followerId = addEntity(world)
    addComponent(world, Unit, followerId)
    addComponent(world, Position, followerId)
    addComponent(world, Velocity, followerId)
    Leader.followers[eid][i] = followerId

    Position.x[followerId] = 128
    Position.y[followerId] = 128
  }

  function loop() {
    pipeline(world)

    requestAnimationFrame(loop)
  }

  requestAnimationFrame(loop)
}

main()
