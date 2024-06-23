<script setup lang="ts">
import { inject, onMounted, onUnmounted } from 'vue'

onMounted(() => {
  document.body.style.overflowX = 'hidden'
  document.body.style.overflowY = 'scroll'
  document.body.style.height = '200vh'
})

onUnmounted(() => {
  document.body.style.overflow = 'hidden' // スクロールを無効にする
  document.body.style.height = '' // 元の状態に戻す
  document.body.style.overflow = '' // 元の状態に戻す
})
</script>

<template>
  <body>
    <div id="fm">
      <div id="user_fm">
        <div id="user_icon"></div>
        <div id="user_name"></div>
        <div id="reg_day"></div>
      </div>

      <div id="cps_fm" class="four_elm">
        <div id="cps_chart"></div>
      </div>

      <div id="play_count_fm" class="four_elm">
        <div id="play_count"></div>
      </div>

      <div id="best_ips_fm" class="four_elm">
        <div id="best_ips"></div>
      </div>

      <div id="total_time_fm" class="four_elm">
        <div id="total_time"></div>
      </div>

      <div id="active_day"></div>
    </div>
  </body>
</template>

<style lang="scss" scoped>
body {
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
  height: 150%;
  position: absolute;
  top: 16%;
  left: 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: transparent;

  //ユーザーの名前、登録日、アイコンなど
  #user_fm {
    display: flex;
    position: absolute;
    top: 5%;
    left: 0;
    height: 15%;
    width: 100%;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(4.4px);
    -webkit-backdrop-filter: blur(4.4px);
    border: 1px solid rgba(255, 255, 255, 0.56);
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;

    #user_icon {
      position: absolute;
      left: 2%;
      width: 10%;
      height: 70%;
      background-color: #ccc;
      border-radius: 50%;
    }

    #user_name {
      position: absolute;
      display: flex;
      width: 50%;
      height: 60%;
      left: 20%;
      background-color: red;
    }

    #reg_day {
      position: absolute;
      display: flex;
      width: 20%;
      height: 60%;
      right: 5%;
      background-color: yellow;
    }
  }

  // プレイ情報

  .four_elm {
    position: absolute;
    display: flex;
    height: 10%;
    width: 20%;
    top: 25%;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(4.4px);
    -webkit-backdrop-filter: blur(4.4px);
    border: 1px solid rgba(255, 255, 255, 0.56);
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;
  }

  #cps_fm {
    left: 0;
  }

  #play_count_fm {
    left: 25%;
  }

  #best_ips_fm {
    left: 55%;
  }

  #total_time_fm {
    left: 80%;
  }

  #active_day {
    position: absolute;
    display: flex;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(4.4px);
    -webkit-backdrop-filter: blur(4.4px);
    border: 1px solid rgba(255, 255, 255, 0.56);
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;
    height: 30%;
    width: 100%;
    top: 40%;
  }
}
</style>
