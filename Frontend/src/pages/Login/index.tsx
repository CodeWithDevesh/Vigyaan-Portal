import LoginForm from "../../components/auth/login";

function LoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 mt-20">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your details below to access your account
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;
