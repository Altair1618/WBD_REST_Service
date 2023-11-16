import { Router } from "express";

import { CertificateTemplateController } from "../controllers/certificateTemplateController";

export class CertificateTemplateRouter {
  private certificateTemplateController: CertificateTemplateController;

  constructor() {
    this.certificateTemplateController = new CertificateTemplateController();
  }

  public getRouter(): Router {
    const router = Router();

    router.get("/certificate", (req, res) => {
      this.certificateTemplateController.getCertificateTemplate(req, res);
    });

    router.post("/certificate", (req, res) => {
      this.certificateTemplateController.createtCertificateTemplate(req, res);
    });

    router.put("/certificate", (req, res) => {
      this.certificateTemplateController.updateCertificateTemplate(req, res);
    });

    return router;
  }
}
