---
type: exercise
title: "Working with Numbers"
description: "Practice working with numerical data in Python"
access: free
entry: "numbers.py"
minutes: 20
difficulty: easy
files:
  - name: "numbers.py"
    language: python
---

Arithmetic, and the places Python differs from JavaScript.

In **numbers.py**:

1. `split_time(minutes)` returns `(hours, remaining_minutes)` as a tuple of two `int`s.
   `split_time(150)` is `(2, 30)`.
2. `percent(part, whole)` returns the percentage as an `int`, rounded to nearest. When
   `whole` is `0`, return `0` rather than dividing.
3. `clamp(value, low, high)` keeps a number inside a range.
4. `average(numbers)` returns the mean as a `float`, or `0.0` for an empty list.
5. `is_exact(value)` is `True` when a float has no fractional part. `is_exact(3.0)` is
   `True`, `is_exact(3.5)` is `False`.

Watch the int-versus-float line throughout. `/` always gives a float; `//` and `round()` do not.

## file numbers.py

```python
# 1. (hours, remaining_minutes), both ints.
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
```

## solution

```python
def split_time(minutes):
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
```

## explanation

split_time returns a bare comma-separated pair, which is already a tuple; the parentheses are optional. // and % keep both halves as ints where / would make them floats. round() with one argument returns an int, which is what the isinstance check wants. `if not numbers` is the idiomatic empty check, since an empty list is falsy. is_integer() is a float method and says exactly what the function is called.

## check split_time divides into hours and minutes

150 minutes is two hours and thirty.

```python
assert split_time(150) == (2, 30)
```

## check split_time returns ints, not floats

Using / here would give 2.5 hours. Use // and %.

```python
h, m = split_time(120)
assert isinstance(h, int) and isinstance(m, int)
```

## check split_time handles less than an hour

Forty minutes is zero hours and forty.

```python
assert split_time(40) == (0, 40)
```

## check percent rounds to the nearest whole number

One of three is 33 percent, not 33.33.

```python
assert percent(1, 3) == 33 and percent(2, 3) == 67
```

## check percent returns an int

round() with no second argument gives an int.

```python
assert isinstance(percent(1, 4), int)
```

## check percent avoids dividing by zero

A whole of zero returns 0 rather than raising.

```python
assert percent(5, 0) == 0
```

## check clamp keeps a value inside the range

Below the floor gives the floor, above the ceiling gives the ceiling.

```python
assert clamp(5, 0, 10) == 5 and clamp(-1, 0, 10) == 0 and clamp(99, 0, 10) == 10
```

## check average returns the mean as a float

The mean of 1, 2 and 3 is 2.0.

```python
assert average([1, 2, 3]) == 2.0 and isinstance(average([1, 2, 3]), float)
```

## check average returns 0.0 for an empty list

Dividing by len([]) would raise ZeroDivisionError.

```python
assert average([]) == 0.0
```

## check is_exact spots a whole-valued float

3.0 has no fractional part; 3.5 does.

```python
assert is_exact(3.0) is True and is_exact(3.5) is False
```

## hint after 1

```python
return minutes // 60, minutes % 60
```

## hint after 2

Guard the zero case with an early return before any division.

## hint after 3

```python
return max(low, min(value, high))
```

## hint after 4

is_exact can compare the value against int(value), or use value.is_integer().
