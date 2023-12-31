import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import confessbg from "../utils/confessbg.jpg";
import { useSelector } from "react-redux";
import dateFormat, { masks } from "dateformat";
import Axios from "axios";

export const IndividualPost = ({ item }) => {
  // console.log(item);
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => {
    return state?.user?.user?.usercode;
  });
  const username = useSelector((state) => {
    return state?.user?.user?.username;
  });
  const token = useSelector((state) => {
    return state.user.token;
  });
  const userId = useSelector((state) => {
    return state.user.user.id;
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

  const [userDetails, setUserDetails] = useState({});
  const [couslen, setCounslen] = useState(0);
  const [anonslen, setAnonslen] = useState(0);
  const [likechanged, setLikeChanged] = useState(true);
  const [allLikes, setAllLikes] = useState(0);

  useEffect(() => {
    setAllLikes(item.overallLikesCount);
  }, []);

  const [isliking, setIsliking] = useState(false);

  const likeAPost = async (id) => {
    setIsLiked(!isLiked);
    if (!isliking) {
      if (user) {
        setIsLiked(!isLiked);
        if (isLiked) {
          setAllLikes(allLikes - 1);
        } else {
          setAllLikes(allLikes + 1);
        }
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
          console.log(error);
          setIsLiked(!isLiked);
          setIsliking(false);
          // navigate("/login");
        }
      } else {
        setIsLiked(!isLiked);
        if (isLiked) {
          setAllLikes(allLikes - 1);
        } else {
          setAllLikes(allLikes + 1);
        }
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
          // setCounslen(result.data.PostComments.length);
          // setPageData(result.data.posts);
          setIsliking(false);
        } catch (error) {
          console.log(error);
          // navigate("/login");
          setIsLiked(!isLiked);
          setIsliking(false);
        }
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [isLiked]);

  useEffect(() => {
    console.log(userId);
    const isThere = item.userLikes.find((item) => item.user_id === userId);
    const isCounsellorThere = item.counselorLikes.find(
      (item) => item.counselor_id === userId
    );
    if (isThere || isCounsellorThere) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, []);

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
  var dateString = item.dob;

  var age = calculateAge(dateString);

  const handleShareClick = async (shareURL) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Share this link",
          text: "Check out this link:",
          url: `/post/show/${shareURL}`,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Web Share API is not supported on this browser.");
    }
  };

  // console.log(item);
  return user !== undefined || username !== undefined ? (
    <div>
      <div className="mt-6 mb-[30px] shadow-2xl border border-red-300 py-4 mx-[10px] md:mx-[50px] px-3 md:px-6 rounded-xl bg-[#ff00002c]">
        <div className="flex">
          <div className="h-[40px] w-[40px] bg-[red]  rounded-full flex flex-col items-center justify-center">
            {item?.usercode && (
              <h2 className="text-xl mt-[10px] text-white">
                {" "}
                {item?.usercode.charAt(0).toUpperCase()}
                {item?.usercode.charAt(1).toUpperCase()}
              </h2>
            )}
          </div>
          <div className="flex flex-col text-[red] ml-2">
            <span className="text-xl font-bold capitalize">
              {item?.usercode || item?.username}, {item?.gender}, {age}{" "}
              {age > 2 ? "years" : "year"}
            </span>
            <br />
            <span className="mt-[-13px]">
              {dateFormat(item?.createdAt, "mmmm d, yyyy")}
            </span>{" "}
            <br />
          </div>
        </div>
        <div
          onClick={() => {
            navigate(`/post/show/${item.postId}`);
          }}
          className=" leading-6 text-[black] hover:cursor-pointer pl-[47px] font-semibold "
        >
          {/* {console.log(item)} */}
          {item.post.split(" ").length > 70 ? (
            <div className="leading-5 text-[black] hover:cursor-pointer  font-semibold">
              {`${item.post.split(/\s+/).slice(0, 70).join(" ")} `}
              <span className="text-[red]   hover:cursor-pointer font-semibold">
                read more...
              </span>
            </div>
          ) : (
            item.post
          )}
        </div>

        {/* <div className="w-[100%] mx-auto justify-center bg-[red] h-[1px] my-3 "></div> */}

        <div className="mt-3 flex pl-[47px] justify-between items-center">
          <div
            className=" flex  p-2 min-w-[40px] md:max-w-[150px] justify-center items-center hover:cursor-pointer bg-[#ff00003c] w-[26%] rounded-2xl  "
            onClick={() => {
              navigate(`/post/show/${item.postId}`);
            }}
          >
            <div className="font-bold  text-xl text-[red]  mr-2 ">
              {/* {console.log(item)} */}
              {item.allCommentsCount}{" "}
            </div>
            <i className="bi bi-chat-right-dots text-2xl text-[red] pt-2"></i>
          </div>

          <div className=" flex bg-[#ff00003c] rounded-2xl min-w-[40px] w-[26%] md:max-w-[150px] p-2  justify-center items-center hover:cursor-pointer  ">
            {!isLiked && (
              <div
                onClick={() => {
                  // setIsLiked(true);

                  console.log(item);
                }}
                className=" "
              >
                <div
                  className="flex items-center text-[red] font-bold  text-xl "
                  onClick={() => {
                    // setIsLiked(false);
                    console.log(item);
                    likeAPost(item.postId);
                  }}
                >
                  {allLikes}
                  <i className="bi bi-hand-thumbs-up-fill cursor-pointer text-3xl  text-slate-600 pl-[5px]  "></i>
                </div>
              </div>
            )}

            {isLiked && (
              <div
                onClick={() => {
                  // setIsLiked(true);
                  console.log(item);
                }}
                className=" "
              >
                <div className="flex items-center text-[red] font-bold  text-xl">
                  {allLikes}
                  <i
                    onClick={() => {
                      likeAPost(item.postId);
                      // setIsLiked(false);
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
              handleShareClick(item.postId);
            }}
            className="bg-[#ff00003c] rounded-2xl w-[26%] !min-w-[90px] md:max-w-[150px] justify-center flex font-bold text-[red] items-center  "
          >
            <button className="py-[20px] ">Share</button>
            <i class="bi bi-share ml-2 text-xl font-bold text-[red] -mb-1 max-[400px]:text-base"></i>
          </div>
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
