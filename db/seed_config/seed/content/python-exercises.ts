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

export const numbersExercise: ExerciseConfig = {
  seedSequence: 2,
  exercise_display_number: 1,
  estimated_time_minutes: 20,
  difficulty: 'easy',
  instructions: `Arithmetic, and the places Python differs from JavaScript.

In **numbers.py**:

1. \`split_time(minutes)\` returns \`(hours, remaining_minutes)\` as a tuple of two \`int\`s.
   \`split_time(150)\` is \`(2, 30)\`.
2. \`percent(part, whole)\` returns the percentage as an \`int\`, rounded to nearest. When
   \`whole\` is \`0\`, return \`0\` rather than dividing.
3. \`clamp(value, low, high)\` keeps a number inside a range.
4. \`average(numbers)\` returns the mean as a \`float\`, or \`0.0\` for an empty list.
5. \`is_exact(value)\` is \`True\` when a float has no fractional part. \`is_exact(3.0)\` is
   \`True\`, \`is_exact(3.5)\` is \`False\`.

Watch the int-versus-float line throughout. \`/\` always gives a float; \`//\` and \`round()\` do not.`,
  code_files: {
    files: [
      {
        filename: 'numbers.py',
        language: 'python',
        content: `# 1. (hours, remaining_minutes), both ints.
def split_time(minutes):
    return (0, 0)


# 2. Percentage as a rounded int. 0 when whole is 0.
def percent(part, whole):
    return 0


# 3. Keep value between low and high.
def clamp(value, low, high):
    return value


# 4. Mean as a float. 0.0 for an empty list.
def average(numbers):
    return 0.0


# 5. True when a float has no fractional part.
def is_exact(value):
    return False
`,
        isReadOnly: false,
        isHidden: false,
      },
    ],
    defaultView: 'numbers.py',
  },
  tests: {
    tests: [
      {
        name: 'split_time divides into hours and minutes',
        description: '150 minutes is two hours and thirty.',
        testFunction: 'assert split_time(150) == (2, 30)',
        expectedOutput: [2, 30],
      },
      {
        name: 'split_time returns ints, not floats',
        description: 'Using / here would give 2.5 hours. Use // and %.',
        testFunction: 'h, m = split_time(120)\nassert isinstance(h, int) and isinstance(m, int)',
        expectedOutput: true,
      },
      {
        name: 'split_time handles less than an hour',
        description: 'Forty minutes is zero hours and forty.',
        testFunction: 'assert split_time(40) == (0, 40)',
        expectedOutput: [0, 40],
      },
      {
        name: 'percent rounds to the nearest whole number',
        description: 'One of three is 33 percent, not 33.33.',
        testFunction: 'assert percent(1, 3) == 33 and percent(2, 3) == 67',
        expectedOutput: 33,
      },
      {
        name: 'percent returns an int',
        description: 'round() with no second argument gives an int.',
        testFunction: 'assert isinstance(percent(1, 4), int)',
        expectedOutput: true,
      },
      {
        name: 'percent avoids dividing by zero',
        description: 'A whole of zero returns 0 rather than raising.',
        testFunction: 'assert percent(5, 0) == 0',
        expectedOutput: 0,
      },
      {
        name: 'clamp keeps a value inside the range',
        description: 'Below the floor gives the floor, above the ceiling gives the ceiling.',
        testFunction: 'assert clamp(5, 0, 10) == 5 and clamp(-1, 0, 10) == 0 and clamp(99, 0, 10) == 10',
        expectedOutput: 5,
      },
      {
        name: 'average returns the mean as a float',
        description: 'The mean of 1, 2 and 3 is 2.0.',
        testFunction: 'assert average([1, 2, 3]) == 2.0 and isinstance(average([1, 2, 3]), float)',
        expectedOutput: 2,
      },
      {
        name: 'average returns 0.0 for an empty list',
        description: 'Dividing by len([]) would raise ZeroDivisionError.',
        testFunction: 'assert average([]) == 0.0',
        expectedOutput: 0,
      },
      {
        name: 'is_exact spots a whole-valued float',
        description: '3.0 has no fractional part; 3.5 does.',
        testFunction: 'assert is_exact(3.0) is True and is_exact(3.5) is False',
        expectedOutput: true,
      },
    ],
  },
  hints: {
    hints: [
      { order: 1, type: 'code', content: 'return minutes // 60, minutes % 60', showAfterAttempts: 1 },
      {
        order: 2,
        type: 'text',
        content: 'Guard the zero case with an early return before any division.',
        showAfterAttempts: 2,
      },
      { order: 3, type: 'code', content: 'return max(low, min(value, high))', showAfterAttempts: 3 },
      {
        order: 4,
        type: 'text',
        content: 'is_exact can compare the value against int(value), or use value.is_integer().',
        showAfterAttempts: 4,
      },
    ],
  },
  default_solution: {
    content: `def split_time(minutes):
    return minutes // 60, minutes % 60


def percent(part, whole):
    if whole == 0:
        return 0
    return round(part / whole * 100)


def clamp(value, low, high):
    return max(low, min(value, high))


def average(numbers):
    if not numbers:
        return 0.0
    return sum(numbers) / len(numbers)


def is_exact(value):
    return float(value).is_integer()
`,
    explanation:
      'split_time returns a bare comma-separated pair, which is already a tuple; the parentheses ' +
      'are optional. // and % keep both halves as ints where / would make them floats. round() ' +
      'with one argument returns an int, which is what the isinstance check wants. `if not ' +
      'numbers` is the idiomatic empty check, since an empty list is falsy. is_integer() is a ' +
      'float method and says exactly what the function is called.',
  },
}

