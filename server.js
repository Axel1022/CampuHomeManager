import app from "./app.js";
import connectiondb from "./config/db.js";
import chalk from "chalk";

const port = parseInt(process.env.PORT, 10) || 8081;

if (isNaN(port)) {
  console.error("❌ El puerto especificado no es válido.");
  process.exit(1);
}

const startServer = async () => {
  try {
    await connectiondb.authenticate();
    console.log(chalk.green("✅ Conexión a la base de datos exitosa"));

    await connectiondb.sync({ alter: false });
    console.log(chalk.green("✅ Base de datos sincronizada"));

    app.listen(port, () => {
      console.log(
        chalk.blue(
          `🚀 Servidor iniciado en http://localhost:${port}/auth/login`
        )
      );
    });

    process.on("SIGINT", async () => {
      console.log("🔄 Cerrando el servidor...");
      await connectiondb.close();
      console.log(chalk.green("✅ Conexión a la base de datos cerrada"));
      process.exit(0);
    });
  } catch (error) {
    console.error(chalk.red("❌ Error al iniciar el servidor:"), error.message);
    process.exit(1);
  }
};

startServer();
