const typeDisplay = document.getElementById("typeDisplay");
const charDisplay = document.getElementById("charDisplay");
const typeInput = document.getElementById("typeInput");
const timer = document.getElementById("timer");
const right = document.getElementById("correct");
const worng = document.getElementById("incorrect");
const counter = document.getElementById("counter");
const level = document.getElementById("buttons");
const short = document.getElementById("short");
const normal = document.getElementById("normal");
const long = document.getElementById("long");
const wpm = document.getElementById("wpm");
const wpmdisplay = document.getElementById("wpmdisplay");
const accdisplay = document.getElementById("accdisplay");
const acc = document.getElementById("acc");
const container1 = document.getElementById("container1");
const resultother = document.getElementById("resultother");
const allinput = document.getElementById("allinput");
const allinputDisplay = document.getElementById("allinputDisplay");
const time = document.getElementById("time");
const timeDisplay = document.getElementById("timeDisplay");
const canvas = document.getElementById("myChart");
const write = document.getElementById("write");
let ctx = canvas.getContext("2d");
let myChart;
let wpmvalue;
let accvalue;
let previousIncorrect = 0;
let trueincorrect = 0;
let timerInterval;
let tabcounter;
let seconds;
let inputsPerSecond;
let correctperseocond;
let incorrectpersecond;
function elementStylebefore() {
  charDisplay.style.visibility = "visible";
  typeDisplay.style.visibility = "visible";
  level.style.visibility = "visible";
  short.style.visibility = "visible";
  normal.style.visibility = "visible";
  long.style.visibility = "visible";
  counter.style.visibility = "visible";
  wpm.style.visibility = "hidden";
  wpmdisplay.style.visibility = "hidden";
  accdisplay.style.visibility = "hidden";
  acc.style.visibility = "hidden";
  resultother.style.visibility = "hidden";
  allinput.style.visibility = "hidden";
  time.style.visibility = "hidden";
  canvas.style.visibility = "hidden";
}
elementStylebefore();
function playez() {
  function gettingfromezjson() {
    return fetch("../odai/short.json")
      .then((Response) => Response.json())
      .then((data) => {
        const ids = Object.keys(data);
        const randomId = ids[Math.floor(Math.random() * ids.length)];
        const sentence = data[randomId].sentence;
        const type = data[randomId].type;
        return { sentence, type };
      })
      .catch((error) => console.error("Error:", error));
  }

  gettingfromezjson().then((result) => {
    const sentence = result.sentence;
    const type = result.type;
    typeDisplay.innerText = sentence;
    let char = type.split("");
    char.forEach((character) => {
      const characterspan = document.createElement("span");
      characterspan.innerText = character;
      charDisplay.appendChild(characterspan);
    });
  });
}

function playnormal() {
  typeDisplay.innerText = "";
  function gettingfromnormaljson() {
    return fetch("../odai/normal.json")
      .then((Response) => Response.json())
      .then((data) => {
        const ids = Object.keys(data);
        const randomId = ids[Math.floor(Math.random() * ids.length)];
        const sentence = data[randomId].sentence;
        const type = data[randomId].type;
        return { sentence, type };
      })
      .catch((error) => console.error("Error:", error));
  }

  gettingfromnormaljson().then((result) => {
    const sentence = result.sentence;
    const type = result.type;
    typeDisplay.innerText = sentence;
    let char = type.split("");
    char.forEach((character) => {
      const characterspan = document.createElement("span");
      characterspan.innerText = character;
      charDisplay.appendChild(characterspan);
    });
  });
}

function playlong() {
  typeDisplay.innerText = "";
  function gettingfromlongjson() {
    return fetch("../odai/long.json")
      .then((Response) => Response.json())
      .then((data) => {
        const ids = Object.keys(data);
        const randomId = ids[Math.floor(Math.random() * ids.length)];
        const sentence = data[randomId].sentence;
        const type = data[randomId].type;
        return { sentence, type };
      })
      .catch((error) => console.error("Error:", error));
  }

  gettingfromlongjson().then((result) => {
    const sentence = result.sentence;
    const type = result.type;
    typeDisplay.innerText = sentence;
    let char = type.split("");
    char.forEach((character) => {
      const characterspan = document.createElement("span");
      characterspan.innerText = character;
      charDisplay.appendChild(characterspan);
    });
  });
}

