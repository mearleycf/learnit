import { addMilliseconds, subDays } from 'date-fns'

// generate a random number between two provided values inclusive
/* --------------------------------------------------------
Usage: entriesGenerator(floor?: number, ceiling?: number): number
- floor: the lowest possible value to generate (inclusive), default is 1 if not provided
- ceiling: the highest possible value to generate (inclusive), default is 1 if not provided
- returns: a random number between floor and ceiling, inclusive
-------------------------------------------------------- */

export const entriesGenerator = <T>(floor?: number, ceiling?: number): number => {
  if (floor === undefined && ceiling === undefined) {
    return 1
  }

  const floorNum = floor ?? 1
  const ceilingNum = ceiling ?? floor ?? 1

  return Math.floor(Math.random() * (ceilingNum - floorNum + 1)) + floorNum
}

// select one element from an array at random
/* --------------------------------------------------------
usage: getRandomElement(array: T[]): T | undefined
- array: the array from which to select an element
- returns: a randomly selected element from the array, or undefined if the array is empty
-------------------------------------------------------- */
export const getRandomElement = <T>(array?: T[]): T | undefined => {
  if (!array || array.length === 0) {
    return undefined
  }
  const randomIndex = entriesGenerator(0, array.length - 1)
  return array[randomIndex]!
}

// generate a random date between a range of provided dates
/* --------------------------------------------------------
usage: 
randomDateGenerator(options: DateOptions = {}): { createdDate: Date; updatedDate: Date | null }

options:
- start: Date | number (default: 180) - start date or number of days before the reference date
- end: Date | number (default: current date) - end date or number of days before the reference date
- reference: Date (default: current date) - reference date for the start and end dates
- includeUpdated: boolean (default: false) - whether to include an updated date
- chanceOfUpdate: number (default: 0.8) - chance of an update occurring

returns:
- createdDate: Date - a randomly generated date within the specified range
- updatedDate: Date | null - a randomly generated updated date within the specified range, or null if includeUpdated is false or the update does not occur
-------------------------------------------------------- */

type DateOptions = {
  start?: Date | number
  end?: Date | number
  reference?: Date
  includeUpdated?: boolean
  chanceOfUpdate?: number
}

const defaultOptions: Required<DateOptions> = {
  start: 180,
  end: new Date(),
  reference: new Date(),
  includeUpdated: false,
  chanceOfUpdate: 0.8,
}

export const randomDateGenerator = (options: DateOptions = {}): { createdDate: Date; updatedDate: Date | null } => {
  const mergedOptions: Required<DateOptions> = { ...defaultOptions, ...options }
  const generateRandomDate = (startDate: Date, endDate: Date): Date => {
    const timeDiff = endDate.getTime() - startDate.getTime()
    return addMilliseconds(startDate, Math.random() * timeDiff)
  }

  let startDate
  mergedOptions.start instanceof Date
    ? (startDate = mergedOptions.start)
    : (startDate = subDays(mergedOptions.reference, mergedOptions.start))

  let endDate
  mergedOptions.end instanceof Date
    ? (endDate = mergedOptions.end)
    : (endDate = subDays(mergedOptions.reference, mergedOptions.end))

  const createdDate = generateRandomDate(startDate, endDate)

  let updatedDate: Date | null = null
  if (mergedOptions.includeUpdated && Math.random() < mergedOptions.chanceOfUpdate) {
    updatedDate = generateRandomDate(createdDate, endDate)
  }

  return {
    createdDate,
    updatedDate,
  }
}
