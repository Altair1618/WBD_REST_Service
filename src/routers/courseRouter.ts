import { Router } from "express";

import { CourseController } from "../controllers/courseController";

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

    router.get("/courses/:id", (req, res) => {
      this.courseController.getCourse(req, res);
    });

    router.put("/courses/:id", (req, res) => {
      this.courseController.updateCourse(req, res);
    });

    router.delete("/courses/:id", (req, res) => {
      this.courseController.deleteCourse(req, res);
    });

    return router;
  }
}