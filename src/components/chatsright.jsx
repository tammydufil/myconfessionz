import React, { useEffect, useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { LoggedInNav } from "./loggedinNav";
import confessbg from "../utils/confessbg.jpg";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export const Chatsright = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState("");
  const [activeConversation, setActiveConversation] = useState([]);
  const [message, setMessage] = useState("");
  const [allUserMessages, setAllUserMessages] = useState([]);
  const [allCounselorMessages, setAllCounselorMessages] = useState([]);
  const [showConversations, setShowConversation] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);
  const [deletingId, setDeletingId] = useState("");
  const [deletingName, setDeletingName] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  // console.log(activeConversation?.id);

  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (message.length === 0) {
      setHeight(0);
    }
  }, [message]);

  const handleChange = (e) => {
    const element = e.target;
    const scrollHeight = element.scrollHeight || 0;
    const clientHeight = element.clientHeight || 0;
    const height = Math.max(scrollHeight, clientHeight);
    setHeight(height);
  };

  console.log(conversation);
  const getUserMessages = async () => {
    console.log("Getting user messages");
    try {
      const result = await Axios.get(
        `https://restapis.myconfessionz.com/api/conversations/${activeConversationId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const sortedMessages = result.data.messages.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
      console.log(sortedMessages);
      setAllUserMessages(sortedMessages);
    } catch (error) {
      console.log(error);
    }
  };

  const getConversations = async () => {
    // setLoading(true);
    console.log("Getting convos");
    setLoadingConversations(true);
    try {
      if (user) {
        const data = await Axios.get(
          `https://restapis.myconfessionz.com/api/conversations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(data);

        setConversation(data.data.conversations);

        setLoading(false);
        setLoadingConversations(false);
      } else {
        const data = await Axios.get(
          `https://restapis.myconfessionz.com/api/counselor-conversations`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(data);

        setConversation(data.data.conversations);
        setLoading(false);
        setLoadingConversations(false);
      }
    } catch (error) {
      setLoadingConversations(false);
      setLoading(false);
      console.log(error);
      // navigate("/homepage");
    }
  };
  const getConversationsFromSearch = async (id, newUser) => {
    // setLoading(true);
    console.log(id);
    const exists = conversation.find((item) => item.receiver.id === id);
    console.log(exists);
    if (exists) {
      setActiveConversationId(exists.id);
      setActiveConversation(exists);
      const result = await Axios.get(
        `https://restapis.myconfessionz.com/api/conversations/${exists.id}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(result);
      const sortedMessages = result.data.messages.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
      // console.log(sortedMessages);

      setAllUserMessages(sortedMessages);
    } else {
      setActiveConversationId(id);
      setActiveConversation({ id: newUser.id, username: newUser.username });
      setAllUserMessages([]);
    }
  };

  useEffect(() => {
    if (activeConversation?.id) {
      console.log(true);
    }
  }, [activeConversation]);

  const sendInitialMessage = async () => {
    try {
      const result = await Axios.post(
        `https://restapis.myconfessionz.com/api/initiate-conversation`,
        { receiver_id: activeConversation.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getConversations();

      // console.log(result?.data?.conversation?.receiver_id);
      if (!activeConversation?.first_name) {
        setActiveConversationId(result?.data?.conversation?.receiver_id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(activeConversation);
  const [deletingmessage, setDeletingMessage] = useState(false);
  const deleteMessage = async (id) => {
    try {
      setDeletingMessage(true);
      const result = await Axios.delete(
        `https://restapis.myconfessionz.com/api/delete-conversations/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(id, activeConversationId);

      setActiveConversation([]);
      setAllUserMessages([]);

      getConversations();
      handleCloseDelete();
      setDeletingMessage(false);
    } catch (error) {
      setDeletingMessage(false);
      console.log(error);
    }
  };
  const sendMessage = async () => {
    console.log(activeConversation.id);

    if (allUserMessages.length < 1) {
      try {
        await sendInitialMessage();
      } catch (initialMessageError) {
        console.error("Error sending initial message:", initialMessageError);
        // Handle the error as needed
        return;
      }
    }

    try {
      setSendingMessage(true);
      if (user) {
        const result = await Axios.post(
          `https://restapis.myconfessionz.com/api/messages`,
          { receiver_id: activeConversation.id, content: message },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(activeConversation);
        console.log(result);
        // setActiveConversationId(result?.message?.conversation_id);

        // getUserMessages();

        const result2 = await Axios.get(
          `https://restapis.myconfessionz.com/api/conversations/${result.data?.conversation?.id}/messages`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(result2);

        const sortedMessages = result2.data.messages.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );

        setAllUserMessages(sortedMessages);
        setSendingMessage(false);
      } else {
        const result = await Axios.post(
          `https://restapis.myconfessionz.com/api/counselor-messages`,
          { receiver_id: activeConversation.id, content: message },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(result);
        getUserMessages();
      }

      setMessage("");
      setHeight(0);
      setSendingMessage(false);
      // getCounselorMessages();
    } catch (error) {
      setSendingMessage(false);
      console.error(error);
      alert("Error Occurred");
      // Handle the error as needed
    }
  };

  useEffect(() => {
    console.log(allUserMessages);
  }, [allUserMessages]);

  // const getCounselorMessages = async () => {
  //   try {
  //     const result = await Axios.get(
  //       `https://restapis.myconfessionz.com/api/conversations/${activeConversationId}/messages`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     console.log(result);
  //     setAllCounselorMessages(result.data.messages);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    getUserMessages();
  }, [activeConversation]);

  useEffect(() => {
    getConversations();
  }, []);

  const originalFieldList = [
    { id: 1, name: "Mental Health Counseling" },
    { id: 2, name: "Marriage and Family Counseling" },
    { id: 3, name: "School Counseling" },
    { id: 4, name: "Career Counseling" },
    { id: 5, name: "Substance Abuse Counseling" },
    { id: 6, name: "Rehabilitation Counseling" },
    { id: 7, name: "Grief Counseling" },
    { id: 8, name: "Child and Adolescent Counseling" },
    { id: 9, name: "Geriatric Counseling" },
    { id: 10, name: "Trauma Counseling" },
    { id: 11, name: "Eating Disorders Counseling" },
    { id: 12, name: "Multicultural Counseling" },
    { id: 13, name: "Military and Veterans Counseling" },
    { id: 14, name: "Art Therapy" },
    { id: 15, name: "Play Therapy" },
    { id: 16, name: "Sex Therapy" },
    { id: 17, name: "Community Counseling" },
  ];
  const [fieldList, setFieldList] = useState(originalFieldList);
  const [isSearchingByField, setIsSearchingByField] = useState(true);
  const [isSearchingByName, setIsSearchingByName] = useState(false);

  const user = useSelector((state) => {
    return state?.user?.user?.usercode;
  });
  const username = useSelector((state) => {
    return state?.user?.user?.username;
  });

  const token = useSelector((state) => {
    return state.user.token;
  });

  let [time, setTime] = useState(4);

  if (user === undefined && username === undefined) {
    setTimeout(() => setTime(time - 1), 1000);
  }

  useEffect(() => {
    if (time === 0) {
      navigate("/login");
    }
  }, [time]);
  const [filterName2, setFilterName2] = useState("");
  const [counsellors2, setCounsellors2] = useState([]);

  const getCounsellors2 = async () => {
    setLoading(true);
    try {
      const result = await Axios.get(
        "https://restapis.myconfessionz.com/api/all-counselors",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(result);

      setCounsellors2(result.data.counselors);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    const newdata = counsellors.filter((item) =>
      item.username.toLowerCase().includes(filterName.toLowerCase())
    );
    setDataDisplayed(newdata);
  }, [loading]);

  const getCounsellors = async (field) => {
    setLoading(true);
    try {
      const result = await Axios.get(
        `https://restapis.myconfessionz.com/api/counselors-by-field/${field}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(result);

      setCounsellors(result.data.counselor);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const navigate = useNavigate();

  const [filterName, setFilterName] = useState("");
  const [fieldName, setFieldName] = useState("");
  const [dataDisplayed, setDataDisplayed] = useState([]);

  useEffect(() => {
    if (fieldName === "") {
      setFieldList(originalFieldList);
    }
  }, [fieldName]);

  useEffect(() => {
    if (filterName === "") {
      setDataDisplayed(counsellors);
    }
  }, [filterName]);
  useEffect(() => {
    setDataDisplayed(counsellors);
  }, [counsellors]);

  useEffect(() => {
    getCounsellors();
    getCounsellors2();
  }, []);

  const [dataDisplayed2, setDataDisplayed2] = useState([]);

  useEffect(() => {
    if (filterName2 === "") {
      setDataDisplayed2(counsellors2);
    }
  }, [filterName2]);
  useEffect(() => {
    setDataDisplayed2(counsellors2);
  }, [counsellors2]);

  const [fieldNameToDisplay, setFieldNameToDisplay] = useState("");
  return user !== undefined || username !== undefined ? (
    <div>
      <LoggedInNav></LoggedInNav>
      <div className="flex">
        {showConversations && (
          <div className="  md:hidden  left w-screen min-h-screen   bg-[#ff000026] pt-[100px]">
            <h3 className="text-center ">Conversations</h3>

            <div className="flex flex-col mt-8  items-center justify-center">
              {!loadingConversations ? (
                conversation.length == 0 ? (
                  <h5>No Conversations yet</h5>
                ) : (
                  conversation.map((item) => {
                    // console.log(item);
                    return (
                      <div className="flex items-center">
                        {" "}
                        <h2
                          className="cursor-pointer capitalize bg-[#ff000027] mr-3 text-xl py-2 px-3 rounded-lg "
                          onClick={() => {
                            console.log(item);
                            if (user) {
                              setActiveConversation(item.receiver);
                            } else {
                              setActiveConversation(item.sender);
                            }

                            setActiveConversationId(item.id);
                            setShowConversation(false);
                          }}
                        >
                          {user ? item.receiver.username : item.sender.usercode}{" "}
                        </h2>
                        {user && (
                          <i
                            className="bi bi-three-dots text-[red] transition-all hover:scale-[130%] -mt-2 cursor-pointer"
                            onClick={() => {
                              setDeletingId(item.id);
                              setDeletingName(
                                user
                                  ? item.receiver.username
                                  : item.sender.usercode
                              );
                              handleShowDelete();
                              // deleteMessage(item.id);
                            }}
                          ></i>
                        )}
                      </div>
                    );
                  })
                )
              ) : (
                <h5 className="text-xl">Loading Conversations...</h5>
              )}
            </div>
          </div>
        )}
        <div>
          <div className=" hidden md:block  left w-[30vw] h-screen fixed left-0 bg-[#ff000026] pt-[100px]">
            <h3 className="text-center text-2xl">Conversations</h3>

            <div className="flex flex-col mt-8 items-center justify-center">
              {!loadingConversations ? (
                conversation.length == 0 ? (
                  <h5>No Conversations yet</h5>
                ) : (
                  conversation.map((item) => {
                    return (
                      <div className="flex items-center">
                        {" "}
                        <h2
                          onClick={() => {
                            console.log(item);
                            if (user) {
                              setActiveConversation(item.receiver);
                            } else {
                              setActiveConversation(item.sender);
                            }
                            setActiveConversationId(item.id);
                          }}
                          className="text-xl cursor-pointer hover:text-[#361414] hover:bg-[#ff000018] px-3 py-2 rounded-lg capitalize"
                        >
                          {user ? item.receiver.username : item.sender.usercode}
                        </h2>
                        {user && (
                          <i
                            className="bi bi-three-dots text-[red] ml-1 transition-all hover:scale-[130%] -mt-2 cursor-pointer"
                            onClick={() => {
                              setDeletingId(item.id);
                              setDeletingName(
                                user
                                  ? item.receiver.username
                                  : item.sender.usercode
                              );
                              handleShowDelete();
                              // deleteMessage(item.id);
                            }}
                          ></i>
                        )}
                      </div>
                    );
                  })
                )
              ) : (
                <h5 className="text-xl">Loading Conversations...</h5>
              )}
            </div>
          </div>
        </div>
        <div>
          {!showConversations && (
            <div className="right  md:block md:ml-[30vw] w-screen md:w-[70vw] h-screen  pt-[54px] ">
              {activeConversation?.id && (
                <div className="border-b-2 bg-[white] border-[#00000017]  h-[60px] flex items-center fixed top-[54px] w-screen">
                  <div className="flex items-center justify-between w-full ">
                    <div className="flex items-center">
                      <i
                        onClick={() => {
                          setShowConversation(true);
                        }}
                        className="bi bi-arrow-left font-bold mt-[15px] text-2xl mr-[-10px] ml-3 md:hidden"
                      ></i>
                      <img
                        src="https://picsum.photos/40/40"
                        alt=""
                        className="rounded-full ml-5 mt-1"
                      />
                      <h3 className="mt-3 text-xl ml-4 capitalize">
                        {activeConversation?.username ||
                          activeConversation?.usercode ||
                          activeConversation?.receiver?.username ||
                          activeConversation?.receiver?.usercode}
                      </h3>
                    </div>
                    <button
                      onClick={() => {
                        getUserMessages();
                      }}
                      className="bg-[#ff00001d] mr-4 py-2 font-semibold hover:scale-[103%] transition-all px-2 text-[10px] text-[red] rounded-md"
                    >
                      <i className="bi bi-arrow-clockwise "></i> Refresh
                    </button>
                  </div>
                </div>
              )}
              <div className="mt-3 px-6 pb-[200px] pt-[60px]">
                {allUserMessages.map((item) => {
                  return (
                    <p
                      className={`${
                        user && item.sender_type === "user" && "text-end"
                      } ${
                        username && item.sender_type !== "user" && "text-end"
                      }`}
                    >
                      <span className="bg-red-300 inline-block px-3 py-2 text-base  rounded-xl capitalize">
                        {item.content}
                      </span>
                    </p>
                  );
                })}
              </div>{" "}
            </div>
          )}
          <div className="right hidden md:block md:ml-[30vw] w-screen md:w-[70vw] h-screen  pt-[54px] ">
            {activeConversation?.id && (
              <div className="border-b-2 bg-[white] border-[#00000012]  h-[60px] flex items-center fixed top-[54px] w-screen">
                <div className="flex items-center  justify-between w-[70vw]">
                  <div className="flex items-center ">
                    <i
                      onClick={() => {
                        setShowConversation(true);
                      }}
                      className="bi bi-arrow-left font-bold mt-[15px] text-2xl mr-[-10px] ml-3 md:hidden"
                    ></i>
                    <img
                      src="https://picsum.photos/40/40"
                      alt=""
                      className="rounded-full ml-5 mt-1"
                    />
                    <h3 className="mt-3 text-xl ml-4 capitalize">
                      {activeConversation?.username ||
                        activeConversation?.usercode ||
                        activeConversation?.receiver?.username ||
                        activeConversation?.receiver?.usercode}
                    </h3>
                  </div>

                  <button
                    onClick={() => {
                      getUserMessages();
                    }}
                    className="bg-[#ff00001d] mr-4 py-2 font-semibold hover:scale-[103%] transition-all px-2 text-[13px] text-[red] rounded-md"
                  >
                    <i className="bi bi-arrow-clockwise "></i> Refresh
                  </button>
                </div>
              </div>
            )}
            <div className="mt-3 px-6 pb-[200px] pt-[60px]">
              {allUserMessages.map((item) => {
                console.log(item);
                return user ? (
                  <p
                    className={`${
                      user && item.sender_type === "user" && "text-end"
                    } ${
                      username && item.sender_type !== "user" && "text-end "
                    }`}
                  >
                    <span
                      className={` inline-block px-3 text-base py-2 rounded-xl capitalize ${
                        user && item.sender_type === "user"
                          ? " bg-red-300"
                          : "bg-black text-white"
                      } ${
                        username && item.sender_type !== "user"
                          ? "bg-black"
                          : "bg-red-300"
                      }`}
                    >
                      {item.content}
                    </span>
                  </p>
                ) : (
                  <p
                    className={`${
                      user && item.sender_type === "user" && "text-end"
                    } ${
                      username && item.sender_type !== "user" && "text-end "
                    }`}
                  >
                    <span
                      className={` inline-block px-3 text-base py-2 rounded-xl capitalize ${
                        username && item.sender_type !== "user"
                          ? " bg-black text-white"
                          : "bg-red-300  "
                      }`}
                    >
                      {item.content}
                    </span>
                  </p>
                );
              })}
            </div>{" "}
          </div>

          {activeConversation?.id && (
            <div className="flex md:w-[70vw] w-screen items-center  md:ml-[30vw] bg-[#00000053] justify-center fixed bottom-[55px]">
              <form action="" className="   justify-center items-center">
                <div className="flex items-center">
                  <textarea
                    name=""
                    id=""
                    cols={20}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      handleChange(e);
                    }}
                    className="border-2 rounded-xl overflow-hidden my-3 border-[red] focus:border-[red] active::border-[red] px-3 pt-3 pb-4 placeholder:text-[red] hidden md:block w-[50vw]"
                    placeholder="Message"
                    style={{ height: `${height}px` }}
                  ></textarea>
                  <textarea
                    name=""
                    id=""
                    rows="10"
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      handleChange(e);
                    }}
                    className="border-2 my-3 rounded-xl overflow-hidden  w-[60vw] sm:w-[70vw] border-[red] focus:border-[red] active::border-[red] px-3 pt-3 pb-4 placeholder:text-[red] md:hidden "
                    placeholder="Message"
                    style={{ height: `${height}px` }}
                  ></textarea>

                  {sendingMessage ? (
                    <button
                      type="submit"
                      className=" ml-2 lg:ml-8 form-top text-base  text-white px-[30px] py-[10px] rounded-2xl mt-3  mb-3   "
                    >
                      <div class="spinner-border text-white" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className=" ml-2 lg:ml-8 form-top text-base  text-white px-[30px] py-[10px] rounded-2xl mt-3  mb-3   "
                      onClick={(e) => {
                        e.preventDefault();

                        // sendInitialMessage();
                        sendMessage();
                      }}
                    >
                      <i className="bi bi-send "></i>
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {user && (
            <div
              className="fixed  bottom-[150px] right-[30px] bg-[red] h-[40px] w-[40px] rounded-full hidden md:flex items-center justify-center cursor-pointer"
              onClick={() => {
                handleShow();
                getCounsellors();
                getCounsellors2();
                setIsSearchingByField(true);
              }}
            >
              <i className="bi bi-chat-right-text-fill text-lg text-white pt-[0.39rem]"></i>
            </div>
          )}

          {user && showConversations && (
            <div
              className="fixed  bottom-[150px] right-[30px] bg-[red] h-[40px] w-[40px] rounded-full flex  md:hidden items-center justify-center cursor-pointer"
              onClick={() => {
                handleShow();
              }}
            >
              <i className="bi bi-chat-right-text-fill text-lg text-white pt-[0.39rem]"></i>
            </div>
          )}

          <Offcanvas show={show} onHide={handleClose} placement="end">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Select Counsellor </Offcanvas.Title>
            </Offcanvas.Header>
            {loading === true && (
              <div className="fixed top-0   h-[100vh] w-[30vw] z-50 overflow-x-hidden bg-[#00000064] bg-cover flex justify-center items-center">
                <svg
                  class="pl overflow-x-hidden"
                  viewBox="0 0 200 200"
                  width="200"
                  height="200"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      id="pl-grad1"
                      x1="1"
                      y1="0.5"
                      x2="0"
                      y2="0.5"
                    >
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
            <div className="left  pt-3  pb-[130px]   h-[100vh] w-full overflow-y-scroll  border-2 shadow-2xl   ">
              <div className="text-xl text-center z-40 max-w-[80%] mx-auto text-[red]">
                {!isSearchingByName ? (
                  <div className="text-xl text-center z-40 max-w-[80%] mx-auto text-[red]">
                    Search Councellors
                    {isSearchingByField
                      ? "by Field"
                      : ` in  
                ${fieldNameToDisplay}`}
                  </div>
                ) : (
                  "Search Councellors by Name"
                )}
              </div>

              <div className="flex justify-center mt-3">
                {isSearchingByName ? (
                  <button
                    className="bg-[red] py-2 px-3 rounded text-white "
                    onClick={() => {
                      setIsSearchingByName(!isSearchingByName);
                    }}
                  >
                    <i className="bi bi-arrow-right"></i> Search by Field
                  </button>
                ) : (
                  <button
                    className="bg-[red] py-2 px-3 rounded text-white "
                    onClick={() => {
                      setIsSearchingByName(!isSearchingByName);
                    }}
                  >
                    <i className="bi bi-arrow-right"></i> Search by name
                  </button>
                )}
              </div>
              {!isSearchingByName ? (
                <div>
                  {" "}
                  {isSearchingByField ? (
                    <div>
                      <form action="" className="flex justify-center mb-4">
                        <input
                          type="text"
                          value={fieldName}
                          onChange={(e) => {
                            setFieldName(e.target.value);
                            const newdata = fieldList.filter((item) =>
                              item.name
                                .toLowerCase()
                                .includes(fieldName.toLowerCase())
                            );
                            setFieldList(newdata);
                          }}
                          className="w-[80%] rounded border-2 placeholder:text-[red] border-[red] p-2 mt-4"
                          placeholder="Search by field"
                        />
                      </form>
                      <div className="mt-6 sm:ml-10">
                        <h3 className="text-xl text-center">
                          {fieldList.length === 0 && "Not Available"}
                        </h3>
                        {fieldList.map((item) => {
                          return (
                            <div className="flex justify-start items-center mt-4">
                              {/* <img src={item.image} alt="" /> */}
                              <h4
                                onClick={() => {
                                  //   navigate(`/counsellor/${item.id}`);
                                  getCounsellors(item.name);
                                  setFieldNameToDisplay(item.name);
                                  setIsSearchingByField(false);
                                  // setShowConversation(false);
                                }}
                                className="text-[black] uppercase text-sm  cursor-pointer hover:text-[red] max-w-[70%]"
                              >
                                {item?.name}
                              </h4>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex ml-3 mt-3">
                        <button
                          className="bg-[red] py-2 px-3 rounded text-white"
                          onClick={() => {
                            setIsSearchingByField(true);
                          }}
                        >
                          <i className="bi bi-arrow-left"></i> Fields
                        </button>
                      </div>
                      <form action="" className="flex justify-center mb-4">
                        <input
                          type="text"
                          value={filterName}
                          onChange={(e) => {
                            setFieldName(e.target.value);
                            const newdata = counsellors.filter((item) =>
                              item.username
                                .toLowerCase()
                                .includes(fieldName.toLowerCase())
                            );
                            setCounsellors(newdata);
                          }}
                          className="w-[80%] rounded border-2 placeholder:text-[red] border-[red] p-2 mt-3"
                          placeholder="Search by name"
                        />
                      </form>

                      <div className="mt-6">
                        <h3 className="text-xl text-center">
                          {counsellors.length === 0 && "Not Available"}
                        </h3>
                        {counsellors.map((item) => {
                          return (
                            <div className="flex justify-start items-center mt-4 pl-[22px]">
                              {/* <img src={item.image} alt="" /> */}
                              <h4
                                onClick={() => {
                                  // navigate(`/counsellor/${item.id}`);

                                  setShowConversation(false);

                                  getConversationsFromSearch(item.id, item);
                                  handleClose();
                                }}
                                className="text-[black] uppercase text-sm ml-3 cursor-pointer hover:text-[red] max-w-[70%]"
                              >
                                {item?.username}
                              </h4>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}{" "}
                </div>
              ) : (
                <h3 className="">
                  <form action="" className="flex justify-center mb-4">
                    <input
                      type="text"
                      value={filterName2}
                      onChange={(e) => {
                        setFilterName2(e.target.value);
                        const newdata = counsellors2.filter((item) =>
                          item.username
                            .toLowerCase()
                            .includes(filterName2.toLowerCase())
                        );
                        setDataDisplayed2(newdata);
                      }}
                      className="w-[80%] rounded border-2 placeholder:text-lg placeholder:text-[red] border-[red] p-2 mt-4"
                      placeholder="Search by name"
                    />
                  </form>

                  <div className="mt-7 sm:ml-10">
                    {dataDisplayed2.map((item) => {
                      return (
                        <div className="flex justify-start items-center mt-2 ">
                          {/* <img src={item.image} alt="" /> */}
                          <h4
                            onClick={() => {
                              // navigate(`/counsellor/${item.id}`);
                              console.log(item);
                              setShowConversation(false);
                              getConversationsFromSearch(item.id, item);
                              handleClose();
                            }}
                            className="text-[black] uppercase text-base cursor-pointer hover:text-[red] max-w-[70%]"
                          >
                            {item?.username}
                          </h4>
                        </div>
                      );
                    })}
                  </div>

                  {dataDisplayed2.length === 0 && (
                    <p className="mx-auto ml-3 w-[70%]">
                      No Counsellor Matches the Description
                    </p>
                  )}
                </h3>
              )}
            </div>
          </Offcanvas>

          <Modal
            show={showDelete}
            onHide={handleCloseDelete}
            className="z-[500]"
          >
            <Modal.Header closeButton>
              <Modal.Title>Delete Chat</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className="!leading-[27px]">
                {" "}
                Are you sure you want to delete chat with{" "}
                <span className="uppercase font-semibold">{deletingName}</span>
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                className="bg-slate-700 hover:bg-slate-700"
                onClick={handleCloseDelete}
              >
                Close
              </Button>
              {!deletingmessage ? (
                <Button
                  variant="primary"
                  className="!bg-[red] hover:bg-[red]"
                  onClick={() => {
                    deleteMessage(deletingId);
                  }}
                >
                  Delete
                </Button>
              ) : (
                <Button
                  variant="primary"
                  className="!bg-[grey] text-white hover:bg-[red]"
                >
                  Loading...
                </Button>
              )}
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  ) : (
    <div className="relative">
      <img
        src={confessbg}
        alt=""
        className="absolute h-screen w-screen brightness-[20%] "
      />
      <div className=" relative flex flex-col justify-center items-center h-screen text-center z-30">
        <span className="text-2xl text-white">
          Redirecting to Login page in {time}
        </span>
      </div>
    </div>
  );
};
