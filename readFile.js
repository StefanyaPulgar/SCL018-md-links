const fs = require('fs');
const markdownLinkExtractor = require('markdown-link-extractor');
const fetch = require('node-fetch');
const path = require('path') // modulo para manupular las rutas



let filePath = process.argv[2];

//FUNCION PARA EXTRAER LOS LINKS
const getLinks = (data, pathInitial) => {
    const arrObjsLinks = markdownLinkExtractor(data, true).filter(
      (link) => link.href.includes("https://") || link.href.includes("http://")
    );
    let arrLinks = [];
    arrObjsLinks.forEach((objLink) => {
        const objectLinks = {
            file: pathInitial,
            link: objLink.href,
            text: objLink.text,
          };
          arrLinks.push(objectLinks)
          //console.log("obj", objectLinks)
    });
    return arrLinks;
  };

const readFile = (filePath) => { 
    const data = fs.readFileSync(filePath,{encoding:'utf8', flag:'r'});
    return data
};

const data = readFile(filePath)

// // sample links
let linksArr = getLinks(data);
// console.log(linksArr)
let promiseArr = linksArr.map(l=>fetch(l)
    .then(response => console.log(response.status))
);

// const linkTest = 'https://user-images.githubusercontent.com/110297/42118443-b7a5f1f0-7bc8-11e8-96ad-9cc5593715a6.jpg';
// fetch(linkTest)
//   .then(response => console.log(response.status))
//   .then(data => console.log(data));


// Promise.all(promiseArr).then(res => {
//   /* do something with res here... */
//   console.log(res);
// })


// fetch('http://example.com/movies.json')
//   .then(response => response.json())
//   .then(data => console.log(data));

