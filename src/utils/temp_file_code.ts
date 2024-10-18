/* create a random number of entries for any array or object;
passes in a multiplier parameter `ceiling` to determine the highest number we want to generate.
*/
const entriesGenerator = <T>(ceiling: number): number => {
  return Math.floor(Math.random() * ceiling) + 1
}

// // array for using to randomize content
// const htmlFiles = [
//   ['index.html', `<div id="app">Hello World</div>`],
//   ['page1.html', `<div id="app"><h1>Header 1</h1><p>This is a page</p></div>`],
//   ['page2.html', `<div id="app"><a href="">This page has a link</a></div>`],
//   [
//     'page3.html',
//     `<div id="app"><form><label for="page">Enter your name: </label><input name="page" type="text" /></form></div>`,
//   ],
// ]

// const htmlFileResults = Object.fromEntries(htmlFiles.slice(0, entriesGenerator(4)))

const codeFiles = [
  ['index.js', `// your code here`],
  ['global.css', `body {font-size: 1rem;}\n/* your styles here */`],
  ['index.html', `<div id="app">Hello World</div>`],
  ['calculate.js', `const sum = (x, y) => x + y\n//more code here`],
]
const codeFileResults = Object.fromEntries(codeFiles.slice(0, entriesGenerator(4)))
