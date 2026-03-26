const wait = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

export const requestMock = async (callback, delay = 500) => {
  await wait(delay)
  return callback()
}
