import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useEffect } from "react";
import dateFormat, { masks } from "dateformat";

export const EachReplyCounsellor = ({
  item,
  getComment,
  postId,
  commentId,
  counselorReplies,
}) => {
  console.log(counselorReplies);
  const [loadingItemId, setLoadingItemId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allLikes, setAllLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isliking, setIsliking] = useState(false);
  const [likechanged, setLikeChanged] = useState(true);
  const navigate = useNavigate();
  const token = useSelector((state) => {
    return state.user.token;
  });

  const userId = useSelector((state) => {
    return state.user.user.id;
  });
  const deleteCounsellorReply = async (id) => {
    setLoading(true);
    try {
      const data = await Axios.delete(
        `https://restapis.myconfessionz.com/api/counselor-delete-reply/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getComment();
      if (data.status === 500) {
        navigate("/homepage");
      }
      // console.log(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      // navigate("/login");
      navigate("/homepage");
    }
  };

  const user = useSelector((state) => {
    return state?.user?.user?.usercode;
  });
  const likeAPost = async () => {
    if (!isliking) {
      if (user) {
        try {
          setIsliking(true);
          console.log(token);

          const result = await Axios.post(
            `https://restapis.myconfessionz.com/api/user-like-counselor-reply/${postId}/${commentId}/${item.id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log(result);
          console.log(result.data.message.toUpperCase());
          if (result.data.message.toUpperCase() === "LIKED!") {
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
        try {
          setIsliking(true);
          const result = await Axios.post(
            `https://restapis.myconfessionz.com/api/counselor-like-counselor-reply/${postId}/${commentId}/${item.id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log(result);

          if (result.data.message.toUpperCase() === "LIKED!") {
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
      }
    }
  };
  const [pageReply, setPageReply] = useState([]);
  const [counselorReplyDetails, setCounselorReplyDetails] = useState({});
  const [fetching, setFetching] = useState(false);
  const getAllReplies = async () => {
    try {
      setFetching(true);
      const result = await Axios.get(
        `https://restapis.myconfessionz.com/api/counselor-comment-replies/${item.id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(result);

      setCounselorReplyDetails(result.data.counnselorReply.counselor);

      const isThere = result.data.counnselorReply.user_likes.find((item) => {
        return item.user_id === userId;
      });
      setPageReply(result?.data?.counnselorReply);
      const isCounselorThere = result.data.counnselorReply.counselor_likes.find(
        (item) => {
          return item.counselor_id === userId;
        }
      );
      if (isThere) {
        setIsLiked(true);
      } else if (isCounselorThere) {
        setIsLiked(true);
      }

      setAllLikes(
        result.data.counnselorReply.counselor_likes_count +
          result.data.counnselorReply.user_likes_count
      );
      setFetching(false);
    } catch (error) {
      setFetching(false);
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(pageReply);
  }, [pageReply]);

  useEffect(() => {
    getAllReplies();
  }, []);

  useEffect(() => {
    console.log(pageReply);
  }, [pageReply]);

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
  var dateString = counselorReplyDetails?.dob;

  var age = calculateAge(dateString);

  return (
    <div>
      {fetching ? (
        <div className="mt-[20px]">
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
      ) : (
        <div className="mb-4 bg-white py-3 px-2 rounded">
          <div className="flex">
            <div className="h-[40px] w-[40px] flex items-center justify-center bg-[red] rounded-full text-[white] font-bold uppercase pt-1">
              {counselorReplyDetails?.username?.charAt(0)}
              {counselorReplyDetails?.username?.charAt(1)}
            </div>
            <div className="ml-3">
              <h5 className="text-[red] font-bold capitalize">
                {counselorReplyDetails?.username},{" "}
                {counselorReplyDetails?.gender}, {age}{" "}
                {age > 2 ? "years" : "year"}
              </h5>
              <p className="-mt-2 text-[red]">
                {dateFormat(item?.createdAt, "mmmm d, yyyy")}
              </p>
            </div>
          </div>
          <h4 className="text-xl ml-[50px] leading-6">
            {item.counselor_reply}
          </h4>
          <div className="flex items-center mt-3">
            <div className="flex ml-[50px] justify-center bg-red-300 w-[100px] rounded-xl py-[6px] text-[red] ">
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
                        setIsLiked(true);
                        // console.log(item);
                        likeAPost();
                      }}
                      className="bi bi-hand-thumbs-up-fill cursor-pointer  text-3xl  text-slate-600 pl-[5px]  "
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
                        likeAPost();
                        // setIsLiked(false);
                      }}
                      className="bi bi-hand-thumbs-up-fill cursor-pointer text-3xl  text-[red] pl-[5px]  "
                    ></i>
                  </div>
                </div>
              )}
            </div>
            {userId === item.counselor_id && (
              <div className="flex flex-row-reverse">
                <button
                  onClick={() => {
                    deleteCounsellorReply(item.id);
                    setLoadingItemId(item.id);
                  }}
                  className="bg-red-300 text-[red]  rounded-lg  px-4 font-bold py-[16px] ml-3"
                >
                  {loading && loadingItemId === item.id ? (
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
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