export const stringsExercise: ExerciseConfig = {
  seedSequence: 3,
  exercise_display_number: 1,
  estimated_time_minutes: 20,
  difficulty: 'medium',
  instructions: `Strings, slicing, and the methods whose names differ from JavaScript.

In **strings.py**:

1. \`slugify(title)\` turns \`"Working With Numbers"\` into \`"working-with-numbers"\`. Lowercase,
   words joined by hyphens, surrounding whitespace ignored.
2. \`truncate(text, limit)\` returns \`text\` unchanged when it fits, otherwise the first
   \`limit\` characters with \`"…"\` appended. The ellipsis does not count towards the limit.
3. \`initials_of(names)\` takes a list of full names and returns their initials joined by
   commas: \`["Ada Lovelace", "Alan Turing"]\` becomes \`"AL, AT"\`.
4. \`is_palindrome(text)\` ignores case and any character that is not a letter.
   \`"A man, a plan, a canal: Panama"\` is a palindrome.
5. \`word_lengths(sentence)\` returns a dict mapping each word to its length, lowercased. A
   repeated word appears once.`,
  code_files: {
    files: [
      {
        filename: 'strings.py',
        language: 'python',
        content: `# 1. "Working With Numbers" -> "working-with-numbers"
def slugify(title):
    return ""


# 2. First limit characters plus an ellipsis, when it does not fit.
def truncate(text, limit):
    return text


# 3. ["Ada Lovelace", "Alan Turing"] -> "AL, AT"
def initials_of(names):
    return ""


# 4. Ignore case and non-letters.
def is_palindrome(text):
    return False


# 5. {word: length}, lowercased, each word once.
def word_lengths(sentence):
    return {}
`,
        isReadOnly: false,
        isHidden: false,
      },
    ],
    defaultView: 'strings.py',
  },
  tests: {
    tests: [
      {
        name: 'slugify lowercases and joins with hyphens',
        description: 'Spaces become hyphens and everything is lowercase.',
        testFunction: 'assert slugify("Working With Numbers") == "working-with-numbers"',
        expectedOutput: 'working-with-numbers',
      },
      {
        name: 'slugify ignores surrounding whitespace',
        description: 'Leading and trailing spaces must not become hyphens.',
        testFunction: 'assert slugify("  Lists and Tuples  ") == "lists-and-tuples"',
        expectedOutput: 'lists-and-tuples',
      },
      {
        name: 'truncate leaves short text alone',
        description: 'No ellipsis when the text already fits.',
        testFunction: 'assert truncate("short", 10) == "short"',
        expectedOutput: 'short',
      },
      {
        name: 'truncate cuts and appends an ellipsis',
        description: 'The ellipsis is extra, not part of the limit.',
        testFunction: 'assert truncate("abcdefgh", 3) == "abc\\u2026"',
        expectedOutput: 'abc…',
      },
      {
        name: 'truncate leaves text of exactly the limit alone',
        description: 'Equal to the limit still fits.',
        testFunction: 'assert truncate("abc", 3) == "abc"',
        expectedOutput: 'abc',
      },
      {
        name: 'initials_of joins with a comma and space',
        description: 'Two initials per name, names separated by ", ".',
        testFunction: 'assert initials_of(["Ada Lovelace", "Alan Turing"]) == "AL, AT"',
        expectedOutput: 'AL, AT',
      },
      {
        name: 'initials_of handles an empty list',
        description: 'No names gives an empty string.',
        testFunction: 'assert initials_of([]) == ""',
        expectedOutput: '',
      },
      {
        name: 'is_palindrome ignores case and punctuation',
        description: 'The classic example should pass.',
        testFunction: 'assert is_palindrome("A man, a plan, a canal: Panama") is True',
        expectedOutput: true,
      },
      {
        name: 'is_palindrome rejects a non-palindrome',
        description: 'Ordinary text is not one.',
        testFunction: 'assert is_palindrome("hello there") is False',
        expectedOutput: false,
      },
      {
        name: 'word_lengths maps each word once, lowercased',
        description: 'A repeated word appears a single time.',
        testFunction: 'assert word_lengths("The the cat") == {"the": 3, "cat": 3}',
        expectedOutput: { the: 3, cat: 3 },
      },
    ],
  },
  hints: {
    hints: [
      { order: 1, type: 'code', content: 'return "-".join(title.lower().split())', showAfterAttempts: 1 },
      {
        order: 2,
        type: 'text',
        content: 'Compare len(text) against limit first, then slice with text[:limit].',
        showAfterAttempts: 2,
      },
      {
        order: 3,
        type: 'code',
        content: 'cleaned = [c.lower() for c in text if c.isalpha()]',
        showAfterAttempts: 3,
      },
      {
        order: 4,
        type: 'text',
        content:
          'A dict comprehension over sentence.lower().split() deduplicates for free, since later keys overwrite earlier ones.',
        showAfterAttempts: 4,
      },
    ],
  },
  default_solution: {
    content: `def slugify(title):
    return "-".join(title.lower().split())


def truncate(text, limit):
    if len(text) <= limit:
        return text
    return text[:limit] + "\\u2026"


def initials_of(names):
    return ", ".join("".join(word[0].upper() for word in name.split()) for name in names)


def is_palindrome(text):
    cleaned = [character.lower() for character in text if character.isalpha()]
    return cleaned == cleaned[::-1]


def word_lengths(sentence):
    return {word: len(word) for word in sentence.lower().split()}
`,
    explanation:
      'split() with no argument splits on any run of whitespace and discards empties, which is ' +
      'why slugify needs no separate strip. The nested generator in initials_of reads oddly at ' +
      'first: the inner one builds one name\\u2019s initials, the outer joins the names. ' +
      'cleaned[::-1] is a reversed copy, so comparing the two is the whole palindrome check. ' +
      'The dict comprehension deduplicates without effort, because a repeated key simply ' +
      'overwrites itself with the same value.',
  },
}

