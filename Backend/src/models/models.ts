import mongoose from "mongoose";

//User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      enum: ["CSE", "IT", "ECE", "ME", "EE"],
      required: true,
    },
    grad_year: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },
    role: {
      type: String,
      enum: ["winner", "user"],
      default: "user",
    },
    projects_created: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    ],
    projects_assigned: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    verified: {
      type: Boolean,
      default: false
    },
    resetToken: { type: String }, // Stores reset token
    resetTokenExpires: { type: Date },
  },
  { timestamps: true }
);

//Project Schema
const projectSchema = new mongoose.Schema(
  {
    problemId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
    },
    problem_statement: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      enum: ["CSE", "IT", "ECE", "ME", "EE"],
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Original Winner
    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      validate: {
        validator: function (
          this: any,
          value: mongoose.Types.ObjectId | null
        ): boolean {
          return this.status === "taken" ? value !== null : true;
        },
        message: "Project is already 'taken'.",
      },
    }, // Current Owner
    status: {
      type: String,
      enum: ["available", "taken"],
      default: "available",
    },
    image: {
      type: String,
    }, // Image URL of project
  },
  { timestamps: true }
);

const requestSchema = new mongoose.Schema(
  {
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    requested_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    status: {
      type: String,
      enum: ["pending", "approved", "denied"],
      default: "pending",
    },
    request_date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
requestSchema.index({ project_id: 1, requested_by: 1 }, { unique: true });


const notificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["request_sent", "request_approved", "request_denied"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    sent_at: {
      type: Date,
      default: Date.now,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const UserOTPVerificationSchema = new mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  otp: String,
  createdAt: Number,
  expiry: Number
})

const userModel = mongoose.model("Users",userSchema,"Users");
const projectModel = mongoose.model("Projects",projectSchema,"Projects");
const requestModel = mongoose.model("Requests",requestSchema,"Requests");
const notificationModel = mongoose.model("Notifications",notificationSchema,"Notifications");
const userOTPVerificationModel = mongoose.model("UserOTPVerification",UserOTPVerificationSchema,"UserOTPVerification");
export{
    userModel,
    projectModel,
    requestModel,
    notificationModel,
    userOTPVerificationModel
};