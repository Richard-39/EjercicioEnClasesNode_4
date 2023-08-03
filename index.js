const { agregarViaje, obtenerViajes, modificarPresupuesto, eliminarViaje, obtenerViaje } = require('./consultas')
const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config()
console.log(process.env)

app.use(express.json())

const reportarConsulta = async (req, res, next) => {
    const parametros = req.params
    const url = req.url
    console.log(`
    Hoy ${new Date()}
    Se ha recibido una consulta en la ruta ${url}
    con los parámetros:
    `, parametros)
    next()
}

app.listen(3000, console.log("SERVIDOR ENCENDIDO"))

app.get("/viajes", async (req, res) => {
    const viajes = await obtenerViajes()
    res.json(viajes)
})


app.post("/viajes", async (req, res) => {
    try {
        const { destino, presupuesto } = req.body
        await agregarViaje(destino, presupuesto)
        res.send("Viaje agregado con éxito")
    } catch (error) {
        const { code } = error
        if (code == "23502") {
            res.status(400)
                .send("Se ha violado la restricción NOT NULL en uno de los campos de la tabla")
        } else {
            res.status(500).send(error)
        }
    }
})



// nuevo

app.put("/viajes/:id", async (req, res) => {
    const { id } = req.params
    const { presupuesto } = req.query
    try {
        await modificarPresupuesto(presupuesto, id)
        res.send("Presupuesto modificado con éxito")
    } catch ({ code, message }) {
        res.status(code).send(message)
    }
})

app.delete("/viajes/:id", async (req, res) => {
    const { id } = req.params
    await eliminarViaje(id)
    res.send("Viaje eliminado con éxito")
})

app.get("/viajes/:id", reportarConsulta, async (req, res) => {
    const { id } = req.params
    const viaje = await obtenerViaje(id)
    res.json(viaje)
})