export const listsExercise: ExerciseConfig = {
  seedSequence: 4,
  exercise_display_number: 1,
  estimated_time_minutes: 25,
  difficulty: 'medium',
  instructions: `Comprehensions, dictionaries and sets, over the same lesson catalogue as the JavaScript course.

**catalogue.py** (read only) exports \`LESSONS\`, a list of dicts with \`title\`, \`minutes\`,
\`done\` and \`tags\`.

In **lists.py**:

1. \`titles(lessons)\` returns every title, in order.
2. \`unfinished(lessons)\` returns the lessons that are not done.
3. \`by_tag(lessons)\` returns a dict mapping each tag to the titles carrying it, in the order
   the lessons appear.
4. \`all_tags(lessons)\` returns every tag, deduplicated and sorted.
5. \`longest_title(lessons)\` returns the longest title, breaking a tie by taking the earlier one.
   An empty list gives \`None\`.

Write 1, 2 and 4 as comprehensions. You could use loops; the point is to get comfortable with
the shape.`,
  code_files: {
    files: [
      {
        filename: 'catalogue.py',
        language: 'python',
        content: `# The lessons your functions are asked about. You do not need to change this.

LESSONS = [
    {"title": "Arrays", "minutes": 40, "done": False, "tags": ["data", "core"]},
    {"title": "Variables", "minutes": 20, "done": True, "tags": ["core"]},
    {"title": "Objects", "minutes": 25, "done": False, "tags": ["data", "core"]},
    {"title": "Functions", "minutes": 35, "done": True, "tags": ["core", "logic"]},
]
`,
        isReadOnly: true,
        isHidden: false,
      },
      {
        filename: 'lists.py',
        language: 'python',
        content: `from catalogue import LESSONS


# 1. Every title, in order. A comprehension.
def titles(lessons):
    return []


# 2. The lessons that are not done. A comprehension.
def unfinished(lessons):
    return []


# 3. {tag: [titles]}, in the order the lessons appear.
def by_tag(lessons):
    return {}


# 4. Every tag, deduplicated and sorted. A comprehension plus a set.
def all_tags(lessons):
    return []


# 5. The longest title, earliest on a tie. None when empty.
def longest_title(lessons):
    return None
`,
        isReadOnly: false,
        isHidden: false,
      },
    ],
    defaultView: 'lists.py',
  },
  tests: {
    tests: [
      {
        name: 'titles returns every title in order',
        description: 'Order follows the input, not the alphabet.',
        testFunction: 'assert titles(LESSONS) == ["Arrays", "Variables", "Objects", "Functions"]',
        expectedOutput: ['Arrays', 'Variables', 'Objects', 'Functions'],
      },
      {
        name: 'titles handles an empty list',
        description: 'No lessons gives no titles.',
        testFunction: 'assert titles([]) == []',
        expectedOutput: [],
      },
      {
        name: 'unfinished keeps only lessons that are not done',
        description: 'Two of the four seeded lessons are unfinished.',
        testFunction: 'assert [l["title"] for l in unfinished(LESSONS)] == ["Arrays", "Objects"]',
        expectedOutput: ['Arrays', 'Objects'],
      },
      {
        name: 'by_tag groups titles under every tag',
        description: 'A lesson with two tags appears under both.',
        testFunction:
          'assert by_tag([{"title": "A", "tags": ["x", "y"]}, {"title": "B", "tags": ["x"]}]) == {"x": ["A", "B"], "y": ["A"]}',
        expectedOutput: { x: ['A', 'B'], y: ['A'] },
      },
      {
        name: 'by_tag keeps the order the lessons appear in',
        description: 'Not alphabetical, and not reversed.',
        testFunction:
          'assert by_tag([{"title": "Zed", "tags": ["x"]}, {"title": "Amy", "tags": ["x"]}])["x"] == ["Zed", "Amy"]',
        expectedOutput: ['Zed', 'Amy'],
      },
      {
        name: 'by_tag returns an empty dict for an empty list',
        description: 'No lessons means no tags.',
        testFunction: 'assert by_tag([]) == {}',
        expectedOutput: {},
      },
      {
        name: 'all_tags deduplicates and sorts',
        description: 'Each tag once, alphabetically.',
        testFunction: 'assert all_tags(LESSONS) == ["core", "data", "logic"]',
        expectedOutput: ['core', 'data', 'logic'],
      },
      {
        name: 'all_tags returns a list, not a set',
        description: 'Sorted output has to be a list; a set has no order.',
        testFunction: 'assert isinstance(all_tags(LESSONS), list)',
        expectedOutput: true,
      },
      {
        name: 'longest_title picks the longest',
        description: 'Variables is nine characters, the longest of the four.',
        testFunction: 'assert longest_title(LESSONS) == "Variables"',
        expectedOutput: 'Variables',
      },
      {
        name: 'longest_title keeps the earlier one on a tie',
        description: 'Two titles of equal length: the first wins.',
        testFunction: 'assert longest_title([{"title": "abc"}, {"title": "xyz"}]) == "abc"',
        expectedOutput: 'abc',
      },
      {
        name: 'longest_title returns None for an empty list',
        description: 'Nothing to pick.',
        testFunction: 'assert longest_title([]) is None',
        expectedOutput: null,
      },
    ],
  },
  hints: {
    hints: [
      { order: 1, type: 'code', content: 'return [lesson["title"] for lesson in lessons]', showAfterAttempts: 1 },
      {
        order: 2,
        type: 'code',
        content: 'groups.setdefault(tag, []).append(lesson["title"])',
        showAfterAttempts: 2,
      },
      {
        order: 3,
        type: 'code',
        content: 'return sorted({tag for lesson in lessons for tag in lesson["tags"]})',
        showAfterAttempts: 3,
      },
      {
        order: 4,
        type: 'text',
        content:
          'max() with a key takes the first maximum it meets, which is the tie rule you want. Guard the empty case first.',
        showAfterAttempts: 4,
      },
    ],
  },
  default_solution: {
    content: `from catalogue import LESSONS


def titles(lessons):
    return [lesson["title"] for lesson in lessons]


def unfinished(lessons):
    return [lesson for lesson in lessons if not lesson["done"]]


def by_tag(lessons):
    groups = {}
    for lesson in lessons:
        for tag in lesson["tags"]:
            groups.setdefault(tag, []).append(lesson["title"])
    return groups


def all_tags(lessons):
    return sorted({tag for lesson in lessons for tag in lesson["tags"]})


def longest_title(lessons):
    if not lessons:
        return None
    return max(lessons, key=lambda lesson: len(lesson["title"]))["title"]
`,
    explanation:
      'setdefault creates the list the first time a tag appears and returns it either way, which ' +
      'is the idiomatic grouping line. The set comprehension in all_tags has two for clauses, ' +
      'read left to right as nested loops, and sorted() turns the set back into an ordered list. ' +
      'max() returns the first maximum it encounters, so the tie rule falls out rather than ' +
      'needing a comparison.',
  },
}

