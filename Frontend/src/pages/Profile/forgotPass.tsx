import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import { KeyRound, Mail, SquareAsterisk } from "lucide-react";
import { toast } from "react-toastify";
import { api } from "../../helpers/api";
import { AuthContext } from "../../components/auth/AuthContext";

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [token, setToken] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) logout();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (step === 1) {
        api
          .post("/auth/forgot-password", { email })
          .then((res) => {
            if (res.data.ok) {
              toast.success("Password reset email sent successfully.");
              setStep(2);
            } else {
              toast.error(
                res.data.message ||
                  "Failed to send password reset email. Please try again."
              );
            }
          })
          .catch((err) => {
            console.error(err);
            toast.error(
              err.response?.data.message ||
                "Failed to send password reset email. Please try again."
            );
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        if (newPass !== confirmPass) {
          toast.error("Passwords do not match");
          setIsLoading(false);
          return;
        }

        api
          .post("/auth/reset-password", { token, newPassword: newPass })
          .then((res) => {
            if (res.data.ok) {
              toast.success("Password reset successfully. Please login.");
              navigate("/login");
            } else {
              toast.error(
                res.data.message ||
                  "Failed to reset password. Please try again."
              );
            }
          })
          .catch((err) => {
            console.error(err);
            toast.error(
              err.response?.data.message ||
                "Failed to reset password. Please try again."
            );
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-[80vh] w-screen mt-[100px] flex items-center justify-center bg-opacity-50">
      <div className="bg-white rounded-lg shadow-[0px_35px_35px_rgba(0,0,0,0.4)] w-full max-w-sm overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-200">
          <div
            className={`h-1 bg-primary transition-all duration-500 ease-in-out ${
              step === 1 ? "w-1/2" : "w-full"
            }`}
          ></div>
        </div>
        <div className="p-6 pb-0">
          <h2 className="text-xl font-bold text-primary">
            {step === 1 ? "Get Reset Token" : "Reset Password"}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {step === 1
              ? "Enter Your Email"
              : "Enter the verification token sent to your email"}
          </p>
        </div>
        <div>
          <form onSubmit={handleSubmit} className="p-6 space-y-2 pb-2">
            {step === 1 && (
              <>
                <Input
                  icon={<Mail size={20} color="#99a1af" />}
                  placeholder=""
                  label={"Email"}
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </>
            )}

            {step === 2 && (
              <>
                <Input
                  icon={<SquareAsterisk size={20} color="#99a1af" />}
                  label={"Verification Token"}
                  placeholder=""
                  type="text"
                  id="token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />
                <Input
                  icon={<KeyRound size={20} color="#99a1af" />}
                  label={"New Password"}
                  placeholder=""
                  type="password"
                  id="newPass"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                />
                <Input
                  icon={<KeyRound size={20} color="#99a1af" />}
                  label={"Confirm Password"}
                  placeholder=""
                  type="password"
                  id="confirmPass"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                />
              </>
            )}

            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 rounded-md bg-black text-white font-medium hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-black"
              >
                {isLoading
                  ? "Processing..."
                  : step === 1
                  ? "Send"
                  : "Change Password"}
              </button>
            </div>

            {step === 1 && (
              <div
                className="ml-auto text-sm font-rubik mt-6 w-fit cursor-pointer"
                onClick={() => setStep(2)}
              >
                Already Got a Token??
              </div>
            )}
            {step === 2 && (
              <div
                className="mr-auto text-sm font-rubik mt-6 w-fit cursor-pointer"
                onClick={() => setStep(1)}
              >
                Did not get a token??
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPass;
