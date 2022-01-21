import { SnackSystem } from '../SnackSystem'

type QueuedKeyEvent = ['keydown' | 'keyup', string]

/**
 * Create a system updating the `inputs` property of the world.
 * @param domEl Element to which attach the keyboard event listeners
 */
export function InputSystem(domEl: HTMLElement): SnackSystem {
  const queue: Array<QueuedKeyEvent> = []

  domEl.addEventListener('keydown', e => {
    queue.push(['keydown', e.key])
  })

  domEl.addEventListener('keyup', e => {
    queue.push(['keyup', e.key])
  })

  return world => {
    while (queue.length) {
      const [eventType, key] = queue.shift()!

      if (key === 'ArrowLeft') {
        world.inputs.left = eventType === 'keydown'
      } else if (key === 'ArrowRight') {
        world.inputs.right = eventType === 'keydown'
      }
    }
    return world
  }
}
