import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { useState } from "react";
import { useNonAuthProtected } from "../effects/use-auth";
import { useAxios } from "../effects/use-axios";
import { useForm } from "react-hook-form";
import isEmail from "validator/lib/isEmail";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import { useAlert } from "react-alert";

function SignUp() {
  useNonAuthProtected();
  const axios = useAxios();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onTouched" });

  let [isHidden, setIsHidden] = useState(true);
  const history = useHistory();
  const alert = useAlert();

  function renderError(condition, message) {
    if (condition) {
      return <p className="text-red-500">{message}</p>;
    }
    return null;
  }

  async function validateEmail(value) {
    try {
      const response = await axios.post("/api/v1/auth/checkemail", {
        email: value,
      });
      return response.data.valid || "Email is already taken";
    } catch (err) {
      console.log(err);
      return err.message;
    }
  }

  async function onSubmit(data) {
    try {
      const response = await axios.post("/api/v1/auth/signup", {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
      });
      history.push("/signin");
      alert.success(
        "Signed up successfully. Please log in with your credentials."
      );
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="">
      <div className="w-96 h-auto mt-20 bg-white  p-5 shadow-lg">
        <h1 className="text-center text-2xl font-bold mb-4 text-gray-800">
          Sign up
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
                    uniqueEmail: AwesomeDebouncePromise(validateEmail, 150),
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
              {renderError(
                errors.email?.type === "uniqueEmail",
                errors.email?.message
              )}
            </label>
          </div>

          <div className="mt-6">
            <label>
              <span className="text-gray-700 text-opacity-90">First Name</span>
              <input
                className="w-full border-b border-solid border-gray-300 outline-none "
                placeholder=""
                {...register("firstName", {
                  required: true,
                  maxLength: 260,
                })}
              />
              {renderError(
                errors.firstName?.type === "required",
                "First name is required"
              )}
              {renderError(
                errors.firstName?.type === "maxLength",
                "Maximum allowed length is 260 characters"
              )}
            </label>
          </div>

          <div className="mt-6">
            <label>
              <span className="text-gray-700 text-opacity-90">Last Name</span>
              <input
                className="w-full border-b border-solid border-gray-300 outline-none "
                placeholder=""
                {...register("lastName", {
                  required: true,
                  maxLength: 260,
                })}
              />
              {renderError(
                errors.lastName?.type === "required",
                "Last name is required"
              )}
              {renderError(
                errors.lastName?.type === "maxLength",
                "Maximum allowed length is 260 characters"
              )}
            </label>
          </div>

          <div className="mt-6">
            <label>
              <span className="text-gray-700 text-opacity-90">Password</span>
              <div className="flex">
                <input
                  className="w-full border-b border-solid border-gray-300 outline-none "
                  placeholder=""
                  type={isHidden ? "password" : "text"}
                  {...register("password", { required: true })}
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
              Sign up
            </button>
            <div className="mt-2">
              <Link to="/signin">
                <span className="text-xs hover:underline">
                  Existing user? Sign in!
                </span>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
export default SignUp;
