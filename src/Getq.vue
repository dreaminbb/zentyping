<template>
  <div>
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>お題を書こう！</title>
        <link rel="stylesheet" href="getq.css" />
        <script src="https://kit.fontawesome.com/661acc8356.js" crossorigin="anonymous"></script>
      </head>
      <body>
        <div id="progress-loader" class="progress-loader">
          <div id="progress" class="progress"></div>
        </div>

        <div id="Inputs">
          <textarea id="upInput" class="upInput" autocomplete="off" maxlength="290"></textarea>
          <textarea
            id="undreInput"
            class="undreInput"
            autocomplete="off"
            autocomplete="off"
          ></textarea>
        </div>

        <button id="sendButton" class="sendButton">
          <div class="svg-wrapper-1">
            <div class="svg-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path
                  fill="currentColor"
                  d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                ></path>
              </svg>
            </div>
          </div>
          <span>Send</span>
        </button>
        <button id="del" class="del">
          <svg viewBox="0 0 448 512" class="svgIcon">
            <path
              d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
            ></path>
          </svg>
        </button>
        <button id="notebutton" class="conf">
          <main rel="main">
            <div class="notification">
              <svg viewbox="0 0 166 197">
                <path
                  d="M82.8652955,196.898522 C97.8853137,196.898522 110.154225,184.733014 110.154225,169.792619 L55.4909279,169.792619 C55.4909279,184.733014 67.8452774,196.898522 82.8652955,196.898522 L82.8652955,196.898522 Z"
                  class="notification--bellClapper"
                ></path>
                <path
                  d="M146.189736,135.093562 L146.189736,82.040478 C146.189736,52.1121695 125.723173,27.9861651 97.4598237,21.2550099 L97.4598237,14.4635396 C97.4598237,6.74321823 90.6498186,0 82.8530327,0 C75.0440643,0 68.2462416,6.74321823 68.2462416,14.4635396 L68.2462416,21.2550099 C39.9707102,27.9861651 19.5163297,52.1121695 19.5163297,82.040478 L19.5163297,135.093562 L0,154.418491 L0,164.080956 L165.706065,164.080956 L165.706065,154.418491 L146.189736,135.093562 Z"
                  class="notification--bell"
                ></path>
              </svg>
              <span id="notification--num" class="notification--num"></span>
            </div>
          </main>
        </button>
        <button id="back" class="conf">
          <i class="fa-solid fa-arrows-rotate"></i>
        </button>
        <button id="settings" class="conf"><i class="fa-solid fa-gear"></i></button>
        <div id="note">
          <button id="exsit"><i class="fa-solid fa-xmark"></i></button>
          <p></p>
          <p class="big">書き方</p>
          <p class="small">
            文字数バーの緑は"short"&nbsp;&nbsp;&nbsp;&nbsp;黄色は"normal"&nbsp;&nbsp;&nbsp;&nbsp;赤は"long"のお題になります<br />
            上の段に日本語文を書き下の段に上段で書いた文の平仮名を書いてください<br />文のミスがないかしっかり確認していただいた後に右下のボタンを押す<br />と上下の文が送信されます。
          </p>
          <p id="bignote" class="big">注意書き</p>
          <p id="noteSentense" class="small">
            不適切な言葉、誰かの個人情報、悪口、暴言などは書かないでください<br />もしも以下のような内容を含めた文を書いたらこちらで削除します。
          </p>
          <p></p>
        </div>
        <script src="https://unpkg.com/wanakana"></script>
        <script type="module" src="getq.js"></script>
      </body>
    </html>
  </div>
</template>

<script>
export default {
  name: 'GetQ',
  data() {
    return {
      // Your data properties go here
    }
  },
  mounted() {
    // Code to run when the component is mounted
  },
  methods: {
    // Your methods go here
  }
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
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  user-select: none;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
body {
  background-color: rgb(54, 54, 54);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  justify-content: center;
  overflow: hidden;
  font-family: 'poppins', sans-serif;
}
textarea {
  border: none;
}

.progress-loader {
  top: 9%;
  left: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
}

.progress-loader {
  width: 400px;
  background: rgba(236, 236, 238, 0.253);
  height: 20px;
  border-radius: 7px;
}

.progress {
  content: '';
  width: 0%;
  height: 20px;
  border-radius: 10px;
  background: rgb(255, 255, 255);
  transition: 0.5s;
}

@keyframes shake {
  0% {
    transform: translate(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translate(-10px, 0);
  }
  20%,
  40%,
  60%,
  80%,
  100% {
    transform: translate(10px, 0);
  }
}
.shake {
  animation: shake 0.6s;
}
.conf {
  background-color: rgba(54, 54, 54, 0.3);
  color: rgb(170, 170, 170);
  display: flex;
  position: absolute;
  width: 5%;
  height: 10%;
  border: none;
  left: 16%;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  text-align: center;
  transition: transform 0.6s;
}

#notebutton {
  top: 20%;
}
#back {
  top: 45%;
  font-size: 3rem;
}
#settings {
  top: 70%;
  font-size: 3rem;
}

.conf:hover {
  background-color: rgba(179, 179, 179, 0.5);
  transform: translateY(-10px); /* 要素を上に10px移動 */
  color: rgb(255, 255, 255);
}
#back:hover {
  animation: rotate 2s linear infinite;
}
#settings:hover {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

