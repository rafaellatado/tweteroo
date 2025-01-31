import express from 'express';
import cors from 'cors'; 
import { MongoClient, ObjectId } from "mongodb";
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

app.post('/sign-up', async (req, res) => {

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
    return res.status(201).send('User successfully created!');
  } catch (err) {
    return res.status(500).send(err.message);
  }

});

app.post('/tweets', async(req, res) => {

  const { username, tweet } = req.body;
  const userTweet = { username, tweet };
  
  const userSchema = joi.object({
    username: joi.string().required(),
    tweet: joi.string().required()
  })

  const validation = userSchema.validate(userTweet, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map(detail => detail.message);
    return res.status(422).send(errors);
  }

  try {
    const validUser = await db.collection('users').findOne({ username: username })

    if (!validUser) {
      return res.status(401).send('This user does not exist!');
    }

  } catch {
    return res.status(500).send(err.message);
  }

  try {
    await db.collection('tweets').insertOne(userTweet);
    return res.status(201).send('Tweet successfully created!');

  } catch (err) {
    return res.status(500).send(err.message);
  }

})

app.get('/tweets', async (req, res) => {

  try {
    const allTweets = await db.collection('tweets')
      .find()
      .sort({ _id: -1 })
      .toArray();

    const tweets = await Promise.all(
      allTweets.map(async tweet => {
        const user = await db.collection('users').findOne({ username: tweet.username });
        tweet.avatar = user.avatar;
        return tweet;
      })
    );

    return res.status(200).send(tweets);

  } catch (err) {
    return res.status(500).send(err.message);
  }
})

app.put('/tweets/:id', async (req, res) => {
  const { id } = req.params;
  const tweetUpdate = { tweet: req.body.tweet };

  const tweetSchema = joi.object({
    tweet: joi.string().required()
  })

  const validation = tweetSchema.validate(tweetUpdate, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map(detail => detail.message);
    return res.status(422).send(errors);
  }

  try {
    const tweetExists = await db.collection('tweets').findOne({ _id: new ObjectId(id) })
    if (!tweetExists) {
      return res.status(404).send('Tweet not found :(')
    }

    await db.collection('tweets').updateOne({ _id: new ObjectId(id) }, { $set: tweetUpdate })
    res.status(204).send('Tweet successfully updated.')

  } catch (err) {
    return res.status(500).send(err.message);
  }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`App rodando liso na porta ${PORT}!`));
