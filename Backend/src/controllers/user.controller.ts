import { Request, Response } from "express";
import {
  notificationModel,
  projectModel,
  requestModel,
  userModel,
} from "../models/models";

const projectRequest = async (req: Request, res: Response): Promise<any> => {
  const { project_id, requested_by } = req.body;

  if (!project_id || !requested_by) {
    return res.status(406).json({
      message: "Empty projectId or requested user",
    });
  }

  try {
    const alreadyExists = await requestModel.findOne({
      project_id: project_id,
      requested_by: requested_by,
    });

    if (alreadyExists) {
      return res.status(400).json({
        message: "Request from this user already exists",
      });
    }
    const obj = {
      project_id: project_id,
      requested_by: requested_by,
    }
    const newReq = new requestModel(obj);
    await newReq.save()
    return res.json({
      message: "Project requested successfully",
    });
  } catch (error) {
    return res.status(501).json({
      message: "Error while requesting project",
    });
  }
};

const sendDm = async (req: Request, res: Response): Promise<any> => {
  const { to, subject, message } = req.body();

  try {
    const coll = notificationModel;

    await coll.insertOne({
      user_id: "1",
      message: message,
      type: "request_sent",
    });

    return res.json({
      message: "Email sent successfully",
    });
  } catch (Error) {
    console.log(Error);
    return res.status(501).json({
      message: "Error while sending dm",
    });
  }
};

const getProjects = async (req: Request, res: Response): Promise<any> => {
  try {
    const { status, branch } = req.query;
    const filters: any = {};
    if (status) filters.status = status;
    if (branch) filters.branch = branch;

    const resp = await projectModel.find(filters);
    return res.json({
      response: resp,
    });
  } catch (Error) {
    console.log(Error);
    return res.status(501).json({
      message: "Error while fetching projects",
    });
  }
};

const getProject = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    const project = await projectModel.findById(id);

    if (!project) {
      return res.status(404).json({
        message: "Invalid Project ID",
      });
    }

    return res.json({
      response: project,
    });
  } catch (Error) {
    return res.status(501).json({
      message: "Error while fetching the project",
    });
  }
};
const request = async (req: Request, res: Response): Promise<any> => {
  try {
    const { project_id, requested_by } = req.body;
    const exists = await requestModel.findOne({project_id,requested_by});
    if(exists){
      return res.status(403).json({
        message: "Request Already Exists",
        ok: false
      })
    }
    const newRequest = new requestModel({
      project_id,
      requested_by,
    });
    await newRequest.save();
    return res.json({
      message: "Requested Access.",
      ok: true,
    });
  } catch (err) {
    return res.status(404).json({
      message: "An error occurred.",
      error: err,
      ok: false,
    });
  }
};
interface AuthenticatedRequest extends Request {
  userId?: string;
  role?: string;
}
const createProject = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { problemId, title, problem_statement, description, branch, image } =
      req.body;
    const project = await projectModel.findOne({ problemId });
    if (project) {
      return res.status(409).json({
        message: "Problem already uploaded.",
        ok: false,
      });
    }
    const projectData = {
      problemId,
      title,
      problem_statement,
      description,
      branch,
      created_by: req.userId,
      image: image || null,
    };
    const newProject = new projectModel(projectData);
    await newProject.save();
    const updatedUser = await userModel.findByIdAndUpdate(
      req.userId,
      { $push: { projects_created: newProject._id } },
      { new: true }
    );
    if (!updatedUser) {
      await projectModel.deleteOne({ problemId });
      return res.status(404).json({
        message: "User not found",
        ok: false,
      });
    }
    return res.status(201).json({
      message: "Project Created",
      ok: true,
      projectId: newProject._id,
    });
  } catch (err) {
    return res.status(404).json({
      message: "An error occurred.",
      error: err,
      ok: false,
    });
  }
};
const allRequests = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  //wrong
  const user = await userModel.findById(req.userId);
  if (!user) {
    return res.status(404).json({
      message: "User not found",
      ok: false,
    });
  }
  if (!Array.isArray(user.projects_created) || user.projects_created.length === 0) {
    return res.status(200).json({
      message: "The winner hasn't uploaded any projects.",
      ok: false
    });
  }
  const requests = await Promise.all(
    user.projects_created.map(async (projectId) => {
      return requestModel.find({ project_id: projectId , status: "pending"});
    })
  );
  return res.status(200).json({
    requests: requests,
    ok: true,
  });
};
const approveReq = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const request = await requestModel.findById(id);
    if (!request) {
      return res.status(404).json({
        message: "Request Not Found!",
        ok: false,
      });
    }
    const project = await projectModel.findById(request.project_id);
    if (!project) {
      return res.status(404).json({
        message: "Project Not Found!",
        ok: false,
      });
    }
    const updatedProject = await projectModel.findByIdAndUpdate(
      request.project_id,
      { status: "taken", assigned_to: request.requested_by },
      { new: true }
    );
    if (!updatedProject) {
      return res.status(500).json({
        message: "Error updating the project!",
        ok: false,
      });
    }
    request.status = "approved";
    await request.save();
    return res.status(200).json({
      message: "Request Granted",
      ok: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Some error occured.",
      error: err,
      ok: false,
    });
  }
};
const denyReq = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const request = await requestModel.findById(id);
    if (!request) {
      return res.status(404).json({
        message: "Request Not Found!",
        ok: false,
      });
    }
    request.status = "denied";
    await request.save();
    return res.status(200).json({
      message: "Request Denied",
      ok: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Some error occured.",
      error: err,
      ok: false,
    });
  }
};

const getProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const user = await userModel.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
        ok: false,
      });
    }
    return res.status(200).json({
      response: user,
      ok: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Some error occured.",
      error: err,
      ok: false,
    });
  }
};
const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
        ok: false,
      });
    }

    const { name, email, grad_year } = req.body;

    const updateObj: Partial<typeof user> = {};
    if (name) updateObj.name = name;
    if (email) updateObj.email = email;
    if (grad_year) updateObj.grad_year = grad_year;

    const updatedUser = await userModel.findByIdAndUpdate(
      req.userId,
      { $set: updateObj },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Profile Updated Successfully",
      ok: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Some error occurred.",
      error: err,
      ok: false,
    });
  }
};

export {
  projectRequest,
  sendDm,
  getProjects,
  getProject,
  createProject,
  request,
  allRequests,
  approveReq,
  denyReq,
  getProfile,
  updateProfile,
};
