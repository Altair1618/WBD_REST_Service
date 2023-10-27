import cors from 'cors';
import express from 'express';
import { Request, Response } from 'express';
import dotenv from 'dotenv';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

dotenv.config();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello!');
});

app.listen(port, () => {
  console.log(`Application started on port ${port}!`);
});
