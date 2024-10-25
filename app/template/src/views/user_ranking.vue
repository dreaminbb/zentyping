<script lang="ts" setup>
// import { ref } from 'vue'
// const ranking_table = ref<HTMLTableElement | null>(null)
const test_value = [
  {
    correct_count: 59,
    correct_per_second: [
      0.4, 0.0, 0.0, 0.7, 0.7, 0.6, 0.8, 0.3, 0.7, 0.9, 0.8, 0.4, 0.0, 0.2, 0.2, 0.2, 0.6, 0.6, 0.4,
      0.6
    ],
    correct_per_second_num: 3.2,
    correct_rate: 29.535098050455332,
    id: 21,
    incorrect_count: 41,
    input_per_second: [
      0.6, 0.9, 0.9, 0.5, 0.6, 0.5, 0.0, 0.8, 0.2, 0.4, 0.3, 0.0, 0.1, 0.1, 0.4, 0.1, 0.1, 0.2, 0.9,
      0.7
    ],
    input_per_second_num: 1.2,
    length: 87,
    level: 'short',
    name: 'test_user_10',
    play_count: 1,
    played_at: '2024-10-26T05:11:54.581300',
    pun_count: 0,
    time: 15.092352273633969
  },
  {
    correct_count: 52,
    correct_per_second: [
      0.8, 0.2, 0.3, 0.8, 0.1, 0.0, 0.3, 0.4, 0.7, 0.4, 0.0, 0.5, 0.7, 0.0, 0.1, 0.7, 0.7, 0.0, 0.5,
      0.8
    ],
    correct_per_second_num: 6.0,
    correct_rate: 86.5939050756841,
    id: 28,
    incorrect_count: 29,
    input_per_second: [
      0.6, 0.1, 0.7, 0.7, 0.0, 0.6, 0.8, 0.7, 0.3, 0.0, 0.0, 0.6, 0.9, 0.8, 0.7, 0.5, 0.8, 0.6, 0.3,
      0.8
    ],
    input_per_second_num: 1.1,
    length: 46,
    level: 'short',
    name: 'test_user_10',
    play_count: 1,
    played_at: '2024-10-26T05:11:54.584526',
    pun_count: 1,
    time: 62.48509693844299
  },
  {
    correct_count: 73,
    correct_per_second: [
      0.1, 0.3, 0.6, 0.3, 0.9, 0.5, 0.2, 0.8, 0.6, 0.6, 0.9, 0.0, 0.5, 0.7, 0.5, 0.9, 0.8, 0.0, 0.3,
      0.8
    ],
    correct_per_second_num: 2.9,
    correct_rate: 41.45444887173885,
    id: 7,
    incorrect_count: 75,
    input_per_second: [
      0.0, 0.2, 0.3, 0.1, 0.9, 0.8, 0.9, 0.6, 0.9, 0.0, 0.6, 0.6, 0.5, 0.0, 0.1, 0.5, 0.0, 0.8, 0.3,
      0.1
    ],
    input_per_second_num: 1.6,
    length: 80,
    level: 'short',
    name: 'test_user_10',
    play_count: 1,
    played_at: '2024-10-26T05:11:54.585225',
    pun_count: 2,
    time: 23.22290281213154
  },
  {
    correct_count: 2,
    correct_per_second: [
      0.7, 0.9, 0.0, 0.4, 0.5, 0.8, 0.9, 0.7, 0.4, 0.1, 0.5, 0.4, 0.7, 0.2, 0.9, 0.3, 0.2, 0.6, 0.6,
      0.3
    ],
    correct_per_second_num: 1.0,
    correct_rate: 15.173375634553087,
    id: 24,
    incorrect_count: 69,
    input_per_second: [
      0.8, 0.0, 0.8, 0.9, 0.8, 0.5, 0.3, 0.2, 0.6, 0.0, 0.9, 0.3, 0.1, 0.0, 0.1, 0.8, 0.5, 0.4, 0.6,
      0.9
    ],
    input_per_second_num: 2.6,
    length: 29,
    level: 'short',
    name: 'test_user_10',
    play_count: 1,
    played_at: '2024-10-26T05:11:54.585878',
    pun_count: 9,
    time: 75.20121462943547
  },
  {
    correct_count: 53,
    correct_per_second: [
      0.3, 0.3, 0.1, 0.6, 0.0, 0.6, 0.8, 0.9, 0.1, 0.1, 0.1, 0.8, 0.0, 0.4, 0.9, 0.2, 0.4, 0.2, 0.9,
      0.4
    ],
    correct_per_second_num: 2.0,
    correct_rate: 55.709073827396715,
    id: 21,
    incorrect_count: 50,
    input_per_second: [
      0.4, 0.0, 0.6, 0.2, 0.0, 0.4, 0.4, 0.9, 0.4, 0.1, 0.0, 0.8, 0.3, 0.3, 0.5, 0.7, 0.1, 0.5, 0.1,
      0.8
    ],
    input_per_second_num: 1.0,
    length: 56,
    level: 'short',
    name: 'test_user_10',
    play_count: 1,
    played_at: '2024-10-26T05:11:54.586460',
    pun_count: 8,
    time: 96.2370809714144
  },
  {
    correct_count: 41,
    correct_per_second: [
      0.7, 0.5, 0.6, 0.3, 0.7, 0.2, 0.4, 0.7, 0.9, 0.3, 0.6, 0.9, 0.8, 0.3, 0.3, 0.5, 0.0, 0.4, 0.8,
      0.5
    ],
    correct_per_second_num: 1.7,
    correct_rate: 34.53035671925524,
    id: 19,
    incorrect_count: 73,
    input_per_second: [
      0.1, 0.1, 0.4, 0.6, 0.7, 0.4, 0.9, 0.4, 0.8, 0.4, 0.6, 0.0, 0.4, 0.3, 0.7, 0.3, 0.6, 0.0, 0.8,
      0.5
    ],
    input_per_second_num: 1.2,
    length: 79,
    level: 'short',
    name: 'test_user_10',
    play_count: 1,
    played_at: '2024-10-26T05:11:54.587099',
    pun_count: 5,
    time: 40.82241656340271
  },
  {
    correct_count: 9,
    correct_per_second: [
      0.8, 0.6, 0.4, 0.9, 0.0, 0.2, 0.4, 0.4, 0.0, 0.9, 0.7, 0.5, 0.2, 0.9, 0.6, 0.5, 0.4, 0.2, 0.2,
      0.4
    ],
    correct_per_second_num: 1.7,
    correct_rate: 94.15491433404942,
    id: 11,
    incorrect_count: 43,
    input_per_second: [
      0.3, 0.0, 0.3, 0.9, 0.2, 0.1, 0.7, 0.7, 0.4, 0.9, 0.5, 0.5, 0.0, 0.1, 0.4, 0.3, 0.6, 0.9, 0.9,
      0.3
    ],
    input_per_second_num: 0.2,
    length: 53,
    level: 'short',
    name: 'test_user_10',
    play_count: 1,
    played_at: '2024-10-26T05:11:54.587752',
    pun_count: 7,
    time: 12.138039696292447
  },
  {
    correct_count: 5,
    correct_per_second: [
      0.4, 0.5, 0.7, 0.4, 0.7, 0.1, 0.3, 0.9, 0.6, 0.7, 0.3, 0.4, 0.9, 0.3, 0.1, 0.8, 0.4, 0.3, 0.2,
      0.3
    ],
    correct_per_second_num: 7.2,
    correct_rate: 79.88604140448295,
    id: 4,
    incorrect_count: 71,
    input_per_second: [
      0.7, 0.5, 0.5, 0.1, 0.8, 0.1, 0.2, 0.5, 0.2, 0.0, 0.6, 0.0, 0.7, 0.9, 0.6, 0.7, 0.3, 0.9, 0.9,
      0.2
    ],
    input_per_second_num: 3.5,
    length: 39,
    level: 'short',
    name: 'test_user_10',
    play_count: 1,
    played_at: '2024-10-26T05:11:54.588431',
    pun_count: 4,
    time: 92.2422425935367
  },
  {
    correct_count: 23,
    correct_per_second: [
      0.1, 0.3, 0.3, 0.8, 0.6, 0.0, 0.0, 0.8, 0.8, 0.6, 0.5, 0.7, 0.2, 0.9, 0.5, 0.5, 0.3, 0.6, 0.7,
      0.3
    ],
    correct_per_second_num: 6.8,
    correct_rate: 56.08955511765722,
    id: 16,
    incorrect_count: 6,
    input_per_second: [
      0.5, 0.9, 0.7, 0.8, 0.7, 0.3, 0.8, 0.5, 0.4, 0.0, 0.7, 0.6, 0.2, 0.2, 0.6, 0.2, 0.6, 0.5, 0.3,
      0.1
    ],
    input_per_second_num: 0.4,
    length: 36,
    level: 'short',
    name: 'test_user_10',
    play_count: 1,
    played_at: '2024-10-26T05:11:54.588990',
    pun_count: 0,
    time: 13.704262378218147
  },
  {
    correct_count: 19,
    correct_per_second: [
      0.0, 0.6, 0.2, 0.7, 0.7, 0.8, 0.7, 0.9, 0.7, 0.8, 0.0, 0.8, 0.0, 0.2, 0.0, 0.1, 0.0, 0.1, 0.1,
      0.5
    ],
    correct_per_second_num: 8.1,
    correct_rate: 43.954357608776995,
    id: 1,
    incorrect_count: 98,
    input_per_second: [
      0.5, 0.6, 0.5, 0.0, 0.7, 0.4, 0.2, 0.7, 0.3, 0.9, 0.7, 0.9, 0.6, 0.4, 0.4, 0.6, 0.2, 0.9, 0.2,
      0.0
    ],
    input_per_second_num: 3.7,
    length: 75,
    level: 'short',
    name: 'test_user_10',
    play_count: 1,
    played_at: '2024-10-26T05:11:54.589731',
    pun_count: 0,
    time: 48.689785510480135
  },
  {
    correct_count: 22,
    correct_per_second: [
      0.7, 0.3, 0.3, 0.5, 0.5, 0.6, 0.7, 0.5, 0.8, 0.1, 0.4, 0.2, 0.3, 0.7, 0.2, 0.9, 0.5, 0.2, 0.2,
      0.8
    ],
    correct_per_second_num: 5.6,
    correct_rate: 43.551719400355296,
    id: 19,
    incorrect_count: 87,
    input_per_second: [
      0.6, 0.5, 0.2, 0.2, 0.0, 0.7, 0.1, 0.6, 0.0, 0.2, 0.2, 0.7, 0.5, 0.4, 0.0, 0.9, 0.7, 0.9, 0.1,
      0.1
    ],
    input_per_second_num: 3.3,
    length: 70,
    level: 'short',
    name: 'test_user_10',
    play_count: 1,
    played_at: '2024-10-26T05:11:56.866845',
    pun_count: 6,
    time: 54.04066949754528
  },
  {
    correct_count: 10,
    correct_per_second: [
      0.4, 0.7, 0.0, 0.6, 0.3, 0.2, 0.4, 0.7, 0.4, 0.7, 0.2, 0.2, 0.3, 0.0, 0.7, 0.9, 0.7, 0.9, 0.0,
      0.9
    ],
    correct_per_second_num: 4.4,
    correct_rate: 46.96105192381806,
    id: 21,
    incorrect_count: 91,
    input_per_second: [
      0.0, 0.5, 0.9, 0.3, 0.7, 0.3, 0.5, 0.9, 0.8, 0.1, 0.4, 0.5, 0.9, 0.5, 0.9, 0.5, 0.9, 0.0, 0.7,
      0.5
    ],
    input_per_second_num: 2.0,
    length: 97,
    level: 'short',
    name: 'test_user_10',
    play_count: 1,
    played_at: '2024-10-26T05:11:56.869144',
    pun_count: 9,
    time: 19.62515937871734
  },
  {
    correct_count: 9,
    correct_per_second: [
      0.5, 0.3, 0.5, 0.6, 0.2, 0.2, 0.0, 0.5, 0.5, 0.2, 0.3, 0.0, 0.6, 0.3, 0.8, 0.4, 0.5, 0.4, 0.3,
      0.5
    ],
    correct_per_second_num: 7.6,
    correct_rate: 96.99341832044679,
    id: 20,
    incorrect_count: 96,
    input_per_second: [
      0.6, 0.5, 0.7, 0.9, 0.4, 0.9, 0.5, 0.6, 0.8, 0.6, 0.5, 0.4, 0.2, 0.3, 0.9, 0.5, 0.8, 0.3, 0.8,
      0.1
    ],
    input_per_second_num: 0.1,
    length: 61,
    level: 'short',
    name: 'test_user_10',
    play_count: 1,
    played_at: '2024-10-26T05:11:56.869728',
    pun_count: 8,
    time: 32.822339740553716
  },
  {
    correct_count: 90,
    correct_per_second: [
      0.1, 0.8, 0.8, 0.5, 0.1, 0.7, 0.5, 0.1, 0.9, 0.9, 0.5, 0.4, 0.2, 0.6, 0.5, 0.5, 0.9, 0.7, 0.9,
      0.5
    ],
    correct_per_second_num: 8.0,
    correct_rate: 73.27102980616328,
    id: 5,
    incorrect_count: 45,
    input_per_second: [
      0.2, 0.8, 0.2, 0.1, 0.6, 0.5, 0.7, 0.2, 0.1, 0.6, 0.6, 0.7, 0.7, 0.5, 0.9, 0.7, 0.6, 0.4, 0.2,
      0.4
    ],
    input_per_second_num: 3.7,
    length: 90,
    level: 'short',
    name: 'test_user_10',
    play_count: 1,
    played_at: '2024-10-26T05:11:56.870169',
    pun_count: 9,
    time: 15.015928466094197
  },
  {
    correct_count: 40,
    correct_per_second: [
      0.5, 0.3, 0.3, 0.0, 0.7, 0.4, 0.6, 0.9, 0.2, 0.4, 0.1, 0.7, 0.2, 0.8, 0.3, 0.0, 0.6, 0.4, 0.8,
      0.6
    ],
    correct_per_second_num: 3.4,
    correct_rate: 82.10002086008532,
    id: 17,
    incorrect_count: 29,
    input_per_second: [
      0.7, 0.5, 0.9, 0.8, 0.3, 0.7, 0.9, 0.1, 0.2, 0.9, 0.6, 0.7, 0.5, 0.0, 0.4, 0.6, 0.5, 0.1, 0.8,
      0.6
    ],
    input_per_second_num: 3.1,
    length: 71,
    level: 'short',
    name: 'test_user_10',
    play_count: 1,
    played_at: '2024-10-26T05:11:56.870729',
    pun_count: 4,
    time: 89.14476971221782
  },
  {
    correct_count: 73,
    correct_per_second: [
      0.9, 0.9, 0.2, 0.8, 0.4, 0.8, 0.5, 0.3, 0.2, 0.1, 0.0, 0.7, 0.9, 0.9, 0.8, 0.1, 0.2, 0.3, 0.1,
      0.3
    ],
    correct_per_second_num: 6.6,
    correct_rate: 36.960161738516916,
    id: 28,
    incorrect_count: 31,
    input_per_second: [
      0.4, 0.9, 0.7, 0.5, 0.2, 0.3, 0.8, 0.9, 0.5, 0.1, 0.0, 0.1, 0.4, 0.9, 0.2, 0.9, 0.3, 0.5, 0.2,
      0.5
    ],
    input_per_second_num: 1.6,
    length: 22,
    level: 'short',
    name: 'test_user_10',
    play_count: 1,
    played_at: '2024-10-26T05:11:56.871187',
    pun_count: 10,
    time: 25.833280985935158
  },
  {
    correct_count: 35,
    correct_per_second: [
      0.5, 0.0, 0.5, 0.7, 0.0, 0.8, 0.5, 0.7, 0.6, 0.8, 0.5, 0.3, 0.8, 0.2, 0.4, 0.7, 0.4, 0.1, 0.5,
      0.1
    ],
    correct_per_second_num: 3.3,
    correct_rate: 71.41344279316584,
    id: 27,
    incorrect_count: 40,
    input_per_second: [
      0.4, 0.3, 0.2, 0.5, 0.1, 0.2, 0.2, 0.7, 0.3, 0.6, 0.7, 0.4, 0.9, 0.8, 0.4, 0.7, 0.9, 0.9, 0.9,
      0.0
    ],
    input_per_second_num: 2.0,
    length: 46,
    level: 'short',
    name: 'test_user_10',
    play_count: 1,
    played_at: '2024-10-26T05:11:56.871712',
    pun_count: 3,
    time: 8.190130210707059
  },
  {
    correct_count: 19,
    correct_per_second: [
      0.8, 0.3, 0.5, 0.2, 0.1, 0.6, 0.4, 0.6, 0.1, 0.7, 0.2, 0.3, 0.9, 0.3, 0.5, 0.4, 0.4, 0.7, 0.2,
      0.9
    ],
    correct_per_second_num: 7.6,
    correct_rate: 72.49896592277905,
    id: 30,
    incorrect_count: 95,
    input_per_second: [
      0.5, 0.5, 0.8, 0.6, 0.6, 0.5, 0.5, 0.3, 0.2, 0.6, 0.7, 0.5, 0.1, 0.6, 0.6, 0.5, 0.4, 0.2, 0.6,
      0.9
    ],
    input_per_second_num: 1.5,
    length: 31,
    level: 'short',
    name: 'test_user_10',
    play_count: 1,
    played_at: '2024-10-26T05:11:56.872136',
    pun_count: 3,
    time: 49.20086304767571
  },
  {
    correct_count: 56,
    correct_per_second: [
      0.6, 0.4, 0.8, 0.0, 0.1, 0.8, 0.7, 0.8, 0.7, 0.9, 0.3, 0.2, 0.5, 0.8, 0.5, 0.9, 0.1, 0.1, 0.5,
      0.6
    ],
    correct_per_second_num: 7.8,
    correct_rate: 52.70925406092789,
    id: 2,
    incorrect_count: 72,
    input_per_second: [
      0.9, 0.2, 0.3, 0.1, 0.9, 0.4, 0.4, 0.1, 0.8, 0.9, 0.1, 0.1, 0.2, 0.0, 0.5, 0.6, 0.6, 0.6, 0.3,
      0.8
    ],
    input_per_second_num: 3.3,
    length: 99,
    level: 'short',
    name: 'test_user_10',
    play_count: 1,
    played_at: '2024-10-26T05:11:56.872608',
    pun_count: 9,
    time: 55.37619272494728
  },
  {
    correct_count: 51,
    correct_per_second: [
      0.8, 0.4, 0.0, 0.0, 0.1, 0.9, 0.8, 0.5, 0.8, 0.6, 0.6, 0.3, 0.5, 0.1, 0.7, 0.4, 0.6, 0.4, 0.9,
      0.0
    ],
    correct_per_second_num: 2.9,
    correct_rate: 95.30500316504109,
    id: 29,
    incorrect_count: 66,
    input_per_second: [
      0.5, 0.3, 0.3, 0.0, 0.2, 0.1, 0.0, 0.0, 0.8, 0.2, 0.2, 0.8, 0.0, 0.3, 0.7, 0.3, 0.9, 0.3, 0.3,
      0.7
    ],
    input_per_second_num: 3.4,
    length: 86,
    level: 'short',
    name: 'test_user_10',
    play_count: 1,
    played_at: '2024-10-26T05:11:56.873335',
    pun_count: 10,
    time: 13.961702778370377
  }
]
const ranking_deta_label_arr: Array<string> = [
  '順位',
  'ユーザー名',
  '正入力率',
  '一秒間の正入力',
  '一秒間の入力',
  'タイム',
  'タイムスタンプ'
]
const ranking_deta_label_len = ranking_deta_label_arr.length
</script>

