<script lang="ts" setup>
import base_header from '@/components/base_header.vue'

</script>

<template>
  <body>
    <base_header />
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

  .tool_svg:hover {
    transition: 0.5s;
    transform: translateY(-1px);
    filter: brightness(150%);
  }

  body {
    margin: 0;
    padding: 0;
    background: rgb(12, 11, 11);
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

    #login_link {
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
