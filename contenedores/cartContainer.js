const fs = require("fs");

const fileToArray = async (fileName) => {
  try {
    return JSON.parse(await fs.promises.readFile(fileName));
  } catch (error) {
    console.log("Se produjo un error!");
    throw error;
  }
};

const arrayToFile = async (fileName, array) => {
  try {
    //leer archivo y cargarlo en array
    await fs.promises.writeFile(fileName, JSON.stringify(array));
  } catch (error) {
    throw error;
  }
};

const createEmptyFile = async (fileName) => {
  try {
    //leer archivo y cargarlo en array
    await fs.promises.writeFile(fileName, "[]");
  } catch (e) {
    throw error;
  }
};

const fileChecker = async (fileName) => {
  const stats = fs.existsSync(fileName);

  if (!(stats)) {
    console.log(`Creo archivo vacio: ${fileName}`);
    await createEmptyFile(fileName);
  }
};

module.exports = class cartContainer {
  constructor(fileName) {
    this.fileName = fileName;
  }

  async createCart(obj) {
    try {
         await fileChecker(this.fileName);
      let array = await fileToArray(this.fileName);
      let longitud = array.length;
      let index = 0;
      //Valido que el array tenga objetos
      if (longitud == 0) {
        index = 1;
      } else {
        index = array[longitud - 1].id + 1;
      }

      obj.id = index;
      array.push(obj);

      await arrayToFile(this.fileName, array);
      return obj.id;
    } catch (error) {
      throw error;
    }
  }

   async getCartById(id) {
    try {
       await fileChecker(this.fileName);
      let array = await fileToArray(this.fileName);
      array = array.filter((x) => {
        return x.id == id;
      });
      if (array[0] == undefined) {
        return { error: "Carrito no encontrado" };
      } else {
        return array;
      }
    } catch (error) {
      throw error;
    }
  }

  async addProdToCartById(obj) {
    try {
        await fileChecker(this.fileName);

      let array = await fileToArray(this.fileName);
      let objIndex = array.findIndex(
        (cart) => cart.id == obj.id
      );

      if (objIndex == -1) {
        return { error: "Carrito no encontrado" };
      } else {

        array[objIndex].productos.push(obj.productos[0]);

        await arrayToFile(this.fileName, array);
        return { estado: "Carrito actualizado" };
      }
    } catch (error) {
      throw error;
    }
  }

  async getAll() {
    try {
      await fileChecker(this.fileName);
      return  fileToArray(this.fileName);
    } catch (error) {
      throw error;
    }
  }

  async deleteCartById(id) {
    try {
      await fileChecker(this.fileName);
     
      let array = await fileToArray(this.fileName);
     
      let obj = this.getCartById(id);
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

   async deleteProductoToCartById(obj) {
    try {
      await fileChecker(this.fileName);

      let array = await fileToArray(this.fileName);
      let objIndex = array.findIndex(
        (cart) => cart.id == obj.id
      );

      if (objIndex == -1) {
        return { error: "Carrito no encontrado" };
      } else {
      
        let arrayCart =  array[objIndex].productos
    
        arrayCart = arrayCart.filter((x) => {
            return x.id != obj.id_prod;
          });
        
        array[objIndex].productos = arrayCart;
       
        console.log(array);
        await arrayToFile(this.fileName, array);
        return { estado: "Carrito actualizado" };
      }
    } catch (error) {
      throw error;
    }
  }

   async deleteAll() {
    await createEmptyFile(this.fileName);
  }
};



