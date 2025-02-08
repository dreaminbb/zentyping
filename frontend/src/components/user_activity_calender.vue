<script setup lang="ts">
// import {onMounted, ref} from 'vue'

// const calender_body = ref<HTMLElement | null>(null)
// const active_level = ref<Array<string>>(['rgb(237,227,239)', 'rgb(207,175,207)', 'rgb(248,159,255)', 'rgb(173,0,239)', 'rgb(194,9,255)'])

// // 登録日のフォーマット方法->2024/08/03
// // 2024の1/1は月曜日
// // 202412/31は火曜日
// function format_calender_day(activity_calender_value: Array<{
//   day: string,
//   week_number: number,
//   day_of_week: string,
//   play_count_in_day: number
// }>): Array<Array<{
//   day: string,
//   week_number: number,
//   day_of_week: string,
//   play_count_in_day: number
// }>> {
//   const sunday = activity_calender_value.filter((value) => value.day_of_week === 'Sun').sort((a, b) => a.week_number - b.week_number)
//   const monday = activity_calender_value.filter((value) => value.day_of_week === 'Mon').sort((a, b) => a.week_number - b.week_number)
//   const tuesday = activity_calender_value.filter((value) => value.day_of_week === 'Tue').sort((a, b) => a.week_number - b.week_number)
//   const wednesday = activity_calender_value.filter((value) => value.day_of_week === 'Wed').sort((a, b) => a.week_number - b.week_number)
//   const thursday = activity_calender_value.filter((value) => value.day_of_week === 'Thu').sort((a, b) => a.week_number - b.week_number)
//   const friday = activity_calender_value.filter((value) => value.day_of_week === 'Fri').sort((a, b) => a.week_number - b.week_number)
//   const saturday = activity_calender_value.filter((value) => value.day_of_week === 'Sat').sort((a, b) => a.week_number - b.week_number)
//   return [sunday, monday, tuesday, wednesday, thursday, friday, saturday]
// }

// onMounted(() => {
//   setInterval(() => {
//     const activity_calender_value = user_info().activity_calender
//     const formated_activity_calender_value: Array<Array<{
//       day: string,
//       week_number: number,
//       day_of_week: string,
//       play_count_in_day: number
//     }>> = format_calender_day(activity_calender_value) as Array<Array<{
//       day: string,
//       week_number: number,
//       day_of_week: string,
//       play_count_in_day: number
//     }>>
//     generate_user_activity_calender(formated_activity_calender_value, 2024)
//   }, 300)
// })


// // 0 = 日曜日, 1 = 月曜日, 2 = 火曜日, 3 = a水曜日, 4 = 木曜日, 5 = 金曜日, 6 = 土曜日
// // formated_activity_calender_value  =   曜日=array<array<obj,obj,obj,obj>, 曜日=array<obj,obj,obj,obj>, 曜日=array<obj,obj,obj,obj>>
// // 曜日、その曜日の回数は配列に保管されている
// // ある１日の活動履歴は配列の中の一部であり同じ曜日で1/1からの日数が短い順にまとまっている


// function generate_user_activity_calender(formated_activity_calender_value: Array<Array<{
//   day: string,
//   week_number: number,
//   day_of_week: string,
//   play_count_in_day: number
// }>>, year: number): void {

//   // if (year < 2024) {
//   //   console.log('no date')
//   //   return
//   // }

//   if (calender_body.value) {
//     const empty_days = calender_body.value.querySelectorAll('td') as NodeListOf<HTMLTableCellElement>
//     if (empty_days) {
//       const empty_same_day_of_week = calender_body.value.querySelectorAll('tr')

