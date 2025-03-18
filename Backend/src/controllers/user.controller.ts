import { Request, Response } from "express";
import {
  notificationModel,
  projectModel,
  requestModel,
  userModel,
} from "../models/models";
import { CustomRequest } from "..";
import dotenv from "dotenv";
import { sendEmail } from "./mail.controller";
dotenv.config();
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
    };
    const newReq = new requestModel(obj);
    await newReq.save();
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
    const { status, branch, email } = req.query;
    const filters: any = {};
    if (status) filters.status = status;
    if (branch) filters.branch = branch;
    if (email) filters.created_by = email;

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

const getMyProjects = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    if (user.role === "winner") {
      if (
        !Array.isArray(user.projects_created) ||
        user.projects_created.length === 0
      ) {
        return res.status(200).json({
          message: "You haven't uploaded any projects.",
        });
      }
      const projects = await projectModel.find({
        _id: { $in: user.projects_created },
      });
      return res.json({
        response: projects,
      });
    } else if (user.role === "user") {
      if (
        !Array.isArray(user.projects_assigned) ||
        user.projects_assigned.length === 0
      ) {
        return res.status(200).json({
          message: "You haven't taken any projects.",
        });
      }
      const projects = await projectModel.find({
        _id: { $in: user.projects_assigned },
      });
      return res.json({
        response: projects,
      });
    }
  } catch (Error) {
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
const request = async (req: CustomRequest, res: Response): Promise<any> => {
  try {
    const { project_id, message, subject } = req.body;
    const requested_by = req.userId;
    const exists = await requestModel.findOne({ project_id, requested_by });
    if (exists) {
      return res.status(403).json({
        message: "Request Already Exists",
        ok: false,
      });
    }
    const newRequest = new requestModel({
      project_id,
      requested_by,
    });
    const user = await userModel.findById(req.userId);
    const project = await projectModel.findById(project_id);
    const winner = await userModel.findById(project?.created_by);
    if (!user) {
      return res.status(404).json({
        message: "user not found",
        ok: false,
      });
    }
    if (!winner) {
      return res.status(404).json({
        message: "winner not found",
        ok: false,
      });
    }

    await newRequest.save();
    const sent = await sendEmail(user.email, winner.email, subject, message);
    if (!sent) {
      await requestModel.deleteOne({
        project_id,
        requested_by,
      });
      res.status(500).json({
        message: "Error sending mail",
        ok: false,
      });
    }
    return res.json({
      message: "Requested Access.",
      ok: true,
    });
  } catch (err) {
    console.log(err);
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
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const { problemId, title, problem_statement, description, branch } =
      req.body;
    const file = req.file;
    const project = await projectModel.findOne({ problemId });
    if (project) {
      return res.status(409).json({
        message: "Problem already uploaded.",
        ok: false,
      });
    }
    let imageUrl: string | null = null;
    let filePath: string | null = null;
    if (file) {
      try {
        const admin = req.admin!;
        const bucket = admin.storage().bucket();
        const folderPath = `${process.env.DB}/vigyaanPortal/images/${req.userId}`;
        const fileName = `${problemId}`;
        filePath = `${folderPath}/${fileName}`;
        const fileUpload = bucket.file(`${folderPath}/${fileName}`);

        await fileUpload.save(file.buffer, {
          contentType: file.mimetype,
        });

        const [url] = await fileUpload.getSignedUrl({
          action: "read",
          expires: "01-12-2026",
        });
        imageUrl = url;
      } catch (err) {
        return res
          .status(500)
          .json({ ok: false, message: "Error uploading abstract", error: err });
      }
    }
    const projectData = {
      problemId,
      title,
      problem_statement,
      description,
      branch,
      created_by: req.userId,
      image: imageUrl,
    };
    const newProject = new projectModel(projectData);
    try {
      await newProject.save();
    } catch (err) {
      if (filePath) {
        const admin = req.admin!;
        await admin.storage().bucket().file(filePath).delete();
      }
      return res.status(500).json({
        message: "Error saving project to database",
        error: err,
        ok: false,
      });
    }
    const updatedUser = await userModel.findByIdAndUpdate(
      req.userId,
      { $push: { projects_created: newProject._id } },
      { new: true }
    );
    if (!updatedUser) {
      if (filePath) {
        const admin = req.admin!;
        await admin.storage().bucket().file(filePath).delete();
      }
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
  if (req.role === "winner")
    try {
      const user = await userModel.findById(req.userId);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
          ok: false,
        });
      }
      if (
        !Array.isArray(user.projects_created) ||
        user.projects_created.length === 0
      ) {
        return res.status(200).json({
          message: "The winner hasn't uploaded any projects.",
          ok: false,
        });
      }
      const requests = await requestModel
        .find({
          project_id: { $in: user.projects_created },
          status: "pending",
        })
        .populate("requested_by", "name email")
        .populate("project_id", "title description");

      return res.status(200).json({
        requests: requests,
        ok: true,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Some error occured.",
        error: err,
        ok: false,
      });
    }
  else if (req.role === "user") {
    try {
      const user = await userModel.findById(req.userId);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
          ok: false,
        });
      }
      const requests = await requestModel
        .find({ requested_by: req.userId })
        .populate("project_id", "title description")
        .populate("requested_by", "name email");
      return res.status(200).json({
        requests: requests,
        ok: true,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Some error occured.",
        error: err,
        ok: false,
      });
    }
  }
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

    if (project.status === "taken") {
      return res.status(409).json({
        message: "Project already taken.",
        ok: false,
      });
    }

    const user = await userModel.findById(request.requested_by);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        ok: false,
      });
    }

    const updatedProject = await projectModel.findByIdAndUpdate(
      request.project_id,
      { status: "taken", assigned_to: request.requested_by },
      { new: true }
    );

    const updatedUser = await userModel.findByIdAndUpdate(
      request.requested_by,
      { $push: { projects_assigned: request.project_id } },
      { new: true }
    );

    await requestModel.updateMany(
      { project_id: request.project_id, _id: { $ne: id } },
      { $set: { status: "denied" } }
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

    const { name, branch, grad_year } = req.body;

    const updateObj: Partial<typeof user> = {};
    if (name) updateObj.name = name;
    if (branch) updateObj.branch = branch;
    if (grad_year) updateObj.grad_year = grad_year;

    try {
      await userModel.findByIdAndUpdate(
        req.userId,
        { $set: updateObj },
        { new: true, runValidators: true }
      );
    } catch (err) {
      return res.json(500).json({
        message: "Unable to update user. Please try again.",
        error: err,
        ok: false,
      });
    }
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
  getMyProjects,
};
