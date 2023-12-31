import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { navigate, useNavigate } from "react-router-dom";
import "../css/main.css";
import confessbg from "../utils/confessbg.jpg";
import textured from "../utils/textured.jpg";
import { Spin as Hamburger } from "hamburger-react";
import logo from "../utils/secondconfess.png";
import { setUser } from "../redux/actions/UserActions";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { LoggedInNav } from "./loggedinNav";
import { confessions } from "../utils/confessions";
import { IndividualPost } from "./individualPost";
import { Counsellor } from "./counsellor";
import Axios from "axios";
import { CounsellorNyField } from "./counsellorbyfield";

export const HomePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => {
    return state?.user?.user?.usercode;
  });
  const username = useSelector((state) => {
    return state?.user?.user?.username;
  });

  const token = useSelector((state) => {
    return state.user.token;
  });
  console.log(token);
  const [pageData, setPageData] = useState([]);

  console.log(token);

  const getData = async () => {
    try {
      setLoading(true);
      const result = await Axios.get(
        "https://restapis.myconfessionz.com/api/all-posts-home",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPageData(result.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      navigate("/login");
      dispatch(setUser("."));
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const navigate = useNavigate();
  let [time, setTime] = useState(4);

  if (user === undefined && username === undefined) {
    setTimeout(() => setTime(time - 1), 1000);
  }

  useEffect(() => {
    if (time === 0) {
      navigate("/login");
    }
  }, [time]);

  const [isOpen, setIsopen] = useState(false);
  const [showNavOptions, setShowNavOptions] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBarclose = () => {
    setIsopen(!isOpen);
  };

  // useEffect(() => {
  //   if (pageData.length >= 0) {
  //     setLoading(false);
  //   } else {
  //     setLoading(true);
  //   }
  //   console.log(pageData);
  // }, [pageData]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
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
    <div>
      <LoggedInNav active="home"></LoggedInNav>

      <div className="flex">
        <Counsellor></Counsellor>

        <div
          className={`right w-screen lg:w-[50vw]  overflow-y-scroll h-[100vh] counselordiv 
        ${scrolling ? "counselordiv" : "disappear"}`}
          onScroll={() => {
            handleScroll();
          }}
        >
          <div className="mt-[80px] sm:mt-[130px]  ">
            <div className="  text-xl md:text-2xl font-bold text-[red] transition  lg:ml-[60px] ml-[20px]">
              Sharing Your Darkest Secrets Anonymously
            </div>
            {user && (
              <div className="flex justify-start">
                <button
                  type="submit"
                  className="form-top text-base text-white px-[20px] py-[12px] rounded-2xl mt-3 ml-[20px] lg:ml-[60px] mb-3  "
                  onClick={() => navigate("/post/create")}
                >
                  Share a confession
                </button>
              </div>
            )}
          </div>
          <div className=" mb-[140px] ">
            {loading === true ? (
              <div>
                <div className="mt-6">
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
              pageData?.map((item) => {
                return <IndividualPost item={item}></IndividualPost>;
              })
            )}
          </div>
        </div>
        <CounsellorNyField></CounsellorNyField>
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
