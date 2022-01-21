import { SnackWorld } from './SnackWorld'

export type SnackSystem = (world: SnackWorld, ...args: any[]) => SnackWorld
