<script setup lang="ts">
import {is_login} from '@/assets/auth'
import {onMounted, onUnmounted, ref} from 'vue'

onMounted(() => {
  document.body.style.overflowX = 'hidden'
  document.body.style.overflowY = 'scroll'
  document.body.style.height = '200vh'
})

const user_name = ref<string>('')
const total_time = ref<number>(0)
const bio = ref<string>('')
const created_at = ref<string>('')
const play_count = ref<number>(0)
const short_correct_rate = ref<number>(0)
const normal_correct_rate = ref<number>(0)
const long_correct_rate = ref<number>(0)


async function fetch_user_info(): Promise<void> {
  if (document.cookie && is_login.value) {
    try {
      const response: Response = await fetch('http://localhost:8000/user/info', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      if (response.status === 200) {
        if (data) {
          user_name.value = data['name'] as string
          bio.value = data['bio'] as string
          play_count.value = data['play_count'] as number
          created_at.value = data['created_at'] as string
          total_time.value = data['total_time'] as number
          short_correct_rate.value = data["short_correct_rate"] as number
          normal_correct_rate.value = data['normal_correct_rate'] as number
          long_correct_rate.value = data['long_correct_rate'] as number

        } else {
          console.log('you are bad boy')
          user_name.value = '(:)'
          total_time.value = 0
        }
      } else if (response.status === 401) {
        console.log('ログインし直してください')
        return
      } else if (response.status === 500) {
        console.log('サーバー側でエラーが発生しました')
        return
      }
    } catch (error) {
      console.error(error)
      return
    }
  } else {
    console.log('no cookie???')
    is_login.value = false
    return
  }
}

fetch_user_info()

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
      <div id="user_name">{{ user_name }}</div>
      <div id="reg_day"></div>
      <div id="bio"></div>
    </div>


    <div id="total_results">
      <div id=""></div>

    </div>

    <div id="active_day"></div>




    <!--    <div id="cps_fm" class="four_elm">-->
    <!--      <div id="cps_chart"></div>-->
    <!--    </div>-->

    <!--    <div id="play_count_fm" class="four_elm">-->
    <!--      <div id="play_count">{{ play_count }}</div>-->
    <!--    </div>-->

    <!--    <div id="correct_rate" class="four_elm">-->

    <!--    </div>-->

    <!--    <div id="total_time_fm" class="four_elm">-->
    <!--      <div id="total_time">{{ total_time }}</div>-->
    <!--    </div>-->

    <!--    <div id="active_day"></div>-->
  </div>
  </body>
</template>

<!-- todo -->
<!-- ノートパソコンで見たときに下までスクロールしたら白い部分が見えてしまうので、それ以上スクロールできないようにする -->
<style lang="scss" scoped>
body {
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  height: 900vh;
  min-height: 100%;
  justify-content: center;
  justify-self: center;

  #fm {
    width: 80%;
    height: 150%;
    position: absolute;
    top: 15%;
    left: 10%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: transparent;


    //ユーザーの名前、登録日、アイコンなど
    #user_fm {
      position: relative;
      display: flex;
      height: 50%;
      width: 40%;
      top: 0;
      right: 30%;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 16px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(4.4px);
      -webkit-backdrop-filter: blur(4.4px);
      border: 1px solid rgba(255, 255, 255, 0.56);
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #ccc;

      #reg_day {
        position: absolute;
        display: flex;
        width: 80%;
        height: 5%;
        right: 10%;
        top: 0;
        background-color: yellow;
      }

      #user_icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -150%);
        display: flex;
        width: 10vw;
        height: 20vh;
        background-color: #ccc;
        border-radius: 50%;
      }

      #user_name {
        position: absolute;
        display: flex;
        width: 90%;
        height: 10%;
        left: 5%;
        background-color: red;
      }

      #bio {
        position: absolute;
        display: flex;
        width: 90%;
        height: 30%;
        left: 5%;
        bottom: 10%;
        background-color: blue;
      }
    }

    #total_results{
      position: relative;
      display: grid;
      grid-template-columns: 1fr 1fr;
      width: 60%;
      height: 25%;
      left: 25%;
      top: -50%;
      background: red;
    }

    #active_day {
      position: relative;
      display: flex;
      width: 60%;
      height: 20%;
      left: 25%;
      top: -45%;
      background: blue;
    }

  }
}

// プレイ情報
</style>