//       const all_sun_elm: object | undefined = empty_same_day_of_week[0].querySelectorAll('td')
//       const all_mon_elm: object | undefined = empty_same_day_of_week[1].querySelectorAll('td')
//       const all_tue_elm: object | undefined = empty_same_day_of_week[2].querySelectorAll('td')
//       const all_wed_elm: object | undefined = empty_same_day_of_week[3].querySelectorAll('td')
//       const all_thu_elm: object | undefined = empty_same_day_of_week[4].querySelectorAll('td')
//       const all_fri_elm: object | undefined = empty_same_day_of_week[5].querySelectorAll('td')
//       const all_sat_elm: object | undefined = empty_same_day_of_week[6].querySelectorAll('td')
//       const all_day_elm: Array<object> = [all_sun_elm, all_mon_elm, all_tue_elm, all_wed_elm, all_thu_elm, all_fri_elm, all_sat_elm]

//       const active_levels: Array<string> = active_level.value

//       if (year === 2024) {
//         empty_days[0].style.visibility = 'hidden'
//         empty_days[59 + 60 + 60 + 60].style.visibility = 'hidden'
//         empty_days[59 + 60 + 60 + 60 + 60].style.visibility = 'hidden'
//         empty_days[59 + 60 + 60 + 60 + 60 + 60].style.visibility = 'hidden'
//         empty_days[59 + 60 + 60 + 60 + 60 + 60 + 60].style.visibility = 'hidden'


//         for (let i = 0; i < 7; i++) {
//           const the_day_of_calender_elm = all_day_elm[i] as NodeListOf<HTMLTableCellElement>
//           for (let j = 0; j < formated_activity_calender_value[i].length; j++) {
//             const the_day_of_play_count: number = formated_activity_calender_value[i][j]['play_count_in_day']
//             const value_of_week_number: number = formated_activity_calender_value[i][j]['week_number']
//             //week_numberは第何周目かを表している
//             let adjustment_week_day_index: number = value_of_week_number - 1

//             if (the_day_of_play_count <= 5) {
//               the_day_of_calender_elm[adjustment_week_day_index].style.backgroundColor = active_levels[0]
//             } else if (5 < the_day_of_play_count && the_day_of_play_count <= 10) {
//               the_day_of_calender_elm[adjustment_week_day_index].style.backgroundColor = active_levels[1]
//             } else if (10 < the_day_of_play_count && the_day_of_play_count <= 20) {
//               the_day_of_calender_elm[adjustment_week_day_index].style.backgroundColor = active_levels[2]
//             } else if (20 < the_day_of_play_count && the_day_of_play_count <= 30) {
//               the_day_of_calender_elm[adjustment_week_day_index].style.backgroundColor = active_levels[3]
//             } else if (30 < the_day_of_play_count) {
//               the_day_of_calender_elm[adjustment_week_day_index].style.backgroundColor = active_levels[4]
//             }
//           }
//         }
//       }
//     }
//   }
// }
</script>

<template>
  <div id="activity_calender">
    <div id="day_of_week_display">
      <div>日</div>
      <div>火</div>
      <div>月</div>
    </div>

    <table id="calender_body" ref="calender_body">
      <tr v-for="day in 7" id="same_day_of_week" :key="day" ref="day_of_week">
        <td v-for="same_say_of_weeks in 60" :key="same_say_of_weeks" class="active_days">
        </td>
      </tr>
    </table>

    <!-- <div id="active_level_sample">
      <div class="active_sample_char">少ない</div>
      <div id="active_level_zero" :style="{background:active_level[0]}" class="active_level_sample_eml"></div>
      <div id="active_level_one" :style="{background:active_level[1]}" class="active_level_sample_eml"></div>
      <div id="active_level_two" :style="{background:active_level[2]}" class="active_level_sample_eml"></div>
      <div id="active_level_three" :style="{background:active_level[3]}" class="active_level_sample_eml"></div>
      <div id="active_level_five" :style="{background:active_level[4]}" class="active_level_sample_eml"></div>
      <div class="active_sample_char">多い</div>
    </div> -->
  </div>
</template>

<style scoped lang="scss">
</style>
