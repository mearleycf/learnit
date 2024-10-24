export const exerciseContent = {
    htmlFiles: [
      ['index.html', `<div id="app">Hello World</div>`],
      ['page1.html', `<div id="app"><h1>Header 1</h1><p>This is a page</p></div>`],
      ['page2.html', `<div id="app"><a href="">This page has a link</a></div>`],
      [
        'page3.html',
        `<div id="app"><form><label for="page">Enter your name: </label><input name="page" type="text" /></form></div>`,
      ],
    ],
    codeFiles: [
      ['script.js', `// your code here`],
      ['global.css', `body {font-size: 1rem;}\n/* your styles here */`],
      ['index.html', `<div id="app">Hello World</div>`],
      ['calculate.js', `const sum = (x, y) => x + y\n//more code here`],
    ],
    tests: [
      ['test', 'assert(typeof exercise !== "undefined");'],
      ['test', 'assert(exercise() === true);'],
      ['test', 'assert(exercise.toString().includes("return"));'],
      ['test', 'assert(exercise.length === 0);'],
    ],
    hints: [
      ['Hint 1', 'Start by declaring a function named "exercise".'],
      ['Hint 2', 'The function should return a boolean value.'],
      ['Hint 3', 'Consider what condition would make the function return true.'],
      ['Hint 4', 'Remember, an empty function body implicitly returns undefined.'],
    ]
  }
