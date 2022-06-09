const express = require("express");
const {productRouter }= require("./routes/productRouter.js");
const {cartRouter}= require("./routes/cartRouter");
const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/productos", productRouter);
app.use("/api/carrito",cartRouter);

app.use(function(req, res) {
  // request invalida
        res.json({
          error: 
            '-2'
          , description: `ruta ${req.originalUrl} metodo ${req.method} no implementada` 
        });
  });

app.listen(8080, () => {
  console.log(`Estoy escuchando 8080`);
});

