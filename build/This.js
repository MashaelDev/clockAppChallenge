const config = {
  headers: {
    "X-Api-Key": "aJ6pG0xcu4ugD4wY7GjPXg==4Ryl0POLUUZkzXxI",
  },
};
let timezone;
let flagtime;
let call = 0;
//Btn more&less
function showDays() {
  let clockDiv = document.querySelector("#clock");
  let qouteDiv = document.querySelector("#quote");

  let img = document.querySelector("#arrowicon");
  if (img.getAttribute("src") == "desktop/icon-arrow-down.svg") {
    //

    //

    img.setAttribute("src", "desktop/icon-arrow-up.svg");
    document.querySelector("#moreLessSpan").innerHTML = "LESS";
    //
    clockDiv.scrollIntoView({ behavior: "smooth" });
  } else {
    //

    //
    img.setAttribute("src", "desktop/icon-arrow-down.svg");
    document.querySelector("#moreLessSpan").innerHTML = "MORE";
    qouteDiv.scrollIntoView({ behavior: "smooth" });
  }
}
function refreshQoute() {
  let quoteType = [
    "success",
    "morning",
    "inspirational",
    "hope",
    "happiness",
    "dreams",
  ];
  //
  let index = Math.floor(Math.random() * (5 - 0 + 1)) + 0;
  console.log("this is index :", index);

  axios
    .get(
      `https://api.api-ninjas.com/v1/quotes?category=${quoteType[index]}`,
      config
    )
    .then((res) => {
      let q;
      let quote = document.querySelector("#quoteText");
      let author = document.querySelector("#author");
      for (q of res.data) {
        quote.innerHTML = q.quote;
        author.innerHTML = q.author;
      }
    })
    .catch((err) => console.log(err));
}

//
function getTimeZone() {
  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let lat = position.coords.latitude;
        let long = position.coords.longitude;
        const url = `https://api.api-ninjas.com/v1/timezone?lat=${lat}&lon=${long}`;

        axios
          .get(url, config)
          .then((res) => {
            document.getElementById("TIMEZONE").innerHTML = res.data.timezone;
            timezone = res.data.timezone;

            getDaysOfWeksYears(timezone);
            DynamicClock(timezone);
            getCurrentCity(lat, long);
          })
          .catch((err) => console.log(err));
      },
      () => alert("We cant specify the location")
    );
}
function getCurrentCity(lat, long) {
  let url = `https://api.api-ninjas.com/v1/reversegeocoding?lat=${lat}&lon=${long}`;

  axios
    .get(url, config)
    .then((res) => {
      let i;
      let cityName;
      for (i of res.data) {
        cityName = i.name;
        getCioc(timezone, cityName);
      }
    })
    .catch((err) => console.log(err));
}

function getCioc(timezone, currentCity) {
  let capital = timezone.split("/")[1];

  axios
    .get(`https://restcountries.com/v3.1/capital/${capital}`)
    .then((res) => {
      let cioc;
      for (cioc of res.data) {
        document.querySelector(
          "#cioc"
        ).innerHTML = `IN ${currentCity.toUpperCase()},${cioc.cioc}`;
      }
    })
    .catch((err) => console.log(err));
}

//Clock

function getDaysOfWeksYears(timezone) {
  axios
    .get(`http://worldtimeapi.org/api/timezone/${timezone}`)
    .then((res) => {
      //DynamicClock(res.data.datetime);

      document.getElementById("DayOfYear").innerHTML = res.data.day_of_year;
      document.getElementById("DayOfweek").innerHTML = res.data.day_of_week;
      document.getElementById("WeekNum").innerHTML = res.data.week_number;
      document.getElementById("UTC").innerHTML = res.data.utc_offset;
    })
    .catch((err) => console.log(err));
}

function DynamicClock(timezone) {
  axios
    .get(`http://worldtimeapi.org/api/timezone/${timezone}`)
    .then((res) => {
      let datetime = res.data.datetime.split("T");

      let getTime = datetime[1].split(":");
      //let min = getTime[2].split(".");
      let ClockTime = [getTime[0], getTime[1]].join(":");
      document.querySelector("h1").innerHTML = ClockTime;

      let hours = ClockTime.split(":");
      let morningOrevening = document.querySelector("#morningOrevening");
      let iconmoonsun = document.querySelector("#monsun");

      if (Number(hours[0]) <= 11) {
        morningOrevening.innerHTML = `GOOD MORNING <span class="hidden md:inline">, IT’S CURRENTLY</span></span`;
        iconmoonsun.setAttribute("src", "desktop/icon-sun.svg");
        flagtime = 1;

        if (call != flagtime) {
          changeBackground();
        }
      } else if (Number(hours[0]) >= 12) {
        morningOrevening.innerHTML = `GOOD EVENING <span class="hidden md:inline">, IT’S CURRENTLY</span></span`;
        iconmoonsun.setAttribute("src", "desktop/icon-moon.svg");
        flagtime = 2;

        if (call != flagtime) {
          changeBackground();
        }
      }
    })
    .catch((err) => console.log(err));

  setTimeout(function () {
    DynamicClock(timezone);
  }, 1000);
}
function changeBackground() {
  call = flagtime;

  let section = document.querySelector("section");
  if (call == 1) {
    section.classList.add("bgMorningsection");
    document.querySelector("#effect").style.display = "block";
  } else {
    document.querySelector("#effect").style.display = "hidden";
    section.classList.add("bgNightsection");
  }
}
refreshQoute();
getTimeZone();
//getCurrentCity();
