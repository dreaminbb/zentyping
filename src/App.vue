<script setup>
import { ref, onMounted } from 'vue'

const writting = 'おだいをかいてみよう'
const displayText = ref('')

onMounted(() => {
  let index = 0
  setInterval(() => {
    if (index < writting.length) {
      displayText.value += writting.charAt(index)
      index++
    } else {
      index = 0
      displayText.value = ''
    }
  }, 300) // 1秒ごとに文字を追加
})
</script>
<template>
  <body>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Yuji+Hentaigana+Akari&display=swap"
      rel="stylesheet"
    />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,-25"
    />
    <header>
      <h1>justy typing</h1>
    </header>
    <div id="tools">
      <div class="tool">
        <span to="/Getq" id="terminal" class="material-symbols-outlined">terminal</span>
      </div>
      <div class="tool">
        <router-link to="" id="settings" class="material-symbols-outlined">settings</router-link>
      </div>
      <div class="tool">
        <span id="about" class="material-symbols-outlined">Exclamation</span>
      </div>
      <div class="tool">
        <span id="help" class="material-symbols-outlined">Help</span>
      </div>
    </div>
    <div class="card" id="left">
      <p id="rankingCaracter">Ranking</p>
      <button class="button" id="checkButton">check</button>
    </div>
    <div class="card" id="center">
      <button class="button" id="writeButton">write</button>
      <span id="writtingAnimetion">{{ displayText }}</span>
      <span id="writting" class="material-symbols-outlined">Brush</span>
    </div>
    <div id="cardframe">
      <div id="right">
        <div class="card__content"></div>
        <div id="cardhover"></div>
        <span class="material-symbols-outlined" id="keyboardicon"> keyboard </span>
        <button class="button" id="playButton">play</button>
      </div>
    </div>
  </body>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Yuji+Hentaigana+Akebono&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Slackside+One&family=Yuji+Hentaigana+Akebono&display=swap');

.yuji-hentaigana akebono-regular {
  font-family: 'Yuji Hentaigana Akebono', cursive;
  font-weight: 400;
  font-style: normal;
}

.slackside-one-regular {
  font-family: 'Slackside One', cursive;
  font-weight: 400;
  font-style: normal;
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  user-select: none;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  justify-content: center;
}
body {
  margin: 0;
  padding: 0;
  background: linear-gradient(#652bc2, #000000);
  display: flex;
  align-items: center;
  height: 100vh;
  justify-content: center;
  overflow: hidden;
  font-family: 'poppins', sans-serif;
}

header {
  width: 100%;
  top: 0%;
  position: absolute;
  display: flex;
  background-color: transparent;
  filter: brightness(120%); /* 光度を20%上げる */
  border-radius: 10px;
}
h1 {
  position: absolute;
  left: 5%;
  font-family: cursive;
  font-size: 3rem;
  color: #ebebeb;
  text-align: left;
}
#tools {
  position: absolute;
  display: flex;
  top: 10%;
  width: 20%;
  height: 4%;
  right: 10%;
  background-color: rgb(255, 255, 255);
  border-radius: 40px;
  background: rgba(255, 255, 255, 0.3);
  -webkit-backdrop-filter: blur(17px);
  backdrop-filter: blur(17px);
  border: 1px solid rgba(255, 255, 255, 0.15);
}
.tool {
  display: flex;
  flex: 1;
  background-color: #ffffff;
  width: 25%;
  height: 100%;
  border-radius: 900px;
  filter: brightness(130%);
  background-color: transparent;
  justify-content: center;
  align-items: center;
  text-align: center;
}
#settings,
#terminal,
#about,
#help {
  width: 33%;
  height: 100%;
  position: absolute;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: #b981ca;
}

#settings:hover,
#terminal:hover,
#about:hover,
#help:hover,
.tool:hover {
  transition: 0.5s;
  transform: translateY(-1px);
  color: #dabfbf;
  filter: brightness(150%);
  box-shadow: rgba(151, 65, 252, 0.2) 0 15px 30px -5px;
}
.card {
  display: flex;
  position: absolute;
  width: 400px;
  height: 50%;
  bottom: 14%;
  padding: 20px;
  filter: brightness(130%);
}

.button {
  position: absolute;
  border: none;
  border-radius: 30px;
  bottom: 10%;
  width: 35%;
  height: 10%;
  align-items: center;
  color: #808080;
  cursor: pointer;
  font-size: 1.5rem;
  text-align: center;
  text-decoration: none;
  display: flex;
  transition-duration: 0.4s;
}

