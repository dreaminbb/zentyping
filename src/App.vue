<script setup>
import { RouterView } from 'vue-router'
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
        <span to="" id="settings" class="material-symbols-outlined">settings</span>
      </div>
      <div class="tool">
        <span id="about" class="material-symbols-outlined">Exclamation</span>
      </div>
      <div class="tool">
        <span id="help" class="material-symbols-outlined">Help</span>
      </div>
    </div>
    <span id="scut"
      >crlr + c <br />
      command line
    </span>
    <RouterView />
  </body>
</template>

<style>
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  user-select: none;
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
