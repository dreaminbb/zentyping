<script setup lang="ts">
import {ref, nextTick, reactive, onMounted, inject, type Ref, provide} from 'vue'
import {pie_chart, line_chart} from './chart'
import {play_api_key} from '@/assets/main'

const active_buttons = reactive({short: false, normal: false, long: false})
const get_problem_data_from_api: any = ref(null)

const type_input = ref<string>('')
const char = ref<string>('')
const type = ref<string>('')
const level = ref<string>('')
const pbm_id = ref<string>('')
const time = ref<number>(0)
const correct_count = ref<number>(0)
const correct_rate = ref<number>(0)
const level_num = ref<number>(0)
const pun_count = ref<number>(0)
const correct_every_second = ref<number[]>([])
const input_every_second = ref<number[]>([])

let short_count: number = 1
let normal_count: number = 1
let long_count: number = 1
let timer: number | undefined
let ips_built: number | undefined
let type_count: number = 0

provide('correct_rate', correct_rate)
provide('correct_count', correct_count)
provide('time', time)
provide('correct_every_second', correct_every_second)
provide('input_every_second', input_every_second)

const char_display = ref<HTMLElement | null>(null)
const char_span = ref<HTMLElement | null>(null)
const textarea = ref<HTMLElement | null>(null)
const play_init_button = ref<HTMLElement | null>(null)
const back_game_button = ref<HTMLElement | null>(null)

const play_page = ref(true)
const result_page = ref(false)
const tools = inject('tools') as Ref<boolean>
const header_focus_class = inject('header_focus_class') as Ref<boolean>
const play_ditail = ref(false)
const level_buttons = ref(true)
const activepun = ref(false)
const lost_focus = ref(false)
const focus_alert = ref(false)
const click_sentence = ref(false)
const focus_svg = ref(false)
const isComposing = ref(false)
const japaneseInput = ref(false)
const capslockchecker = ref(false)