<template>
  <body>

    <table id="ranking_table">
      <tr id="ranking_label_fm">
        <th v-for="key in ranking_deta_label_len" :key="key">
          {{ ranking_deta_label_arr[key - 1] }}
        </th>
      </tr>
      <tr v-for="(user, index) in test_value" :key="user.id" class="ranking_list">
        <td v-if="index != 0">
          {{ index + 1 }}
        </td>
        <div v-if="index == 0" class="fas fa-crown" id="crown"></div>
        <td>{{ user.name }}</td>
        <td>{{ user.correct_rate.toFixed(2) }}%</td>
        <td>{{ user.correct_per_second_num.toFixed(2) }}</td>
        <td>{{ user.input_per_second_num.toFixed(2) }}</td>
        <td>{{ user.time.toFixed(1) }}s</td>
        <td>{{ new Date(user.played_at).toLocaleString() }}</td>
      </tr>
    </table>
  </body>
</template>

<style lang="scss">
body {
  height: 700%;
  width: 100%;
  background: rgba(169, 147, 147, 0.5);
  overflow-x: hidden;
  overflow-y: scroll;

  #ranking_table {
    position: absolute;
    text-align: center;
    top: 20%;
    width: 90%;
    height: 100%; // ここを変えるとスクロールの長さが変わる(短いとできない)
    border-radius: 10%;
    border-collapse: collapse;
    color: white;
    color: rgb(48, 48, 48);

    tr:nth-child(1) {
      background: rgba(169, 147, 147, 0.7);
      border-radius: 10%;
    }

    tr:nth-child(even) {
      background: #ddd;
    }

    #crown {
      position: relative;
      top: 20%;
    }
  }
}
</style>
