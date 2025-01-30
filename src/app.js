import express from 'express';
import cors from 'cors'; 
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import joi from 'joi';

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors()); 

const mongoURL = process.env.MONGO_URL;
const mongoClient = new MongoClient(mongoURL);
let db;

mongoClient.connect()
 .then(() => {
  console.log('Conexão com o banco estabelecida com sucesso.')
  db = mongoClient.db()
  })
 .catch((err) => console.log('Erro ao conectar com o banco: ', err.message));

 app.post("/sign-up", async (req, res) => {

  const { username, avatar } = req.body;
  const user = { username, avatar };

  const userSchema = joi.object({
    username: joi.string().required(),
    avatar: joi.string().required()
  })

  const validation = userSchema.validate(user, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map(detail => detail.message);
    return res.status(422).send(errors);
  }

  try {
    await db.collection('users').insertOne(user);
    return res.status(201).send('User created successfully!');
  } catch (err) {
    return res.status(500).send(err.message);
  }

});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`App rodando liso na porta ${PORT}!`));



/* app.get("/", (req, res) => {
  db.collection('tweets').find().toArray()
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err.message))
}); */
