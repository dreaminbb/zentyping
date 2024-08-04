<script setup lang="ts">
import {is_login} from '@/assets/auth'
import {onMounted, onUnmounted, ref} from 'vue'

onMounted(() => {
  document.body.style.overflowX = 'hidden'
  document.body.style.overflowY = 'scroll'
  document.body.style.height = '200vh'
})

const joined_day = ref<string>('')
const user_name = ref<string>('')
const formated_time = ref<string>('00:00')
const bio = ref<string>('')
const keyboard_name = ref<string>('')
const play_count = ref<number>(0.0)
const short_correct_rate = ref<number>(0.0)
const normal_correct_rate = ref<number>(0.0)
const long_correct_rate = ref<number>(0.0)

//登録日のフォーマット方法->2024/08/03



//時間のフォーマット方法-> 1:30:00
//formatted_minutes = `0${minutes}` <-もし右の真偽値がtrueの場合  `${minutes}` <-それ以外
function format_time(total_time: number): void {
  const hours: number = Math.floor(total_time / 3600);
  const minutes: number = Math.floor((total_time % 3600) / 60);
  const seconds: number = Math.floor(total_time % 60);

  const formatted_minutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formatted_seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

  if (hours < 1) {
    formated_time.value = `${formatted_minutes}:${formatted_seconds}`;
  } else {
    formated_time.value = `${hours}:${formatted_minutes}:${formatted_seconds}`;
  }
}

