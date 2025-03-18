import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { api } from "../../helpers/api";
import {
  CheckCircleIcon,
  GraduationCapIcon,
  BookIcon,
  LockIcon,
  MailIcon,
  UserIcon,
} from "../icons";
import { AuthContext } from "./AuthContext";

const Signup = () => {
  const currentYear = new Date().getFullYear();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    branch: "",
    grad_year: currentYear,
  });
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const branches = ["CSE", "IT", "ECE", "EEE", "ME", "CE", "BT"];
  const years = Array.from({ length: 4 }, (_, i) => currentYear + i);

  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.verified) navigate("/dashboard");
      else setStep(2);
    }
  }, [user]);

  interface FormData {
    name: string;
    email: string;
    password: string;
    branch: string;
    grad_year: number;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email: string): boolean => {
    return email.endsWith(".nitrr.ac.in");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (step == 1) {
        if (!validateEmail(formData.email)) {
          throw new Error("Please use your college email address");
        }
        api
          .post(`/auth/signup`, formData)
          .then(() => {
            setStep(2);
            api
              .post(`/auth/request-otp`)
              .then((res) => {
                console.log(res.data);
              })
              .catch((err) => {
                console.error(err.message || "Error while requesting OTP");
              });
          })
          .catch((err) => {
            console.log(err);
            toast.error(err.response.data.message || "Error while signing up");
          });
      } else {
        try {
          if (!otp) {
            toast.error("Please enter your OTP");
          } else {
            await api
              .post(`/auth/verify-otp`, {
                otp,
              })
              .then((res) => {
                if (res.data.ok) {
                  toast.success(
                    "Registration successful: Your account has been created!"
                  );
                  login();
                  navigate("/dashboard");
                } else {
                  toast.error("Error while validating otp");
                }
              })
              .catch((err) => {
                toast.error(
                  err.response.data.message || "Error while validating otp"
                );
                console.log(err);
              });
          }
        } catch (err) {
          if (err instanceof Error) {
            toast.error(err.message || "Something went wrong");
          } else {
            toast.error("Something went wrong");
          }
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message || "An error occurred during registration");
      } else {
        toast.error("An error occurred during registration");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async (): Promise<boolean> => {
    return api
      .post(`/auth/request-otp`)
      .then((res) => {
        console.log(res);
        return true;
      })
      .catch((err) => {
        toast.error(err.response.data.message || "Error while requesting OTP");
        return false;
      });
  };

  const notify = (content: string) => {
    toast(content);
  };

  return (
    <div className="min-h-[80vh] w-screen my-[100px] flex items-center justify-center bg-opacity-50">
      <div className="bg-white rounded-lg shadow-[0px_35px_35px_rgba(0,0,0,0.4)] w-[90vw] max-w-sm overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-200">
          <div
            className={`h-1 bg-primary transition-all duration-500 ease-in-out ${
              step === 1 ? "w-1/2" : "w-full"
            }`}
          ></div>
        </div>

        {/* Modal Header */}
        <div className="p-6">
          <h2 className="text-center text-xl font-bold text-primary">
            {step === 1 ? "Create an Account" : "Verify Your Email"}
          </h2>
          <p className="text-center text-sm text-gray-600 mt-1">
            {step === 1
              ? "Join Vigyaan Portal to explore and collaborate on innovative projects"
              : "Enter the 6-digit verification code sent to your email"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {step === 1 ? (
            <div className="space-y-4">
              {/* Name Field */}
              <div className="space-y-1">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon />
                  </div>
                  <input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="text-xs  sm:text-base w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  College Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@college.edu"
                    value={formData.email}
                    onChange={handleChange}
                    className="text-xs sm:text-base w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="text-xs sm:text-base w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                    required
                  />
                </div>
              </div>

              {/* Branch and Semester Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label
                    htmlFor="branch"
                    className="text-sm font-medium text-gray-700"
                  >
                    Branch
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BookIcon />
                    </div>
                    <select
                      id="branch"
                      value={formData.branch}
                      onChange={(e) =>
                        handleSelectChange("branch", e.target.value)
                      }
                      className="text-xs sm:text-base w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black appearance-none"
                      required
                    >
                      <option value="">Select</option>
                      {branches.map((branch) => (
                        <option key={branch} value={branch}>
                          {branch}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="sem"
                    className="text-sm font-medium text-gray-700"
                  >
                    Graduation Year
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <GraduationCapIcon />
                    </div>
                    <select
                      id="sem"
                      value={formData.grad_year}
                      onChange={(e) =>
                        handleSelectChange("grad_year", e.target.value)
                      }
                      className="text-xs sm:text-base w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black appearance-none"
                      required
                    >
                      <option value="">Select</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-4 text-xs lg:text-sm font-rubik gap-2">
                <p>Already have an account...</p>
                <Link to={"/login"} className="text-xs lg:text-sm underline">
                  Sign In
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* OTP Notification */}
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <div className="flex items-start gap-3">
                  <CheckCircleIcon />
                  <div>
                    <h4 className="text-sm sm:text-lg font-medium text-black">
                      Verification Required
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600">
                      We've sent a 6-digit code to{" "}
                      <span className="font-medium">{formData.email}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* OTP Field */}
              <div className="space-y-1">
                <label
                  htmlFor="otp"
                  className="text-sm font-medium text-gray-700"
                >
                  Verification Code
                </label>
                <input
                  id="otp"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="text-xs sm:text-base w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black text-center tracking-widest"
                  required
                />
                <p className="text-xs lg:text-sm text-gray-500 text-center">
                  Didn't receive the code?{" "}
                  <button
                    onClick={async () => {
                      const otpSent = await resendOTP();
                      if (otpSent) notify("OTP has been sent");
                    }}
                    type="button"
                    className="text-xs sm:text-sm text-black hover:text-gray-800 hover:cursor-pointer"
                  >
                    Resend
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="text-xs sm:text-base w-full py-2 px-4 rounded-md bg-black text-white font-medium hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-black"
            >
              {isLoading
                ? "Processing..."
                : step === 1
                ? "Continue"
                : "Verify & Complete"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
