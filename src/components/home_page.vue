<script lang="ts">
import { ref, onMounted } from 'vue'
export default {
  setup() {
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
      }, 300)
    })

    return {
      displayText
    }
  }
}
</script>
<template>
  <body>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link
      href="https://fonts.googleapis.com/css2?family=Yuji+Hentaigana+Akari&display=swap"
      rel="stylesheet"
    />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,-25"
    />
    <div class="card" id="left">
      <p id="rankingCaracter">Ranking</p>
    </div>
    <router-link to="/write" class="card" id="center">
      <span id="writtingAnimetion">{{ displayText }}</span>
      <span id="writting" class="material-symbols-outlined">Brush</span>
    </router-link>
    <router-link to="/play" id="cardframe">
      <div id="right">
        <div class="card__content"></div>
        <div id="cardhover"></div>
        <span class="material-symbols-outlined" id="keyboardicon"> keyboard </span>
      </div>
    </router-link>
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
  left: 5%;
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
  right: 5%;
  width: 400px;
  height: 50%;
  bottom: 14%;
}
#right {
  position: absolute;
  display: flex;
  filter: brightness(130%);
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
}
#scut {
  position: absolute;
  bottom: 2%;
  left: 46%;
  color: #ffffff;
  font-size: 1rem;
  font-family: cursive;
  text-align: right;
  padding: 10px;
  margin: 10px;
  text-align: center;
}
</style>
