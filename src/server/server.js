import express from "express";
import multer from "multer";
import { connection } from "./db.js";
import path from "path";
import fs from "fs";

const app = express()
const port = 3001

app.use(express.json());
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/img/avatars/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '_' + `${req.query.user_id}` + '_' + `${new Date().getTime()}` + path.extname(file.originalname));
  },
  overwrite: true,
});
const upload = multer({ storage: storage });

app.post('/upload', upload.single('avatar'), (req, res) => {
  if (req.file) {
    const sql = `UPDATE \`blog_table\` SET \`avatar\`='${req.file.path}' WHERE \`id\` = ${Number(req.query.user_id)}`;
    connection.query(sql, (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Ошибка при выполнении запроса к базе данных' });
        console.log(error.code, error.message);
      } else {
        res.send(req.file.path);
      }
    });

  } else {
    res.status(400).send('No file uploaded');
  }
});

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
  const { login, password, userFingerprint, avatar } = req.body;
  const sql = `INSERT INTO \`blog_table\`(\`login\`, \`pass\`, \`avatar\`, \`token\`) VALUES (?, ?, ?, ?);`;

  connection.query(sql, [login, password, avatar, userFingerprint], (error, results) => {
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
  const sql = `SELECT * FROM \`blog_table\` WHERE \`id\` = ${req.query.id}`
  
  connection.query(sql, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Ошибка при выполнении запроса к базе данных' });
      console.log(error.code, error.message);
    } else {
      res.send(results);
    }
  });
})

app.post('/postnewpost',(req,res)=>{
  const sql = `INSERT INTO \`blog_post\`(\`user_id\`, \`date\`, \`post_text\`, \`like_count\`, \`comment_count\`) VALUES ('${req.body.user_id}','${new Date().getTime()}','${req.body.post_text}',0,0)`

  connection.query(sql, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Ошибка при выполнении запроса к базе данных' });
      console.log(error.code, error.message);
    } else {
      res.send(results);
    }
  });
})

app.delete('/delete-image',(req,res)=>{
  const filePath = req.query.filePath;
  // if(!filePath || !path.isAbsolute(filePath)){
  //   console.log('Неверный путь к файлу');
  // }
  fs.unlink(filePath,(err)=>{
    if(err){
      console.log('Не удалось удалить файл');
    }
    res.send('Файл успешно удален');
  })
})

app.post('/update-token',(req,res)=>{
  const sql = `UPDATE \`blog_table\` SET \`token\`='${req.body.token}' WHERE \`id\` = ${req.body.id}`

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
