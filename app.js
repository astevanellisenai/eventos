//Definição
const express = require("express");
const app = express();

//Motor de conversao do HTML para o Backend
app.set("view engine", "ejs");

//Codificação de URL
app.use(express.urlencoded({
    extended: true
}));

//Rotas
app.get("/", (req, res) => {
    res.render("index");
});

//Rota Login
app.get("/login", (req, res) => {
    res.render("login");
});

//Rota Administrativa
app.get("/admin", (req, res) => {
    res.render("admin");
});

//Rotas Categorias
const categoriasRoutes = 
require('./Routes/categoriasRoutes');
app.use("/categorias", categoriasRoutes);

//Rotas Participantes
const participantesRoutes = 
require('./Routes/participantesRoutes');
app.use("/participantes", participantesRoutes);

//Rotas Eventos
const eventosRoutes = 
require('./Routes/eventosRoutes');
app.use("/eventos", eventosRoutes);

//Rotas Usuarios
const usuariosRoutes = 
require('./Routes/usuariosRoutes');
app.use("/usuarios", usuariosRoutes);

//Execução
const porta = 3001;
app.listen(porta, () => {
    console.log(`Servidor: http://localhost:${porta}`);
});