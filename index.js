module.exports = () => {
  // ...
};

const fs = require('fs') //FileSistem módulo proporciona muchas funciones muy útiles para acceder e interactuar con el sistema de archivos.
const markdownLinkExtractor = require('markdown-link-extractor');
const path = require('path') // modulo para manupular las rutas
const route = process.argv[2];
const fetch = require('node-fetch');
// import chalk from 'chalk';
//const chalk = require('chalk');


//fs.readdir(); // lee el contenido de un directorio
//fs.readFile(); // lee el contenido de un archivo. Relacionado:fs.read()
//fs.stat(); // devuelve el estado del archivo identificado por el nombre de archivo pasado.
// path.resolve()método resuelve una secuencia de rutas o segmentos de ruta en una ruta absoluta.

//FUNCION PRINCIPAL
// const mdLinks = (path, options) => {
//   return new Promise((resolve, rejects) => {
//   }

// volverla ruta absoluta
//(!path.isAbsolute(filePath)) {
 // filePath = resolve(filePath);
//}




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
      // El método match() se usa para obtener todas las ocurrencias de una expresión regular dentro de una cadena.
  return arrLinks;
};

// FUNCION PARA SABER SI EL ARCHIVO ES MD
const dirFile = (doc) => {
  return new Promise((resolve, reject) => {
    try {
      const fileExt = path.extname(doc.toLowerCase()); // devuelve la extension de un archivo
      const mdExt = ".md";
      if (fileExt === mdExt) {
        resolve(readFilePromise(doc));
      } else {
        console.error(doc, "no es un archivo .md");
      }
    } catch (error) {
      reject(error);
    }
   
  });
};

// FUNCION PARA LEER LOS ARCHIVOS MD
const readFilePromise = (filePath) => { //filepath es la ruta
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => { //utf es para interpretar los caracteres del archivo
      if (err) {
        reject(err);
      } else {
        resolve(getLinks(data, filePath));
      }
    });
  });
};

//FUNCION PARA LEER CARPETAS
const readFolderPromise = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(filePath, (err, files) => { //filepath es la ruta
      if (err) {
        reject(err);
      } else {
        resolve(files); //files: archivos que contiene la carpeta
      }
      console.log("files", files)
    });
  });
};

const dirFolder = (dirPath) => {
  return new Promise((resolve) => {
    const pathFolder = dirPath; //ruta
    //console.log('PFolder: ' + pathFolder);
    readFolderPromise(pathFolder)
      .then(files => { //archivos
        //console.log(files);
        files.forEach((file) => { //file es cada archivo que contiene la carpeta
          const fullPath = path.join(pathFolder, file); //.join une los segmentos de la ruta
          //console.log('Full Path: ' + fullPath);
          //console.log(fullPath);
          docOrFolder(fullPath).then(res => {
            //console.log('Hola 2');
            //console.log(res);
            resolve(res);
          });
        });
        //console.log("folderfiles", files)
        //console.log("pathfolder", pathFolder)
      })
      .catch(err => {
        console.log(err);
      });
  });
};

// FUNCION PARA SABER SI ES UN ARCHIVO O CARPETA
const docOrFolder = (route) => {
  return new Promise((resolve, reject) => {
    fs.stat(route, (error, stats) => { // .stat devuelve el estado del archivo identificado por el nombre de archivo pasado.
      if (error) {
        reject(error);
      }
      // console.log("prob", route)
      if (stats.isDirectory()) { // isDirectory es booleano, describe si es directorio o no
        resolve(dirFolder(route));
      } else if (stats.isFile()) { //isfile describe si es archivo o no, es booleano
        dirFile(route).then((links) => resolve(links));
      }
    });
  });
  
};

//dirFile(route).then((respuesta) => console.log(respuesta))
docOrFolder(route).then(res => {
  //console.log(res);
  let arrLinks = []
  arrObj = Object.entries(res);
  arrObj.forEach(([key, value]) => arrLinks.push(value.link));
  //console.log(arrLinks);
  validateLinks(arrLinks);
})


const validateLinks = (linksArr) => {
  let arrLinks = [];
  const linkStatus = linksArr.map(link => {
    
    fetch(link)
    .then(res=>{
      //console.log(res)
      if(res.status==200){
        arrLinks.push({
          url: res.url,
          status: res.status,
          statusText: res.statusText,
        })
        //console.log("prob", res.url)
         return arrLinks
      }
      
    })
    
  })
  //Promise.all(linkStatus)
  console.log(arrLinks)
 
  
   console.log(linkStatus)
  }
    