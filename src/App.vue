<script setup></script>
<template>
  <body>
    <header>
      <h1>head</h1>
    </header>
    <div class="card" id="left">
      <p id="rankingCaracter">Ranking</p>
      <button class="button" id="checkButton">check</button>
    </div>
    <div class="card" id="center">
      <button class="button" id="writeButton">write</button>
      <img src="..\iconandpic\paint-brush.png" alt="" id="writtingicon" />
    </div>
    <div class="card" id="right">
      <div class="card__content"></div>
      <button class="button" id="playButton">play</button>
    </div>
  </body>
</template>

<style>
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
  background: linear-gradient(to right, rgb(22, 138, 167), rgb(250, 250, 250));
  filter: brightness(120%); /* 光度を20%上げる */
  color: #000000;
  border-radius: 10px;
}
h1 {
  font-size: 3rem;
  background-color: rgb(168, 106, 106) rgb(187, 149, 149) rgb(204, 188, 188);
}

.card {
  display: flex;
  position: absolute;
  width: 400px;
  height: 50%;
  bottom: 14%;
  padding: 20px;
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

#center {
  box-sizing: border-box;
  background: #ffffff;
  background-image: linear-gradient(#ffffff 1.1rem, #ccc 1.2rem);
  background-size: 100% 1.2rem;
  border-radius: 10px;
  cursor: move;
  transition: 0.5s;
}

#writeButton {
  background-color: #e6e6e6;
}
#writeButton:hover {
  background-color: #a5a5a5;
  box-shadow: 10px 50px rgba(194, 194, 194, 0.1);
  transition: 0.5s;
  transform: translateY(-10px);
}
#writtingicon {
  position: absolute;
  display: flex;
  color: #00ddeb;
  width: 10%;
  height: 9%;
  right: 10%;
  bottom: 30%;
}

#right {
  filter: brightness(130%); /* 光度を20%上げる */
  right: 10%;
  border-radius: 20px;
  padding: 3px;
  box-shadow: rgba(151, 65, 252, 0.2) 0 15px 30px -5px;
  background-image: linear-gradient(144deg, #af40ff, #5b42f3 50%, #00ddeb);
}
.card__content {
  background: rgb(17, 19, 82);
  border-radius: 17px;
  width: 100%;
  height: 100%;
}
#playButton {
  background: linear-gradient(144deg, #6f4d8a, #414294 60%, #11555a);
  border: 1px solid #ffffff;
  transition: 0.5s;
}

#playButton:hover {
  background: linear-gradient(144deg, #6f4d8a, #4245f3 40%, #db2222);
  box-shadow:  1px 30px 40px rgba(233, 233, 233, 0.1);
  transform: translateY(-10px);
}
</style>
