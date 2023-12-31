import React, { useEffect, useState } from "react";
import dateFormat from "dateformat";
import { useDispatch, useSelector } from "react-redux";
import Axios from "axios";
import {
  setCommentss,
  setCounsellorComments,
} from "../redux/actions/UserActions";
import Modal from "react-bootstrap/Modal";
// import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { EachReply } from "./eachreply";
// import { EachcommentForCounsellor } from "./eachcommentForCounsellor";
import { EachReplyCounsellor } from "./eachreplyCousellor";

export const Eachcomment = ({ item }) => {
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
  // const [loadingItemId, setLoadingItemId] = useState(null);
  const [allLikes, setAllLikes] = useState(0);
  // const [allReplies, setAllReplies] = useState(0);

  const user = useSelector((state) => {
    return state?.user?.user?.usercode;
  });
  // const username = useSelector((state) => {
  //   return state?.user?.user?.username;
  // });
  const userId = useSelector((state) => {
    return state.user.user.id;
  });

  const [commentUserDetails, setCommentUserDetails] = useState({});

  console.log(userId);
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
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
        await Axios.delete(
          `https://restapis.myconfessionz.com/api/counselor-delete-comment/${id}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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

  const submitReply = async (id) => {
    setSubmitLoading(true);
    // console.log(username);
    try {
      if (user) {
        console.log("There is user");
        const data = await Axios.post(
          `https://restapis.myconfessionz.com/api/user-reply-user/${id}`,
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
        getComment();

        setSubmitLoading(false);
        setNewReply("");
      } else {
        console.log("There is no user");
        const data = await Axios.post(
          `https://restapis.myconfessionz.com/api/counselor-reply-user/${id}`,
          { reply: newReply },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        getComment();
        setNewReply("");
        if (data.status === 500) {
          navigate("/homepage");
        }

        setSubmitLoading(false);
      }
    } catch (error) {
      setSubmitLoading(false);
      console.log(error);
      // navigate("/login");
      navigate("/homepage");
    }
  };

  const getComment = async () => {
    if (item.user_comment) {
      try {
        setCommentLoading(true);
        const response = await Axios.get(
          `https://restapis.myconfessionz.com/api/user-single-comment/${item.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCommentUserDetails(response?.data?.user);

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

        setReplies(response.data.userReplies);
        setCounsellorReplies(response.data.counselorReplies);
        setAllLikes(response.data.allLikes);
        // setAllReplies(response.data.allReplies);
        console.log(response);
        setCommentLoading(false);
      } catch (error) {
        setCommentLoading(false);
        console.log(error);
      }
    } else {
      try {
        const response = await Axios.get(
          `https://restapis.myconfessionz.com/api/counselor-single-comment/${item.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAllLikes(response.data.allLikes);
        // setAllReplies(response.data.allReplies);
        console.log(response);
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
        // console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // eslint-disable-next-line
  useEffect(() => {
    getComment();
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
          try {
            setIsliking(true);
            if (isLiked) {
              setAllLikes(allLikes - 1);
            } else {
              setAllLikes(allLikes + 1);
            }
            // console.log(token);
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
  var dateString = commentUserDetails.dob;

  var age = calculateAge(dateString);

  return (
    <div>
      <div className=" mx-auto  w-[90vw] lg:w-[45vw] text-[#f3b1b1]  mb-11 ">
        {!commentLoading ? (
          <div>
            <div className="flex">
              <div className="h-[40px] w-[40px] bg-[red]  rounded-full flex flex-col items-center justify-center">
                {commentUserDetails?.usercode && (
                  <h2 className="text-xl mt-[10px] text-white">
                    {" "}
                    {commentUserDetails?.usercode.charAt(0).toUpperCase()}
                    {commentUserDetails?.usercode.charAt(1).toUpperCase()}
                  </h2>
                )}
              </div>
              <div className="flex text-[red]">
                <div className="flex flex-col text-[red] ml-2">
                  <span className="text-xl font-bold capitalize">
                    {commentUserDetails?.usercode}, {commentUserDetails?.gender}
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

            <div className=" flex flex-col rounded-2xl justify-around items-stretch bg-white pb-4 text-[red] pt-4 shadow-lg">
              <div className="flex justify-around   items-center">
                <div
                  onClick={() => {
                    handleShow();

                    setModalData({
                      commentId: item.id,
                      title: item.comment,
                      replies: replies,
                      counsellorReplies: counsellorReplies,
                    });
                  }}
                  className=" flex  py-[13px] px-2 min-w-[40px] md:max-w-[150px] justify-center items-center hover:cursor-pointer bg-[#ff00003c] w-[26%] rounded-2xl  "
                >
                  <div className="font-bold  max-[450px]:text-[13px] sm:text-[20px] text-[red]  sm:mr-2 py-[8px] sm:py-[0]">
                    {replies.length + counsellorReplies.length}
                    <span className="text-[red] ml-1 sm:ml-3 max-[450px]:text-[13px] sm:text-[18px]">
                      {replies.length + counsellorReplies.length > 1
                        ? "Replies"
                        : "Reply"}
                    </span>
                  </div>
                </div>

                <div className=" flex  p-2 min-w-[40px] md:max-w-[150px] justify-center items-center hover:cursor-pointer bg-[#ff00003c] w-[26%] rounded-2xl  ">
                  {!isLiked && (
                    <div
                      onClick={() => {
                        // setIsLiked(true);
                        // console.log(item);
                      }}
                      className=" "
                    >
                      <div className="font-bold  text-xl text-[red]  mr-2 flex pl-2 pt-1 sm:pl-0 sm:pt-0">
                        {allLikes}
                        <i
                          onClick={() => {
                            setIsLiked(true);
                            // // console.log(item);
                            likeAPost();
                          }}
                          className="bi bi-hand-thumbs-up-fill cursor-pointer text-3xl -mt-1 sm:-mt-0 text-slate-600 pl-[5px]  "
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
                      className="flex "
                    >
                      <div className="font-bold  text-xl text-[red]  mr-2 flex ">
                        {allLikes}
                        <i
                          onClick={() => {
                            likeAPost();
                            setIsLiked(false);
                          }}
                          className="bi bi-hand-thumbs-up-fill cursor-pointer text-3xl -mt-1 sm:-mt-0 text-[red] pl-[5px]  "
                        ></i>
                      </div>
                    </div>
                  )}
                  {/* <h3 className=" text-[red] text-xl">React</h3>   */}
                </div>
                {userId === item.user_id && (
                  <button
                    onClick={() => {
                      handleCommentDelete(item.id);
                    }}
                    type="submit"
                    className=" flex py-[19px] sm:py-[20px] font-bold px-2 min-w-[40px] md:max-w-[150px] justify-center items-center hover:cursor-pointer bg-[#ff00003c] w-[26%] rounded-2xl  "
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
                      <div className="max-[450px]:text-xs ">Delete</div>
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

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalData.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="flex justify-around mb-[70px]">
            <div
              className={`${
                showCounsellorReplies && "border-b-2"
              }  border-[red] w-[40%] text-center pb-2 text-xl cursor-pointer`}
              onClick={() => {
                setShowcounsellorreplies(true);
              }}
            >
              Counselor Replies
            </div>
            <div
              className={`${
                !showCounsellorReplies && "border-b-2"
              }  border-[red] w-[40%] text-center pb-2 text-xl cursor-pointer`}
              onClick={() => {
                setShowcounsellorreplies(false);
              }}
            >
              Anonymous Replies
            </div>
            {/* <button
              type="submit"
              className=" form-top text-base text-white px-[20px] py-[12px] rounded-2xl  "
              onClick={() => setShowcounsellorreplies(!showCounsellorReplies)}
            >
              {!showCounsellorReplies
                ? "Counsellor Replies"
                : "Anonymous Replies"}
            </button> */}
          </div>

          {!showCounsellorReplies ? (
            replies.length === 0 ? (
              <h4 className="text-center my-7 text-xl">No Replies yet</h4>
            ) : (
              replies.map((item1) => {
                return (
                  <div>
                    <EachReply
                      item={item1}
                      getComment={getComment}
                      postId={item.post_id}
                      commentId={item.id}
                      replies={replies}
                      counsellorReplies={counsellorReplies}
                    ></EachReply>
                  </div>
                );
              })
            )
          ) : (
            <div className="mt-3">
              {counsellorReplies.length === 0 ? (
                <h4 className="text-center my-7 text-xl">No Replies yet</h4>
              ) : (
                counsellorReplies.map((item1) => {
                  return (
                    <div>
                      <EachReplyCounsellor
                        item={item1}
                        getComment={getComment}
                        postId={item.post_id}
                        commentId={item.id}
                        replies={replies}
                        counsellorReplies={counsellorReplies}
                      ></EachReplyCounsellor>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </Modal.Body>
        <div className="mypad"></div>
        <Modal.Footer>
          <div className="flex   rounded-2xl  ">
            <form
              action=""
              onSubmit={(e) => {
                e.preventDefault();
                submitReply(modalData.commentId);
              }}
              className="  py-3 items-center justify-center w-full rounded-xl bg-[#00000032] p-2  "
            >
              <textarea
                value={newReply}
                onChange={(e) => {
                  setNewReply(e.target.value);
                  handleChange(e);
                }}
                placeholder="Reply to the comment"
                className=" placeholder:text-black w-[100%] mb-2  overflow-y-hidden border-black border-2  rounded-xl p-3 pb-4"
                style={{ height: `${height}px` }}
                rows="1"
              ></textarea>
              <br />
              <button className="bg-red-600   py-3 px-2 rounded text-white">
                {submitLoading ? (
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
                  <div className="">Submit Reply</div>
                )}
              </button>
            </form>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
