import React, { useEffect, useState } from "react";
import dateFormat, { masks } from "dateformat";
import { useDispatch, useSelector } from "react-redux";
import Axios from "axios";
import {
  setCommentss,
  setCounsellorComments,
} from "../redux/actions/UserActions";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

export const EachcommentForCounsellor = ({ item }) => {
  console.log(item);
  const token = useSelector((state) => {
    return state.user.token;
  });

  console.log(item);
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate("");

  // console.log(token);
  const [replies, setReplies] = useState([]);
  const [counsellorReplies, setCounsellorReplies] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [loadingItemId, setLoadingItemId] = useState(null);
  const [allLikes, setAllLikes] = useState(0);
  const [allReplies, setAllReplies] = useState(0);

  const user = useSelector((state) => {
    return state?.user?.user?.usercode;
  });
  const username = useSelector((state) => {
    return state?.user?.user?.username;
  });
  const userId = useSelector((state) => {
    return state.user.user.id;
  });

  console.log(userId);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const dispatch = useDispatch();
  const pageComments = useSelector((state) => {
    return state.user.comments;
  });

  // console.log(pageComments);
  const counsellorcomments = useSelector((state) => {
    return state.user.counsellorcomments;
  });

  const [height, setHeight] = useState(0);

  const handleChange = (e) => {
    const element = e.target;
    const scrollHeight = element.scrollHeight || 0;
    const clientHeight = element.clientHeight || 0;
    const height = Math.max(scrollHeight, clientHeight);
    setHeight(height);
  };

  const handleCommentDelete = async (id) => {
    setLoading(true);
    try {
      if (user) {
        const data = await Axios.delete(
          `https://restapis.myconfessionz.com/api/user-delete-comment/${id}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (data.status === 500) {
          navigate("/homepage");
        }

        const newlist = pageComments.filter((item) => item.id !== id);
        dispatch(setCommentss(newlist));
        setLoading(false);
      } else {
        const data = await Axios.delete(
          `https://restapis.myconfessionz.com/api/counselor-delete-comment/${id}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // if (data.status === 500) {
        //   navigate("/homepage");
        // }

        const newlist = counsellorcomments.filter((item) => item.id !== id);
        dispatch(setCounsellorComments(newlist));

        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      navigate("/homepage");
    }
  };

  const deleteAnonymousReply = async (id) => {
    setLoading(true);
    try {
      const data = await Axios.delete(
        `https://restapis.myconfessionz.com/api/delete-reply-anon/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.status === 500) {
        navigate("/homepage");
      }
      // console.log(data);
      setLoading(false);
      getReplies(item.id);
    } catch (error) {
      setLoading(false);
      console.log(error);
      // navigate("/login");
      navigate("/homepage");
    }
  };
  const deleteCounsellorReply = async (id) => {
    setLoading(true);
    try {
      const data = await Axios.delete(
        `https://restapis.myconfessionz.com/api/delete-reply-counselor/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.status === 500) {
        navigate("/homepage");
      }
      // console.log(data);
      setLoading(false);
      getCounsellorReplies(item.id);
    } catch (error) {
      setLoading(false);
      console.log(error);
      // navigate("/login");
      navigate("/homepage");
    }
  };
  const getReplies = async (id) => {
    setLoading(true);
    try {
      const data = await Axios.get(
        `https://restapis.myconfessionz.com/api/all-comment-replies/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.status === 500) {
        navigate("/homepage");
      }
      // console.log(data);
      setLoading(false);
      setReplies(data.data.commentReplies);
    } catch (error) {
      setLoading(false);
      console.log(error);
      // navigate("/login");
    }
  };
  const getCounsellorReplies = async (id) => {
    setLoading(true);
    try {
      const data = await Axios.get(
        `https://restapis.myconfessionz.com/api/all-comment-replies-counselor/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCounsellorReplies(data.data.commentReplies);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      // navigate("/login");
    }
  };
  console.log(username);
  const submitReply = async (id) => {
    setSubmitLoading(true);
    // console.log(username);
    try {
      if (user) {
        console.log("There is user");
        const data = await Axios.post(
          `https://restapis.myconfessionz.com/api/reply/${id}`,
          { reply: newReply },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (data.status === 500) {
          navigate("/homepage");
        }
        getReplies(item.id);

        setSubmitLoading(false);
        setNewReply("");
      } else {
        console.log("There is no user");
        const data = await Axios.post(
          `https://restapis.myconfessionz.com/api/reply-counselor/${id}`,
          { reply: newReply },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (data.status === 500) {
          navigate("/homepage");
        }

        getCounsellorReplies(item.id);

        setSubmitLoading(false);
      }
    } catch (error) {
      setSubmitLoading(false);
      console.log(error);
      // navigate("/login");
      navigate("/homepage");
    }
  };

  console.log(item);
  const [commentUserDetails, setCommentUserDetails] = useState({});
  const [fetching, setFetching] = useState(false);

  const getComment = async () => {
    if (item.user_comment) {
      try {
        const response = await Axios.get(
          `https://restapis.myconfessionz.com/api/user-single-comment/${item.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const isThere = response.data?.userLikes?.find(
          (item) => item.user_id === userId
        );
        const isCounsellorThere = response.data?.counselorLikes?.find(
          (item) => item.counselor_id === userId
        );
        if (isThere || isCounsellorThere) {
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }

        console.log(response);
        setAllLikes(response.data.allLikes);
        setAllReplies(response.data.allReplies);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        setFetching(true);
        const response = await Axios.get(
          `https://restapis.myconfessionz.com/api/counselor-single-comment/${item.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCommentUserDetails(response?.data?.counselor);
        const isThere = response.data?.userLikes?.find(
          (item) => item.user_id === userId
        );
        const isCounsellorThere = response.data?.counselorLikes?.find(
          (item) => item.counselor_id === userId
        );
        if (isThere || isCounsellorThere) {
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
        setAllLikes(response.data.allLikes);
        setAllReplies(response.data.allReplies);
        setFetching(false);
      } catch (error) {
        console.log(error);
        setFetching(false);
      }
    }
  };
  function calculateAge(dateString) {
    // Create a new date object from the input string
    var birthDate = new Date(dateString);

    // Get the current date
    var currentDate = new Date();

    // Calculate the difference in years
    var age = currentDate.getFullYear() - birthDate.getFullYear();

    // Check if the current date has passed the birthdate for this year
    if (
      currentDate.getMonth() < birthDate.getMonth() ||
      (currentDate.getMonth() === birthDate.getMonth() &&
        currentDate.getDate() < birthDate.getDate())
    ) {
      age--; // Subtract 1 from age if the birthdate has not been reached yet
    }

    return age;
  }
  var dateString = commentUserDetails?.dob;

  var age = calculateAge(dateString);

  useEffect(() => {
    getComment();
  }, []);

  useEffect(() => {
    getReplies(item.id);
    getCounsellorReplies(item.id);
  }, []);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showCounsellorReplies, setShowcounsellorreplies] = useState(false);
  console.log(item);
  const [isliking, setIsliking] = useState(false);
  const [likechanged, setLikeChanged] = useState(true);
  console.log(token);
  const likeAPost = async () => {
    if (!isliking) {
      if (user) {
        if (item.user_comment) {
          setIsLiked(!isLiked);
          if (isLiked) {
            setAllLikes(allLikes - 1);
          } else {
            setAllLikes(allLikes + 1);
          }
          try {
            setIsliking(true);
            console.log(token);
            console.log(
              `https://restapis.myconfessionz.com/api/user-like-user-comment/${item.post_id}/${item.id}`
            );
            const result = await Axios.post(
              `https://restapis.myconfessionz.com/api/user-like-user-comment/${item.post_id}/${item.id}`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            console.log(result);

            if (result.status === 201) {
              setIsLiked(true);
              setAllLikes(allLikes + 1);
            } else {
              setIsLiked(false);
              if (allLikes > 0) {
                setAllLikes(allLikes - 1);
              }
            }
            setLikeChanged(!likechanged);
            setIsliking(false);
            // setCounslen(result.data.PostComments.length);
            // setPageData(result.data.posts);
          } catch (error) {
            setIsliking(false);
            console.log(error);
            setIsLiked(!isLiked);
            // navigate("/login");
          }
        } else {
          setIsLiked(!isLiked);
          try {
            setIsliking(true);
            const result = await Axios.post(
              `https://restapis.myconfessionz.com/api/user-like-counselor-comment/${item.post_id}/${item.id}`,

              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            console.log(result);

            if (result.status === 201) {
              setIsLiked(true);
              setAllLikes(allLikes + 1);
            } else {
              setIsLiked(false);
              if (allLikes > 0) {
                setAllLikes(allLikes - 1);
              }
            }
            setLikeChanged(!likechanged);
            setIsliking(false);
            // setCounslen(result.data.PostComments.length);
            // setPageData(result.data.posts);
          } catch (error) {
            console.log(error);
            setIsLiked(!isLiked);
            setIsliking(false);
            // navigate("/login");
          }
        }
      } else {
        if (item.user_comment) {
          setIsLiked(!isLiked);
          try {
            setIsliking(true);
            const result = await Axios.post(
              `https://restapis.myconfessionz.com/api/counselor-like-user-comment/${item.post_id}/${item.id}`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            console.log(result);

            if (result.status === 201) {
              setIsLiked(true);
              setAllLikes(allLikes + 1);
            } else {
              setIsLiked(false);
              if (allLikes > 0) {
                setAllLikes(allLikes - 1);
              }
            }
            setLikeChanged(!likechanged);
            setIsliking(false);
            // setCounslen(result.data.PostComments.length);
            // setPageData(result.data.posts);
          } catch (error) {
            setIsliking(false);
            console.log(error);
            setIsLiked(!isLiked);
            // navigate("/login");
          }
        } else {
          setIsLiked(!isLiked);
          try {
            setIsliking(true);
            const result = await Axios.post(
              `https://restapis.myconfessionz.com/api/counselor-like-counselor-comment/${item.post_id}/${item.id}`,

              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            console.log(result);

            if (result.status === 201) {
              setIsLiked(true);
              setAllLikes(allLikes + 1);
            } else {
              setIsLiked(false);
              if (allLikes > 0) {
                setAllLikes(allLikes - 1);
              }
            }
            setLikeChanged(!likechanged);
            setIsliking(false);
            // setCounslen(result.data.PostComments.length);
            // setPageData(result.data.posts);
          } catch (error) {
            console.log(error);
            setIsLiked(!isLiked);
            setIsliking(false);
            // navigate("/login");
          }
        }
      }
    }
  };

  return (
    <div>
      <div className=" mx-auto  w-[90vw] lg:w-[45vw] text-[red]  mb-11 ">
        {!fetching ? (
          <div>
            <div className="flex">
              <div className="h-[40px] w-[40px] bg-[red]  rounded-full flex flex-col items-center justify-center">
                {commentUserDetails?.username && (
                  <h2 className="text-xl mt-[10px] text-white">
                    {" "}
                    {commentUserDetails?.username.charAt(0).toUpperCase()}
                    {commentUserDetails?.username.charAt(1).toUpperCase()}
                  </h2>
                )}
              </div>
              <div className="flex text-[red]">
                <div className="flex flex-col text-[red] ml-2">
                  <span className="text-xl font-bold capitalize">
                    {commentUserDetails?.username}, {commentUserDetails?.gender}
                    , {age}
                    {age > 2 ? " years" : " year"}
                  </span>
                  <br />
                  <span className="mt-[-13px]">
                    {dateFormat(item?.created_at, "mmmm d, yyyy")},
                  </span>{" "}
                  <br />
                </div>
              </div>
            </div>

            <p
              className=" px-3 py-2 mb-4 rounded-xl !ml-[45px] text-[white] bg-red-600 w-full inline-block"
              style={{
                margin: 0,
                padding: 0,
                display: "inline-block",
                width: "auto",
              }}
            >
              {item.user_comment || item.counselor_comment}
            </p>

            <div className=" rounded-2xl flex flex-col justify-around items-stretch bg-white pb-4 text-[red] pt-4 shadow-lg">
              <div className="flex pl-[40px]   items-center">
                <div className=" flex  p-2 min-w-[40px] md:max-w-[150px] justify-center items-center hover:cursor-pointer bg-[#ff00003c] w-[26%] rounded-2xl  ">
                  {!isLiked && (
                    <div
                      onClick={() => {
                        // setIsLiked(true);
                        // console.log(item);
                      }}
                      className=" "
                    >
                      <div className="font-bold  text-xl text-[red]  mr-2 flex items-center justify-center pl-2 sm:pl-0 ">
                        {allLikes}
                        <i
                          onClick={() => {
                            setIsLiked(true);
                            // // console.log(item);
                            likeAPost();
                          }}
                          className="bi bi-hand-thumbs-up-fill cursor-pointer text-3xl  text-slate-600 pl-[5px]  "
                        ></i>
                      </div>
                    </div>
                  )}

                  {isLiked && (
                    <div
                      onClick={() => {
                        // setIsLiked(true);
                        // console.log(item);
                      }}
                      className=" "
                    >
                      <div className="font-bold  text-xl text-[red]  mr-2 flex items-center justify-center  pl-2 sm:pl-0  ">
                        {allLikes}
                        <i
                          onClick={() => {
                            likeAPost();
                            setIsLiked(false);
                          }}
                          className="bi bi-hand-thumbs-up-fill cursor-pointer text-3xl  text-[red] pl-[5px]  "
                        ></i>
                      </div>
                    </div>
                  )}
                  {/* <h3 className=" text-[red] text-xl">React</h3>   */}
                </div>
                {userId === item.counselor_id && (
                  <button
                    onClick={() => {
                      handleCommentDelete(item.id);
                    }}
                    type="submit"
                    className=" flex py-[20px] font-bold px-2 min-w-[40px] md:max-w-[150px] justify-center items-center ml-5 hover:cursor-pointer bg-[#ff00003c] w-[26%] rounded-2xl  "
                  >
                    {loading ? (
                      <div className=" flex items-center">
                        <div
                          class="spinner-border float-end mr-2 text-[5px]"
                          role="status"
                        >
                          <span class="visually-hidden">Loading...</span>
                        </div>
                        Loading
                      </div>
                    ) : (
                      <div className="">Delete</div>
                    )}
                  </button>
                )}
              </div>

              {/* {console.log(item.postId)} */}
              {/* {console.log(userId)} */}
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <div class="post">
              <p class="post-image placeholder"></p>
              <p class="post-image placeholder"></p>
              <p class="post-image placeholder"></p>
              <p class="post-image placeholder"></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