async function get_from_api() {
  try {
    const response = await fetch('http://localhost:8000/play/get_pbm', {
      method: 'GET',
      headers: {
        Authorization: play_api_key
      }
    })
    if (response.status === 200) {
      const data: JSON = await response.json()
      return data
    } else {
      console.error('server error')
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

function play_init_focus(event: KeyboardEvent) {
  if (event.key === 'Tab' && play_init_button.value) {
    event.preventDefault()
    play_init_button.value.focus()
  }
}

async function play_init() {
  if (textarea.value) {
    textarea.value.focus()
  }

  await nextTick()
  if (char_display.value) {
    Array.from(char_display.value.querySelectorAll('span')).forEach((span: HTMLElement) => {
      span.classList.remove('correct', 'incorrect', 'cursor_after')
    })
    char_display.value?.querySelector('span')?.classList.add('cursor_before')
  }
  play_ditail.value = false
  type_input.value = ''
  correct_count.value = 0
  clearInterval(timer)
  clearInterval(ips_built)
  correct_every_second.value = []
  input_every_second.value = []
  time.value = 0
  type_count = 0
}

function start_timer() {
  timer = setInterval(() => {
    time.value++
    correct_every_second.value.push(Math.floor(correct_count.value / (time.value / 10)) / 10)
    input_every_second.value.push(Math.floor(type_count / (time.value / 10)) / 10)
  }, 100)
}

function click_to_focus() {
  play_init()
}

function type_input_lost_focus() {
  lost_focus.value = true
  focus_alert.value = true
  click_sentence.value = true
  focus_svg.value = true
  level_buttons.value = true
  tools.value = true
  header_focus_class.value = false
}

function type_input_focus() {
  lost_focus.value = false
  focus_alert.value = false
  click_sentence.value = false
  focus_svg.value = false
}

function back_game_focus(event: KeyboardEvent) {
  if (event.key === 'Tab' && back_game_button.value) {
    event.preventDefault()
    back_game_button.value.focus()
  }
}

async function back_game() {
  result_page.value = false
  play_page.value = true
  level_buttons.value = true
  get_problem_data_from_api.value = await get_from_api()
  short_count = normal_count = long_count = 0

  if (active_buttons.short === true) {
    short_count++
    type.value = get_problem_data_from_api.value[0][0].type
    char.value = get_problem_data_from_api.value[0][0].char
  }
  if (active_buttons.normal == true) {
    normal_count++
    type.value = get_problem_data_from_api.value[1][0].type
    char.value = get_problem_data_from_api.value[1][0].char
  }
  if (active_buttons.long === true) {
    long_count++
    type.value = get_problem_data_from_api.value[2][0].type
    char.value = get_problem_data_from_api.value[2][0].char
  }

  window.removeEventListener('keydown', back_game_focus)
  window.addEventListener('keydown', play_init_focus)
  await nextTick()
  play_init()
}

onMounted(async () => {
  get_problem_data_from_api.value = await get_from_api()
  const active_buttons_item = localStorage.getItem('active_buttons')
  if (active_buttons_item) {
    try {
      const active_buttons_object = JSON.parse(active_buttons_item)
      if (active_buttons_object.short === true) {
        type.value = get_problem_data_from_api.value[0][0].type
        char.value = get_problem_data_from_api.value[0][0].char
        active_buttons.short = true
        level.value = 'short'
      }
      if (active_buttons_object.normal === true) {
        active_buttons.normal = true
        type.value = get_problem_data_from_api.value[1][0].type
        char.value = get_problem_data_from_api.value[1][0].char
        level.value = 'normal'
      }
      if (active_buttons_object.long === true) {
        type.value = get_problem_data_from_api.value[2][0].type
        char.value = get_problem_data_from_api.value[2][0].char
        active_buttons.long = true
        level.value = 'long'
      }
    } catch (error) {
      console.error('Error parsing active_buttons from localStorage:', error)
    }
  } else {
    active_buttons.normal = true
    type.value = get_problem_data_from_api.value[1][0].type
    char.value = get_problem_data_from_api.value[1][0].char
  }
  if (!activepun.value) {
    pun_count.value = 0
  }

  nextTick()
  play_init()
  window.addEventListener('keydown', play_init_focus)
})

async function identify_level(level: 'short' | 'normal' | 'long') {
  for (const key in active_buttons) {
    if (key === level) {
      active_buttons[key as 'short' | 'normal' | 'long'] = true
    } else if (['short', 'normal', 'long'].includes(key)) {
      active_buttons[key as 'short' | 'normal' | 'long'] = false
    }
  }

  if (
      short_count === get_problem_data_from_api.value[0].length ||
      normal_count === get_problem_data_from_api.value[0].length ||
      long_count === get_problem_data_from_api.value[0].length
  ) {
    short_count = normal_count = long_count = 0
    get_problem_data_from_api.value = await get_from_api()
  }
  localStorage.setItem('active_buttons', JSON.stringify(active_buttons))
  if (active_buttons.short) {
    active_buttons.short = true
    type.value = get_problem_data_from_api.value[0][short_count].type
    char.value = get_problem_data_from_api.value[0][short_count].char
  }
  if (active_buttons.normal) {
    active_buttons.normal = true
    type.value = get_problem_data_from_api.value[1][normal_count].type
    char.value = get_problem_data_from_api.value[1][normal_count].char
  }
  if (active_buttons.long) {
    active_buttons.long = true
    type.value = get_problem_data_from_api.value[2][long_count].type
    char.value = get_problem_data_from_api.value[2][long_count].char
  }

  if (!activepun.value) {
    pun_count.value = 0
  }
}

function punactivate() {
  activepun.value = !activepun.value
  localStorage.setItem('activepun', JSON.stringify(activepun.value))
}

function typing() {
  if (char_display.value) {
    type_count++

    if (type_count > 0) {
      level_buttons.value = false
      play_ditail.value = true
      tools.value = false
      header_focus_class.value = true
    }
    if (type_count === 1) {
      start_timer()
    }
    if (type_input.value.length === 0) {
      char_display.value?.querySelector('span')?.classList.add('cursor_before')
    } else {
      char_display.value?.querySelector('span')?.classList.remove('cursor_before')
    }

    const type_input_length: number = type_input.value.length
    const span_from_char_display: HTMLElement[] = Array.from(
        char_display.value.querySelectorAll('span')
    )

    const export_cursor_span = Array.from(char_display.value.querySelectorAll('span')).filter(
        (span: HTMLSpanElement, index: number) => index !== type_input_length - 1
    )
    export_cursor_span.forEach((span) => span.classList.remove('cursor_after'))
    if (type_input_length > 0 && type_input_length < char.value.length) {
      span_from_char_display[type_input_length - 1].classList.add('cursor_after')
    }

    const type_first: string = type_input.value[type_input_length - 1]

    if (type_input.value.length < char.value.length && type_input_length > 0) {
      const char_first: string | null = span_from_char_display[type_input_length - 1].textContent

      const char_front: string | null = span_from_char_display[type_input_length].textContent

      if (type_input_length >= 2) {
        const type_before: string = type_input.value[type_input_length - 2]
        const char_before: string | null = span_from_char_display[type_input_length - 2].textContent

        if (
            type_before === 's' &&
            char_before === 's' &&
            type_first === 'h' &&
            char_first === 'i'
        ) {
          add_middle_method(type_input_length, type_first)
          return
        }
        if (
            type_before === 's' &&
            char_before === 's' &&
            type_first === 'y' &&
            char_first === 'h'
        ) {
          change_middle_method(type_input_length, type_first)
          return
        }
      }

      if (type_first === 'c' && char_first === 't' && char_front === 'i') {
        ti_to_chi(type_input_length)
        return
      }
    }

    span_from_char_display.forEach((span: HTMLElement, index: number) => {
      if (index < type_input_length) {
        if (span.textContent === type_input.value[index]) {
          span.classList.add('correct')
          span.classList.remove('incorrect')
        } else {
          span.classList.remove('correct')
          span.classList.add('incorrect')
        }
      } else {
        span.classList.remove('correct', 'incorrect')
      }
    })
    correct_count.value = span_from_char_display
        .slice(0, type_input_length)
        .filter((span) => span.classList.contains('correct')).length
  }

  //グラフのための変数に数を代入
  correct_rate.value = Number(((correct_count.value / type_count) * 100).toFixed(1))

  // ゲームが終わった時
  if (
      correct_count.value === char.value.length ||
      (type_input.value[type_input.value.length - 1] === '\n' &&
          type_input.value.length >= char.value.length)
  ) {
    textarea.value?.blur()
    setTimeout(() => result(), 100)
  }
}

function add_middle_method(type_input_length: number, type_first: string) {
  if (char_display.value) {
    char.value =
        char.value.slice(0, type_input_length - 1) +
        type_first +
        char.value.slice(type_input_length - 1, char.value.length)
    char_display.value.querySelectorAll('span')[type_input_length - 1].classList.add('correct')
  }
}

function change_middle_method(type_input_length: number, type_first: string) {
  if (char_display.value) {
    char.value =
        char.value.slice(0, type_input_length - 1) +
        type_first +
        char.value.slice(type_input_length, char.value.length)
    char_display.value.querySelectorAll('span')[type_input_length - 1].classList.add('correct')
  }
}

function ti_to_chi(type_input_length: number) {
  if (char_display.value) {
    char.value =
        char.value.slice(0, type_input_length - 1) +
        'c' +
        'h' +
        char.value.slice(type_input_length, char.value.length)
    char_display.value.querySelectorAll('span')[type_input_length - 1].classList.add('correct')
  }
}

//日本語、capslock警告
function typing_keydown(event: KeyboardEvent) {
  if (char_display.value) {
    if (correct_count.value === type_input.value.length && event.key === 'Backspace') {
      event.preventDefault()
    }

    if (['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(event.key)) {
      event.preventDefault()
    }
  }
  if (isComposing.value) {
    japaneseInput.value = true
  }
  capslockchecker.value = event.getModifierState('CapsLock');
}

function compositionStart() {
  isComposing.value = true
  japaneseInput.value = true
}

function compositionEnd() {
  isComposing.value = false
}

// 終わった時の処理
function result() {
  console.log('実行')
  clearInterval(timer)
  time.value = time.value / 10
  setTimeout(() => {
    play_page.value = false
    result_page.value = true
  }, 100)
  tools.value = true
  header_focus_class.value = false
  window.addEventListener('keydown', back_game_focus)

  if (level_num.value === 0) {
    pbm_id.value = get_problem_data_from_api.value[0][short_count - 1]['id']
  }
  if (level_num.value === 1) {
    pbm_id.value = get_problem_data_from_api.value[1][normal_count - 1]['id']
  }
  if (level_num.value === 2) {
    pbm_id.value = get_problem_data_from_api.value[2][long_count - 1]['id']
  }

  //サーバーにデーターを送信する
  const result_data: object = {
    id: pbm_id.value,
    level: level.value,
    time: Number((time.value * 10) / 10),
    correct_rate: correct_rate.value,
    correct_count: correct_count.value,
    incorrect_count: type_input.value.length - correct_count.value,
    input_every_second: input_every_second.value,
    correct_every_second: correct_every_second.value,
    lenght: char.value.length,
    pun_count: pun_count.value
  }

  setTimeout((): void => {
    fetch('http://localhost:8000/play/result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: play_api_key
      },
      body: JSON.stringify(result_data)
    })
  }, 300)
}
</script>
<template>
  <body>
  <main id="play" ref="play" v-if="play_page">
    <div id="buttons" class="buttons" ref="level_buttons" v-if="level_buttons">
      <button
          @click="
            identify_level('short'), play_init(), short_count++, (level_num = 0), (level = 'short')
          "
          :class="{ active: active_buttons.short }"
          class="level"
      >
        short
      </button>
      <button
          @click="
            identify_level('normal'),
              play_init(),
              normal_count++,
              (level_num = 1),
              (level = 'normal')
          "
          :class="{ active: active_buttons.normal }"
          class="level"
      >
        normal
      </button>
      <button
          @click="
            identify_level('long'), play_init(), long_count++, (level_num = 2), (level = 'long')
          "
          :class="{ active: active_buttons.long }"
          class="level"
      >
        long
      </button>
      <button @click="punactivate" :class="{ active: activepun }" class="level">pun</button>
    </div>
    <div id="counters" v-if="play_ditail">
      <div id="correct" class="playdetail">{{ correct_count }}</div>
      <div id="incorrect" class="playdetail">{{ type_input.length - correct_count }}</div>
      <div id="rest_character" class="playdetail">
        {{ type_input.length }} / {{ char.length }}
      </div>
      <div id="timer" class="playdetail">{{ Math.floor(time / 10) }}</div>
    </div>
    <div id="container" class="container" @click="click_to_focus">
      <div id="type_display" class="type_display" ref="type_display">
          <span
              :class="{ type: true, lost_focus: lost_focus }"
              v-for="(type, index) in type"
              :key="index"
          >
            {{ type }}</span
          >
      </div>
      <div id="char_display" class="char_display" ref="char_display">
          <span
              :class="{ char: true, lost_focus: lost_focus }"
              ref="char_span"
              v-for="(character, index) in char"
              :key="index"
          >
            {{ character }}
          </span>
      </div>
      <div class="focus_alert" ref="focus_alert" v-if="focus_alert">
        <p class="click_here">クリックしてフォーカス。。。</p>
        <svg class="focus_alert_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
          <path
              d="m320-410 79-110h170L320-716v306ZM551-80 406-392 240-160v-720l560 440H516l144 309-109 51ZM399-520Z"
          />
        </svg>
      </div>
    </div>
    <button @click="play_init" id="play_init" ref="play_init_button">
      <svg
          id="play_init_svg"
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
      >
        <path
            d="M760-200v-160q0-50-35-85t-85-35H273l144 144-57 56-240-240 240-240 57 56-144 144h367q83 0 141.5 58.5T840-360v160h-80Z"
        />
      </svg>
    </button>
    <div class="japaneseInputAlert" v-if="japaneseInput">
      <svg
          class="alertIcon"
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
      >
        <path
            d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"
        />
      </svg>
      <div class="alertSentence">日本語入力がオンになっています</div>
    </div>
    <div class="capslockInputAlert" v-if="capslockchecker">
      <svg
          class="alertIcon"
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#e8eaed"
      >
        <path
            d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"
        />
      </svg>
      <div class="alertSentence">capslockがオンになっています</div>
    </div>

    <textarea
        id="type_input"
        class="type_input"
        autocomplete="off"
        spellcheck="false"
        autocapitalize="none"
        autocorrect="off"
        autofocus
        v-model="type_input"
        ref="textarea"
        @input="typing"
        @keydown="typing_keydown"
        @focus="type_input_focus"
        @blur="type_input_lost_focus"
        @compositionstart="compositionStart"
        @compositionend="compositionEnd"
    ></textarea>
  </main>
  </body>
  <main id="result" v-if="result_page">
    <div id="graph_frame">
      <pie_chart id="pie_chart"/>
      <line_chart id="line_chart"/>
    </div>
    <div id="result_container">
      <div id="char_detail">
        {{ char.length }} / {{ correct_count }} / {{ char.length - correct_count }}
      </div>
      <div id="time_display">{{ time }} s</div>
      <div id="pun_count">{{ pun_count }}</div>
    </div>
    <button @click="back_game" id="back_game" ref="back_game_button">
      <svg
          id="play_init_svg"
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
      >
        <path
            d="M760-200v-160q0-50-35-85t-85-35H273l144 144-57 56-240-240 240-240 57 56-144 144h367q83 0 141.5 58.5T840-360v160h-80Z"
        />
      </svg>
    </button>
  </main>
</template>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap');

main {
  display: flex;
  align-items: center;
  height: 100vh;
  justify-content: center;
  overflow: hidden;
}

#buttons {
  position: absolute;
  display: flex;
  top: 10.5%;
  left: 50%;
  transform: translate(-50%, -50%);
  justify-content: space-around;
  align-items: center;
  width: 30%;
  height: 4%;
  border-radius: 80px;
  background: rgb(255, 255, 255);
  background: rgba(255, 255, 255, 0.3);
  -webkit-backdrop-filter: blur(17px);
  backdrop-filter: blur(17px);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.level {
  width: 20%;
  height: 100%;
  border: none;
  color: #b981ca;
  filter: brightness(130%);
  background-color: transparent;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 1rem;
  letter-spacing: 3px;
}

.level:hover {
  transition: 0.5s;
  color: #dabfbf;
  box-shadow: rgba(151, 65, 252, 0.2) 0 15px 30px -5px;
}

#counters {
  background-color: transparent;
  color: rgb(135, 177, 255);
  position: absolute;
  display: flex;
  width: 24%;
  height: 5%;
  top: 20%;
  left: 10%;
  align-items: center;
  justify-content: space-evenly;
}

.playdetail {
  padding-left: 10px;
  height: 100%;
  font-size: 2rem;
  font-family: 'Roboto Mono', monospace;
  font-optical-sizing: auto;
}

#rest_character {
  padding-left: 18px;
}

