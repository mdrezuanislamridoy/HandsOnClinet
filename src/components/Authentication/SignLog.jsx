import { useContext, useReducer } from "react";
import axiosInstance from "../../utilities/AxiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faUserTie,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";
import { context } from "../../context/UserContext";

const initialState = {
  name: "",
  email: "",
  pass: "",
  verificationCode: "",
  token: "",
  role: "",
  isVerifying: false,
  message: "",
  isSignUp: true,
  loadingVerify: false,
  sentMail: false,
  remainingTime: 30,
  isTimerActive: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "START_VERIFY":
      return {
        ...state,
        loadingVerify: true,
        message: "",
        sentMail: true,
        isTimerActive: true,
      };
    case "VERIFY_SUCCESS":
      return {
        ...state,
        token: action.token,
        isVerifying: true,
        loadingVerify: false,
        message: "Verification email sent.",
      };
    case "VERIFY_FAIL":
      return {
        ...state,
        loadingVerify: false,
        message: "Failed to send verification email.",
      };
    case "TOGGLE_SIGNUP":
      return { ...state, isSignUp: !state.isSignUp };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function SignLog() {
  const { setLoggedIn } = useContext(context);
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!state.email || !validateEmail(state.email)) {
      dispatch({
        type: "SET_FIELD",
        field: "message",
        value: "Please enter a valid email.",
      });
      return;
    }
    dispatch({ type: "START_VERIFY" });
    try {
      const response = await axiosInstance.post("/auth/sendVerificationCode", {
        email: state.email,
      });
      dispatch({ type: "VERIFY_SUCCESS", token: response.data.token });
    } catch {
      dispatch({ type: "VERIFY_FAIL" });
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!state.token) {
      dispatch({
        type: "SET_FIELD",
        field: "message",
        value: "No verification token found.",
      });
      return;
    }
    try {
      const response = await axiosInstance.post("/auth/signup", {
        name: state.name,
        email: state.email,
        password: state.pass,
        enteredCode: state.verificationCode,
        token: state.token,
        role: state.role,
      });
      dispatch({
        type: "SET_FIELD",
        field: "message",
        value: response.data.message,
      });
    } catch (error) {
      dispatch({
        type: "SET_FIELD",
        field: "message",
        value: error.response?.data?.message || "Signup failed.",
      });
    }
    dispatch({ type: "RESET" });
  };

  const handleLoggedIn = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/auth/login", {
        email: state.email,
        password: state.pass,
      });
      navigate("/");
      setLoggedIn(true);
    } catch {
      dispatch({
        type: "SET_FIELD",
        field: "message",
        value: "Something went wrong",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-color">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h2 className="text-2xl font-bold text-center mb-4">
          {state.isSignUp ? "SignUp" : "LogIn"}
        </h2>
        <p className="text-center extra-color">{state.message}</p>

        <form onSubmit={state.isSignUp ? handleSignUp : handleLoggedIn}>
          {state.isSignUp && (
            <div className="mb-4">
              <label className="block text-color">Name</label>
              <input
                type="text"
                value={state.name}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "name",
                    value: e.target.value,
                  })
                }
                className="w-full border p-2 rounded-md"
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-color">Email</label>
            <input
              type="email"
              value={state.email}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "email",
                  value: e.target.value,
                })
              }
              className="w-full border p-2 rounded-md"
            />
          </div>
          {state.isSignUp && (
            <button
              onClick={handleVerify}
              className="secondary-bg-color text-white p-2 rounded-md w-full"
              disabled={state.isTimerActive}
            >
              {state.sentMail ? `${state.remainingTime}s` : "Verify Email"}
            </button>
          )}
          {state.isVerifying && (
            <div className="mb-4">
              <label className="block text-color">Verification Code</label>
              <input
                type="text"
                value={state.verificationCode}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "verificationCode",
                    value: e.target.value,
                  })
                }
                className="w-full border p-2 rounded-md"
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-color">Password</label>
            <input
              type="password"
              value={state.pass}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "pass",
                  value: e.target.value,
                })
              }
              className="w-full border p-2 rounded-md"
            />
          </div>
          {state.isSignUp && (
            <div className="mb-4">
              <label className="block text-color">Role</label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="volunteer"
                  checked={state.role === "volunteer"}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "role",
                      value: e.target.value,
                    })
                  }
                />{" "}
                Volunteer
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="organization"
                  checked={state.role === "organization"}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "role",
                      value: e.target.value,
                    })
                  }
                />{" "}
                Organization
              </label>
            </div>
          )}
          <button
            type="submit"
            className="bg-slate-500 text-white p-2 rounded-md w-full"
          >
            {state.isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>
        <p className="text-center mt-4">
          <Link
            onClick={() => dispatch({ type: "TOGGLE_SIGNUP" })}
            className="text-slate-800 rounded-md w-full"
          >
            {state.isSignUp ? "Login Instead" : "Create an Account"}
          </Link>
        </p>
      </div>
    </div>
  );
}
