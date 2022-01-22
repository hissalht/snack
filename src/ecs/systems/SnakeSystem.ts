import { defineQuery } from 'bitecs'
import { Leader, POSITION_HISTORY_LENGTH } from '../components/Leader'
import { Position } from '../components/Position'
import { Unit } from '../components/Unit'
import { SnackSystem } from '../SnackSystem'

const leaderQuery = defineQuery([Leader, Unit, Position])

/**
 * This system makes the non-head units of the snake "follow" the leader.
 */
export const SnakeSystem: SnackSystem = world => {
  const leaderId = leaderQuery(world)[0]

  // Fill the leader's position history
  Leader.positionHistory.x[leaderId][Leader.historyCursor[leaderId]] =
    Position.x[leaderId]
  Leader.positionHistory.y[leaderId][Leader.historyCursor[leaderId]] =
    Position.y[leaderId]
  Leader.historyCursor[leaderId] =
    (Leader.historyCursor[leaderId] + 1) % POSITION_HISTORY_LENGTH

  Leader.followers[leaderId].forEach((followerId, i) => {
    if (!followerId) {
      return
    }

    /** Index in the leader's position history to use for this follower. */
    let index = Leader.historyCursor[leaderId] - (i + 1) * 20
    if (index < 0) {
      index = POSITION_HISTORY_LENGTH + index
    }

    Position.x[followerId] = Leader.positionHistory.x[leaderId][index]
    Position.y[followerId] = Leader.positionHistory.y[leaderId][index]
  })

  return world
}
