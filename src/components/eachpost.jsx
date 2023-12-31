import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { confessions } from "../utils/confessions";
import { LoggedInNav } from "./loggedinNav";
import confessbg from "../utils/confessbg.jpg";
import { useDispatch, useSelector } from "react-redux";
import Axios from "axios";
import dateFormat, { masks } from "dateformat";
import { Eachcomment } from "./eachcomment";
import {
  setCounsellorComments,
  setCommentss,
} from "../redux/actions/UserActions";
import { EachcommentForCounsellor } from "./eachcommentForCounsellor";

export const EachPost = () => {
  const [postToBeShown, setPostToBeShown] = useState([]);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    return () => {
      setAllLikes(0);
    };
  }, []);

  const [isLiked, setIsLiked] = useState(false);
  const params = useParams();
  const [showCounsellorReplies, setShowcounsellorreplies] = useState(false);
  const [loading, setLoading] = useState(false);

  const [likechanged, setLikeChanged] = useState(true);
  const [allLikes, setAllLikes] = useState(0);
  const navigate = useNavigate();
  const user = useSelector((state) => {
    return state?.user?.user?.usercode;
  });
  const username = useSelector((state) => {
    return state?.user?.user?.username;
  });
  const userId = useSelector((state) => {
    return state?.user?.user?.id;
  });

  const [isliking, setIsliking] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);

  useEffect(() => {
    console.log(postToBeShown);
    if (postToBeShown.post) {
      setAllLikes(
        postToBeShown?.counselor_likes_count + postToBeShown?.user_likes_count
      );
      setCommentsCount(
        postToBeShown?.counselor_comments_count +
          postToBeShown?.user_comments_count
      );
    }
  }, [postToBeShown]);
  const likeAPost = async (id) => {
    if (!isliking) {
      setIsLiked(!isLiked);
      if (isLiked) {
        setAllLikes(allLikes - 1);
      } else {
        setAllLikes(allLikes + 1);
      }
      if (user) {
        setIsLiked(!isLiked);

        try {
          setIsliking(true);
          const result = await Axios.post(
            `https://restapis.myconfessionz.com/api/user-like-post/${id}`,
            { id: id },
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
            `https://restapis.myconfessionz.com/api/counselor-like-post/${id}`,
            { id: id },
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
  };
  const handleShareClick = async (shareURL) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Share this link",
          text: "Check out this link:",
          url: shareURL,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Web Share API is not supported on this browser.");
    }
  };
  useEffect(() => {
    // console.log(userId);
    const isThere = postToBeShown?.user_likes?.find(
      (item) => item.user_id === userId
    );
    const isCounsellorThere = postToBeShown?.counselor_likes?.find(
      (item) => item.counselor_id === userId
    );
    if (isThere || isCounsellorThere) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [postToBeShown]);

  const token = useSelector((state) => {
    return state.user.token;
  });
  const [deleting, setDeleting] = useState(false);

  const deletePost = async () => {
    try {
      setDeleting(true);
      const result = await Axios.delete(
        `https://restapis.myconfessionz.com/api/delete-post/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDeleting(false);
      navigate(-1);
    } catch (error) {
      setDeleting(false);
      console.log(error);
    }
  };
  const getData = async () => {
    try {
      setLoading(true);
      const result = await Axios.get(
        `https://restapis.myconfessionz.com/api/single-post/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(result);
      dispatch(setCommentss(result.data.post.user_comments));
      dispatch(setCounsellorComments(result.data.post.counselor_comments));
      setPostToBeShown(result.data.post);

      setLoading(false);

      setLoading(false);
      // setPageData(result.data.message);
    } catch (error) {
      setLoading(false);
      console.log(error);
      navigate("/homepage");
    }
  };
  const getDataForComment = async () => {
    try {
      // setLoading(true);
      const result = await Axios.get(
        `https://restapis.myconfessionz.com/api/single-post/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(result);
      dispatch(setCommentss(result.data.post.user_comments));
      dispatch(setCounsellorComments(result.data.post.counselor_comments));
      setPostToBeShown(result.data.post);

      // setPageData(result.data.message);
    } catch (error) {
      // setLoading(false);
      console.log(error);
      navigate("/homepage");
    }
  };
  useEffect(() => {
    console.log(postToBeShown);
  }, [postToBeShown]);

  const [comments, setComments] = useState([]);
  // const [pageComments, setPageComments] = useState([]);
  const [commentBody, setCommentBody] = useState("");
  // const [counsellorcomments, setcounsellorComments] = useState([]);
  const dispatch = useDispatch();
  // const getComments = async () => {
  //   console.log(params.id);
  //   try {
  //     setLoading(true);
  //     const result = await Axios.get(
  //       `https://restapis.myconfessionz.com/api/all-post-comment/${params.id}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     console.log(result);
  //     // dispatch(setCommentss(result.data));
  //     setLoading(false);
  //     console.log(result);
  //   } catch (error) {
  //     setLoading(false);
  //     console.log(error);
  //     // navigate("/login");
  //   }
  // };
  // const getcounsellorcomments = async () => {
  //   setLoading(true);
  //   try {
  //     const result = await Axios.get(
  //       `https://restapis.myconfessionz.com/api/all-post-comments-counselor/${params.id}`,

  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     // dispatch(setCounsellorComments(result.data.PostComments));
  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //     console.log(error);
  //     // navigate("/login");
  //   }
  // };
  const pageComments = useSelector((state) => {
    return state.user.comments;
  });

  console.log(pageComments);
  const counsellorcomments = useSelector((state) => {
    return state.user.counsellorcomments;
  });
  // console.log(counsellorcomments);

  console.log();

  useEffect(() => {
    window.scrollTo(0, 0);
    getData();
    // getComments();
    // getcounsellorcomments();
  }, []);

  console.log(userId);
  let [time, setTime] = useState(4);

  if (user === undefined && username === undefined) {
    setTimeout(() => setTime(time - 1), 1000);
  }

  useEffect(() => {
    if (time === 0) {
      navigate("/login");
    }
  }, [time]);

  const [height, setHeight] = useState(0);

  const handleChange = (e) => {
    const element = e.target;
    const scrollHeight = element.scrollHeight || 0;
    const clientHeight = element.clientHeight || 0;
    const height = Math.max(scrollHeight, clientHeight);
    setHeight(height);
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
  var dateString = postToBeShown?.user?.dob;

  var age = calculateAge(dateString);

  const [scrolling, setScrolling] = useState(false);
  let scrollTimer;

  const handleScroll = () => {
    setScrolling(true);

    // Clear the previous timer if it exists
    if (scrollTimer) {
      clearTimeout(scrollTimer);
    }

    // Set a new timer using setTimeout
    scrollTimer = setTimeout(() => {
      setScrolling(false);
    }, 3000); // Adjust the timeout duration as needed
  };
  return user !== undefined || username !== undefined ? (
    <div className="mb-[60px] ">
      <LoggedInNav></LoggedInNav>

      <div className="lg:flex ">
        <div className="">
          <div
            className={`postdiv hidden lg:block lg:w-[50vw] mb-7 lg:fixed lg:top-0 lg:bottom-0 lg:h-screen md:overflow-y-scroll  ${
              scrolling ? "counselordiv" : "disappear"
            }`}
            onScroll={() => {
              handleScroll();
            }}
          >
            {loading === true ? (
              <div>
                <div className="mt-[150px]">
                  <div class="post">
                    <p class="post-image placeholder"></p>
                    <p class="post-image placeholder"></p>
                    <p class="post-image placeholder"></p>
                    <p class="post-image placeholder"></p>
                  </div>
                  <div class="post mt-4">
                    <p class="post-image placeholder"></p>
                    <p class="post-image placeholder"></p>
                    <p class="post-image placeholder"></p>
                    <p class="post-image placeholder"></p>
                  </div>
                  <div class="post mt-4">
                    <p class="post-image placeholder"></p>
                    <p class="post-image placeholder"></p>
                    <p class="post-image placeholder"></p>
                    <p class="post-image placeholder"></p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-[130px]  border border-red-200 mb-[100px] shadow-xl py-4 mx-[10px] md:mx-[50px] px-3 md:px-6 ">
                <div className="flex">
                  <div className="h-[40px] w-[40px] bg-[red]  rounded-full flex flex-col items-center justify-center">
                    {postToBeShown?.user?.usercode && (
                      <h2 className="text-xl mt-[10px] text-white">
                        {" "}
                        {postToBeShown?.user?.usercode.charAt(0).toUpperCase()}
                        {postToBeShown?.user?.usercode.charAt(1).toUpperCase()}
                      </h2>
                    )}
                  </div>
                  <div className="flex items-center text-[red]">
                    <div className="flex text-[red] ml-2">
                      <span className="text-base  capitalize">
                        {postToBeShown?.user?.usercode ||
                          postToBeShown?.user?.username}
                        , {postToBeShown?.user?.gender}, {age}{" "}
                        {age > 2 ? "years" : "year"},{" "}
                        {dateFormat(postToBeShown.createdAt, "mmmm d, yyyy")}
                      </span>

                      <br />
                    </div>
                  </div>
                </div>
                <div className="mt-2 ml-[46px] leading-6 text-[black] hover:cursor-pointer">
                  {postToBeShown.post}
                </div>
                <div className="w-[93%] mx-auto bg-slate-300 h-[1px] my-3 "></div>
                <div className="mt-3 flex justify-around items-center">
                  <div className=" flex  p-2 min-w-[40px] md:max-w-[150px] justify-center items-center hover:cursor-pointer bg-[#ff00003c] w-[26%] rounded-2xl  ">
                    <div className="font-bold  text-xl text-[red]  mr-2 ">
                      {/* {console.log(item)} */}
                      {commentsCount}
                    </div>
                    <i className="bi bi-chat-right-dots text-2xl text-[red] pt-2"></i>
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
                        <div className="flex items-center text-[red] font-bold  text-xl">
                          {allLikes}
                          <i
                            onClick={() => {
                              setIsLiked(false);
                              // console.log(item);
                              likeAPost(postToBeShown.id);
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
                        <div className="flex items-center text-[red] font-bold  text-xl">
                          {allLikes}
                          <i
                            onClick={() => {
                              likeAPost(postToBeShown.id);
                              setIsLiked(false);
                            }}
                            className="bi bi-hand-thumbs-up-fill cursor-pointer text-3xl  text-[red] pl-[5px]  "
                          ></i>
                        </div>
                      </div>
                    )}
                    {/* <h3 className=" text-[red] text-xl">React</h3>   */}
                  </div>

                  <div
                    onClick={() => {
                      handleShareClick(postToBeShown.id);
                    }}
                    className="bg-[#ff00003c] rounded-2xl w-[26%] !min-w-[90px] md:max-w-[150px] justify-center flex font-bold text-[red] items-center  "
                  >
                    <button className="py-[20px] ">Share</button>
                    <i class="bi bi-share ml-2 text-xl font-bold text-[red] -mb-1 max-[400px]:text-base"></i>
                  </div>
                </div>
                <div className="w-[93%] mx-auto bg-slate-300 h-[1px] my-3 "></div>
                <div className="text-lg mt-2 ml-2 text-[red] font-semibold cursor-pointer">
                  <a
                    href="#new"
                    className="no-underline text-[red] hover:text-[#491f1f] transition-all ml-2"
                  >
                    Add new comment
                  </a>
                </div>

                {userId === postToBeShown.user_id && (
                  <div>
                    {deleting ? (
                      <button
                        className=" form-top text-base text-white px-[20px] py-[12px] rounded-2xl  mt-3 ml-4 "
                        // onClick={() => {
                        //   deletePost(postToBeShown.id);
                        // }}
                      >
                        Deleting..
                      </button>
                    ) : (
                      <button
                        className=" form-top text-base text-white px-[20px] py-[12px] rounded-2xl  mt-3 ml-4 "
                        onClick={() => {
                          deletePost(postToBeShown.id);
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div
            className={`postdiv lg:w-[50vw] lg:hidden mb-7 lg:fixed lg:top-0 lg:bottom-0 lg:h-screen md:overflow-y-scroll `}
            onScroll={() => {
              handleScroll();
            }}
          >
            {loading === true ? (
              <div>
                <div className="mt-[150px]">
                  <div class="post">
                    <p class="post-image placeholder"></p>
                    <p class="post-image placeholder"></p>
                    <p class="post-image placeholder"></p>
                    <p class="post-image placeholder"></p>
                  </div>
                  <div class="post mt-4">
                    <p class="post-image placeholder"></p>
                    <p class="post-image placeholder"></p>
                    <p class="post-image placeholder"></p>
                    <p class="post-image placeholder"></p>
                  </div>
                  <div class="post mt-4">
                    <p class="post-image placeholder"></p>
                    <p class="post-image placeholder"></p>
                    <p class="post-image placeholder"></p>
                    <p class="post-image placeholder"></p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-[130px] border border-red-200 mb-[60px] shadow-xl py-4 mx-[10px] md:mx-[50px] px-3 md:px-6 rounded-xl">
                <div className="flex">
                  <div className="h-[40px] w-[40px] bg-[red]  rounded-full flex flex-col items-center justify-center">
                    {postToBeShown?.user?.usercode && (
                      <h2 className="text-xl mt-[10px] text-white">
                        {" "}
                        {postToBeShown?.user?.usercode.charAt(0).toUpperCase()}
                        {postToBeShown?.user?.usercode.charAt(1).toUpperCase()}
                      </h2>
                    )}
                  </div>
                  <div className="flex text-[red]">
                    <div className="flex flex-col text-[red] ml-2">
                      <span className="text-xl font-bold capitalize">
                        {postToBeShown?.user?.usercode ||
                          postToBeShown?.user?.username}
                        , {postToBeShown?.user?.gender}, {age}{" "}
                        {age > 2 ? "years" : "year"}
                      </span>
                      <br />
                      <span className="mt-[-13px]">
                        {dateFormat(postToBeShown.createdAt, "mmmm d, yyyy")}
                      </span>{" "}
                      <br />
                    </div>
                  </div>
                </div>
                <div className="mt-2 ml-[46px] leading-6 text-[black] hover:cursor-pointer">
                  {postToBeShown.post}
                </div>
                <div className="w-[93%] mx-auto bg-slate-300 h-[1px] my-3 "></div>
                <div className="mt-3 flex justify-around items-center">
                  <div className=" flex  p-2 min-w-[40px] md:max-w-[150px] justify-center items-center hover:cursor-pointer bg-[#ff00003c] w-[26%] rounded-2xl  ">
                    <div className="font-bold  text-xl text-[red]  mr-2 ">
                      {/* {console.log(item)} */}
                      {commentsCount}
                    </div>
                    <i className="bi bi-chat-right-dots text-2xl text-[red] pt-2"></i>
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
                        <div className="flex items-center text-[red] font-bold  text-xl">
                          {allLikes}
                          <i
                            onClick={() => {
                              setIsLiked(false);
                              // console.log(item);
                              likeAPost(postToBeShown.id);
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
                        <div className="flex items-center text-[red] font-bold  text-xl">
                          {allLikes}
                          <i
                            onClick={() => {
                              likeAPost(postToBeShown.id);
                              setIsLiked(false);
                            }}
                            className="bi bi-hand-thumbs-up-fill cursor-pointer text-3xl  text-[red] pl-[5px]  "
                          ></i>
                        </div>
                      </div>
                    )}
                    {/* <h3 className=" text-[red] text-xl">React</h3>   */}
                  </div>

                  <div
                    onClick={() => {
                      handleShareClick(postToBeShown.id);
                    }}
                    className="bg-[#ff00003c] rounded-2xl w-[26%] !min-w-[90px] md:max-w-[150px] justify-center flex font-bold text-[red] items-center  "
                  >
                    <button className="py-[20px] ">Share</button>
                    <i class="bi bi-share ml-2 text-xl font-bold text-[red] -mb-1 max-[400px]:text-base"></i>
                  </div>
                </div>
                <div className="w-[93%] mx-auto bg-slate-300 h-[1px] my-3 "></div>
                <div className="text-lg mt-2 ml-2 text-[red] font-semibold cursor-pointer">
                  <a
                    href="#new"
                    className="no-underline text-[red] hover:text-[#491f1f] transition-all ml-2"
                  >
                    Add new comment
                  </a>
                </div>
                {userId === postToBeShown.user_id && (
                  <div>
                    {deleting ? (
                      <button
                        className=" form-top text-base text-white px-[20px] py-[12px] rounded-2xl  mt-3 ml-4 "
                        // onClick={() => {
                        //   deletePost(postToBeShown.id);
                        // }}
                      >
                        Deleting..
                      </button>
                    ) : (
                      <button
                        className=" form-top text-base text-white px-[20px] py-[12px] rounded-2xl  mt-3 ml-4 "
                        onClick={() => {
                          deletePost(postToBeShown.id);
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="commentsDiv lg:w-[50vw] lg:ml-[50vw] bg-red-50 ">
          {loading === true ? (
            <div>
              <div className="mt-[150px]">
                <div class="post">
                  <p class="post-image placeholder"></p>
                  <p class="post-image placeholder"></p>
                  <p class="post-image placeholder"></p>
                  <p class="post-image placeholder"></p>
                </div>
                <div class="post mt-4">
                  <p class="post-image placeholder"></p>
                  <p class="post-image placeholder"></p>
                  <p class="post-image placeholder"></p>
                  <p class="post-image placeholder"></p>
                </div>
                <div class="post mt-4">
                  <p class="post-image placeholder"></p>
                  <p class="post-image placeholder"></p>
                  <p class="post-image placeholder"></p>
                  <p class="post-image placeholder"></p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex lg:w-[50vw] items-center pt-6 lg:pt-0 mt-[40px] lg:mt-[88px] justify-center ">
                {/* <div className="w-[30%] mx-auto bg-[red] h-[1px] my-3 "></div> */}
                <div className="text-2xl text-[red] font-bold"> Comments</div>
                {/* <div className="w-[30%] mx-auto bg-[red] h-[1px] my-3 "></div> */}
              </div>
              <div className="w-[100%] mx-auto bg-[red] h-[1px] my-3 "></div>

              <div className="text-lg mt-2 ml-2 text-[red] font-semibold cursor-pointer">
                <a
                  href="#new"
                  className="no-underline text-[red] hover:text-[#491f1f] transition-all "
                >
                  Add new comment
                </a>
              </div>

              {/* <div className="text-2xl text-[red]"> Comments</div> */}

              <div className="flex justify-center">
                <button
                  type="submit"
                  className={`text-base text-[red] px-[20px] py-[12px]  mb-[70px] mt-4 ${
                    showCounsellorReplies && "border-b-2 border-red-400 "
                  }`}
                  onClick={() => setShowcounsellorreplies(true)}
                >
                  Counsellor Comments
                </button>

                <button
                  type="submit"
                  className={`text-base text-[red] px-[20px] py-[12px]  mb-[70px] mt-4 ml-[20px] md:ml-[60px] ${
                    !showCounsellorReplies && "border-b-2 border-red-400"
                  }`}
                  onClick={() => setShowcounsellorreplies(false)}
                >
                  Anonymous Comments
                </button>
              </div>

              <div className="mb-[100px]">
                {!showCounsellorReplies ? (
                  <div>
                    {pageComments?.length === 0 && (
                      <div>
                        <div className="text-xl text-center">No Comments</div>
                      </div>
                    )}
                    {pageComments?.map((item) => {
                      return <Eachcomment item={item}></Eachcomment>;
                    })}
                  </div>
                ) : (
                  <div>
                    {counsellorcomments.length === 0 && (
                      <div>
                        <div className="text-xl text-center">No Comments</div>
                      </div>
                    )}
                    {counsellorcomments?.map((item) => {
                      return (
                        <EachcommentForCounsellor
                          item={item}
                        ></EachcommentForCounsellor>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="  bg-[#ff00001d] pb-[20px]" id="new">
                <h5 className=" pt-7 text-2xl text-[red] ml-4">
                  Add a comment
                </h5>
                <div className=" justify-center w-full">
                  <form
                    action=""
                    className="   justify-center items-center"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        setSendingMessage(true);
                        if (!commentBody) {
                          alert("Comment is required");
                          throw new Error();
                        }
                        if (user) {
                          const response = await Axios.post(
                            `https://restapis.myconfessionz.com/api/user-comment/${params.id}`,
                            {
                              comment: commentBody,
                              category: postToBeShown.category,
                              user_id: userId,
                            },
                            {
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            }
                          );

                          getDataForComment();
                          // setPageComments([
                          //   ...pageComments,
                          //   { created_at: Date.now(), comment: commentBody },
                          // ]);

                          console.log("Done");
                          setCommentBody("");
                          setSendingMessage(false);
                        } else {
                          const response = await Axios.post(
                            `https://restapis.myconfessionz.com/api/counselor-comment/${params.id}`,
                            {
                              comment: commentBody,
                              category: postToBeShown.category,
                              user_id: userId,
                            },
                            {
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            }
                          );

                          // setcounsellorComments([
                          //   ...counsellorcomments,
                          //   { created_at: Date.now(), comment: commentBody },
                          // ]);
                          getDataForComment();
                          console.log("Done");
                          setHeight(0);
                          setCommentBody("");
                          setSendingMessage(false);
                        }

                        // setcounsellorComments(result.data.message);
                      } catch (error) {
                        setSendingMessage(false);
                        console.log(error);
                        // navigate("/homepage");
                      }
                    }}
                  >
                    <div className=" items-center w-full">
                      <textarea
                        name=""
                        id=""
                        // cols={20}
                        value={commentBody}
                        onChange={(e) => {
                          setCommentBody(e.target.value);
                          handleChange(e);
                        }}
                        className="border-2 rounded-xl overflow-hidden border-[red] focus:border-[red] active::border-[red] px-3 pt-2 pb-4  ml-4 placeholder:text-[red] hidden md:block w-[80vw] lg:w-[45vw] mt-1"
                        placeholder="Comment"
                        style={{ height: `${height}px` }}
                      ></textarea>
                      <textarea
                        name=""
                        id=""
                        // rows="10"
                        value={commentBody}
                        onChange={(e) => {
                          setCommentBody(e.target.value);
                          handleChange(e);
                        }}
                        className="border-2 rounded-xl overflow-hidden ml-4  sm:w-[70vw] border-[red] focus:border-[red] active::border-[red] px-3 pt-3 pb-4 placeholder:text-[red] md:hidden  w-[80vw] lg:w-[45vw]"
                        placeholder="Comment"
                        style={{ height: `${height}px` }}
                      ></textarea>
                    </div>

                    {!sendingMessage ? (
                      <button
                        type="submit"
                        className="  ml-4  form-top text-base text-white px-[20px] py-[12px] rounded-2xl mt-4  mb-3  "
                      >
                        Submit
                      </button>
                    ) : (
                      <button
                        // type="submit"
                        className="  ml-4  form-top text-base text-white px-[20px] py-[12px] rounded-2xl mt-4  mb-3  "
                      >
                        Loading..
                      </button>
                    )}
                  </form>
                </div>
              </div>
            </div>
          )}
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
