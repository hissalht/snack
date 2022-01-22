import { defineComponent, Types } from 'bitecs'

export const Bounce = defineComponent({
  /**
   * Maximum number of bounces before ignoring the arena borders.
   * 0 means infinite bounces.
   */
  max: Types.ui32,
  /** Current number of times the entity bounced. */
  count: Types.ui32,
})
