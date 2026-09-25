---
type: exercise
title: "String Operations"
description: "Practice working with strings in Python"
access: free
entry: "strings.py"
minutes: 20
difficulty: medium
files:
  - name: "strings.py"
    language: python
---

Strings, slicing, and the methods whose names differ from JavaScript.

In **strings.py**:

1. `slugify(title)` turns `"Working With Numbers"` into `"working-with-numbers"`. Lowercase,
   words joined by hyphens, surrounding whitespace ignored.
2. `truncate(text, limit)` returns `text` unchanged when it fits, otherwise the first
   `limit` characters with `"…"` appended. The ellipsis does not count towards the limit.
3. `initials_of(names)` takes a list of full names and returns their initials joined by
   commas: `["Ada Lovelace", "Alan Turing"]` becomes `"AL, AT"`.
4. `is_palindrome(text)` ignores case and any character that is not a letter.
   `"A man, a plan, a canal: Panama"` is a palindrome.
5. `word_lengths(sentence)` returns a dict mapping each word to its length, lowercased. A
   repeated word appears once.

## file strings.py

```python
# 1. "Working With Numbers" -> "working-with-numbers"
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
```

## solution

```python
def slugify(title):
    return "-".join(title.lower().split())


def truncate(text, limit):
    if len(text) <= limit:
        return text
    return text[:limit] + "\u2026"


def initials_of(names):
    return ", ".join("".join(word[0].upper() for word in name.split()) for name in names)


def is_palindrome(text):
    cleaned = [character.lower() for character in text if character.isalpha()]
    return cleaned == cleaned[::-1]


def word_lengths(sentence):
    return {word: len(word) for word in sentence.lower().split()}
```

## explanation

split() with no argument splits on any run of whitespace and discards empties, which is why slugify needs no separate strip. The nested generator in initials_of reads oddly at first: the inner one builds one name\u2019s initials, the outer joins the names. cleaned[::-1] is a reversed copy, so comparing the two is the whole palindrome check. The dict comprehension deduplicates without effort, because a repeated key simply overwrites itself with the same value.

## check slugify lowercases and joins with hyphens

Spaces become hyphens and everything is lowercase.

```python
assert slugify("Working With Numbers") == "working-with-numbers"
```

## check slugify ignores surrounding whitespace

Leading and trailing spaces must not become hyphens.

```python
assert slugify("  Lists and Tuples  ") == "lists-and-tuples"
```

## check truncate leaves short text alone

No ellipsis when the text already fits.

```python
assert truncate("short", 10) == "short"
```

## check truncate cuts and appends an ellipsis

The ellipsis is extra, not part of the limit.

```python
assert truncate("abcdefgh", 3) == "abc\u2026"
```

## check truncate leaves text of exactly the limit alone

Equal to the limit still fits.

```python
assert truncate("abc", 3) == "abc"
```

## check initials_of joins with a comma and space

Two initials per name, names separated by ", ".

```python
assert initials_of(["Ada Lovelace", "Alan Turing"]) == "AL, AT"
```

## check initials_of handles an empty list

No names gives an empty string.

```python
assert initials_of([]) == ""
```

## check is_palindrome ignores case and punctuation

The classic example should pass.

```python
assert is_palindrome("A man, a plan, a canal: Panama") is True
```

## check is_palindrome rejects a non-palindrome

Ordinary text is not one.

```python
assert is_palindrome("hello there") is False
```

## check word_lengths maps each word once, lowercased

A repeated word appears a single time.

```python
assert word_lengths("The the cat") == {"the": 3, "cat": 3}
```

## hint after 1

```python
return "-".join(title.lower().split())
```

## hint after 2

Compare len(text) against limit first, then slice with text[:limit].

## hint after 3

```python
cleaned = [c.lower() for c in text if c.isalpha()]
```

## hint after 4

A dict comprehension over sentence.lower().split() deduplicates for free, since later keys overwrite earlier ones.
