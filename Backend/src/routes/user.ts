import { Router } from "express";
import { projectRequest, sendDm, getProjects, getProject, createProject, request, allRequests, approveReq, denyReq, getProfile, updateProfile } from "../controllers/user.controller";
import checkAuthentication from '../middleware/checkAuthentication'
import userCheck from "../services/middlewares";

const projectsRouter = Router();
projectsRouter.use(checkAuthentication);
// projectsRouter.post("/requests", projectRedquest);//
projectsRouter.post("/senddm", sendDm);
projectsRouter.get("/projects", getProjects);//
projectsRouter.get("/projects/:id", getProject);//
projectsRouter.post('/requests',request);//
projectsRouter.get('/users/me',getProfile);//
projectsRouter.post('/users/me',updateProfile);//
//winner
projectsRouter.post("/projects",userCheck,createProject);//
projectsRouter.get('/requests',userCheck,allRequests);//
projectsRouter.post('/requests/:id/approve',userCheck,approveReq);//
projectsRouter.post('/requests/:id/deny',userCheck,denyReq);

export default projectsRouter