import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Servir los archivos estáticos del proyecto (frontend)
app.use(express.static(path.join(__dirname, ".."))); 
// 👆 esto asume que "server" está dentro de la carpeta principal "Inmobiliaria3"
// y que los .html están fuera de la carpeta /server

// Ruta básica de prueba
app.get("/api/test", (req, res) => {
  res.json({ ok: true, mensaje: "Servidor funcionando correctamente 🚀" });
});

// (Ejemplo) Ruta para leer propiedades.json
app.get("/api/propiedades", (req, res) => {
  const filePath = path.join(__dirname, "..", "propiedades.json");
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Archivo propiedades.json no encontrado" });
  }
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  res.json(data);
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor funcionando en http://localhost:${3000}`);
});
