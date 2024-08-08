<script setup lang="ts">
import {is_login} from '@/assets/auth'
import {onMounted, onUnmounted, ref} from 'vue'

const calender_body = ref<HTMLElement | null>(null)
const joined_day = ref<string>('')
const user_name = ref<string>('')
const formated_time = ref<string>('00:00')
const bio = ref<string>('')
const keyboard_name = ref<string>('')
const play_count = ref<number>(0.0)
const active_level = ref<Array<string>>(["rgb(106,106,108)", "rgb(207,175,207)", "rgb(211,38,227)", "rgb(173,0,239)", "rgb(194,9,255)"])
const short_correct_rate = ref<number>(0.0)
const normal_correct_rate = ref<number>(0.0)
const long_correct_rate = ref<number>(0.0)
//登録日のフォーマット方法->2024/08/03


// 2024の1/1は月曜日
//202412/31は火曜日


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

const total_time: number = 1000
format_time((total_time))

function format_calender_day(activity_calender_value: Array<{
  week_number: number,
  day_of_week: string,
  play_count_in_day: number
}>): Array<Array<object>> {
  const sunday: Array<object> = activity_calender_value ? activity_calender_value.filter((value) => value["day_of_week"] === "Sun").sort((a, b) => a.week_number - b.week_number) : [{}]
  const monday: Array<object> = activity_calender_value ? activity_calender_value.filter((value) => value["day_of_week"] === "Mon").sort((a, b) => a.week_number - b.week_number) : [{}]
  const tuesday: Array<object> = activity_calender_value ? activity_calender_value.filter((value) => value["day_of_week"] === "Tue").sort((a, b) => a.week_number - b.week_number) : [{}]
  const wednesday: Array<object> = activity_calender_value ? activity_calender_value.filter((value) => value["day_of_week"] === "Wed").sort((a, b) => a.week_number - b.week_number) : [{}]
  const thursday: Array<object> = activity_calender_value ? activity_calender_value.filter((value) => value["day_of_week"] === "Thu").sort((a, b) => a.week_number - b.week_number) : [{}]
  const friday: Array<object> = activity_calender_value ? activity_calender_value.filter((value) => value["day_of_week"] === "Fri").sort((a, b) => a.week_number - b.week_number) : [{}]
  const saturday: Array<object> = activity_calender_value ? activity_calender_value.filter((value) => value["day_of_week"] === "Sat").sort((a, b) => a.week_number - b.week_number) : [{}]
  return [sunday, monday, tuesday, wednesday, thursday, friday, saturday]
}


// 0 = 日曜日, 1 = 月曜日, 2 = 火曜日, 3 = 水曜日, 4 = 木曜日, 5 = 金曜日, 6 = 土曜日
//activity_of  =   曜日=array<array<obj,obj,obj,obj>, 曜日=array<obj,obj,obj,obj>, 曜日=array<obj,obj,obj,obj>>
//曜日、その曜日の回数は配列に保管されている
//ある１日の活動履歴は配列の中の一部であり同じ曜日で1/1からの日数が短い順にまとまっている


function generate_user_activity_calender(activity_calender_value: Array<{
  week_number: number,
  day_of_week: string,
  play_count_in_day: number
}>, year: number): void {

  if (year < 2024) {
    console.log("no date")
    return;
  }

  if (calender_body.value) {
    const empty_days = calender_body.value.querySelectorAll("td") as NodeListOf<HTMLTableCellElement>;
    if (empty_days) {


      const empty_same_day_of_week = calender_body.value.querySelectorAll("tr")
      const activity_of = format_calender_day(activity_calender_value) as Array<Array<{
        week_number: number,
        day_of_week: string,
        play_count_in_day: number
      }>>;

      const all_sun_elm: object | undefined = empty_same_day_of_week[0].querySelectorAll("td")
      const all_mon_elm: object | undefined = empty_same_day_of_week[1].querySelectorAll("td")
      const all_tue_elm: object | undefined = empty_same_day_of_week[2].querySelectorAll("td")
      const all_wed_elm: object | undefined = empty_same_day_of_week[3].querySelectorAll("td")
      const all_thu_elm: object | undefined = empty_same_day_of_week[4].querySelectorAll("td")
      const all_fri_elm: object | undefined = empty_same_day_of_week[5].querySelectorAll("td")
      const all_sat_elm: object | undefined = empty_same_day_of_week[6].querySelectorAll("td")
      const all_day_elm: Array<object> = [all_sun_elm, all_mon_elm, all_tue_elm, all_wed_elm, all_thu_elm, all_fri_elm, all_sat_elm]

      const active_levels: Array<string> = active_level.value

      if (year === 2024) {
        empty_days[0].style.visibility = "hidden"
        empty_days[59 + 60 + 60 + 60].style.visibility = "hidden"
        empty_days[59 + 60 + 60 + 60 + 60].style.visibility = "hidden"
        empty_days[59 + 60 + 60 + 60 + 60 + 60].style.visibility = "hidden"
        empty_days[59 + 60 + 60 + 60 + 60 + 60 + 60].style.visibility = "hidden"


        for (let i = 0; i < 7; i++) {
          const the_day_of_calender_elm = all_day_elm[i] as NodeListOf<HTMLTableCellElement>;
          for (let j = 0; j < activity_of[i].length; j++) {
            const the_day_of_play_count: number = activity_of[i][j]["play_count_in_day"]
            const value_of_week_number: number = activity_of[i][j]["week_number"]
            //week_numberは第何周目かを表している
            let adjustment_week_day_index: number = value_of_week_number - 1


            if (1 <= the_day_of_play_count && the_day_of_play_count <= 5) {
              the_day_of_calender_elm[adjustment_week_day_index].style.backgroundColor = active_levels[0]
            } else if (5 < the_day_of_play_count && the_day_of_play_count <= 10) {
              the_day_of_calender_elm[adjustment_week_day_index].style.backgroundColor = active_levels[1]
            } else if (10 < the_day_of_play_count && the_day_of_play_count <= 20) {
              the_day_of_calender_elm[adjustment_week_day_index].style.backgroundColor = active_levels[2]
            } else if (20 < the_day_of_play_count && the_day_of_play_count <= 30) {
              the_day_of_calender_elm[adjustment_week_day_index].style.backgroundColor = active_levels[3]
            } else if (30 < the_day_of_play_count) {
              the_day_of_calender_elm[adjustment_week_day_index].style.backgroundColor = active_levels[4]
            }
          }
        }
      }
    }
  }
}