#left {
  filter: brightness(130%);
  left: 10%;
  border-radius: 20px;
  padding: 3px;
  box-shadow: rgba(151, 65, 252, 0.2) 0 15px 30px -5px;
  background-image: linear-gradient(144deg, #af40ff, #5b42f3 50%, #00ddeb);
  transition: 0.5s;
}
#rankingCaracter {
  font-size: 2.7rem;
  color: #949494;
}
#left:hover {
  filter: brightness(150%);
}

#checkButton {
  background: linear-gradient(144deg, #af40ff, #5b42f3 50%, #00ddeb);
  border: 1px solid #ffffff;
  transition: 0.5s;
}
#checkButton:hover {
  background: linear-gradient(144deg, #af40ff, #5b42f3 50%, #00ddeb);
  box-shadow: 1px 30px 40px rgba(233, 233, 233, 0.1);
  transform: translateY(-10px);
}

#center {
  display: block;
  box-sizing: border-box;
  background: #ffffff;
  background-image: linear-gradient(#ffffff 1.1rem, #ccc 1.2rem);
  background-size: 100% 1.2rem;
  border-radius: 10px;
  cursor: move;
  transition: 0.5s;
}
#center:hover {
  box-shadow: 10px 50px rgba(194, 194, 194, 0.1);
  transition: 0.5s;
  transform: translateY(-10px);
  transform: rotate(10deg);
}

#writeButton {
  background-color: #a0a0a0;
  position: absolute;
  left: 35%;
}
#writeButton:hover {
  background-color: #a5a5a5;
  box-shadow: 10px 50px rgba(194, 194, 194, 0.1);
  transition: 0.5s;
  transform: translateY(-10px);
}
#writtingicon {
  padding: 0;
  margin: 0;
  position: absolute;
  display: flex;
  color: #00ddeb;
  width: 10%;
  height: 9%;
  right: 10%;
  bottom: 60%;
  animation: shake-diagonal 1s infinite;
}
@keyframes shake-diagonal {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(5deg);
  }
  50% {
    transform: rotate(0deg);
  }
  75% {
    transform: rotate(-5deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
#writtingAnimetion {
  font-family: 'slackside one', cursive;
  font-size: 3rem;
  word-wrap: break-word;
}

#cardframe {
  position: absolute;
  justify-content: center;
  align-items: center;
  display: flex;
  right: 10%;
  width: 400px;
  height: 50%;
  bottom: 14%;
}
#right {
  position: absolute;
  display: flex;
  filter: brightness(130%); /* 光度を20%上げる */
  width: 100%;
  height: 100%;
  border-radius: 20px;
  padding: 3px;
  box-shadow: rgba(151, 65, 252, 0.2) 0 15px 30px -5px;
  background-image: linear-gradient(144deg, #af40ff, #5b42f3 50%, #00b6d6);
}
.card__content {
  background: rgb(17, 19, 75);
  border-radius: 17px;
  width: 100%;
  height: 100%;
}
#right:hover {
  transition: 0.7s;
  filter: brightness(130%);
  animation: contraction 1s infinite;
  height: 90%;
  bottom: 0;
}
#right:hover::after {
  content: 'play ?';
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  position: absolute;
  filter: brightness(150%);
  color: rgb(80, 80, 80);
  font-size: 3rem;
}

#right:hover #cardhover {
  height: 109%;
  width: 100%;
  left: 0%;
  top: -8%;
  border-radius: 28px;
  transition: 0.7s;
  box-shadow: rgba(151, 65, 252, 0.2) 0 15px 30px -5px;
  border-color: red;
}

#playButton {
  background: linear-gradient(144deg, #6f4d8a, #414294 60%, #11555a);
  border: 1px solid #ffffff;
  transition: 0.5s;
}
#keyboardicon {
  position: absolute;
  display: flex;
  bottom: 40%;
  font-size: 8rem;
  color: #525b8a;
}
#cardhover {
  position: absolute;
  top: 0%;
  background-color: #00ddeb;
  border: none;
  border-radius: 40px 40px 0px 0px;
  border-radius: 20px;
  width: 400px;
  height: 0%;
  text-align: center;
  background-color: #00ddeb;
  color: #00ddeb;
  bottom: 10%;
  font-size: 2rem;
}

#playButton:hover {
  background: linear-gradient(144deg, #6f4d8a, #4245f3 40%, #db2222);
  box-shadow: 1px 30px 40px rgba(233, 233, 233, 0.1);
  transform: translateY(-10px);
}
</style>
