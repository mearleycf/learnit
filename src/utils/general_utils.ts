// generate a random number between two provided values inclusive
export const entriesGenerator = <T>(floor?: number, ceiling?: number): number => {
  if (floor === undefined && ceiling === undefined) {
    return 1
  }

  const floorNum = floor ?? 1
  const ceilingNum = ceiling ?? floor ?? 1

  return Math.floor(Math.random() * (ceilingNum - floorNum + 1)) + floorNum
}

// select one element from an array at random
export const getRandomElement = <T>(array?: T[]): T | undefined => {
  if (!array || array.length === 0) {
    return undefined
  }
  const randomIndex = entriesGenerator(0, array.length - 1)
  return array[randomIndex]!
}

// ====================================================================

// generate a random date between a range of provided dates
export const randomDateGenerator = (oldestDaysAgo: number, newestDaysAgo: number) => {
  const today = new Date()
  console.log(today)
}
