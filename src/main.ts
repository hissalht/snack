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
import { Direction } from './ecs/components/Direction'
import { ShootingSystem } from './ecs/systems/ShootingSystem'
import { HighRoller } from './ecs/components/HighRoller'
import { Bounce } from './ecs/components/Bounce'
import { BouncingSystem } from './ecs/systems/BouncingSystem'
import { Projectile } from './ecs/components/Projectile'

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
    BouncingSystem,
    SnakeSystem,
    ShootingSystem,
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
  addComponent(world, Direction, eid)
  addComponent(world, Controlled, eid)
  addComponent(world, Bounce, eid)

  Direction.angle[eid] = Math.PI / 8
  Velocity.x[eid] = Math.cos(Direction.angle[eid]) * 100
  Velocity.y[eid] = Math.sin(Direction.angle[eid]) * 100
  Position.x[eid] = 128
  Position.y[eid] = 128

  for (let i = 0; i < POSITION_HISTORY_LENGTH; i++) {
    Leader.positionHistory.x[eid][i] = 128
    Leader.positionHistory.y[eid][i] = 128
  }

  for (let i = 0; i < 1; i++) {
    const followerId = addEntity(world)
    addComponent(world, Unit, followerId)
    addComponent(world, Position, followerId)
    addComponent(world, Direction, followerId)
    addComponent(world, HighRoller, followerId)
    Leader.followers[eid][i] = followerId

    Position.x[followerId] = 128
    Position.y[followerId] = 128

    HighRoller.cooldown[followerId] = 1.5 // Wait half a sec before shooting the first bullet
  }

  // {
  //   const bullet = addEntity(world)
  //   addComponent(world, Projectile, bullet)
  //   addComponent(world, Position, bullet)
  //   addComponent(world, Velocity, bullet)
  //   addComponent(world, Bounce, bullet)

  //   // Set bullet position
  //   Position.x[bullet] = 128
  //   Position.y[bullet] = 128

  //   // Set bullet velocity
  //   const angle = Math.random() * Math.PI * 2
  //   Velocity.x[bullet] = Math.cos(angle) * 200
  //   Velocity.y[bullet] = Math.sin(angle) * 200

  //   // Set max number of bounces
  //   Bounce.max[bullet] = 3
  // }
  // {
  //   const bullet = addEntity(world)
  //   addComponent(world, Projectile, bullet)
  //   addComponent(world, Position, bullet)
  //   addComponent(world, Velocity, bullet)
  //   addComponent(world, Bounce, bullet)

  //   // Set bullet position
  //   Position.x[bullet] = 128
  //   Position.y[bullet] = 128

  //   // Set bullet velocity
  //   const angle = Math.random() * Math.PI * 2
  //   Velocity.x[bullet] = Math.cos(angle) * 200
  //   Velocity.y[bullet] = Math.sin(angle) * 200

  //   // Set max number of bounces
  //   Bounce.max[bullet] = 3
  // }

  function loop() {
    pipeline(world)

    requestAnimationFrame(loop)
  }

  requestAnimationFrame(loop)
}

main()
