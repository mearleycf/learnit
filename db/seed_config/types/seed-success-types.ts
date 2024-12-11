// type for return value
export type SeededCourse = {
id: string
createdAt: Date
updatedAt: Date | null
title: string
seedSequence: number
dateConfig: {
    createdAt: Date
    updatedAt: Date | null
}
}
