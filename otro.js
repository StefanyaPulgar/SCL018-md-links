const fs = require('fs') //FileSistem módulo proporciona muchas funciones muy útiles para acceder e interactuar con el sistema de archivos.
const path = require('path') // modulo para manupular las rutas


const mdLinks = (pathFile) => {
    let _path = pathFile;
      //registrar la respuesta en una base de datos
        //resolver si la ruta es relativa o absoluta 
      const isAbsolute =  path.isAbsolute(_path);
    
        if (!isAbsolute) {
          //convierte en ruta absoluta la ruta ingresada (path.resolve)
          console.log("test", _path);
          _path = path.resolve(_path);
          //normaliza la ruta si hay errores de semantica
          _path = path.normalize(_path);
          
        }
        console.log(process.argv);
      }
mdLinks(process.argv[2])