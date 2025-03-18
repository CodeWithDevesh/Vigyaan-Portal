import LoginForm from "../../components/auth/login";

function LoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 my-[80px]">
      <div className="max-w-md w-[90vw] space-y-8">
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;