function baseofgame() {
  typeInput.focus();
  inputsPerSecond = [];
  correctperseocond = [];
  incorrectpersecond = [];
  let correct = 0;
  let incorrect = 0;
  seconds = 0;
  tabcounter = 0;
  trueincorrect = 0;
  charDisplay.innerText = "";
  typeInput.value = "";
  right.innerText = 0;
  worng.innerText = 0;

  function rejectbackspace(e) {
    if (e.code === "Backspace") {
      e.preventDefault();
    }
  }

  let inputPossition = 0;
  function updateCharDisplay() {
    let sentenceArray = Array.from(charDisplay.querySelectorAll("span")); //spanの集合体
    sentenceArray.forEach((span, index) => {
      span.classList.remove("current");
      if (index === inputPossition) {
        span.classList.add("current");
      }
    });
  }

  timer.innerText = seconds;
  clearInterval(timerInterval);
  timerInterval = null;
  let inputCount = 0;
  let accpre = 0;
  typeInput.addEventListener("keydown", () => {
    if (
      !timerInterval &&
      (typeof correct !== "undefined" || typeof incorrect !== "undefined")
    ) {
      seconds = 0;
      timerInterval = setInterval(() => {
        timer.innerText = seconds;
        accpre = Math.round(
          ((correct - trueincorrect) / typeInput.value.length) * 100
        );
        inputsPerSecond.push(inputCount);
        correctperseocond.push(accpre);
        incorrectpersecond.push(incorrect);
        if (accpre === 0) {
          accpre = 0;
        }
        inputCount = 0;
        seconds++;
      }, 1000);
    }
  });
  function exception(changechar) {
    newcharspan = changechar.split("");
    charDisplay.innerText = "";
    newcharspan.forEach((newcharacter) => {
      const newcharacterspan = document.createElement("span");
      newcharacterspan.innerText = newcharacter;
      charDisplay.appendChild(newcharacterspan);
    });
  }
  typeInput.addEventListener("input", () => {
    inputCount++;
    let sentenceArray = Array.from(charDisplay.querySelectorAll("span")); //spanの集合体
    const typeget = typeInput.value.replace(/\s/g, "").split("");
    const typegetlength = typeget.length;
    const charfront = charDisplay.innerText[typegetlength];
    const charhead = charDisplay.innerText[typegetlength - 1];
    const charsecond = charDisplay.innerText[typegetlength - 2];
    const typesecond = typeget[typegetlength - 2];
    const typehead = typeget[typegetlength - 1];
    inputPossition = typeInput.value.length - 1;
    updateCharDisplay();
    if (inputPossition < 0) {
      inputPossition = 0;
    }
    if (
      typesecond == "s" &&
      typehead == "h" &&
      charsecond == "s" &&
      charhead == "i"
    ) {
      let changechar =
        charDisplay.innerText.slice(0, typegetlength - 1) +
        "h" +
        charDisplay.innerText.slice(typegetlength - 1);
      exception(changechar);
    } else if (
      typesecond == "c" &&
      typehead == "h" &&
      charsecond == "t" &&
      charhead == "i"
    ) {
      let changechar =
        charDisplay.innerText.slice(0, typegetlength - 2) +
        "c" +
        "h" +
        charDisplay.innerText.slice(typegetlength - 1);
      exception(changechar);
    } else if (
      typesecond == "z" &&
      typehead == "i" &&
      charsecond == "j" &&
      charhead == "i"
    ) {
      let changechar =
        charDisplay.innerText.slice(0, typegetlength - 2) +
        "z" +
        charDisplay.innerText.slice(typegetlength - 1);
      exception(changechar);
    } else if (
      charsecond == "s" &&
      charhead == "h" &&
      charfront == "o" &&
      typesecond == "s" &&
      typehead == "y"
    ) {
      let changechar =
        charDisplay.innerText.slice(0, typegetlength - 2) +
        "s" +
        "y" +
        charDisplay.innerText.slice(typegetlength);
      exception(changechar);
    }
    correct = typeget.filter(
      (char, index) => char === sentenceArray[index].innerText
    ).length;
    if (previousIncorrect - incorrect == 1) {
      trueincorrect++;
    }
    previousIncorrect = incorrect;
    incorrect = typegetlength - correct;
    sentenceArray.forEach((span, index) => {
      if (typeget[index] == null) {
        span.classList.remove("correct");
        span.classList.remove("incorrect");
      } else if (typeget[index] == span.innerText) {
        span.classList.add("correct");
        span.classList.remove("incorrect");
      } else {
        span.classList.add("incorrect");
        span.classList.remove("correct");
      }
    });
    if (correct === typegetlength) {
      document.addEventListener("keydown", rejectbackspace);
    } else if (incorrect > 0) {
      document.removeEventListener("keydown", rejectbackspace);
    }

    right.innerText = correct;
    worng.innerText = incorrect;
    function end() {
      wpmvalue = Math.round(charDisplay.innerText.length / (seconds + 1)); //0.3sの中に入れてしまうと答えが変になる
      accvalue = Math.round(
        ((correct - trueincorrect) / charDisplay.innerText.length) * 100
      );
      setTimeout(function () {
        wpm.innerText = wpmvalue;
        acc.innerText = accvalue + "%";
        timeDisplay.innerText = seconds + 1 + "s";
        allinputDisplay.innerText =
          typeInput.value.length +
          "/" +
          correct +
          "/" +
          incorrect +
          "/" +
          trueincorrect;
        charDisplay.style.visibility = "hidden";
        typeDisplay.style.visibility = "hidden";
        counter.style.visibility = "hidden";
        level.style.visibility = "hidden";
        short.style.visibility = "hidden";
        normal.style.visibility = "hidden";
        long.style.visibility = "hidden";
        wpm.style.visibility = "visible";
        wpmdisplay.style.visibility = "visible";
        accdisplay.style.visibility = "visible";
        acc.style.visibility = "visible";
        resultother.style.visibility = "visible";
        allinput.style.visibility = "visible";
        time.style.visibility = "visible";
        canvas.style.visibility = "visible";
        typeInput.blur();
      }, 300);
      setTimeout(function () {
        drawChart();
      }, 1000);
    }
    if (correct === charDisplay.innerText.length) {
      end();
      drawChart();
      clearInterval(timerInterval);
    }
    typeInput.addEventListener("keydown", (event) => {
      if (event.key === " " || event.key === "Enter") {
        if (correct + incorrect === charDisplay.innerText.length) {
          end();
          drawChart();
          clearInterval(timerInterval);
        }
      }
    });
  });
  typeInput.addEventListener("keydown", (event) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
    }
  });
}
function drawChart() {
  if (myChart) {
    myChart.destroy();
  }
  myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [
        {
          label: "# of Votes",
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
normal.classList.add("active");
elementStylebefore();
playnormal();
baseofgame();

function identifyLevel() {
  if (short.classList.contains("active")) {
    playez();
  } else if (normal.classList.contains("active")) {
    playnormal();
  } else if (long.classList.contains("active")) {
    playlong();
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Tab") {
    event.preventDefault();
    tabcounter++;
    if (tabcounter === 1) {
      document.getElementById("restart").focus();
    } else if (tabcounter === 2) {
      identifyLevel();
      baseofgame();
      elementStylebefore();
    }
  }
});

document.getElementById("restart").addEventListener("click", () => {
  identifyLevel();
  baseofgame();
  elementStylebefore();
});

short.addEventListener("click", () => {
  short.classList.add("active");
  normal.classList.remove("active");
  long.classList.remove("active");
  elementStylebefore();
  playez();
  baseofgame();
});

normal.addEventListener("click", () => {
  normal.classList.add("active");
  short.classList.remove("active");
  long.classList.remove("active");
  elementStylebefore();
  playnormal();
  baseofgame();
});

long.addEventListener("click", () => {
  long.classList.add("active");
  short.classList.remove("active");
  normal.classList.remove("active");
  elementStylebefore();
  playlong();
  baseofgame();
});

write.addEventListener("click", () => {
  window.location.href = "../getq/getq.html";
});
