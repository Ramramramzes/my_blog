import express from "express";
import { connection } from "./db.js";
const app = express()
const port = 3001
app.use(express.json());

app.get('/checkAllUsers', (req, res) => {
  const sql = `SELECT * FROM \`blog_table\` WHERE \`login\` = '${req.query.login}'`

  connection.query(sql, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Ошибка при выполнении запроса к базе данных' });
      console.log(error.code, error.message);
    } else {
      res.send(results);
    }
  });
});

app.get('/checkOneUser', (req, res) => {
  const sql = `SELECT * FROM \`blog_table\` WHERE \`login\` = '${req.query.login}' AND \`pass\` = '${req.query.password}'`

  connection.query(sql, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Ошибка при выполнении запроса к базе данных' });
      console.log(error.code, error.message);
    } else {
      res.send(results);
    }
  });
});

app.post('/addUser', (req, res) => {
  const { login, password, userFingerprint } = req.body;
  const sql = `INSERT INTO \`blog_table\`(\`login\`, \`pass\`, \`token\`) VALUES (?, ?, ?);`;

  connection.query(sql, [login, password, userFingerprint], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Ошибка при выполнении запроса к базе данных' });
      console.error(error.code, error.message);
    } else {
      res.send(results);
    }
  });
});

app.get('/getblogpost',(req,res)=>{
  const sql = `SELECT * FROM \`blog_post\` WHERE \`user_id\` = ${req.query.id}`

  connection.query(sql, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Ошибка при выполнении запроса к базе данных' });
      console.log(error.code, error.message);
    } else {
      res.send(results);
    }
  });
})

app.get('/checktoken',(req,res)=>{
  const sql = `SELECT * FROM \`blog_table\` WHERE \`token\` = '${req.query.token}'`

  connection.query(sql, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Ошибка при выполнении запроса к базе данных' });
      console.log(error.code, error.message);
    } else {
      res.send(results);
    }
  });
})

app.get('/getuser',(req,res)=>{
  const sql = `SELECT * FROM \`blog_table\` WHERE \`id\` = '${req.query.id}'`

  connection.query(sql, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Ошибка при выполнении запроса к базе данных' });
      console.log(error.code, error.message);
    } else {
      res.send(results);
    }
  });
})



app.listen(port, () => {
  console.log(`Запущен на ${port} порту`);
})
