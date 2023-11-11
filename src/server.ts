import cors from 'cors';
import express from 'express';
import { Request, Response } from 'express';

import { CourseRouter } from './routers/courseRouter';
import { UserRouter } from './routers/userRouter';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());


const courseRouter = new CourseRouter();
const userRouter = new UserRouter();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello!');
});

app.use(courseRouter.getRouter());
app.use(userRouter.getRouter());

app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});
