import { addComponent, addEntity } from 'bitecs'
import {
  ARENA_HEIGHT,
  ARENA_WIDTH,
  ENNEMY_MAX_HP,
  ENNEMY_SPAWN_COOLDOWN,
} from '../../constants'
import { Ennemy } from '../components/Ennemy'
import { Health } from '../components/Health'
import { Position } from '../components/Position'
import { SnackSystem } from '../SnackSystem'

export function EnnemySpawnSystem(): SnackSystem {
  let cooldown = ENNEMY_SPAWN_COOLDOWN

  return world => {
    const {
      time: { delta },
    } = world

    cooldown -= delta

    if (cooldown <= 0) {
      cooldown = ENNEMY_SPAWN_COOLDOWN

      const ennemy = addEntity(world)
      addComponent(world, Position, ennemy)
      addComponent(world, Ennemy, ennemy)
      addComponent(world, Health, ennemy)

      Position.x[ennemy] = Math.random() * ARENA_WIDTH
      Position.y[ennemy] = Math.random() * ARENA_HEIGHT

      Health.max[ennemy] = ENNEMY_MAX_HP
      Health.hp[ennemy] = ENNEMY_MAX_HP
    }

    return world
  }
}