.container {
  position: absolute;
  align-items: center;
  background-color: transparent;
  top: 25%;
  width: 80%;
  height: 40%;
  font-weight: 400;
  display: flex;
  flex-direction: column;
}

.type_display,
.char_display {
  position: absolute;
  display: flex;
  width: 100%;
  height: 50%;
  color: #a8a6a6;
  align-items: center;
  text-align: center;
}

.container .type_display {
  letter-spacing: 3px;
  top: 0;
  font-size: 3rem;
  grid-template-columns: repeat(20, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-row-gap: -20px;
}

.container .char_display {
  bottom: 0;
  font-size: 2.5rem;
  display: grid;
  grid-template-columns: repeat(35, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-row-gap: -20px;
}

.char {
  font-size: 2rem;
}

#play_init,
#back_game {
  background-color: transparent;
  padding: 0;
  margin: 0;
  position: relative;
  display: flex;
  bottom: -280px;
  height: 100px;
  width: 150px;
  border-color: transparent;
  border-radius: 30px;
  border-width: 1px;
  justify-content: center;
  align-items: center;
}

#play_init_svg {
  fill: rgb(179, 179, 179);
}

#play_init::after {
  content: 'reset?';
  position: absolute;
  top: -30px;
  width: 100%;
  height: 20%;
  letter-spacing: 3px;
  display: none;
  border-radius: 10px;
  background-color: #b9b9b9;
  color: #333;
}

