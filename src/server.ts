import cors from 'cors';
import express from 'express';
import { Request, Response } from 'express';

import { CourseRouter } from './routers/courseRouter';
import { UserRouter } from './routers/userRouter';
import { SOAPClient, SOAPServices } from './utils/soap';
import { SubscriptionRouter } from './routers/subscriptionRouter';
import { CertificateTemplateRouter } from './routers/certificateTemplateRouter';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const courseRouter = new CourseRouter();
const subscriptionRouter = new SubscriptionRouter();
const userRouter = new UserRouter();
const certificateTemplateRouter = new CertificateTemplateRouter();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello!');
});

app.use(courseRouter.getRouter());
app.use(subscriptionRouter.getRouter());
app.use(userRouter.getRouter());
app.use(certificateTemplateRouter.getRouter());

app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});