export const functionsExercise: ExerciseConfig = {
  seedSequence: 5,
  exercise_display_number: 1,
  estimated_time_minutes: 20,
  difficulty: 'medium',
  instructions: `Default arguments, keyword-only parameters, and the shared-mutable-default trap.

In **functions.py**:

1. \`add_tag(tag, tags=None)\` appends \`tag\` and returns the list. Calling it twice with no
   \`tags\` must give \`["a"]\` then \`["b"]\`, not \`["a", "b"]\`. This is the mutable default trap
   from the lesson.
2. \`format_row(title, *, minutes=0, done=False)\` returns \`"Arrays (40 min) [done]"\`, dropping
   the bracket when not done. \`minutes\` and \`done\` must be keyword-only.
3. \`summarise(**fields)\` turns keyword arguments into \`"key=value"\` pairs joined by \`", "\`,
   sorted by key.
4. \`apply_all(value, *functions)\` passes \`value\` through each function in turn and returns
   the result. No functions returns the value unchanged.`,
  code_files: {
    files: [
      {
        filename: 'functions.py',
        language: 'python',
        content: `# 1. Append and return. Must not share a list between calls.
def add_tag(tag, tags=None):
    return []


# 2. "Arrays (40 min) [done]". minutes and done are keyword-only.
def format_row(title):
    return ""


# 3. Keyword arguments as "key=value", joined by ", ", sorted by key.
def summarise(**fields):
    return ""


# 4. Pass value through each function in turn.
def apply_all(value, *functions):
    return value
`,
        isReadOnly: false,
        isHidden: false,
      },
    ],
    defaultView: 'functions.py',
  },
  tests: {
    tests: [
      {
        name: 'add_tag appends to a supplied list',
        description: 'The given list comes back with the tag on the end.',
        testFunction: 'assert add_tag("b", ["a"]) == ["a", "b"]',
        expectedOutput: ['a', 'b'],
      },
      {
        name: 'add_tag does not share a list between calls',
        description: 'The mutable default trap. Two bare calls must not accumulate.',
        testFunction: 'assert add_tag("a") == ["a"]\nassert add_tag("b") == ["b"]',
        expectedOutput: ['b'],
      },
      {
        name: 'format_row builds the row',
        description: 'Title, minutes in parentheses, and the done marker.',
        testFunction: 'assert format_row("Arrays", minutes=40, done=True) == "Arrays (40 min) [done]"',
        expectedOutput: 'Arrays (40 min) [done]',
      },
      {
        name: 'format_row drops the marker when not done',
        description: 'No trailing bracket, and no trailing space either.',
        testFunction: 'assert format_row("Arrays", minutes=40) == "Arrays (40 min)"',
        expectedOutput: 'Arrays (40 min)',
      },
      {
        name: 'minutes and done are keyword-only',
        description: 'Passing them positionally must raise TypeError.',
        testFunction:
          'try:\n    format_row("Arrays", 40)\n    raise AssertionError("minutes should be keyword-only")\nexcept TypeError:\n    pass',
        expectedOutput: 'TypeError',
      },
      {
        name: 'summarise formats and sorts the pairs',
        description: 'Sorted by key, joined by comma and space.',
        testFunction: 'assert summarise(minutes=40, title="Arrays") == "minutes=40, title=Arrays"',
        expectedOutput: 'minutes=40, title=Arrays',
      },
      {
        name: 'summarise handles no arguments',
        description: 'Nothing passed gives an empty string.',
        testFunction: 'assert summarise() == ""',
        expectedOutput: '',
      },
      {
        name: 'apply_all chains the functions in order',
        description: 'Each result feeds the next.',
        testFunction: 'assert apply_all(3, lambda n: n + 1, lambda n: n * 2) == 8',
        expectedOutput: 8,
      },
      {
        name: 'apply_all with no functions returns the value',
        description: 'Nothing to apply means nothing changes.',
        testFunction: 'assert apply_all("x") == "x"',
        expectedOutput: 'x',
      },
    ],
  },
  hints: {
    hints: [
      {
        order: 1,
        type: 'code',
        content: 'if tags is None:\n    tags = []',
        showAfterAttempts: 1,
      },
      {
        order: 2,
        type: 'code',
        content: 'def format_row(title, *, minutes=0, done=False):',
        showAfterAttempts: 2,
      },
      {
        order: 3,
        type: 'code',
        content: '", ".join(f"{k}={v}" for k, v in sorted(fields.items()))',
        showAfterAttempts: 3,
      },
      {
        order: 4,
        type: 'text',
        content: 'apply_all is a loop reassigning value, or a reduce over the functions.',
        showAfterAttempts: 4,
      },
    ],
  },
  default_solution: {
    content: `def add_tag(tag, tags=None):
    if tags is None:
        tags = []
    tags.append(tag)
    return tags


def format_row(title, *, minutes=0, done=False):
    row = f"{title} ({minutes} min)"
    return f"{row} [done]" if done else row


def summarise(**fields):
    return ", ".join(f"{key}={value}" for key, value in sorted(fields.items()))


def apply_all(value, *functions):
    for function in functions:
        value = function(value)
    return value
`,
    explanation:
      'The None default is the whole fix for the shared-list trap: the new list is built on each ' +
      'call rather than once at definition. The bare * in format_row forces everything after it ' +
      'to be passed by name, which is what makes the positional call raise. sorted() on ' +
      'dict.items() sorts by key, since tuples compare element by element. apply_all is a plain ' +
      'loop, which reads better here than functools.reduce would.',
  },
}

