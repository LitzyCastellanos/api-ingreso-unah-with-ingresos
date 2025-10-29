





import { sequelize } from "./src/config/orm.js";
import { Estudiante } from "./src/modelos/estudiantes.js";

const probarConexion = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado correctamente a la BD");

    // Intenta leer los registros
    const estudiantes = await Estudiante.findAll({ limit: 3 });
    console.log("📄 Registros en app.estudiantes:");
    console.log(estudiantes.map(e => e.toJSON()));

  } catch (err) {
    console.error("❌ Error probando el modelo:", err.message);
  } finally {
    await sequelize.close();
  }
};

probarConexion();











/* prueba.js
const probarLogin = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/v1/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        numerocuenta: "20211021133",
        
      })
    });

    const data = await res.json();
    console.log("📩 Respuesta del servidor:");
    console.log(data);
  } catch (err) {
    console.error("❌ Error al probar login:", err.message);
  }
};

probarLogin();
*/