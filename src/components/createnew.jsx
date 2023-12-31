import React, { useEffect, useState } from "react";
import { LoggedInNav } from "./loggedinNav";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import confessbg from "../utils/confessbg.jpg";
import { useSelector } from "react-redux";
import Axios from "axios";
import confess from "../utils/secondconfess.png";
import textured from "../utils/textured.jpg";

export const CreateNew = () => {
  const navigate = useNavigate();
  const [confession, setConfession] = useState("");
  const rooms = [
    { label: "Love", value: "Love" },
    { label: "Heartbreak", value: "Heartbreak" },
    { label: "Marriage", value: "Marriage" },
    { label: "Domestic Violence", value: "Domestic Violence" },
    { label: "Abused", value: "Abused" },
    { label: "Harassed", value: "Harassed" },
    { label: "Hoe Story", value: "Hoe Story" },
    { label: "Assault", value: "Assault" },
    { label: "Cheating", value: "Cheating" },
    { label: "Entertaining", value: "Entertaining" },
    { label: "Funny", value: "Funny" },
    { label: "Shocking", value: "Shocking" },
    { label: "Murder", value: "Murder" },
    { label: "Sinful", value: "Sinful" },
    { label: "Daily Gist", value: "Daily Gist" },
    { label: "Personal Problem", value: "Personal Problem" },
    { label: "Health Issues", value: "Health Issues" },
    { label: "Politics", value: "Politics" },
    { label: "Supernatural events", value: "Supernatural events" },
    { label: "Ghost stories", value: "Ghost stories" },
    { label: "Others", value: "Others" },
  ];
  const [room, setRoom] = useState({ label: "", value: "" });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const nameParam = queryParams.get("name");
    if (nameParam) {
      const exists = rooms.find((item) => {
        return item?.label.toUpperCase() === nameParam?.toUpperCase();
      });

      if (exists) {
        setRoom({
          label: nameParam.toUpperCase(),
          value: nameParam.toUpperCase(),
        });
      } else {
        setRoom({ label: rooms[0].label, value: rooms[0].label });
      }
    }
  }, []);

  useEffect(() => {
    console.log(room);
  }, [room]);
  useEffect(() => {
    setTimeout(() => {
      setErrorMessage("");
    }, 7000);
  }, [errorMessage]);
  const user = useSelector((state) => {
    return state?.user?.user?.usercode;
  });
  const username = useSelector((state) => {
    return state?.user?.user?.username;
  });
  let [time, setTime] = useState(4);
  const token = useSelector((state) => {
    return state.user.token;
  });

  if (user === undefined && username === undefined) {
    setTimeout(() => setTime(time - 1), 1000);
  }

  useEffect(() => {
    if (time === 0) {
      navigate("/login");
    }
  }, [time]);
  return user !== undefined || username !== undefined ? (
    <div>
      <LoggedInNav active="confess"></LoggedInNav>
      {errorMessage !== "" && (
        <div className=" mt-[58px] bg-[#ff00002f] py-3 text-center text-[red] text-xl font-bold">
          {errorMessage}
        </div>
      )}
      {/* {loading === true && (
        <div className="fixed top-0   h-[100vh] w-screen z-50 overflow-x-hidden bg-[#00000064] bg-cover flex justify-center items-center">
          <svg
            class="pl overflow-x-hidden"
            viewBox="0 0 200 200"
            width="200"
            height="200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="pl-grad1" x1="1" y1="0.5" x2="0" y2="0.5">
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
      )} */}

      <div className="flex ">
        <div className="hidden md:block w-[30vw] fixed top-0 bg-red-500 h-screen  mynav">
          {/* <img
            src={textured}
            alt=""
            className="absolute top-0 z-[2] h-screen brightness-[20%] "
          /> */}
          <img
            src={confess}
            alt=""
            className="fixed   top-0 z-20 opacity-25 h-screen left-0"
          />
        </div>
        <div className="md:ml-[30vw] w-[100vw] md:w-[70vw] pr-[30px] md:pr-[0]  pl-[30px]  pb-[30px] md:pb-[100px] ">
          <div
            className={`${
              errorMessage !== "" ? "mt-[40px]" : "pt-[90px]"
            } mb-[130px] lg:mb-[30px]`}
          >
            <div className="text-[red] pt-10 md:pt-0   text-[25px] md:mx-auto">
              Sharing Your Darkest Secrets Anonymously
            </div>
            <form
              action=""
              onSubmit={async (e) => {
                console.log(room);
                e.preventDefault();
                try {
                  setLoading(true);
                  await Axios.post(
                    "https://restapis.myconfessionz.com/api/create-post",
                    { post: confession, category: room.value },
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  setLoading(false);
                  setErrorMessage("Done");
                  setConfession("");
                  setRoom("");
                  navigate("/homepage");
                } catch (error) {
                  setLoading(false);
                  console.log(error);
                }
              }}
              className="pb-[40px] mt-[30px] flex  flex-col justify-center w-full md:w-[80%]"
            >
              <div className="text-[red]  mt-6 text-xl">
                Select Room to share
              </div>
              <Select
                styles={{
                  control: (base) => ({
                    ...base,
                    border: 0,
                    // This line disable the blue border
                    boxShadow: "red",
                  }),
                }}
                value={room}
                onChange={(e) => {
                  setRoom(e);
                }}
                //   onChange={this.handleChange}
                closeMenuOnSelect
                placeholder={room.value}
                options={rooms}
                isSearchable={true}
                defaultValue={"djdjjd"}
                // required
                className=" border mb-4 border-slate-400 rounded-lg  mt-2"
              />

              <div className="text-[red]  mt-2 mb-2 text-xl">
                Share Your confession
              </div>
              <textarea
                name=""
                id=""
                cols="93"
                rows="10"
                required
                value={confession}
                onChange={(e) => {
                  setConfession(e.target.value);
                }}
                className="border-2 border-[green]  pt-3 pl-4   pr-2 placeholder:text-[red] hidden md:block rounded"
                placeholder="Type your confession here"
              ></textarea>
              <textarea
                name=""
                id=""
                cols="40"
                rows="10"
                required
                value={confession}
                onChange={(e) => {
                  setConfession(e.target.value);
                }}
                className="border-2 border-[red] px-2 pt-2 placeholder:text-[red] md:hidden rounded "
                placeholder="Type your confession here"
              ></textarea>
              {!loading ? (
                <button
                  type="submit"
                  className=" form-top text-base text-white px-[40px] py-[12px] rounded-2xl mt-4   "
                  onClick={() => navigate("/post/create")}
                >
                  Share
                </button>
              ) : (
                <button
                  // type="submit"
                  className=" form-top text-base text-white px-[40px] py-[12px] rounded-2xl mt-4   "
                  // onClick={() => navigate("/post/create")}
                >
                  Loading..
                </button>
              )}
            </form>
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