#play_init:hover::after,
#play_init:focus::after {
  display: block;
}

#play_init:focus,
#play_init:hover {
  outline: none;
  border-color: rgba(255, 255, 255, 0.3);
}

.lost_focus {
  animation-name: spin;
  animation-duration: 1s;
  animation-iteration-count: infinite;
}

@keyframes spin {
  50% {
    transform: rotate(10deg);
  }
  100% {
    transform: rotate(370deg);
  }
}

.focus_alert {
  width: 100%;
  height: 100%;
  animation: focus_apper_contaienr forwards ease 5s;
}

.click_here {
  position: absolute;
  top: 45%;
  left: 40%;
  animation: focus_apper_sentence_and_svg forwards ease 6s;
}

.focus_alert_svg {
  position: absolute;
  top: 45%;
  left: 35%;
  width: 30px;
  animation: focus_apper_sentence_and_svg forwards ease 5s;
}

@keyframes focus_apper_contaienr {
  100% {
    background: rgba(255, 255, 255, 0.42);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
  }
}

@keyframes focus_apper_sentence_and_svg {
  0% {
    color: transparent;
    fill: transparent;
  }
  50% {
    color: #8b8b8b;
    fill: #8b8b8b;
  }
  100% {
    color: #ffffff;
    fill: #ffffff;
  }
}

