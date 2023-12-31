import { Router } from "express";

import { CourseController } from "../controllers/courseController";
import { validateJWT } from "../middlewares/authMiddleware";

export class CourseRouter {
  private courseController: CourseController;

  constructor() {
    this.courseController = new CourseController();
  }

  public getRouter(): Router {
    const router = Router();

    router.get("/courses",  validateJWT, (req, res) => {
      this.courseController.getCourses(req, res);
    });

    router.post("/courses", validateJWT, (req, res) => {
      this.courseController.createCourse(req, res);
    });

    router.get("/courses/:id", validateJWT, (req, res) => {
      this.courseController.getCourse(req, res);
    });

    router.get("/courses/:id/students", validateJWT, (req, res) => {
      this.courseController.getCourseStudents(req, res);
    });

    router.put("/courses/:id", validateJWT, (req, res) => {
      this.courseController.updateCourse(req, res);
    });

    router.delete("/courses/:id", validateJWT, (req, res) => {
      this.courseController.deleteCourse(req, res);
    });

    return router;
  }
}