export const decoratorsExercise: ExerciseConfig = {
  seedSequence: 6,
  exercise_display_number: 1,
  estimated_time_minutes: 25,
  difficulty: 'hard',
  instructions: `Decorators and generators, the two pieces of Python with no everyday JavaScript equivalent.

In **advanced.py**:

1. \`counted(fn)\` is a decorator returning a wrapper that forwards everything and exposes a
   \`.calls\` count of how many times it ran. Use \`functools.wraps\` so the wrapper keeps the
   original's \`__name__\`.
2. \`memoized(fn)\` caches by the positional arguments. A repeat call must not run \`fn\` again.
   Expose the cache dict as \`.cache\`.
3. \`take(iterable, n)\` is a generator yielding at most the first \`n\` items. It must not
   consume more of the iterable than it needs.
4. \`chunks(items, size)\` yields lists of \`size\` items, the last possibly shorter.`,
  code_files: {
    files: [
      {
        filename: 'advanced.py',
        language: 'python',
        content: `import functools


# 1. Decorator exposing .calls. Keep the original __name__ with functools.wraps.
def counted(fn):
    return fn


# 2. Cache by positional arguments. Expose the dict as .cache.
def memoized(fn):
    return fn


# 3. Generator yielding at most the first n items, consuming no more than needed.
def take(iterable, n):
    return iter(())


# 4. Yield lists of size items; the last may be shorter.
def chunks(items, size):
    return iter(())
`,
        isReadOnly: false,
        isHidden: false,
      },
    ],
    defaultView: 'advanced.py',
  },
  tests: {
    tests: [
      {
        name: 'counted forwards arguments and the result',
        description: 'The wrapper behaves exactly like the function it wraps.',
        testFunction: '@counted\ndef add(a, b):\n    return a + b\nassert add(1, 2) == 3',
        expectedOutput: 3,
      },
      {
        name: 'counted tracks how many times it ran',
        description: 'A .calls attribute on the wrapper.',
        testFunction: '@counted\ndef noop():\n    pass\nnoop()\nnoop()\nassert noop.calls == 2',
        expectedOutput: 2,
      },
      {
        name: 'counted keeps the original name',
        description: 'Without functools.wraps this reports "wrapper".',
        testFunction: '@counted\ndef greet():\n    pass\nassert greet.__name__ == "greet"',
        expectedOutput: 'greet',
      },
      {
        name: 'memoized returns the cached result',
        description: 'A second call with the same arguments must not run the function.',
        testFunction:
          'runs = []\n@memoized\ndef slow(n):\n    runs.append(n)\n    return n * 2\nassert slow(2) == 4\nassert slow(2) == 4\nassert len(runs) == 1',
        expectedOutput: 1,
      },
      {
        name: 'memoized recomputes for different arguments',
        description: 'A new key means a real call.',
        testFunction:
          'runs = []\n@memoized\ndef f(n):\n    runs.append(n)\n    return n\nf(1)\nf(2)\nassert len(runs) == 2',
        expectedOutput: 2,
      },
      {
        name: 'memoized exposes its cache',
        description: 'A dict on .cache, keyed by the positional arguments.',
        testFunction: '@memoized\ndef double(n):\n    return n * 2\ndouble(3)\nassert double.cache[(3,)] == 6',
        expectedOutput: 6,
      },
      {
        name: 'take yields at most n items',
        description: 'Three from a longer sequence.',
        testFunction: 'assert list(take([1, 2, 3, 4, 5], 3)) == [1, 2, 3]',
        expectedOutput: [1, 2, 3],
      },
      {
        name: 'take stops early when the iterable is shorter',
        description: 'Asking for more than there is gives everything.',
        testFunction: 'assert list(take([1, 2], 5)) == [1, 2]',
        expectedOutput: [1, 2],
      },
      {
        name: 'take does not consume more than it needs',
        description: 'From an infinite generator, taking three must terminate.',
        testFunction:
          'def forever():\n    n = 0\n    while True:\n        yield n\n        n += 1\nassert list(take(forever(), 3)) == [0, 1, 2]',
        expectedOutput: [0, 1, 2],
      },
      {
        name: 'chunks splits into equal lists',
        description: 'Six items in twos gives three lists.',
        testFunction: 'assert list(chunks([1, 2, 3, 4, 5, 6], 2)) == [[1, 2], [3, 4], [5, 6]]',
        expectedOutput: [
          [1, 2],
          [3, 4],
          [5, 6],
        ],
      },
      {
        name: 'chunks leaves a short final list',
        description: 'Five items in twos ends with a single.',
        testFunction: 'assert list(chunks([1, 2, 3, 4, 5], 2)) == [[1, 2], [3, 4], [5]]',
        expectedOutput: [[1, 2], [3, 4], [5]],
      },
    ],
  },
  hints: {
    hints: [
      {
        order: 1,
        type: 'code',
        content:
          '@functools.wraps(fn)\ndef wrapper(*args, **kwargs):\n    wrapper.calls += 1\n    return fn(*args, **kwargs)\nwrapper.calls = 0\nreturn wrapper',
        showAfterAttempts: 1,
      },
      {
        order: 2,
        type: 'text',
        content:
          'Key the cache on the args tuple. Check membership with `in`, not truthiness, so a cached 0 still counts.',
        showAfterAttempts: 2,
      },
      {
        order: 3,
        type: 'text',
        content: 'A function containing yield is already a generator. Loop and break once you have yielded n.',
        showAfterAttempts: 3,
      },
      {
        order: 4,
        type: 'code',
        content: 'for start in range(0, len(items), size):\n    yield items[start:start + size]',
        showAfterAttempts: 4,
      },
    ],
  },
  default_solution: {
    content: `import functools


def counted(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        wrapper.calls += 1
        return fn(*args, **kwargs)

    wrapper.calls = 0
    return wrapper


def memoized(fn):
    cache = {}

    @functools.wraps(fn)
    def wrapper(*args):
        if args not in cache:
            cache[args] = fn(*args)
        return cache[args]

    wrapper.cache = cache
    return wrapper


def take(iterable, n):
    for index, item in enumerate(iterable):
        if index >= n:
            return
        yield item


def chunks(items, size):
    for start in range(0, len(items), size):
        yield items[start:start + size]
`,
    explanation:
      'The counter lives on the wrapper rather than in a closure variable, which is what makes ' +
      '.calls readable from outside. functools.wraps copies __name__ and the docstring across, ' +
      'without which every traceback says "wrapper". The args tuple is hashable, so it works as ' +
      'a dict key directly, and `not in` rather than a truthiness test means a cached 0 is still ' +
      'a hit. take returns rather than breaking, which ends the generator; because it is a ' +
      'generator, nothing is pulled from the iterable until asked for, which is what lets it ' +
      'work on an infinite one.',
  },
}