.cursor_after::after,
.cursor_before::before {
  content: '|';
  animation: blink 1s infinite;
  margin: -5px;
}

@keyframes blink {
  0% {
    opacity: 0;
  }
  51% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}

.type_input:focus {
  outline: none;
}

.type_input {
  position: absolute;
  background: transparent;
  text-decoration: none;
  outline: none;
  border: none;
  resize: none;
  width: 0;
  height: 0;
}

.japanese_input_alert {
  top: 15%;
  background-color: rgba(97, 255, 142, 0.2);
}

.capslock_input_alert {
  top: 27%;
  background-color: rgba(97, 255, 142, 0.2);
}

.japanese_input_alert,
.capslock_input_alert {
  position: absolute;
  display: flex;
  left: 0;
  width: 18%;
  height: 10%;
  padding: 13px;
  border-radius: 30px;
  letter-spacing: 2px;
  animation: appear 0.5s;
}

.alertIcon {
  align-items: center;
  position: absolute;
  top: 10%;
  font-size: 4rem;
  fill: #b7b7b7;
}

.alertSentence {
  color: #909090;
  position: absolute;
  bottom: 14%;
  display: flex;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-word;
}

@keyframes appear {
  0% {
    left: -40%;
  }
  30% {
    left: -30%;
  }
  50% {
    left: -20%;
  }
  70% {
    left: -10%;
  }
  100% {
    left: 0;
  }
}

