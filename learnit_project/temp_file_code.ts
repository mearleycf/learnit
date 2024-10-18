/* create a random number of entries for any array or object;
passes in a multiplier parameter `ceiling` to determine the highest number we want to generate.
*/
const entriesGenerator = <T>(ceiling: number): number => {
  return Math.floor(Math.random() * ceiling) + 1;
};

// arrays for using to randomize content
const fileNames = ["index.html", "page1.html", "page2.html", "page3.html"];
const fileContents = [
  { file1: `<div id="app">Hello World</div>` },
  { file2: `<div id="app"><h1>Header 1</h1><p>This is a page</p></div>` },
  { file3: `<div id="app"><a href="">This page has a link</a></div>` },
  {
    file4: `<div id="app"><form><label for="page">Enter your name: </label><input name="page" type="text" /></form></div>`,
  },
];
// generates a random number of files to keep in the array
const htmlNumberOfFiles = entriesGenerator(4);
/* splices the array by number of files, exclusive;
for example, if htmlNumberOfFiles = 2,
then fileNames.splice(2) will trim all items > fileContents[1];
because .splice() removes everything after the argument, inclusive;
repeat for fileContents
*/
const htmlFileNames = fileNames.splice(htmlNumberOfFiles);
const htmlFileContents = fileContents.splice(htmlNumberOfFiles);
console.log(htmlFileNames);

const browserHtmlJson = {};
