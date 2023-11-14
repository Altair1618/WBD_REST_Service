import { Router } from "express";

import { SubscriptionController } from "../controllers/subscriptionController";

export class SubscriptionRouter {
  private subscriptionController: SubscriptionController;

  constructor() {
    this.subscriptionController = new SubscriptionController();
  }

  public getRouter(): Router {
    const router = Router();

    router.get("/subscriptions", (req, res) => {
      this.subscriptionController.getPendingSubscriptions(req, res);
    });

    router.put("/subscription/accept/:id", (req, res) => {
      this.subscriptionController.acceptSubscription(req, res);
    });

    router.put("/subscription/reject/:id", (req, res) => {
      this.subscriptionController.rejectSubscription(req, res);
    });

    return router;
  }
}