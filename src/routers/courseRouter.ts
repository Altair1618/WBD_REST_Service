import { Router } from "express";

import { CourseController } from "../controller/courseController";

export class CourseRouter {
  private courseController: CourseController;

  constructor() {
    this.courseController = new CourseController();
  }

  public getRouter(): Router {
    const router = Router();

    router.get("/courses", (req, res) => {
      this.courseController.getCourses(req, res);
    });

    router.post("/courses", (req, res) => {
      this.courseController.createCourse(req, res);
    });

    return router;
  }
}