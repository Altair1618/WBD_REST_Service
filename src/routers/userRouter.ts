import { Router } from 'express';

import { UserController } from '../controllers/userController';
import { validateJWT } from '../middlewares/authMiddleware';

export class UserRouter {
  private userController: UserController;

  constructor() {
    this.userController = new UserController();
  }

  public getRouter(): Router {
    const router = Router();

    router.post('/login', (req, res) => {
      this.userController.login(req, res);
    });

    router.post('/register', (req, res) => {
      this.userController.register(req, res);
    });

    router.get('/self', validateJWT, (req, res) => {
      this.userController.getCurrentUser(req, res);
    });

    router.put('/user/accept/:id', (req, res) => {
      this.userController.acceptUser(req, res);
    });

    router.put('/user/reject/:id', (req, res) => {
      this.userController.rejectUser(req, res);
    });

    return router;
  }
}