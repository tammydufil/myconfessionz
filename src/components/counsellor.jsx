import React, { useEffect, useState } from "react";
import icon1 from "../utils/icon2.png";
import icon2 from "../utils/icon3.png";
import { useSelector } from "react-redux";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

export const Counsellor = () => {
  const user = useSelector((state) => {
    return state?.user?.user?.usercode;
  });
  const username = useSelector((state) => {
    return state?.user?.user?.username;
  });

  const token = useSelector((state) => {
    return state.user.token;
  });
  const [filterName, setFilterName] = useState("");
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const newdata = counsellors.filter((item) =>
      item.username.toLowerCase().includes(filterName.toLowerCase())
    );
    setDataDisplayed(newdata);
  }, [loading]);

  const getCounsellors = async () => {
    setLoading(true);
    try {
      const result = await Axios.get(
        "https://restapis.myconfessionz.com/api/all-counselors ",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(result);

      setCounsellors(result.data.counselors);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const navigate = useNavigate();
  // const counsellors = [
  //   { id: 1, name: "Johnson Samuel", gender: "male" },
  //   { id: 2, name: "Anita Chriswell", gender: "female" },
  //   { id: 3, name: "Likee Mitchelle", gender: "female" },
  //   { id: 4, name: "Rick Lawson", gender: "male" },
  //   { id: 5, name: "Larry Joseph", gender: "male" },
  //   { id: 6, name: "Johnson Samuel", gender: "male" },
  //   { id: 7, name: "Anita Chriswell", gender: "female" },
  //   { id: 8, name: "Likee Mitchelle", gender: "female" },
  //   { id: 9, name: "Rick Lawson", gender: "male" },
  //   { id: 10, name: "Larry Joseph", gender: "male" },
  //   { id: 11, name: "Johnson Samuel", gender: "male" },
  //   { id: 12, name: "Anita Chriswell", gender: "female" },
  //   { id: 13, name: "Likee Mitchelle", gender: "female" },
  //   { id: 14, name: "Rick Lawson", gender: "male" },
  //   { id: 15, name: "Larry Joseph", gender: "male" },
  // ];

  useEffect(() => {
    getCounsellors();
  }, []);

  const [dataDisplayed, setDataDisplayed] = useState([]);

  const handleFilterChange = (event) => {
    setFilterName(event.target.value);
  };

  useEffect(() => {
    if (filterName === "") {
      setDataDisplayed(counsellors);
    }
  }, [filterName]);
  useEffect(() => {
    setDataDisplayed(counsellors);
  }, [counsellors]);

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

  return (
    <div
      className={`left pt-[90px]  pb-[130px]  overflow-y-scroll h-[100vh]   hidden md:block w-[35vw]  lg:w-[25vw] border-2 shadow-xl  counselordiv ${
        scrolling ? "counselordiv" : "disappear"
      }`}
      onScroll={() => {
        handleScroll();
      }}
    >
      <div className="md:text-md font-bold lg:text-xl text-center z-40 max-w-[80%] mx-auto text-[red]">
        Search Councellors by name
      </div>

      <form action="" className="flex justify-center mb-4">
        <input
          type="text"
          value={filterName}
          onChange={(e) => {
            setFilterName(e.target.value);
            const newdata = counsellors.filter((item) =>
              item.username.toLowerCase().includes(filterName.toLowerCase())
            );
            setDataDisplayed(newdata);
          }}
          className="w-[80%] rounded border-2 placeholder:text-[red] border-[red] p-2 mt-4"
          placeholder="Search by name"
        />
      </form>

      {loading === true ? (
        <div>
          <div class="post">
            <p class="post-image placeholder"></p>
            <p class="post-image placeholder"></p>
          </div>
          <div class="post mt-4">
            <p class="post-image placeholder"></p>
            <p class="post-image placeholder"></p>
          </div>
          <div class="post mt-4">
            <p class="post-image placeholder"></p>
            <p class="post-image placeholder"></p>
          </div>
          <div class="post mt-4">
            <p class="post-image placeholder"></p>
            <p class="post-image placeholder"></p>
          </div>
        </div>
      ) : (
        <div className="mt-8">
          {dataDisplayed.map((item) => {
            return (
              <div
                className="flex justify-start items-start mt-1 pt-3 pl-[22px]  cursor-pointer hover:bg-[#ff000044] "
                onClick={() => {
                  navigate(`/counsellor/${item.id}`);
                }}
              >
                <div className="h-[40px] w-[40px] uppercase font-bold bg-[red] rounded-full flex items-center justify-center text-xl text-[white] pt-1">
                  {item?.username.charAt(0)}{" "}
                  <span className="">{item?.username.charAt(1)}</span>
                </div>

                <div className="pl-3  ">
                  <h4 className="uppercase md:text-xs lg:text-sm   text-[red]  cursor-pointer hover:text-[red] max-w-[90%] font-bold -mb-[1px]">
                    {item?.username}
                  </h4>
                  <p className="text-[black]  max-w-[85%] leading-[21px]">
                    {" "}
                    ({item?.counseling_field})
                  </p>
                </div>
              </div>
            );
          })}

          {dataDisplayed.length === 0 && (
            <p className="mx-auto ml-3 w-[70%]">
              No Counsellor Matches the Description
            </p>
          )}
        </div>
      )}
    </div>
  );
};
