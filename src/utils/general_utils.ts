import { addMilliseconds, subDays } from 'date-fns'

/**
 * Generates a random number within a specified range.
 *
 * @param floor - The lower bound of the range (inclusive). Defaults to 1 if not provided.
 * @param ceiling - The upper bound of the range (inclusive). Defaults to the value of `floor` or 1 if not provided.
 * @returns A random number between `floor` and `ceiling`, inclusive.
 */
export const entriesGenerator = <T>(floor?: number, ceiling?: number): number => {
  if (floor === undefined && ceiling === undefined) {
    return 1
  }

  const floorNum = floor ?? 1
  const ceilingNum = ceiling ?? floor ?? 1

  return Math.floor(Math.random() * (ceilingNum - floorNum + 1)) + floorNum
}

/**
 * Selects one element from an array at random.
 *
 * @param array - The array from which to select an element.
 * @returns The randomly selected element, or `undefined` if the provided array is empty or not provided.
 */
export const getRandomElement = <T>(array?: T[]): T | undefined => {
  if (!array || array.length === 0) {
    return undefined
  }
  const randomIndex = entriesGenerator(0, array.length - 1)
  return array[randomIndex]!
}

/**
 * Selects `count` elements from an array at random.
 *
 * @param array - The array from which to select elements.
 * @param count - The number of elements to select.
 * @returns An array of length `count` containing elements randomly selected from `array`.
 */
export const getRandomElements = <T>(array: T[], count: number): T[] => {
  const shallowCopy: T[] = array.slice()
  let i = array.length
  while (--i > 0) {
    const randomIndex: number = Math.floor(Math.random() * (i + 1))
    ;[shallowCopy[i], shallowCopy[randomIndex]] = [shallowCopy[randomIndex]!, shallowCopy[i]!]
  }
  return shallowCopy.slice(0, count)
}

// generate a random date between a range of provided dates

export type DateOptions = {
  start?: Date | number
  end?: Date | number
  reference?: Date
  includeUpdated?: boolean
  chanceOfUpdate?: number
}

export const defaultOptions: Required<DateOptions> = {
  start: 180,
  end: new Date(),
  reference: new Date(),
  includeUpdated: false,
  chanceOfUpdate: 0.8,
}

/**
 * Generates a random date between a range of provided dates.
 *
 * @param options - Options object for customizing the date generation.
 * @param options.start - The start date of the range. Can be a Date object or a number of days prior to the present day.
 * @param options.end - The end date of the range. Can be a Date object or a number of days prior to the present day.
 * @param options.reference - The reference date from which to calculate the start and end dates. Defaults to the present day.
 * @param options.includeUpdated - Whether or not to include an updated date. Defaults to false.
 * @param options.chanceOfUpdate - The probability of an updated date being included. Defaults to 0.8.
 * @returns An object with a createdDate and an updatedDate. The updatedDate is null if options.includeUpdated is false.
 */
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
