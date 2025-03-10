import { Router } from "express";
import { projectRequest, sendDm, getProjects, getProject } from "../controllers/user.controller";
import checkAuthentication from '../middleware/checkAuthentication'

const router = Router();
router.use(checkAuthentication)
router.post("/requests", projectRequest)
router.post("/senddm", sendDm)
router.get("/projects", getProjects)
router.get("/projects/:id", getProject)

export default router