import { Router } from "express";

import { CertificateTemplateController } from "../controllers/certificateTemplateController";
import { validateJWT } from "../middlewares/authMiddleware";

export class CertificateTemplateRouter {
  private certificateTemplateController: CertificateTemplateController;

  constructor() {
    this.certificateTemplateController = new CertificateTemplateController();
  }

  public getRouter(): Router {
    const router = Router();

    router.get("/certificate", validateJWT, (req, res) => {
      this.certificateTemplateController.getCertificateTemplate(req, res);
    });

    router.post("/certificate", validateJWT, (req, res) => {
      this.certificateTemplateController.createtCertificateTemplate(req, res);
    });

    router.put("/certificate", validateJWT, (req, res) => {
      this.certificateTemplateController.updateCertificateTemplate(req, res);
    });

    router.delete("/certificate", validateJWT, (req, res) => {
      this.certificateTemplateController.deleteCertificateTemplate(req, res);
    })

    return router;
  }
}
