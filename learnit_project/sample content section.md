#Arrays

> Last updated July 2024

Arrays in JavaScript allow you to store multiple elements in the same variable. You can store numbers, strings, booleans, arrays, objects & more. These can be mixed within the same array.\
Here are some examples:

```javascript
const users = []; // empty array
const grades = [10, 8, 13, 15]; // array of numbers
const attendees = ["Sam", "Alex"]; // array of strings
const values = [10, false, "John"]; // mixed
```

> ![Best practice icon](https://learnjavascript.online/assets/v2/circle-check-filled.svg?v=2) Name arrays in the plural as they can contain more than one item. This will prove to be especially useful once we need to iterate over an array.

## .length property

You can get the number of elements in an array by using the `.length` property. For example:

```javascript
[].length; // 0

const grades = [10, 8, 13, 15];
grades.length; // 4
```

Note that **.length** is a property (pre-computed value) and not a function. That's why you should not have `()` after it.

[Array.length](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/length) on MDN

## Get element by index

Similarly to strings, you can get an element from an array by using the square bracket syntax `[]` with the `index` starting from 0.

For example:

```javascript
const users = ["Sam", "Alex", "Charley"];
users[1]; //"Alex"
```

You can also use the `.at(index)` method, which accepts negative indices making it easier to find the last element of the array. Negative indices count back from the last element of the array. Here are some examples with `.at()`:

```javascript
const users = ["Sam", "Alex", "Charley", "Blane", "Crane"];
users.at(0); //"Sam"
users.at(1); //"Alex"
users.at(-2); //"Blane"
users.at(-1); //"Crane"
```

[Array.at()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at) on MDN

## Adding an element

You can add an element to an array by using the `.push()` method.

```javascript
const numbers = [10, 8, 13, 15];
numbers.push(20); // returns 5 (the new length of the array)
console.log(numbers); // [10, 8, 13, 15, 20];
```

> ![Warning sign](https://learnjavascript.online/assets/v2/info-triangle-filled.svg?v=2) `Array.push()` returns the new length of the array.

As you can see, `numbers.push(20)` returns 5 which is the length of the array. This is often confusing for a lot of developers which is why we're highlighting it here. `.push()` will add an item to the array but also return the new length of the array.

[Array.push()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push) on MDN

## Arrays & const

Even though the variable `numbers` was defined with `const`, we were able to push new data into it.\
That's because `const` means you can only **assign the variable once** when it's defined. But it doesn't mean the variable is immutable. Its content can change.

What's the benefit of declaring it as a `const` you ask? The benefit is that once you define it as an array, it will always stay as an array which means you can safely call array methods on it. However, the array content can change.

```javascript
const numbers = []; // start with empty array
numbers.push(10); // returns 1 (new length of array)
console.log(numbers); // [10] (still an array but content changed)
numbers.push(20); // returns 2 (new length of array)
console.log(numbers); // [10, 20] (still an array but content changed)
```

> ![Warning sign](https://learnjavascript.online/assets/v2/info-triangle-filled.svg?v=2) If you haven't worked with arrays before, then this is a lot to digest. We recommend that you switch to [learnprogramming.online](https://learnprogramming.online/) which introduces arrays step by step.

## Recap

* `const data = [1, 2, 3]` is an array containing 3 numbers.
* `array.length` returns the number of elements inside the array.
* `array.push(x)` allows you to add the variable **x** to the end of the array. It also returns the new length of the array (after the push has been made).
* Arrays defined with **const** are not constants because you can change the elements inside of it. However, you cannot re-assign them to another value thus they will always be an array.
