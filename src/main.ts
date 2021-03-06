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
import { HighRollerSystem } from './ecs/systems/HighRollerSystem'
import { HighRoller } from './ecs/components/HighRoller'
import { Bounce } from './ecs/components/Bounce'
import { BouncingSystem } from './ecs/systems/BouncingSystem'
import { RemoveSystem } from './ecs/systems/RemoveSystem'
import { Health } from './ecs/components/Health'
import {
  ARENA_HEIGHT,
  ARENA_WIDTH,
  HIGHROLLER_SHOT_COOLDOWN,
  MAGNET_DISTANCE,
  MAGNET_SPEED,
} from './constants'
import { DamageSystem } from './ecs/systems/DamageSystem'
import { DeathSystem } from './ecs/systems/DeathSystem'
import { EnnemySpawnSystem } from './ecs/systems/EnnemySpawnSystem'
import { Cooldown } from './ecs/components/Cooldown'
import { Experience } from './ecs/components/Experience'
import { ExperienceSystem } from './ecs/systems/ExperienceSystem'
import { MagnetSystem } from './ecs/systems/MagnetSystem'
import { Magnet } from './ecs/components/Magnet'
import { Magnetable } from './ecs/components/Magnetable'

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

  const rect = ctx.canvas.getBoundingClientRect()
  ctx.scale(rect.width / ARENA_WIDTH, rect.height / ARENA_HEIGHT)
  ctx.save()

  const pipeline = pipe(
    InputSystem(document.body),
    SteeringSystem,
    MovementSystem,
    BouncingSystem,
    RemoveSystem,
    DamageSystem,
    DeathSystem,
    ExperienceSystem,
    MagnetSystem,
    SnakeSystem,
    HighRollerSystem,
    EnnemySpawnSystem(),
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
  addComponent(world, Magnet, eid)

  Direction.angle[eid] = Math.PI / 8
  Velocity.x[eid] = Math.cos(Direction.angle[eid]) * 100
  Velocity.y[eid] = Math.sin(Direction.angle[eid]) * 100
  Position.x[eid] = 128
  Position.y[eid] = 128
  Magnet.maxDistance[eid] = MAGNET_DISTANCE
  Magnet.speed[eid] = MAGNET_SPEED

  for (let i = 0; i < POSITION_HISTORY_LENGTH; i++) {
    Leader.positionHistory.x[eid][i] = 128
    Leader.positionHistory.y[eid][i] = 128
  }

  for (let i = 0; i < 5; i++) {
    const followerId = addEntity(world)
    addComponent(world, Unit, followerId)
    addComponent(world, Position, followerId)
    addComponent(world, Direction, followerId)
    addComponent(world, HighRoller, followerId)
    addComponent(world, Cooldown, followerId)
    addComponent(world, Health, followerId)
    Leader.followers[eid][i] = followerId

    Position.x[followerId] = 128
    Position.y[followerId] = 128

    // HighRoller.cooldown[followerId] = 1.5 + (i / 5) * 0.5
    Cooldown.default[followerId] = HIGHROLLER_SHOT_COOLDOWN
    Cooldown.value[followerId] = 1.5 + (i / 5) * 0.5

    Health.max[followerId] = 100
    Health.hp[followerId] = Math.min(100, Math.random() * 100 + 50)
  }

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const eid = addEntity(world)
      addComponent(world, Experience, eid)
      addComponent(world, Position, eid)
      addComponent(world, Velocity, eid)
      addComponent(world, Magnetable, eid)
      Position.x[eid] = i * 10
      Position.y[eid] = j * 10
    }
  }

  function loop() {
    pipeline(world)

    requestAnimationFrame(loop)
  }

  requestAnimationFrame(loop)
}

main()
