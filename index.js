#!/usr/bin/env node

const fs = require('fs') //FileSistem módulo proporciona muchas funciones muy útiles para acceder e interactuar con el sistema de archivos.
const markdownLinkExtractor = require('markdown-link-extractor');
const path = require('path') // modulo para manupular las rutas
const route = process.argv[2];
const fetch = require('node-fetch');


const getLinks = (data) => {
    const arrObjsLinks = markdownLinkExtractor(data, true).filter( //true devuelve objetos, false devuelve cadenas
      (link) => link.href.includes("https://") || link.href.includes("http://")
    ); //contiene los datos del link, type(link), raw, href, title, text
    let arrLinks = [];
    arrObjsLinks.forEach((objLink) => {
        const objectLinks = {
            text: objLink.text,
            file: route,
            link: objLink.href,
          };
          arrLinks.push(objectLinks)
    });
    return arrLinks;
};

// FUNCION PARA LEER LOS ARCHIVOS MD
const readFile = (filePath) => { 
    return new Promise((resolve, reject) => {
    try {
    const data = fs.readFileSync(filePath,{encoding:'utf8', flag:'r'}); //flag r:  Abrir archivo para leer
    resolve(getLinks(data));
    }
    catch (err) {
        reject(err);
    }
})
};

// FUNCION PARA SABER SI EL ARCHIVO ES MD ISMD
const dirFile = (doc) => {
    return new Promise((resolve, reject) => {
   try {
    const fileExt = path.extname(doc.toLowerCase()); // devuelve la extension de un archivo
    const mdExt = ".md";
    if (fileExt === mdExt) {
        resolve (readFile(doc))
    } else {
        console.error(doc, "no es un archivo .md");
    }
    } catch (err) {
        reject (err);
    }
})
}


const readFolder = (route) => {
    return new Promise((resolve) => {
    const dataFolder = fs.readdirSync(route);
    dataFolder.forEach(file => {
        console.log("archivos existentes", file)
        const fullPath = path.join(route, file); //.join une los segmentos de la ruta y genera la ruta absoluta
        docOrFolder(fullPath).then(res => resolve(res))
    })
    })
}

const docOrFolder = (route) => {
    return new Promise((resolve, reject) => {
      const stat = fs.statSync(route); //proporciona info de un archivo
    try {
        if(stat.isDirectory()) { //si es directorio devuelve true, al igual si es archivo
            resolve(readFolder(route));
        } else if (stat.isFile()) {
            dirFile(route).then((links) => resolve (links));
        }
}
    catch(err) {
        reject(err)
    }
})
}


const validateLinks = (arrObj) => { //arrObj contiene todo
    return new Promise((resolve) => {
    const validate = arrObj.map(valLink => { // crea un nuevo array con los resultados de la llamada a la función indicada aplicados a cada uno de sus elementos.
     return fetch(valLink.link) //proporciona una interfaz JavaScript para acceder y manipular partes del canal HTTP, tales como peticiones y respuestas. 
     .then(res => {
        return {
            file: valLink.file,
            Url: res.url,
            Text: valLink.text,
            status: res.status,
            statusText: res.statusText, 
        } 
})  
  .catch (err =>
    console.log('Error de validate stats' + err))
})
resolve (Promise.all(validate))
})
}


const validate = true;
const mdLinks = (file) => {
    return new Promise((resolve, reject) => {
        try {
        docOrFolder(file)
        .then(res => {
          if (validate) {
            resolve(validateLinks(res));
        } else {
            resolve(res)
        }  
        });
        } 
        catch {
            reject();
        }
    });
}

mdLinks(route).then(res => console.log(res))

module.exports = {getLinks, dirFile, readFile, readFolder, docOrFolder, validateLinks ,mdLinks};
//module.exports.readFile = readFile;