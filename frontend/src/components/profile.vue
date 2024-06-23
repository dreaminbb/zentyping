<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  document.body.style.overflowX = 'hidden'
  document.body.style.overflowY = 'scroll'
})

onUnmounted(() => {
  document.body.style.overflow = 'hidden' // スクロールを無効にする
})
</script>

<template>
  <main>
    <div id="profile_component">
      <div id="fm">
        <div id="user_fm">
          <div id="user_icon"></div>
          <div id="user_name"></div>
          <div id="reg_day"></div>
        </div>

        <div id="play_info_fm">
          <div id="last_play"></div>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
main {
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  height: 200vh;
  justify-content: center;
  overflow: hidden;
  justify-self: center;
}

#fm {
  width: 80%;
  height: 90%;
  position: absolute;
  top: 16%;
  left: 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4.4px);
  -webkit-backdrop-filter: blur(4.4px);
  border: 1px solid rgba(255, 255, 255, 0.56);
}

#user_fm {
  display: flex;
  position: absolute;
  top: 5%;
  left: 5%;
  height: 22%;
  width: 90%;
  background-color: turquoise;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;

  #user_icon {
    width: 180px;
    height: 180px;
    background-color: #ccc;
    border-radius: 50%;
  }

  #user_name {
    position: absolute;
    display: flex;
    width: 50%;
    height: 60%;
    left: 15%;
    background-color: red;
  }
  #reg_day {
    position: absolute;
    display: flex;
    width: 20%;
    height: 60%;
    right: 10%;
    background-color: yellow;
  }
}
</style>
