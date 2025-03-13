import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "./AuthContext";
import { api } from "../../helpers/api";

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

  async function handleSubmit(event) {
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
          toast("Logged In Successfully!");
          navigate("/");
        } else {
          alert(res.data.message);
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
      <form onSubmit={handleSubmit} className="p-8">
        <div className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-base font-medium text-primary"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@nitrr.ac.in"
              required
              disabled={isLoading}
              className="mt-1 block w-full px-3 py-2 bg-white border border-primary rounded-md text-sm shadow-sm placeholder-gray-400
                         focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-base font-medium text-primary"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="mt-1 block w-full px-3 py-2 bg-white border border-primary rounded-md text-sm shadow-sm placeholder-gray-400
                         focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
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
        <div className="flex justify-end mt-4 text-lg font-rubik gap-2">
          <p>Don't have an account...</p>
          <Link to={"/signup"} className="underline">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
