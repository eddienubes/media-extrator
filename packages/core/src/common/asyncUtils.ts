/**
 * Waits for the given number of milliseconds.
 * If no number is provided, it doesn't resolve at all (infinite promise).
 * @param ms
 */
export const waitForMs = (ms?: number) =>
  new Promise((resolve) => {
    if (ms !== undefined) {
      setTimeout(resolve, ms)
    }
  })
