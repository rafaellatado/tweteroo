import express from 'express';
import cors from 'cors'; 

const app = express();
app.use(express.json());
app.use(cors()); 

app.get("/", (req, res) => {
  res.send('Hello World');
});

const PORT = 5000;
app.listen(PORT, () => console.log(`App rodando liso na porta ${PORT}!`));
