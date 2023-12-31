import React, { useEffect, useState } from "react";
import { LoggedInNav } from "./loggedinNav";
import { useParams } from "react-router-dom";
import Axios from "axios";
import { useSelector } from "react-redux";

export const Eachcounsellor = () => {
  const [loading, setLoading] = useState(false);
  const [counsellorDetails, setCounsellorDetails] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const [allReviews, setAllReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [addNewReview, setAddReview] = useState(false);
  const params = useParams();

  const token = useSelector((state) => {
    return state.user.token;
  });
  const userId = useSelector((state) => {
    return state.user.user.id;
  });
  const user = useSelector((state) => {
    return state?.user?.user?.usercode;
  });
  const username = useSelector((state) => {
    return state?.user?.user?.username;
  });

  const [image, setImage] = useState("");

  const getCounsellors = async () => {
    // setLoading(true);
    try {
      const result = await Axios.get(
        `https://restapis.myconfessionz.com/api/get-single-counselor/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(result);
      setCounsellorDetails(result.data.counselor);
      //   setCounsellors(result.data.counselors);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      //   console.log(error);
    }
  };
  useEffect(() => {
    console.log(allReviews);
  }, [allReviews]);
  const getReviews = async () => {
    setLoading(true);
    try {
      const result = await Axios.get(
        `https://restapis.myconfessionz.com/api/single-counselor-reviews/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(result);
      setAllReviews(result.data.review);
      // setCounsellorDetails(result.data.counselor);
      // console.log("Testing");

      setLoading(false);
    } catch (error) {
      setLoading(false);
      //   console.log(error);
    }
  };
  const addReview = async () => {
    setLoading(true);
    try {
      const result = await Axios.post(
        `https://restapis.myconfessionz.com/api/user-create-review/${params.id}`,
        { review: newReview },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(result);
      getReviews();
      setNewReview("");
      // setCounsellorDetails(result.data.counselor);
      // console.log("Testing");

      setLoading(false);
      setAddReview(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      //   console.log(error);
    }
  };
  const deleteReview = async (id) => {
    setLoading(true);
    try {
      const result = await Axios.delete(
        `https://restapis.myconfessionz.com/api/delete-review/${id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(result);
      getReviews();

      // setCounsellorDetails(result.data.counselor);
      // console.log("Testing");

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      //   console.log(error);
    }
  };
  // const getImage = async () => {
  //   try {
  //     const result = await Axios.get(
  //       `https://restapis.myconfessionz.com/api/counselors/64a54fcf54951-counselor.jpg`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     console.log(result.data);
  //     setImage(result.data);
  //   } catch (error) {
  //     setLoading(false);
  //     //   console.log(error);
  //   }
  // };
  const getImage = async (image) => {
    try {
      const response = await Axios.get(
        `https://restapis.myconfessionz.com/api/counselors/${image}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);
      setImage(`data:image/jpeg;base64,${response.data.image}`);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  useEffect(() => {
    getCounsellors();
    getReviews();
  }, []);
  useEffect(() => {
    console.log(counsellorDetails);
  }, [counsellorDetails]);

  useEffect(() => {
    getImage(counsellorDetails.image);
  }, [counsellorDetails]);

  return (
    <div>
      <LoggedInNav></LoggedInNav>

      {loading ? (
        <div className="h-[80vh] flex justify-center items-center w-screen">
          <div>
            <div className="mt-[200px] flex flex-col w-screen items-center">
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
        </div>
      ) : (
        <div className={`my-[140px] `}>
          <div className="flex  justify-center mx-3  ">
            <div className="shadow-2xl flex  flex-col bg-slate-100 rounded-xl py-4 px-5 max-w-[600px]">
              <div className="flex justify-center ">
                <img
                  src={image}
                  alt=""
                  className="h-[250px] w-[250px] rounded-full object-fill mb-4 "
                />
              </div>
              <div className="flex">
                <h4 className="text-base">
                  <span className="text-[red] text-base">First name</span>:{" "}
                  {counsellorDetails.first_name}
                </h4>
              </div>
              <div className="flex mt-2">
                <h4 className="text-base">
                  <span className="text-[red] text-base">Last name</span>:{" "}
                  {counsellorDetails.last_name}
                </h4>
              </div>
              <div className="flex mt-2">
                <h4 className="text-base">
                  <span className="text-[red] text-base">Username</span>:{" "}
                  {counsellorDetails.username}
                </h4>
              </div>
              <div className="flex mt-2">
                <h4 className="text-base">
                  <span className="text-[red] text-base">Gender</span>:{" "}
                  {counsellorDetails.gender}
                </h4>
              </div>
              <div className="flex mt-2">
                <h4 className="text-base">
                  <span className="text-[red] text-base">Date of birth</span>:{" "}
                  {counsellorDetails.dob}
                </h4>
              </div>
              <div className="flex mt-2">
                <h4 className="text-base">
                  <span className="text-[red] text-base">Bio</span>:{" "}
                  {counsellorDetails.bio}
                </h4>
              </div>
              <div className="flex mt-2">
                <h4 className="text-base">
                  <span className="text-[red] text-base">
                    Counselling Field
                  </span>
                  : {counsellorDetails.counseling_field}
                </h4>
              </div>
              <div className="flex mt-2">
                <h4 className="text-base">
                  <span className="text-[red] text-base">Location</span>:{" "}
                  {counsellorDetails.state}, {counsellorDetails.country}
                </h4>
              </div>
              <div className="flex mt-2">
                <h4 className="text-base">
                  <span className="text-[red] text-base">Reviews</span>:{" "}
                  {allReviews.length}
                </h4>
              </div>
              {/* <div className="flex mt-2">
          <h4 className="text-base">
            <span className="text-[red] text-base">Satisfied Clients</span>:{" "}
            {counsellorDetails.satisfied_clients}
          </h4>
        </div> */}
              <button
                onClick={() => {
                  setShowReviews(true);
                  setAddReview(false);
                }}
                className="bg-[red] py-2 px-3 text-white rounded-lg mt-3"
              >
                View Reviews
              </button>

              {user && (
                <button
                  onClick={() => {
                    setAddReview(true);
                    setShowReviews(false);
                  }}
                  className="w-[100px] text-[10px] bg-[black] py-2 px-2 text-white rounded-lg mt-3"
                >
                  {" "}
                  + Add Review
                </button>
              )}

              {addNewReview && (
                <form
                  action=""
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                  className="mt-3 "
                >
                  <textarea
                    name=""
                    id=""
                    value={newReview}
                    onChange={(e) => {
                      setNewReview(e.target.value);
                    }}
                    placeholder="Add Review"
                    className="w-full rounded-xl py-2 px-2 placeholder:text-base text-base"
                    rows="7"
                  ></textarea>
                  <button
                    type="submit"
                    onClick={() => {
                      addReview();
                    }}
                    className="bg-[green]  py-2 px-3 text-white rounded-lg mt-3"
                  >
                    Submit review
                  </button>
                </form>
              )}
              {showReviews && (
                <div>
                  <h3 className="mt-4 mb-3 text-center text-base underline text-[black]">
                    All Reviews
                  </h3>
                  {allReviews.length === 0 && (
                    <h4 className="text-center text-base mt-3">
                      No reviews yet
                    </h4>
                  )}

                  <div className="mb-[50px]">
                    {allReviews.map((item, key) => {
                      return (
                        <div className=" mb-4 bg-white px-3 py-2 shadow-xl ">
                          <h6 className="capitalize text-[red] text-xs">
                            {item?.user?.usercode}
                          </h6>
                          <h4 className="text-base">{item.review}</h4>
                          {item.user_id === userId && (
                            <div>
                              <button
                                className="bg-[red] py-2 px-2 text-[8px]  text-white rounded-xl -mt-3"
                                onClick={() => {
                                  deleteReview(item.id);
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
