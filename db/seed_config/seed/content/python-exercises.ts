import type { ExerciseConfig } from '../../types/seed-types'

/**
 * Python exercises for Python Fundamentals.
 *
 * These run through Pyodide rather than the JavaScript Worker. Checks are
 * Python statements evaluated with the student's module in scope, so they read
 * like the asserts you would write in a test file.
 */

export const syntaxExercise: ExerciseConfig = {
  seedSequence: 1,
  exercise_display_number: 1,
  estimated_time_minutes: 15,
  difficulty: 'easy',
  instructions: `Your first Python. Four small functions, exercising the differences from JavaScript that
the lesson covered.

In **solution.py**:

1. \`describe(name, lessons)\` returns \`"Mike has 3 lessons"\`, using an f-string. When
   \`lessons\` is 1 the word is \`lesson\`.
2. \`whole_days(minutes)\` returns the number of whole 60-minute blocks, as an \`int\`. Remember
   that \`/\` gives a float and \`//\` does not.
3. \`initials(full_name)\` turns \`"Ada Lovelace"\` into \`"AL"\`. Assume at least one word.
4. \`safe_int(text, fallback=0)\` returns the integer in \`text\`, or \`fallback\` when it is not a
   number. \`int("abc")\` raises rather than returning NaN, so catch it.`,
  code_files: {
    files: [
      {
        filename: 'solution.py',
        language: 'python',
        content: `# 1. "Mike has 3 lessons", singular when lessons == 1.
def describe(name, lessons):
    return ""


# 2. Whole 60-minute blocks, as an int.
def whole_days(minutes):
    return 0


# 3. "Ada Lovelace" -> "AL"
def initials(full_name):
    return ""


# 4. The integer in text, or fallback when it is not a number.
def safe_int(text, fallback=0):
    return fallback
`,
        isReadOnly: false,
        isHidden: false,
      },
    ],
    defaultView: 'solution.py',
  },
  tests: {
    tests: [
      {
        name: 'describe builds the sentence',
        description: 'An f-string with the name and the count.',
        testFunction: 'assert describe("Mike", 3) == "Mike has 3 lessons"',
        expectedOutput: 'Mike has 3 lessons',
      },
      {
        name: 'describe uses the singular for one lesson',
        description: 'One lesson, not one lessons.',
        testFunction: 'assert describe("Ada", 1) == "Ada has 1 lesson"',
        expectedOutput: 'Ada has 1 lesson',
      },
      {
        name: 'whole_days counts complete blocks',
        description: '150 minutes is two whole hours, not two and a half.',
        testFunction: 'assert whole_days(150) == 2',
        expectedOutput: 2,
      },
      {
        name: 'whole_days returns an int, not a float',
        description: 'Using / would give 2.5 here and 2.0 for 120. Use //.',
        testFunction: 'assert whole_days(120) == 2 and isinstance(whole_days(120), int)',
        expectedOutput: 2,
      },
      {
        name: 'initials takes the first letter of each word',
        description: 'Uppercased, joined, no separator.',
        testFunction: 'assert initials("Ada Lovelace") == "AL"',
        expectedOutput: 'AL',
      },
      {
        name: 'initials handles a single name',
        description: 'One word gives one letter.',
        testFunction: 'assert initials("Prince") == "P"',
        expectedOutput: 'P',
      },
      {
        name: 'safe_int parses a number',
        description: 'A numeric string becomes an int.',
        testFunction: 'assert safe_int("42") == 42',
        expectedOutput: 42,
      },
      {
        name: 'safe_int falls back when the text is not a number',
        description: 'int("abc") raises ValueError; catch it and return the fallback.',
        testFunction: 'assert safe_int("abc") == 0 and safe_int("abc", -1) == -1',
        expectedOutput: 0,
      },
    ],
  },
  hints: {
    hints: [
      {
        order: 1,
        type: 'code',
        content: "f\"{name} has {lessons} {'lesson' if lessons == 1 else 'lessons'}\"",
        showAfterAttempts: 1,
      },
      {
        order: 2,
        type: 'text',
        content: 'Use // for whole blocks. / always returns a float, even when it divides evenly.',
        showAfterAttempts: 2,
      },
      {
        order: 3,
        type: 'code',
        content: '"".join(word[0].upper() for word in full_name.split())',
        showAfterAttempts: 3,
      },
      {
        order: 4,
        type: 'code',
        content: 'try:\n    return int(text)\nexcept ValueError:\n    return fallback',
        showAfterAttempts: 4,
      },
    ],
  },
  default_solution: {
    content: `def describe(name, lessons):
    word = "lesson" if lessons == 1 else "lessons"
    return f"{name} has {lessons} {word}"


def whole_days(minutes):
    return minutes // 60


def initials(full_name):
    return "".join(word[0].upper() for word in full_name.split())


def safe_int(text, fallback=0):
    try:
        return int(text)
    except ValueError:
        return fallback
`,
    explanation:
      'The conditional expression in describe reads value-first, which is the reverse of a ' +
      'ternary and takes a moment to get used to. // is floor division and keeps the int, where ' +
      '/ would give 2.0 and fail the isinstance check. split() with no argument splits on any ' +
      'whitespace and drops empties, which is what you want for a name. Catching ValueError ' +
      'specifically rather than bare except means a genuine bug still surfaces.',
  },
}
