import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "./AuthContext";
import { api } from "../../helpers/api";
import Input from "../Input";
import { KeyRound, Mail } from "lucide-react";

function LoginForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    api
      .post(
        `/auth/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res);
        if (res.data.ok == true) {
          login();
          toast.success("Logged In Successfully!");
          navigate("/");
        } else {
          toast.error(res.data.message || "Failed to login. Please try again.");
          console.error(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(`${err.response.data.message}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-[0px_35px_35px_rgba(0,0,0,.4)]">
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6 text-xs lg:text-lg">
          <Input
            type={"email"}
            label={"Email"}
            icon={<Mail size={20} />}
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            id={"mail"}
            placeholder={"namebtech@branch.nitrr.ac.in"}
          />
          <Input
            type={"password"}
            label={"Password"}
            icon={<KeyRound size={20} />}
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            id={"password"}
            placeholder={"namebtech@branch.nitrr.ac.in"}
          />
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
              isLoading ? "opacity-50 cursor-not-allowed" : " cursor-pointer"
            }`}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>
      <div className="flex flex-col justify-center mx-6 mb-5 text-xs lg:text-lg font-rubik gap-2">
        <div className="flex flex-row justify-center">
          <p className="">
            Don't have an account...{"    "}
            <Link to={"/signup"} className="text-xs lg:text-lg underline">
              Sign Up
            </Link>
          </p>
        </div>
        <div className="flex flex-row justify-center">
          <Link to={"/forgotPass"} className="text-xs lg:text-lg underline">
            Forgot Password
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
