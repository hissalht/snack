import { defineComponent, Types } from 'bitecs'

export const Health = defineComponent({
  hp: Types.i32,
  max: Types.ui32,
})