onMounted(() => {
  document.body.style.overflowX = 'hidden'
  document.body.style.overflowY = 'scroll'
  document.body.style.height = '200vh'
  fetch_user_info()
})


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
          const activity_calender_value: Array<{
            week_number: number,
            day_of_week: string,
            play_count_in_day: number
          }> | undefined = data['activity_calender'] || undefined;


          if (activity_calender_value) {
            generate_user_activity_calender(activity_calender_value, 2024)
          } else {
            console.log('no activity_calender')
          }
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


  <div id="activity_calender">
    <div id="day_of_week_display">
      <div>日</div>
      <div>火</div>
      <div>月</div>
    </div>


    <table id="calender_body" ref="calender_body">
      <tr v-for="day in 7" :key="day" id="same_day_of_week" ref="day_of_week">
        <td v-for="same_say_of_weeks in 60" :key="same_say_of_weeks" class="active_days">
        </td>
      </tr>
    </table>

    <div id="active_level_sample">
      <div class="active_sample_char">少ない</div>
      <div class="active_level_sample_eml" id="active_level_zero" :style="{background:active_level[0]}"></div>
      <div class="active_level_sample_eml" id="active_level_one" :style="{background:active_level[1]}"></div>
      <div class="active_level_sample_eml" id="active_level_two" :style="{background:active_level[2]}"></div>
      <div class="active_level_sample_eml" id="active_level_three" :style="{background:active_level[3]}"></div>
      <div class="active_level_sample_eml" id="active_level_five" :style="{background:active_level[4]}"></div>
      <div class="active_sample_char">多い</div>
    </div>

  </div>
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
    left: 10%;
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
    right: 10%;
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
    right: 10%;
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

  #activity_calender {
    position: absolute;
    display: flex;
    top: 75%;
    right: 10%;
    width: 80%;
    height: 30%;
    border: 2px solid;
    border-image: linear-gradient(to right, var(--border_right-color), var(--border-extra-right-color)) 20;
    justify-content: center;
    align-items: center;

    //曜日の表示
    #day_of_week_display {
      position: absolute;
      height: 75%;
      width: 3%;
      left: 0;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: repeat(3, minmax(3px, 1fr));
      grid-row-gap: 10px;
      color: var(--main--font-color);
    }

    #day_of_week_display div {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    //アクティブカレンダーの中身
    #calender_body {
      left: 3%;
      position: absolute;
      height: 60%;
      width: 95%;
      display: grid;
      grid-column-gap: 5px;
      grid-row-gap: 5px;

      #same_day_of_week {
        display: flex;
        background: transparent;
        grid-column-gap: 5px;
      }

      .active_days {
        width: 100%;
        height: 100%;
        display: flex;
        border: 1px solid;
        border-radius: 5px;
        border-color: var(--sub--font-color);
      }

    }

    #active_level_sample {
      position: absolute;
      display: grid;
      bottom: 10%;
      right: 10%;
      height: 5%;
      grid-template-columns: 2fr repeat(5, 15px) 2fr;
      grid-template-rows: 15px;
      grid-column-gap: 15px;
      grid-row-gap: 10px;
      align-items: center;

      .active_sample_char {
        color: var(--main--font-color);
      }

      .active_level_sample_eml {
        width: 100%;
        height: 100%;
        border: 1px solid;
        border-radius: 5px;
        border-color: var(--sub--font-color);
        padding-left: 10px;
      }
    }
  }
}

#play_history {
  position: absolute;
  right: 10%;
  top: 110%;
  display: grid;
  background: transparent;
  width: 80%;
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

  #activity_calender {
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
  #activity_calender,
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

  #activity_calender {
    top: 100%;

  }
  #play_history {
    top: 125%;
  }
}
</style>
