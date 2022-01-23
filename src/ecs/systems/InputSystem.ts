import { INPUT_LEFT_KEYS, INPUT_RIGHT_KEYS } from '../../constants'
import { SnackSystem } from '../SnackSystem'

type QueuedKeyEvent = ['keydown' | 'keyup', string]

/**
 * Create a system updating the `inputs` property of the world.
 * @param domEl Element to which attach the keyboard event listeners
 */
export function InputSystem(domEl: HTMLElement): SnackSystem {
  const queue: Array<QueuedKeyEvent> = []

  domEl.addEventListener('keydown', e => {
    // e.preventDefault()
    queue.push(['keydown', e.key])
  })

  domEl.addEventListener('keyup', e => {
    // e.preventDefault()
    queue.push(['keyup', e.key])
  })

  return world => {
    while (queue.length) {
      const [eventType, key] = queue.shift()!

      if (INPUT_LEFT_KEYS.includes(key)) {
        world.inputs.left = eventType === 'keydown'
      } else if (INPUT_RIGHT_KEYS.includes(key)) {
        world.inputs.right = eventType === 'keydown'
      }
    }
    return world
  }
}
