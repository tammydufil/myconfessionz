import React, { useEffect, useState } from "react";
import { Navbar } from "./navbar";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import textured from "../utils/textured.jpg";
import { redirect, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/actions/UserActions";
import Axios from "axios";
import Toast from "react-bootstrap/Toast";
import Select from "react-select";

export const Login = () => {
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userCode, setUserCode] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showA, setShowA] = useState(true);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState({ value: "Anonymous" });

  useEffect(() => {
    let timeoutId;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      setErrorMessage("");
    }, 7000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [errorMessage]);

  const roleOptions = [
    { label: "Anonymous", value: "Anonymous" },
    {
      label: "Counsellor",
      value: "Counsellor",
    },
  ];

  const csrfToken = window.csrfToken;

  // Set the CSRF token in the headers

  const logUser = async () => {
    setLoading(true);
    try {
      if (role.value === "Anonymous") {
        if (!userCode) {
          setErrorMessage("Usercode Required");
          throw new Error("Usercode Required");
        }
        if (!password) {
          setErrorMessage("Password Required");
          throw new Error("Password Required");
        }
        const data = await Axios.post(
          "https://restapis.myconfessionz.com/api/login",
          {
            usercode: userCode,
            password: password,
          }
        );

        dispatch(setUser({ user: data.data.message, token: data.data.token }));
        setTimeout(() => {
          navigate("/homepage");
        }, 2000);
      } else {
        if (!username) {
          setErrorMessage("Username Required");
          throw new Error("Username Required");
        }
        if (!password) {
          setErrorMessage("Password Required");
          throw new Error("Password Required");
        }
        const data = await Axios.post(
          "https://restapis.myconfessionz.com/api/login-counselor",
          {
            username: username,
            password: password,
          }
        );
        console.log(data.data);
        dispatch(setUser({ user: data.data.message, token: data.data.token }));
        setTimeout(() => {
          navigate("/homepage");
        }, 2000);
      }
      // console.log(data.data.token);

      setErrorMessage("Successfully logged in");
      setLoading(false);
      setTimeout(() => {
        navigate("/homepage");
      }, 500);
      // console.log(data);
    } catch (error) {
      setLoading(false);
      console.log(error);
      setErrorMessage(error.response.data.message);
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (!password) {
      setErrorMessage("Password required");
    }
    if (password.length < 8) {
      setErrorMessage("Password should be at least 8 characters");
    }
    if (role.value === "Anonymous" && !userCode) {
      setErrorMessage("Usercode required");
    }
    if (role.value !== "Anonymous" && !username) {
      setErrorMessage("Username required");
    }

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      logUser();
    }

    setValidated(true);
  };

  const user = useSelector((state) => {
    return state?.user?.user?.usercode;
  });
  const usename = useSelector((state) => {
    return state?.user?.user?.username;
  });

  useEffect(() => {
    if (user || username) {
      navigate("/homepage");
    }
  }, []);

  useEffect(() => {
    console.log(errorMessage);
  }, [errorMessage]);

  return (
    <div className="bg-pink-100 min-h-[100vh]">
      {loading && (
        <div className="fixed top-0    h-[100vh] w-screen z-50 overflow-x-hidden bg-[#00000064] bg-cover flex justify-center items-center">
          <svg
            class="pl overflow-x-hidden"
            viewBox="0 0 200 200"
            width="200"
            height="200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="pl-grad1" x1="1" y1="0.5" x2="0" y2="0.5">
                <stop offset="0%" stop-color="hsl(313,90%,55%)" />
                <stop offset="100%" stop-color="hsl(223,90%,55%)" />
              </linearGradient>
              <linearGradient id="pl-grad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="hsl(313,90%,55%)" />
                <stop offset="100%" stop-color="hsl(223,90%,55%)" />
              </linearGradient>
            </defs>
            <circle
              class="pl__ring"
              cx="100"
              cy="100"
              r="82"
              fill="none"
              stroke="url(#pl-grad1)"
              stroke-width="36"
              stroke-dasharray="0 257 1 257"
              stroke-dashoffset="0.01"
              stroke-linecap="round"
              transform="rotate(-90,100,100)"
            />
            <line
              class="pl__ball"
              stroke="url(#pl-grad2)"
              x1="100"
              y1="18"
              x2="100.01"
              y2="182"
              stroke-width="36"
              stroke-dasharray="1 165"
              stroke-linecap="round"
            />
          </svg>
        </div>
      )}
      <Navbar></Navbar>
      {/* {errorMessage !== "" && (
        <div className="bg-[#ff00002f] py-3 text-center text-[red] text-xl font-bold">
          {errorMessage}
        </div>
      )} */}

      <div className="relative loginpage overflow-x-hidden  ">
        <div className="relative z-30   flex justify-center  py-[60px] fade-in-bck1 overflow-x-hidden ">
          <div className="flex flex-col   bg-opacity-10 bg-white justify-center items-center  rounded-b-2xl  overflow-x-hidden">
            <div className="form-top pl-5 bg-[red] flex py-3 w-full  text-white text-xl rounded-t-xl items-center ">
              Login
            </div>
            <div className="flex flex-col items-center py-4 !mb-[50px] justify-center w-[330px] md:w-[450px] px-3 md:px-[100px]  shadow-2xl rounded-b-2xl border-x-2 border-b-2 border-red-300">
              <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
                className=""
              >
                <Row className="mb-3 ">
                  <Form.Group controlId="validationCustom01">
                    <Form.Label className="mb-2 text-sm text-black ">
                      Role
                    </Form.Label>
                    <Select
                      value={role.value}
                      //   onChange={this.handleChange}
                      options={roleOptions}
                      onChange={(e) => {
                        setErrorMessage("");
                        setRole(e);
                      }}
                      placeholder={role.value}
                      isSearchable={true}
                      className="md:w-[420px]  rounded-lg mb-6 !mx-0"
                    />
                    {role.value === "Anonymous" ? (
                      <div className="md:w-[420px] ">
                        <Form.Label className="mb-2 text-sm text-black l">
                          Usercode
                        </Form.Label>
                        <Form.Control
                          required
                          type="text"
                          value={userCode}
                          className="md:w-[420px] !mx-0"
                          onChange={(e) => {
                            setErrorMessage("");
                            setUserCode(e.target.value);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="md:w-[420px] ">
                        <Form.Label className="mb-2 text-sm text-black ">
                          Username
                        </Form.Label>
                        <Form.Control
                          required
                          type="text"
                          value={username}
                          className="!mx-0"
                          onChange={(e) => {
                            setErrorMessage("");
                            setUsername(e.target.value);
                          }}
                        />
                      </div>
                    )}
                  </Form.Group>
                  <Form.Group
                    controlId="validationCustom01"
                    className="md:w-[420px] "
                  >
                    <Form.Label className="mb-2 text-sm text-black mt-4 ">
                      Password
                    </Form.Label>
                    <Form.Control
                      required
                      type="password"
                      minLength={8}
                      value={password}
                      className="!m-0  md:!w-[420px]"
                      onChange={(e) => {
                        setErrorMessage("");
                        setPassword(e.target.value);
                      }}
                    />
                  </Form.Group>
                </Row>

                <div className="mt-2 h-[30px]">
                  <h4 className="text-sm text-[red] font-semibold ">
                    {errorMessage}
                  </h4>
                </div>

                <button
                  type="submit"
                  className="form-top text-white px-[30px] py-[15px] rounded-2xl mb-3 md:w-[420px] "
                >
                  Login
                </button>
                <br />
                <a
                  style={{ fontFamily: "Cormorant" }}
                  className="text-[red] pl-1 hover:text-[#ff3c00] text-lg  underline-offset-4 cursor-pointer font-bold"
                  onClick={() => {
                    navigate("/password-reset");
                  }}
                >
                  Forgot Password
                </a>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
