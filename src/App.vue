<script lang="ts" setup>
import { provide, ref } from 'vue'
import { RouterView } from 'vue-router'
import router from './router'

const tools = ref(true)
const header_normal_class = ref(true)
const header_focus_class = ref(false)

provide('tools', tools)
provide('header_focus_class', header_focus_class)
</script>

<template>
  <body>
    <header>
      <router-link to="/" id="title">
        <h1
          :class="{
            header_focus_class: header_focus_class,
            header_normal_class: header_normal_class
          }"
        >
          mode typing
        </h1>
      </router-link>
      <router-link to="/login" id="login">
        <p id="login_char">login</p>
      </router-link>
    </header>
    <div id="tools" ref="tools" v-if="tools">
      <div class="tool">
        <svg id="terminal" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
          <path
            d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H160v400Zm140-40-56-56 103-104-104-104 57-56 160 160-160 160Zm180 0v-80h240v80H480Z"
          />
        </svg>
      </div>
      <div class="tool">
        <svg id="setting" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
          <path
            d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"
          />
        </svg>
      </div>
      <div class="tool">
        <svg id="about" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
          <path
            d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
          />
        </svg>
      </div>
      <div class="tool">
        <svg id="help" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
          <path
            d="M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
          />
        </svg>
      </div>
    </div>
    <RouterView />
  </body>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap');
:root {
  --main-icon-color: #dabfbf;
  --char-color: rgb(206, 206, 206);
}
svg {
  fill: var(--main-icon-color);
  width: 50px;
}

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
header {
  position: absolute;
  top: 0;
  height: 7%;
  width: 100%;
  background-color: transparent;
}

#title {
  height: 10%;
  width: 100%;
  right: 0;
  bottom: 0;
  position: absolute;
  display: flex;
  background-color: transparent;
  filter: brightness(120%);
}
#login {
  position: absolute;
  display: flex;
  background-color: transparent;
  justify-content: center;
  border-radius: 10px;
  text-decoration: none;
  border: 1px solid rgb(202, 202, 202);
  font-size: 2rem;
  width: 10%;
  height: 90%;
  right: 5%;
  bottom: 0;
}
#login_char {
  color: var(--char-color);
  border: none;
}
#login:hover,
#login:hover {
  border-color: aliceblue;
}

h1 {
  position: absolute;
  letter-spacing: 7px;
  font-size: 3rem;
  bottom: 0%;
  left: 5%;
  border-radius: 16px;
  background-color: transparent;
  color: var(--char-color);
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
  width: 25%;
  height: 100%;
  border-radius: 900px;
  filter: brightness(130%);
  background-color: transparent;
  justify-content: center;
  align-items: center;
  text-align: center;
}

#setting,
#terminal,
#about,
#help {
  width: 40px;
  height: 30px;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}

#setting:hover,
#terminal:hover,
#about:hover,
#help:hover,
.tool:hover {
  width: 100px;
  transition: 0.5s;
  transform: translateY(-1px);
  filter: brightness(150%);
  box-shadow: rgba(151, 65, 252, 0.2) 0 15px 30px -5px;
}
#scut {
  position: absolute;
  display: flex;
  bottom: 10%;
  left: 46%;
  color: var(--char-color);
  font-size: 1rem;
  padding: 10px;
  margin: 10px;
  text-align: center;
}
</style>
