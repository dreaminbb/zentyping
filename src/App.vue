<script lang="ts" setup>
import { provide, ref } from 'vue'
import { RouterView } from 'vue-router'

const tools = ref(true)
const header_normal_class = ref(true)
const header_focus_class = ref(false)

provide('tools', tools)
provide('header_focus_class', header_focus_class)
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
    <router-link to="/" id="header">
      <h1
        :class="{
          header_focus_class: header_focus_class,
          header_normal_class: header_normal_class
        }"
      >
        mode typing
      </h1>
    </router-link>
    <div id="tools" ref="tools" v-if="tools">
      <div class="tool">
        <span to="/Getq" id="terminal" class="material-symbols-outlined">terminal</span>
      </div>
      <div class="tool">
        <span to="setting" id="settings" class="material-symbols-outlined">settings</span>
      </div>
      <div class="tool">
        <span id="about" class="material-symbols-outlined">Exclamation</span>
      </div>
      <div class="tool">
        <span id="help" class="material-symbols-outlined">Help</span>
      </div>
    </div>
    <RouterView />
  </body>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap');
* {
  box-sizing: border-box;
  user-select: none;
  padding: 0;
  margin: 0;
  font-family: 'Roboto Mono', monospace;
  font-optical-sizing: auto;
}

body {
  margin: 0;
  padding: 0;
  background: linear-gradient(#865ffb, #000000);
  display: flex;
  align-items: center;
  height: 100vh;
  justify-content: center;
  overflow: hidden;
}

#header {
  height: 10%;
  width: 100%;
  top: 0%;
  position: absolute;
  display: flex;
  background-color: transparent;
  filter: brightness(120%);
}
h1 {
  position: absolute;
  letter-spacing: 7px;
  font-size: 3rem;
  bottom: 0%;
  left: 5%;
  border-radius: 16px;
  background-color: transparent;
  color: rgba(250, 250, 250, 0.5);
}

.header_focus_class {
  color: rgba(182, 182, 182, 0.2);
  background-color: transparent;
  border-radius: 16px;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  animation: header_down_animetion ease 0.3s;
  animation-fill-mode: forwards;
}

@keyframes header_down_animetion {
  100% {
    bottom: -10%;
  }
}

#tools {
  position: absolute;
  display: flex;
  top: 8.5%;
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
  display: flex;
  bottom: 10%;
  left: 46%;
  color: #ffffff;
  font-size: 1rem;
  padding: 10px;
  margin: 10px;
  text-align: center;
}
</style>