#Inputs {
  background-color: rgb(54, 54, 54);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 50%;
  height: 75%;
}
.upInput {
  top: 0%;
  background-color: rgb(255, 226, 226);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 45%;
  caret-color: rgb(255, 255, 255);
  color: rgb(177, 240, 234);
}
.undreInput {
  bottom: 0%;
  background-color: rgb(177, 240, 234);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 45%;
  margin: 10px;
  caret-color: rgb(255, 226, 226);
  color: rgb(182, 160, 160);
}
.upInput,
.undreInput {
  border: none;
  font-size: 2rem;
  outline: none;
  border-radius: 30px;
  resize: none;
  text-align: start;
  line-height: 90%;
  padding-top: 20px;
  padding-left: 20px;
}

.sendButton {
  display: flex;
  position: absolute;
  bottom: 20%;
  left: 80%;
  font-family: inherit;
  font-size: 18px;
  background: linear-gradient(to bottom, #5c5c5c 0%, #ffffff 100%);
  color: rgb(255, 255, 255);
  padding: 0.8em 1.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 25px;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
}

.sendButton:hover {
  transform: translateY(-3px);
  box-shadow: 0px 8px 15px rgba(179, 179, 179, 0.3);
}

.sendButton:active {
  transform: scale(0.95);
  box-shadow: 0px 2px 5px rgba(182, 182, 182, 0.2);
}

.sendButton span {
  display: block;
  margin-left: 0.4em;
  transition: all 0.3s;
}

.sendButton svg {
  width: 18px;
  height: 18px;
  fill: white;
  transition: all 0.3s;
}

.sendButton .svg-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  margin-right: 0.5em;
  transition: all 0.3s;
}

.sendButton:hover .svg-wrapper {
  background-color: rgba(255, 255, 255, 0.5);
}

.sendButton:hover svg {
  transform: rotate(45deg);
}

.del {
  position: absolute;
  display: flex;
  bottom: 6%;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgb(78, 78, 78);
  border: none;
  font-weight: 600;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.164);
  cursor: pointer;
  transition-duration: 0.3s;
  overflow: hidden;
}

.svgIcon {
  width: 12px;
  transition-duration: 0.3s;
}

.svgIcon path {
  fill: white;
}

.del:hover {
  width: 140px;
  border-radius: 50px;
  transition-duration: 0.3s;
  background-color: rgb(255, 69, 69);
  align-items: center;
}

.del:hover .svgIcon {
  width: 50px;
  transition-duration: 0.3s;
  transform: translateY(60%);
}

.del::before {
  position: absolute;
  top: -20px;
  content: 'Clear all';
  color: white;
  transition-duration: 0.3s;
  font-size: 2px;
}

.del:hover::before {
  font-size: 13px;
  opacity: 1;
  transform: translateY(30px);
  transition-duration: 0.3s;
}
main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40%;
  position: relative;
}
main .notification {
  position: relative;
  width: 9em;
  height: 10em;
}
main .notification svg {
  width: 4.2em;
  height: 10em;
}
main .notification svg > path {
  fill: #ffffffb9;
}

main .notification--bell {
  animation: bell 2.2s linear infinite;
  transform-origin: 50% 0%;
}
main .notification--bellClapper {
  animation: bellClapper 2.2s 0.1s linear infinite;
}
main .notification--num {
  position: absolute;
  top: 11%;
  left: 60%;
  font-size: 1.6rem;
  border-radius: 50%;
  width: 0.9em;
  height: 0.9em;
  background-color: #f35322;
  text-align: center;
  line-height: 1em;
  animation: notification 3.2s ease;
}

@keyframes bell {
  0%,
  25%,
  75%,
  100% {
    transform: rotate(0deg);
  }
  40% {
    transform: rotate(2deg);
  }
  45% {
    transform: rotate(-2deg);
  }
  55% {
    transform: rotate(1deg);
  }
  60% {
    transform: rotate(-1deg);
  }
}
@keyframes bellClapper {
  0%,
  25%,
  75%,
  100% {
    transform: translateX(0);
  }
  40% {
    transform: translateX(-0.15em);
  }
  45% {
    transform: translateX(0.15em);
  }
  55% {
    transform: translateX(-0.1em);
  }
  60% {
    transform: translateX(0.1em);
  }
}
@keyframes notification {
  0%,
  25%,
  75%,
  100% {
    opacity: 1;
  }
  30%,
  70% {
    opacity: 0;
  }
}

#note {
  display: block;
  position: absolute;
  width: 50%;
  height: 50%;
  background: linear-gradient(to bottom, #e59b9b 0%, #ffffff 100%);
  top: 10%;
  left: 25%;
  color: rgb(255, 255, 255);
  border-radius: 20px;
  overflow: auto;
  padding-left: 30px;
  padding-top: 90px;
}
#exsit {
  position: absolute;
  top: 0%;
  right: 0%;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgb(245, 193, 255);
  border: none;
  font-weight: 600;
  text-align: center; /* ここを変更 */
  justify-content: center;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.164);
  color: #949191d8;
  cursor: pointer;
  transition-duration: 0.3s;
  overflow: hidden;
  color: rgb(241, 174, 174);
}
#exsit:hover {
  width: 140px;
  border-radius: 50px;
  transition-duration: 0.3s;
  background-color: rgb(235, 137, 137);
  text-align: center;
}

.small,
.big {
  text-align: center;
}
.small {
  font: 1.6rem;
}
.big {
  font-size: 2rem;
}

#bignote,
#noteSentense {
  color: #7c3636;
}
</style>
