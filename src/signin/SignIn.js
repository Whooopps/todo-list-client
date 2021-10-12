import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import isEmail from "validator/lib/isEmail";
import { useNonAuthProtected, useSetAuth } from "../effects/use-auth";
import { useAxios } from "../effects/use-axios";

function SignIn() {
  useNonAuthProtected();
  const setAuth = useSetAuth();
  const axios = useAxios();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onTouched" });
  const history = useHistory();

  let [isHidden, setIsHidden] = useState(true);

  async function onSubmit(data) {
    try {
      const response = await axios.post("/api/v1/auth/login", {
        email: data.email,
        password: data.password,
      });
      const { token } = response.data.token;
      localStorage.setItem("token", token);
      setAuth(true);
      history.push("/");
    } catch (err) {
      console.log(err);
    }
  }

  function renderError(condition, message) {
    if (condition) {
      return <p className="text-red-500">{message}</p>;
    }
    return null;
  }

  return (
    <div>
      <div className="w-96 h-auto mt-20 bg-white  p-5 shadow-lg">
        <h1 className="text-center text-2xl font-bold mb-4 text-gray-800">
          Log in
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="">
            <label>
              <span className="text-gray-700 text-opacity-90">Email</span>
              <input
                className="w-full border-b border-solid border-gray-300 outline-none"
                placeholder=""
                {...register("email", {
                  required: true,
                  validate: {
                    email: (v) => isEmail(v),
                  },
                })}
              />
              {renderError(
                errors.email?.type === "required",
                "Email is required"
              )}
              {renderError(
                errors.email?.type === "email",
                "Email is not valid"
              )}
            </label>
          </div>

          <div className="mt-6">
            <label>
              <span className="text-gray-700 text-opacity-90">Password</span>
              <div className="flex">
                <input
                  className="flex-grow w-full border-b border-solid border-gray-300 outline-none "
                  placeholder=""
                  type={isHidden ? "password" : "text"}
                  {...register("password", {
                    required: true,
                  })}
                />
                <i
                  onClick={() => setIsHidden(!isHidden)}
                  className={`${
                    isHidden ? "fas fa-eye" : "fas fa-eye-slash"
                  } flex-grow-0 flex-shrink-0 self-end pb-1 border-b border-solid border-gray-300 cursor-pointer`}
                ></i>
              </div>
              {renderError(
                errors.password?.type === "required",
                "Password is required"
              )}
            </label>
          </div>

          <div className="mt-6 text-center">
            <button
              className="bg-green-500 text-white rounded text-center px-5 py-1.5"
              type="submit"
              disabled={isSubmitting}
            >
              Log in
            </button>
            <div className="mt-2">
              <Link to="/signup">
                <span className="text-xs hover:underline">
                  New user? Sign up!
                </span>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