const total_time:number = 1000
format_time((total_time))

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
          joined_day.value = data['created_at'].split('T')[0].replace(/-/g, ':') as string
          play_count.value = data["total_result"]['play_count'] as number
          const total_time: number = data['total_result']["total_time"] as number
          format_time((total_time))
          short_correct_rate.value = data["total_result"]["short_correct_rate"] as number
          normal_correct_rate.value = data["total_result"]['normal_correct_rate'] as number
          long_correct_rate.value = data["total_result"]['long_correct_rate'] as number
        } else {
          console.log('you are bad boy')
          user_name.value = '(:'
          formated_time.value = '00:00'
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

  <div id="user_fm">
    <div id="joined_day" class="user_profile">{{ joined_day }}</div>
    <div id="user_icon" class="user_profile"></div>
    <div id="user_name" class="user_profile">{{ user_name }}</div>
    <div id="bio" class="user_profile">{{ bio }}</div>
    <div id="keyboard_name" class="user_profile">キーボード:</div>
    <div id="keyboard_name_char">{{ keyboard_name }}</div>
  </div>

  <p id="line-height"></p>

  <div id="play_info">
    <div class="total_result_elms" id="total_time_display">{{ formated_time }}</div>
    <div class="total_result_elms" id="total_play_count">{{ play_count }}回</div>
  </div>

  <div id="correct_rate_container">
    <div class="correct_rate_display" id="short_correct_rate">short: {{ short_correct_rate }}%</div>
    <div class="correct_rate_display" id="normal_correct_rate">normal: {{ normal_correct_rate }}%</div>
    <div class="correct_rate_display" id="long_correct_rate">long: {{ long_correct_rate }}%</div>
  </div>

  <div id="active_day"></div>
  <div id="play_history"></div>
  </body>
</template>

<!-- todo -->
<!-- ノートパソコンで見たときに下までスクロールしたら白い部分が見えてしまうので、それ以上スクロールできないようにする -->
<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap');

:root {
  --main-icon-color: #dabfbf;
  --char-color: rgb(206, 206, 206);
  --sub--color: #1f1f1f;
  --border_right-color: #759fe9;
  --border_left-color: #ff7e5f;
  --border-sub-right-color: #754b77;
  --border_sub-left-color: #9ba4f3;
  --border-extra-right-color: #f3b9f3;
  --red-fellow: #e0b290;
  --pink_red: #ef7fb0;
  --main--font-color: #f0f0f0;
  --sub--font-color: #808080;
}

body {
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  height: 900vh;
  justify-content: center;
  justify-self: center;

  #user_fm {
    position: absolute;
    top: 20%;
    left: 15%;
    display: flex;
    height: 50%;
    width: 20%;
    right: 30%;
    background: transparent;
    justify-content: center;
    border: 2px solid var(--border_right-color);
    border-image: linear-gradient(to right, var(--border_right-color), var(--border_left-color)) 20;

    #joined_day {
      position: absolute;
      display: flex;
      width: 80%;
      height: 5%;
      right: 10%;
      top: 2%;
      color: var(--main--font-color);
      letter-spacing: 0.1rem;
      align-items: center;
      justify-content: center;
    }

    #user_icon {
      position: absolute;
      top: 15%;
      display: flex;
      width: 100px;
      height: 100px;
      background-color: #ccc;
      border-radius: 50%;
      align-items: center;
      justify-content: center;
    }

    #user_name {
      position: absolute;
      display: flex;
      width: 90%;
      height: 10%;
      left: 5%;
      bottom: 50%;
      font-size: 150%;
      color: var(--main--font-color);
      letter-spacing: 0.1rem;
      align-items: center;
      justify-content: center;
    }

    #bio {
      position: absolute;
      display: flex;
      width: 90%;
      height: 40%;
      left: 5%;
      bottom: 5%;
      color: var(--main--font-color);
      letter-spacing: 0.1rem;
      justify-content: center;
    }

    #keyboard_name {
      position: absolute;
      display: flex;
      width: 90%;
      height: 5%;
      left: 5%;
      bottom: 8%;
      color: var(--sub--font-color);
      letter-spacing: 0.1rem;
    }

    #keyboard_name_char {
      position: absolute;
      display: flex;
      width: 90%;
      height: 5%;
      left: 5%;
      bottom: 2%;
      color: var(--main--font-color);
      letter-spacing: 0.1rem;
    }
  }

  #line-height {
    background: rgba(166, 166, 166, 0.5);
  }

  #line-height {
    position: absolute;
    display: flex;
    top: 20%;
    left: 40%;
    width: 2px;
    height: 50%;
  }

  #line-withed {
    position: absolute;
    display: flex;
    top: 45%;
    left: 41%;
    width: 44%;
    height: 2px;
  }

  #play_info {
    position: absolute;
    height: 10%;
    width: 40%;
    top: 20%;
    right: 15%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    border: 2px solid;
    border-image: linear-gradient(to right, var(--border-sub-right-color), var(--border_sub-left-color)) 20;

    .total_result_elms {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--main--font-color);
      font-size: 1.5rem;
    }
  }

  #correct_rate_container {
    position: absolute;
    display: flex;
    top: 35%;
    right: 15%;
    width: 40%;
    height: 10%;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    border: 2px solid;
    border-image: linear-gradient(to right, var(--border_right-color), var(--border-extra-right-color)) 20;
    align-items: center;
    padding: 40px;
    justify-content: space-between;

    .correct_rate_display {
      color: var(--main--font-color);
      font-size: 1.25rem;
    }
  }

  #active_day {
    position: absolute;
    top: 50%;
    right: 15%;
    width: 40%;
    height: 20%;
    display: flex;
    border: 2px solid;
    border-image: linear-gradient(to right, var(--border_right-color), var(--border-extra-right-color)) 20;
  }

  #play_history {
    position: absolute;
    right: 15%;
    top: 75%;
    display: grid;
    width: 70%;
    height: 60%;
    border: 2px solid;
    border-image: linear-gradient(to right, var(--red-fellow), var(--pink_red)) 20;
  }


  @media (max-width: 1280px) {
    * {
      font-size: 1rem;
    }

    .user_profile {
      width: 70%;
      padding: 10px;
    }

    #user_name {
      top: 50%;
    }
    #bio {
      top: 60%;
    }
    #keyboard_name {
      top: 70%;
      font-size: 0.5rem;
    }

    #user_fm {
      width: 35%;
      height: 75%;
    }

    #play_info {
      height: 30%;
    }

    #active_day {
      height: 30%;
      top: 65%
    }

    #user_icon {
      width: 50px;
      height: 50px;
    }

    #user_name {
      font-size: 110%;
    }

    #play_history {
      top: 110%;
    }
  }


  @media (max-width: 920px) {
    * {
      font-size: 0.7rem;
    }

    #user_fm,
    #play_info,
    #active_day,
    #play_history {
      width: 80%;
      left: 10%;
    }
    #keyboard_name {
      font-size: 0.6rem;
    }

    #user_icon {
      width: 50px;
      height: 50px;
    }

    #user_name {
      font-size: 110%;
    }

    #play_info {
      top: 75%;
    }

    #active_day {
      top: 100%;

    }
    #play_history {
      top: 125%;
    }
  }
}
</style>
