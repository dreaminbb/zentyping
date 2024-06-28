<script lang="ts" setup>
import {provide, type Ref, ref} from 'vue'
import {RouterView} from 'vue-router'
import {is_login} from './client'


const tools = ref(true)
const login_button = ref(true)
const user_profile: Ref<boolean> = ref(false)

const header_normal_class = ref(true)
const header_focus_class = ref(false)

//ログインしていたらログインボタンを消す
provide('login', is_login)
provide('tools', tools)
provide('header_normal_class', header_normal_class)
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
  </header>

  <div id="head_items">
    <router-link
        to="/profile"
        ref="user_profile"
        id="profile_link"
        v-if="is_login && $route.name === 'home'"
        class="items"
    >
      <svg class="item_svg" id="profile_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
        <path
            d="M480-240q-56 0-107 17.5T280-170v10h400v-10q-42-35-93-52.5T480-240Zm0-80q69 0 129 21t111 59v-560H240v560q51-38 111-59t129-21Zm0-160q-25 0-42.5-17.5T420-540q0-25 17.5-42.5T480-600q25 0 42.5 17.5T540-540q0 25-17.5 42.5T480-480ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80H240Zm240-320q58 0 99-41t41-99q0-58-41-99t-99-41q-58 0-99 41t-41 99q0 58 41 99t99 41Zm0-140Z"
        />
      </svg>
    </router-link>

    <button id="logout_button" class="items" @click="logout" v-if="is_login && $route.name === 'home'">
      <svg class="item_svg" id="logout_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
        <path
            d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
      </svg>
    </button>

    <router-link
        id="register_link"
        class="items"
        to="/login"
        v-if="!is_login && $route.name === 'home'"
        ref="login_button"
    >
      <svg id="register_icon" class="item_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
        <path
            d="M80-160v-112q0-33 17-62t47-44q51-26 115-44t141-18q30 0 58.5 3t55.5 9l-70 70q-11-2-21.5-2H400q-71 0-127.5 17T180-306q-9 5-14.5 14t-5.5 20v32h250l80 80H80Zm542 16L484-282l56-56 82 82 202-202 56 56-258 258ZM400-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm10 240Zm-10-320q33 0 56.5-23.5T480-640q0-33-23.5-56.5T400-720q-33 0-56.5 23.5T320-640q0 33 23.5 56.5T400-560Zm0-80Z"/>
      </svg>
    </router-link>

  </div>


  <div id="tools" ref="tools" v-if="!is_login && $route.name === 'home'">
    <svg class="tool_svg" id="terminal" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
      <path
          d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H160v400Zm140-40-56-56 103-104-104-104 57-56 160 160-160 160Zm180 0v-80h240v80H480Z"
      />
    </svg>
    <svg class="tool_svg" id="setting" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
      <path
          d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"
      />
    </svg>
    <svg class="tool_svg" id="about" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
      <path
          d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
      />
    </svg>
    <svg class="tool_svg" id="help" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
      <path
          d="M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
      />
    </svg>
  </div>
  <RouterView/>
  </body>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap');

:root {
  --main-icon-color: #dabfbf;
  --char-color: rgb(206, 206, 206);
  --svg-size: 50px;
}


* {
  box-sizing: border-box;
  user-select: none;
  padding: 0;
  margin: 0;
  font-family: 'Roboto Mono', monospace;
  font-optical-sizing: auto;

  svg {
    fill: var(--main-icon-color);
  }

  svg:hover {
    transition: 0.5s;
    transform: translateY(-1px);
    filter: brightness(150%);
    box-shadow: rgba(151, 65, 252, 0.2) 0 15px 30px -5px;
  }

  body {
    margin: 0;
    padding: 0;
    background: linear-gradient(#8258b8, #68506a, #4f3b4f);
    display: flex;
    align-items: center;
    height: 100vh;
    justify-content: center;
    overflow: auto;
  }

  header {
    position: absolute;
    top: 0;
    height: 7%;
    width: 100%;
    background-color: transparent;

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

    h1 {
      position: absolute;
      letter-spacing: 7px;
      font-size: 3rem;
      bottom: 0;
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
      animation: header_down_animation ease 0.3s;
      animation-fill-mode: forwards;
    }
  }

  //ログインページのリンクやプロフィールへのボタン
  #head_items {
    position: absolute;
    display: grid;
    background: transparent;
    top: 2%;
    width: 20%;
    height: 6%;
    right: 10%;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 1fr;

    .item_svg {
      width: 100%;
      height: 100%;
    }

    .items {
      top: 0;
      position: absolute;
      background: transparent;
      border: none;
      justify-content: center;
      align-items: center;
      margin: auto;
    }

    #profile_link {
      grid-column: 1;
      width: 50%;
      height: 100%;
    }

    #logout_button {
      grid-column: 2;
      width: 100%;
      height: 100%;
    }


    #register_link {
      grid-column: 1;
      width: 100%;
      height: 100%;
      top: 0;
    }

    .item_svg:hover {
      fill: var(--main-icon-color);
    }
  }
}


@keyframes header_down_animation {
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
  border-radius: 40px;
  background: rgba(255, 255, 255, 0.3);
  -webkit-backdrop-filter: blur(17px);
  backdrop-filter: blur(17px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  justify-content: space-around;
  align-items: center;
}

#tool_svg {
  fill: var(--main-icon-color);
}

#setting,
#terminal,
#about,
#help {
  width: 35px;
  transition: (50%, 50%);
}

</style>
