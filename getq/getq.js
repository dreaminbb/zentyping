const upInput = document.getElementById("upInput");
const undreInput = document.getElementById("undreInput");
const del = document.getElementById("del");
const notebutton = document.getElementById("notebutton");
const back = document.getElementById("back");
const settings = document.getElementById("settings");
const sendButton = document.getElementById("sendButton");
const progress = document.getElementById("progress");
const proloder = document.getElementById("progress-loader");
const note = document.getElementById("note");
const exsit = document.getElementById("exsit");
const notification = document.getElementById("notification--num");
let exsitCount = 0;
progress.style.maxWidth = "100%";
const badwords = [
  "ちんこ",
  "チンコ",
  "ちんちん",
  "チンチン",
  "おっぱい",
  "オッパイ",
  "まんこ",
  "マンコ",
  "アナル",
  "あなる",
  "アナルセックス",
  "あなるせっくす",
  "セックス",
  "せっくす",
  "エッチ",
  "えっち",
  "騎乗位",
  "ペニス",
  "penis",
  "死ね",
  "殺す",
  "同人誌",
  "手コキ",
  "フェラ",
  "パイズリ",
  "ケツ穴確定",
  "野獣先輩",
  "810",
  "nigger",
  "ass",
  "fuck",
  "bitch",
  "gay",
  "真夏の夜の淫夢",
  "射精",
  "blowjob",
  "handjob",
];
const upInner1 = "私の一番好きなアニメは、、";
const unInner1 = "わたしのいちばんすきなあにめは,,";
const upInner2 = "日光を浴びることは大切です";
const underInner2 = "にっこうをあびることはたいせつです";
progress.style.visibility = "hidden";
proloder.style.visibility = "hidden";
upInput.addEventListener("input", () => {
  progress.style.visibility = "visible";
  proloder.style.visibility = "visible";
  const uplength = upInput.value.length;
  let persent = uplength * 0.4;
  progress.style.width = `${persent}%`;
  if (0 < uplength && uplength <= 50) {
    progress.style.backgroundColor = "rgb(181, 255, 152)";
  } else if (50 < uplength && uplength <= 120) {
    progress.style.backgroundColor = "rgb(236, 255, 152)";
  } else if (120 < uplength && uplength <= 290) {
    progress.style.backgroundColor = " rgb(233, 124, 124)";
  }
});

let clickcount = 0;
let count = 0;
let uncount = 0;
let nextcount = 0;
let unnextcount = 0;
let undelcount = 1;
let delcount = 1;
let delup = null;
let undel = null;
let nexttimer = null;
let uptimer = null;
let untimer = null;
let unnetxtimer = null;
window.onload = function () {
  setTimeout(() => {
    uptimer = setInterval(() => {
      upInput.value += upInner1[count];
      count++;
      if (count === upInner1.length - 1) {
        setTimeout(() => {
          clearInterval(uptimer);
          delup = setInterval(() => {
            upInput.value = upInput.value.slice(0, -delcount);
            delcount++;
            if (upInput.value.length === 0) {
              clearInterval(delup);
              nexttimer = setInterval(() => {
                upInput.value += upInner2[nextcount];
                nextcount++;
                if (nextcount === upInner2.length) {
                  clearInterval(nexttimer);
                }
              }, 400);
            }
          }, 400);
        }, 570);
      }
    }, 300);
  }, 600);

  setTimeout(() => {
    untimer = setInterval(() => {
      undreInput.value += unInner1[uncount];
      uncount++;
      if (uncount === unInner1.length) {
        clearInterval(untimer);
        undel = setInterval(() => {
          undreInput.value = undreInput.value.slice(0, -1);
          undelcount++;
          if (undreInput.value.length === 0) {
            clearInterval(undel);
            unnetxtimer = setInterval(() => {
              undreInput.value += underInner2[unnextcount];
              unnextcount++;
              if (unnextcount === underInner2.length) {
                clearInterval(unnetxtimer);
              }
            }, 200);
          }
        }, 150);
      }
    }, 100);
  }, 600);
};

addEventListener("click", () => {
  clickcount++;
});
upInput.addEventListener("click", () => {
  if (clickcount === 0) {
    upInput.value = "";
    undreInput.value = "";
    clearInterval(uptimer);
    clearInterval(nexttimer);
    clearInterval(delup);
    clearInterval(undel);
    clearInterval(unnetxtimer);
    clearInterval(untimer);
  }
});

undreInput.addEventListener("click", () => {
  if (clickcount === 0) {
    upInput.value = "";
    undreInput.value = "";
    clearInterval(uptimer);
    clearInterval(nexttimer);
    clearInterval(delup);
    clearInterval(undel);
    clearInterval(unnetxtimer);
    clearInterval(untimer);
  }
});
addEventListener("keydown", () => {
  if (clickcount === 0) {
    upInput.value = "";
    undreInput.value = "";
    clearInterval(uptimer);
    clearInterval(nexttimer);
    clearInterval(delup);
    clearInterval(undel);
    clearInterval(unnetxtimer);
    clearInterval(untimer);
  }
});
note.style.visibility = "hidden";

notebutton.addEventListener("click", () => {
  note.style.visibility = "visible";
});

exsit.addEventListener("click", () => {
  note.style.visibility = "hidden";
  if (exsitCount >= 1) {
    notification.style.visibility = "hidden";
  }
  if (clickcount > 1) {
    clearInterval(uptimer);
    clearInterval(nexttimer);
    clearInterval(delup);
    clearInterval(undel);
    clearInterval(unnetxtimer);
    clearInterval(untimer);
  }
  clearInterval(uptimer);
  clearInterval(nexttimer);
  clearInterval(delup);
  clearInterval(undel);
  clearInterval(unnetxtimer);
  clearInterval(untimer);
  upInput.value = "";
  undreInput.value = "";
});
back.addEventListener("click", () => {
  window.location.href = "../game/play.html";
});

del.addEventListener("click", () => {
  progress.style.width = "0%";
  clearInterval(uptimer);
  clearInterval(nexttimer);
  clearInterval(delup);
  clearInterval(undel);
  clearInterval(unnetxtimer);
  clearInterval(untimer);
  upInput.value = "";
  undreInput.value = "";
});

sendButton.addEventListener("click", () => {
  const undrelength = undreInput.value.length;
  const uplength = upInput.value.length;
  const totalup = uplength * 2 + uplength / 2;
  if (undrelength > totalup) {
    alert("なんか多くね");
  }
  const romaji = wanakana.toRomaji(undreInput.value);
  console.log(romaji);
});