.active {
  color: #ffffff;
}

.correct {
  color: #ffffff;
}

.incorrect {
  color: #f25353;
}

#graph_frame {
  position: absolute;
  display: flex;
  background-color: transparent;
  width: 70%;
  height: 35%;
  right: 20%;
}

#pie_chart {
  position: absolute;
  width: 30%;
  height: 100%;
  left: 0;
  background: rgba(255, 255, 255, 0.58);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(7.1px);
  -webkit-backdrop-filter: blur(7.1px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: ease circle_graph_animetion 0.5s;
}

@keyframes circle_graph_animetion {
  0% {
    left: 10%;
  }
}

#line_chart {
  position: absolute;
  left: 0;
  height: 100%;
  width: 70%;
  background: rgba(255, 255, 255, 0.58);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(7.1px);
  -webkit-backdrop-filter: blur(7.1px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: ease wave_graph_animetion 0.5s;
}

@keyframes wave_graph_animetion {
  0% {
    left: -10%;
  }
}

#result_container {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  font-size: 2rem;
  color: #ffffff;
  width: 15%;
  height: 35%;
  right: 5%;
}

#char_detail,
#time_display,
#pun_count {
  position: absolute;
  width: 90%;
  left: 14%;
  animation: result_container_animetion ease 1s;
}

@keyframes result_container_animetion {
  0% {
    left: -30%;
    color: transparent;
  }
  70% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
    left: 14%;
  }
}

#char_detail {
  top: 0;
  letter-spacing: 0;
  font-size: 1.8rem;
}

#time_display {
  top: 50%;
}

#pun_count {
  bottom: 0;
}

#char_detail::after,
#time_display::after,
#pun_count::after {
  position: absolute;
  background-color: transparent;
  justify-content: center;
  align-items: center;
  top: 30px;
  width: 110%;
  height: 100%;
  letter-spacing: 3px;
  border-radius: 10px;
  display: none;
  color: #b6b6b6;
  font-size: 1.5rem;
}

#char_detail::after {
  content: '長さ / 正解 / 間違い';
}

#time_display::after {
  content: '時間';
}

#pun_count::after {
  content: '句読点';
}

#char_detail:focus,
#char_detail:hover,
#time_display:focus,
#time_display:hover,
#pun_count:focus #pun_count:hover {
  outline: none;
  border-color: rgba(255, 255, 255, 0.3);
}

#back_game::after {
  content: 'back to game';
  position: absolute;
  top: -30px;
  width: 100%;
  height: 20%;
  letter-spacing: 3px;
  display: none;
  border-radius: 10px;
  background-color: #b9b9b9;
  color: #333;
}

#back_game:hover::after,
#back_game:focus::after,
#char_detail:hover::after,
#char_detail:focus::after,
#time_display:hover::after,
#time_display:focus::after,
#pun_count:hover::after,
#pun_count:focus:after {
  display: block;
}

#back_game:focus,
#back_game:hover {
  outline: none;
  border-color: rgba(255, 255, 255, 0.3);
}
</style>
