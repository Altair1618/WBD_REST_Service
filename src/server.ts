import express from 'express';
import { Request, Response } from 'express';

const app = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello!');
});

app.listen(5000, () => {
  console.log('Application started on port 5000!');
});
