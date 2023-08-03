const { Pool } = require('pg')
const pool = new Pool({
    host: 'localhost',
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
    allowExitOnIdle: true
})

const agregarViaje = async (destino, presupuesto) => {
    const consulta = "INSERT INTO viajes values (DEFAULT, $1, $2)"
    const values = [destino, presupuesto]
    const result = await pool.query(consulta, values)
    console.log("Viaje agregado")
}

const obtenerViajes = async () => {
    const { rows } = await pool.query("SELECT * from viajes");
    console.log(rows);
    return rows;
}

//agregarViaje("Valdivia", 150000);
//obtenerViajes();

// nuevo

const modificarPresupuesto = async (presupuesto, id) => {
    const consulta = "UPDATE viajes SET presupuesto = $1 WHERE id = $2"
    const values = [presupuesto, id]
    const result = await pool.query(consulta, values)

    if (result.rowCount === 0) {
        throw { code: 404, message: "No se consiguió ningún viaje con este id" }
    }
}

const eliminarViaje = async (id) => {
    const consulta = "DELETE FROM viajes WHERE id = $1"
    const values = [id]
    const result = await pool.query(consulta, values)
}

const obtenerViaje = async (id) => {
    const consulta = "SELECT * FROM viajes WHERE id = $1"
    const values = [id]
    const result = await pool.query(consulta, values)
    const [viaje] = result.rows
    return viaje
}

module.exports = { agregarViaje, obtenerViajes, modificarPresupuesto, eliminarViaje, obtenerViaje }



