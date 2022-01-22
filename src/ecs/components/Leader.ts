import { defineComponent, Types } from 'bitecs'

export const POSITION_HISTORY_LENGTH = 256

export const Leader = defineComponent({
  historyCursor: Types.ui32,
  previousPositions: {
    x: [Types.f32, POSITION_HISTORY_LENGTH],
    y: [Types.f32, POSITION_HISTORY_LENGTH],
  },
  followers: [Types.eid, 8],
})