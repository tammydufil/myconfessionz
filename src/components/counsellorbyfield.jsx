import React, { useEffect, useRef, useState } from "react";
import icon1 from "../utils/icon2.png";
import icon2 from "../utils/icon3.png";
import { useSelector } from "react-redux";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

export const CounsellorNyField = () => {
  const [counsellors, setCounsellors] = useState([]);
  const [displayedCounsellors, setDisplayedCounsellors] = useState([]);
  const [loading, setLoading] = useState(false);
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
  const [filterName, setFilterName] = useState("");

  useEffect(() => {
    if (filterName === "") {
      setDisplayedCounsellors(counsellors);
    } else {
      const newdata = counsellors.filter((item) =>
        item.username.toLowerCase().includes(filterName.toLowerCase())
      );
      setDisplayedCounsellors(newdata);
    }
  }, [filterName, counsellors]);

  const user = useSelector((state) => {
    return state?.user?.user?.usercode;
  });
  const username = useSelector((state) => {
    return state?.user?.user?.username;
  });

  const token = useSelector((state) => {
    return state.user.token;
  });

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

  useEffect(() => {
    getCounsellors();
  }, []);

  const [fieldName, setFieldName] = useState("");
  const [dataDisplayed, setDataDisplayed] = useState([]);

  const handleFilterChange = (event) => {
    setFilterName(event.target.value);
  };

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
  const [fieldNameToDisplay, setFieldNameToDisplay] = useState("");

  // const divRef = useRef(null);
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
      className={`left pt-[90px]  pb-[130px]  overflow-y-scroll h-[100vh]   hidden lg:block w-[25vw] border-2 shadow-2xl  ${
        scrolling ? "counselordiv" : "disappear"
      }`}
      onScroll={() => {
        handleScroll();
      }}
      onScrollEnd={() => {
        console.log("Stopped");
        setScrolling(false);
      }}
    >
      <div className="text-xl text-start z-40 max-w-[80%] mx-auto text-[red] font-bold">
        Search Councellors{" "}
        {isSearchingByField ? "by Field" : `for ${fieldNameToDisplay}`}
      </div>

      {loading === true ? (
        <div className="mt-6">
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
      ) : isSearchingByField ? (
        <div>
          {" "}
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="flex justify-center mb-4"
          >
            <input
              type="text"
              value={fieldName}
              onChange={(e) => {
                setFieldName(e.target.value);
                const newdata = fieldList.filter((item) =>
                  item.name.toLowerCase().includes(fieldName.toLowerCase())
                );
                setFieldList(newdata);
              }}
              className="w-[80%] rounded border-2 placeholder:text-[red] border-[red] p-2 mt-4"
              placeholder="Search by field"
            />
          </form>
          <div className="mt-6">
            <h3 className="text-xl text-center">
              {fieldList.length === 0 && "No Counsellor"}
            </h3>
            {fieldList.map((item) => {
              return (
                <div className="flex justify-start items-center mt-4 pl-[22px]">
                  {/* <img src={item.image} alt="" /> */}
                  <h4
                    onClick={() => {
                      //   navigate(`/counsellor/${item.id}`);
                      getCounsellors(item.name);
                      setFieldNameToDisplay(item.name);
                      setIsSearchingByField(false);
                    }}
                    className="text-[black] uppercase text-sm ml-3 cursor-pointer hover:text-[red] max-w-[70%]"
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
              className="bg-[red] py-2 px-3 ml-5 rounded text-white"
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
                setFilterName(e.target.value);

                // setDisplayedCounsellors(newdata);
              }}
              className="w-[80%] rounded border-2 placeholder:text-[red] border-[red] p-2 mt-3"
              placeholder="Search by name"
            />
          </form>

          <div className="mt-6">
            <h3 className="text-xl text-center">
              {displayedCounsellors.length === 0 && "No Counsellor"}
            </h3>
            {displayedCounsellors.map((item) => {
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
          </div>
        </div>
      )}
    </div>
  );
};
