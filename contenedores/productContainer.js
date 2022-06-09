const fs = require("fs");

/**
 * Lee un array de objetos dentro de un archivo, retorna un array de objetos json
 * @param {string} fileName
 * @returns Array de objetos contenido en el archivo
 */
const fileToArray = async (fileName) => {
  try {
    //leer archivo y cargarlo en array
    //devolver array
    return JSON.parse(await fs.promises.readFile(fileName));
  } catch (error) {
    console.log("Se produjo un error!");
    throw error;
  }
};

/**
 * Escribe el array completo en un archivo
 * @param {string} fileName
 * @param {obj} array
 */
const arrayToFile = async (fileName, array) => {
  try {
    //leer archivo y cargarlo en array
    await fs.promises.writeFile(fileName, JSON.stringify(array));
  } catch (error) {
    throw error;
  }
};

/**
 * Crea un archivo nuevo con el nombre recibido por parametro
 * @param {string} fileName
 */
 const createEmptyFile = async (fileName) => {
  try {
    //leer archivo y cargarlo en array
    await fs.promises.writeFile(fileName, "[]");
  } catch (e) {
    throw error;
  }
};

/**
 * Valida que exista el archivo, si no existe lo crea llamando a createEmptyFile(fileName)
 * @param {string} fileName 
 */
const fileChecker = async (fileName) => {
  //chequeo que el archivo exista si no existe lo creo
  const stats = fs.existsSync(fileName);
 
  if (!(stats)) {
    console.log(`Creo archivo vacio: ${fileName}`);
    await createEmptyFile(fileName);
  }
};

module.exports = class productContainer {
  constructor(fileName) {
    //this.container = [];
    this.fileName = fileName;
  }

  /**
   * Guarda agrega un objeto array
   * @param {string} obj
   * @returns Id del objeto guardado
   */
  async save(obj) {
    try {
        //chequeo que el archivo exista si no existe lo creo
         await fileChecker(this.fileName);

      let array = await fileToArray(this.fileName);
      console.log(array);
      let longitud = array.length;
      console.log(longitud);
      let index = 0;
      //Valido que el array tenga objetos
      if (longitud == 0) {
        index = 1;
      } else {
        //sumar uno al id del ultimo elemento y agregarlo al id del objeto
        index = array[longitud - 1].id + 1;
        console.log(`Index ${index}`);
      }

      obj.id = index;
      array.push(obj);
      //escribir archivo
      await arrayToFile(this.fileName, array);
      //devolver id
      return obj.id;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Selecciona un objeto del archivo y lo devuleve
   * @param {int} id
   * @returns Devuelve el objeto si lo encuentra
   */
   async getById(id) {
    try {

       //chequeo que el archivo exista si no existe lo creo
       await fileChecker(this.fileName);

      let array = await fileToArray(this.fileName);

      array = array.filter((x) => {
        return x.id == id;
      });

      if (array[0] == undefined) {
        return { error: "producto no encontrado" };
      } else {
        return array;
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Selecciona un objeto del archivo y lo devuleve
   * @param {int} id
   * @returns Devuelve el objeto si lo encuentra
   */
  async updateById(obj) {
    try {
        //chequeo que el archivo exista si no existe lo creo
        await fileChecker(this.fileName);

      let array = await fileToArray(this.fileName);
      let objIndex = array.findIndex(
        (product) => product.id == obj.id
      );

      if (objIndex == -1) {
        return { error: "producto no encontrado" };
      } else {
        array[objIndex].title = obj.title;
        array[objIndex].price = obj.price;
        array[objIndex].thumbnail = obj.thumbnail;
        await arrayToFile(this.fileName, array);
        return { estado: "Producto actualizado" };
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @returns Devuelve todos los objetos del array
   */
  async getAll() {
    try {
      await fileChecker(this.fileName);
      return  fileToArray(this.fileName);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Borra el objeto con le id seleccionado en el array
   * @param {int} id
   */
  async deleteById(id) {
    try {
      await fileChecker(this.fileName);
     
      let array = await fileToArray(this.fileName);
     
      let obj = this.getById(id);
      console.log(obj.error != "");

      if (obj.error == "") {
        return obj;
      } else {
        array = array.filter((x) => {
          return x.id != id;
        });
        await arrayToFile(this.fileName, array);
        return { idDeleted: id };
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Borra todos los objetos del archivo llamado a createEmptyFile(this.fileName)
   */
   async deleteAll() {
    await createEmptyFile(this.fileName);
  }
};