export const modulesExercise: ExerciseConfig = {
  seedSequence: 7,
  exercise_display_number: 1,
  estimated_time_minutes: 25,
  difficulty: 'medium',
  instructions: `Split code across modules, the way a real project does.

Three files. **formatting.py** and **timing.py** are written for you and read only.
**report.py** is yours, and it imports from both.

1. Import \`pluralise\` and \`titlecase\` from \`formatting\`, and \`humanise\` from \`timing\`.
2. Export \`line(lesson)\` returning \`"Arrays — 40 minutes"\`, with the title titlecased and
   the duration humanised. A lesson is \`{"title": ..., "minutes": ...}\`.
3. Export \`report(lessons)\` returning one line per lesson, joined by newlines, with a final
   summary line \`"3 lessons, 1 hour 35 minutes total"\`. Pluralise "lesson" correctly.
4. Export \`MODULE_NAME\`, set to this module's own \`__name__\`. It should be \`"report"\` when
   imported, which is what the check asserts.`,
  code_files: {
    files: [
      {
        filename: 'formatting.py',
        language: 'python',
        content: `# Text helpers. You do not need to change this file.


def pluralise(count, word):
    return word if count == 1 else word + "s"


def titlecase(text):
    return " ".join(part.capitalize() for part in text.split())
`,
        isReadOnly: true,
        isHidden: false,
      },
      {
        filename: 'timing.py',
        language: 'python',
        content: `# Duration helpers. You do not need to change this file.

from formatting import pluralise


def humanise(minutes):
    """40 -> "40 minutes"; 95 -> "1 hour 35 minutes"; 60 -> "1 hour"."""
    hours, rest = divmod(minutes, 60)
    parts = []
    if hours:
        parts.append(f"{hours} {pluralise(hours, 'hour')}")
    if rest or not hours:
        parts.append(f"{rest} {pluralise(rest, 'minute')}")
    return " ".join(parts)
`,
        isReadOnly: true,
        isHidden: false,
      },
      {
        filename: 'report.py',
        language: 'python',
        content: `# 1. Import pluralise and titlecase from formatting, humanise from timing.


# 4. This module's own __name__.
MODULE_NAME = ""


# 2. "Arrays — 40 minutes", titlecased and humanised.
def line(lesson):
    return ""


# 3. One line per lesson, then a summary line.
def report(lessons):
    return ""
`,
        isReadOnly: false,
        isHidden: false,
      },
    ],
    defaultView: 'report.py',
  },
  tests: {
    tests: [
      {
        name: 'the helper modules import cleanly',
        description: 'formatting and timing are available, and timing uses formatting.',
        testFunction:
          'from timing import humanise\nfrom formatting import titlecase\nassert humanise(95) == "1 hour 35 minutes"\nassert titlecase("array methods") == "Array Methods"',
        expectedOutput: '1 hour 35 minutes',
      },
      {
        name: 'line formats a single lesson',
        description: 'Title titlecased, an em dash, then the humanised duration.',
        testFunction: 'assert line({"title": "arrays", "minutes": 40}) == "Arrays \\u2014 40 minutes"',
        expectedOutput: 'Arrays — 40 minutes',
      },
      {
        name: 'line humanises an hour or more',
        description: 'Ninety-five minutes reads as one hour thirty-five.',
        testFunction: 'assert line({"title": "objects", "minutes": 95}) == "Objects \\u2014 1 hour 35 minutes"',
        expectedOutput: 'Objects — 1 hour 35 minutes',
      },
      {
        name: 'report lists every lesson',
        description: 'One line each, newline separated.',
        testFunction:
          'out = report([{"title": "a", "minutes": 10}, {"title": "b", "minutes": 20}])\nassert out.split("\\n")[0] == "A \\u2014 10 minutes"\nassert out.split("\\n")[1] == "B \\u2014 20 minutes"',
        expectedOutput: 'A — 10 minutes',
      },
      {
        name: 'report ends with a summary line',
        description: 'Count, the word lessons, and the total duration.',
        testFunction:
          'out = report([{"title": "a", "minutes": 40}, {"title": "b", "minutes": 35}, {"title": "c", "minutes": 20}])\nassert out.split("\\n")[-1] == "3 lessons, 1 hour 35 minutes total"',
        expectedOutput: '3 lessons, 1 hour 35 minutes total',
      },
      {
        name: 'report uses the singular for one lesson',
        description: 'One lesson, not one lessons.',
        testFunction:
          'out = report([{"title": "a", "minutes": 10}])\nassert out.split("\\n")[-1] == "1 lesson, 10 minutes total"',
        expectedOutput: '1 lesson, 10 minutes total',
      },
      {
        name: 'MODULE_NAME is the module’s own name',
        description: '__name__ is "report" when the module is imported.',
        testFunction: 'assert MODULE_NAME == "report"',
        expectedOutput: 'report',
      },
    ],
  },
  hints: {
    hints: [
      {
        order: 1,
        type: 'code',
        content: 'from formatting import pluralise, titlecase\nfrom timing import humanise',
        showAfterAttempts: 1,
      },
      { order: 2, type: 'code', content: 'MODULE_NAME = __name__', showAfterAttempts: 2 },
      {
        order: 3,
        type: 'code',
        content: "f\"{titlecase(lesson['title'])} \\u2014 {humanise(lesson['minutes'])}\"",
        showAfterAttempts: 3,
      },
      {
        order: 4,
        type: 'text',
        content: 'Build the lines with a comprehension, append the summary, then join the whole list with newlines.',
        showAfterAttempts: 4,
      },
    ],
  },
  default_solution: {
    content: `from formatting import pluralise, titlecase
from timing import humanise

MODULE_NAME = __name__


def line(lesson):
    return f"{titlecase(lesson['title'])} \\u2014 {humanise(lesson['minutes'])}"


def report(lessons):
    lines = [line(lesson) for lesson in lessons]
    total = sum(lesson["minutes"] for lesson in lessons)
    count = len(lessons)
    lines.append(f"{count} {pluralise(count, 'lesson')}, {humanise(total)} total")
    return "\\n".join(lines)
`,
    explanation:
      'The imports are plain module-level imports, exactly as they would be on disk; nothing ' +
      'about running in a browser changes them. __name__ is a module-level name Python sets for ' +
      'you, which is the same mechanism behind the `if __name__ == "__main__"` guard. Note the ' +
      'single quotes inside the f-string: the outer string uses double quotes, so the dict key ' +
      'has to use the other kind.',
  },
}
