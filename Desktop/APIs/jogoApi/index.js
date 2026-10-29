const express = require("express")
const mysql = require("mysql2/promise")
const app = express()

app.use(express.json())


const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "catalogo_jogos"
})

// ------  Gêneros ------

// GET /
app.get("/generos", async (req, res) => {
    const [generos] = await db.execute("SELECT * FROM genero")
    return res.json(generos)
})

// POST /
app.post("/generos", async (req, res) => {
    const { nome, descricao } = req.body

    if (!nome || !descricao) {
        return res.status(400).json({ error: "Nome e descrição são obrigatórios" })
    }

    const [resultado] = await db.execute(
        "INSERT INTO genero (nome, descricao) VALUES (?, ?)",
        [nome, descricao]
    )

    return res.status(201).json({ id: resultado.insertId, nome, descricao })
})

// ------  Jogos ------

// GET /
app.get("/jogos", async (req, res) => {
    const [jogos] = await db.execute("SELECT * FROM jogos")
    return res.json(jogos)
})

// GET /
app.get("/jogos/:id", async (req, res) => {
    const id = req.params.id

    const [jogos] = await db.execute(
        "SELECT * FROM jogos WHERE id = ?",
        [id]
    )

    if (jogos.length === 0) {
        return res.status(404).json({ error: "Jogo não encontrado" })
    }

    return res.json(jogos[0])
})

// POST /
app.post("/jogos", async (req, res) => {
    const { nome, desenvolvedora, sinopse, genero_id } = req.body

    if (!nome || !desenvolvedora || !sinopse || !genero_id) {
        return res.status(400).json({ error: "Nome, desenvolvedora, sinopse e genero_id são obrigatórios" })
    }

    // Verificar se o gênero 
    const [generos] = await db.execute("SELECT * FROM genero WHERE id = ?", [genero_id])
    if (generos.length === 0) {
        return res.status(400).json({ error: "O genero_id informado não existe" })
    }

    const [resultado] = await db.execute(
        "INSERT INTO jogos (nome, desenvolvedora, sinopse, genero_id) VALUES (?, ?, ?, ?)",
        [nome, desenvolvedora, sinopse, genero_id]
    )

    return res.status(201).json({ id: resultado.insertId, nome, desenvolvedora, sinopse, genero_id })
})

// PUT 
app.put("/jogos/:id", async (req, res) => {
    const id = req.params.id
    const { nome, desenvolvedora, sinopse, genero_id } = req.body

    if (!nome || !desenvolvedora || !sinopse || !genero_id) {
        return res.status(400).json({ error: "Nome, desenvolvedora, sinopse e genero_id são obrigatórios" })
    }

    // Verificar se o gênero 
    const [generos] = await db.execute("SELECT * FROM genero WHERE id = ?", [genero_id])
    if (generos.length === 0) {
        return res.status(400).json({ error: "O genero_id informado não existe" })
    }

    const [resultado] = await db.execute(
        "UPDATE jogos SET nome = ?, desenvolvedora = ?, sinopse = ?, genero_id = ? WHERE id = ?",
        [nome, desenvolvedora, sinopse, genero_id, id]
    )

    if (resultado.affectedRows === 0) {
        return res.status(404).json({ error: "Jogo não encontrado" })
    }

    return res.json({ id: Number(id), nome, desenvolvedora, sinopse, genero_id })
})

// DELETE /
app.delete("/jogos/:id", async (req, res) => {
    const id = req.params.id

    const [resultado] = await db.execute(
        "DELETE FROM jogos WHERE id = ?",
        [id]
    )

    if (resultado.affectedRows === 0) {
        return res.status(404).json({ error: "Jogo não encontrado" })
    }

    return res.status(204).end()
})

app.listen(3000, () => console.log("API no ar"))