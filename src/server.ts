import cors from 'cors';
import express from 'express';
import { Request, Response } from 'express';

import { CourseRouter } from './routers/courseRouter';
import { UserRouter } from './routers/userRouter';
import { SOAPClient, SOAPServices } from './utils/soap';

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

app.get('/test', (req: Request, res: Response) => {
  let client = new SOAPClient();
  client.fetch(SOAPServices.GET_ALL_LOGGINGS);
});

app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});
