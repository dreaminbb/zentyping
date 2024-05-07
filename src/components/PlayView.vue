<script setup lang="ts">
import { ref, nextTick, reactive, onMounted, watch } from 'vue'
const active_buttons = reactive({ short: false, normal: false, long: false })
const get_problem_data_from_api: any = ref(null)
let short_count: number = 1
let normal_count: number = 1
let long_count: number = 1
const activepun = ref(false)
const char_display = ref<HTMLElement | null>(null)
const char = ref('')
const type_input = ref('')
const type = ref('')
const char_span = ref<HTMLElement | null>(null)
const textarea = ref<HTMLElement | null>(null)
let correct_count: number = 0
let type_count: number = 0
const time = ref(0)
const lost_focus = ref(false)
const focus_alert = ref(false)
const click_sentence = ref(false)
const focus_svg = ref(false)
const isComposing = ref(false)
const japaneseInput = ref(false)
const capslockchecker = ref(false)

async function get_from_api() {
  try {
    const response = await fetch('http://localhost:8000/')
    const problem_data_from_api = await response.json()
    return problem_data_from_api
  } catch (error) {
    char.value = '(: something went wrong ....'
  }
}

function start_timer() {
  setInterval(() => {
    time.value++
  }, 100)
}

function click_to_focus() {
  if (textarea.value) {
    textarea.value.focus()

  }
}

function type_input_lost_focus() {
  setTimeout(() => {
    lost_focus.value = true
  }, 1000)
  focus_alert.value = true
  click_sentence.value = true
  focus_svg.value = true
}


function type_input_focus() {
  lost_focus.value = false
  focus_alert.value = false
  click_sentence.value = false
  focus_svg.value = false

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
      }
      if (active_buttons_object.normal === true) {
        active_buttons.normal = true
        type.value = get_problem_data_from_api.value[1][0].type
        char.value = get_problem_data_from_api.value[1][0].char
      }
      if (active_buttons_object.long === true) {
        active_buttons.long = true
        type.value = get_problem_data_from_api.value[2][0].type
        char.value = get_problem_data_from_api.value[2][0].char
      }
    } catch (error) {
      console.error('Error parsing active_buttons from localStorage:', error) //ローカルストレージから読み込めなかったごめんぴょ❤️ちゅ♡ちゅ♡って表示させる
    }
  } else {
    active_buttons.normal = true
    type.value = get_problem_data_from_api.value[1][0].type
    char.value = get_problem_data_from_api.value[1][0].char
  }

  await nextTick()
  const first_span_from_char_display = char_display.value?.querySelector('span')
  first_span_from_char_display?.classList.add('cursor_before')
  if (textarea.value) {
    textarea.value.focus()
  }
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
  if (active_buttons.short === true) {
    active_buttons.short = true
    type.value = get_problem_data_from_api.value[0][short_count].type
    char.value = get_problem_data_from_api.value[0][short_count].char
  }
  if (active_buttons.normal === true) {
    active_buttons.normal = true
    type.value = get_problem_data_from_api.value[1][normal_count].type
    char.value = get_problem_data_from_api.value[1][normal_count].char
  }
  if (active_buttons.long === true) {
    active_buttons.long = true
    type.value = get_problem_data_from_api.value[2][long_count].type
    char.value = get_problem_data_from_api.value[2][long_count].char
  }
  correct_count = 0
  time.value = 0
  type_input.value = ''
  if (char_display.value) {
    Array.from(char_display.value.querySelectorAll('span')).forEach((span: HTMLElement) => {
      span.classList.remove('correct', 'incorrect', 'cursor_after')
    })
  }
  if (textarea.value) {
    textarea.value.focus()
  }
}

function punactivate() {
  activepun.value = !activepun.value
  localStorage.setItem('activepun', JSON.stringify(activepun.value))
  type_input.value = ''
  correct_count = 0
  if (char_display.value)
    Array.from(char_display.value.querySelectorAll('span')).forEach((span: HTMLElement) => {
      span.classList.remove('correct', 'incorrect', 'cursor_after')
    })
  if (textarea.value) {
    textarea.value.focus()
  }
}

function typing() {
  if (char_display.value) {
    type_count++
    if (type_count === 1) {
      start_timer()
    }
    if (type_input.value.length === 0) {
      char_display.value?.querySelector('span')?.classList.add('cursor_before')
    } else {
      char_display.value?.querySelector('span')?.classList.remove('cursor_before')
    }

    const type_input_length: number = type_input.value.length
    const span_from_char_display = Array.from(char_display.value.querySelectorAll('span'))

    const export_cursor_span = Array.from(char_display.value.querySelectorAll('span')).filter(
      (span: HTMLSpanElement, index: number) => index !== type_input_length - 1
    )
    export_cursor_span.forEach((span) => span.classList.remove('cursor_after'))

    if (type_input_length > 0) {
      span_from_char_display[type_input_length - 1].classList.add('cursor_after')
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

    correct_count = span_from_char_display
      .slice(0, type_input_length)
      .filter((span) => span.classList.contains('correct')).length
  }
}

function typing_keydown(event: KeyboardEvent) {
  if (char_display.value) {
    if (correct_count === type_input.value.length && event.key === 'Backspace') {
      event.preventDefault()
    }
  }
  if (isComposing.value) {
    japaneseInput.value = true
  }
  if (event.getModifierState('CapsLock')) {
    capslockchecker.value = true
  } else {
    capslockchecker.value = false
  }
}

function compositionStart() {
  isComposing.value = true
  japaneseInput.value = true
}

function compositionEnd() {
  isComposing.value = false
}
</script>

<template>
  <body>
    <div id="buttons" class="buttons">
      <button
        @click="identify_level('short'), short_count++"
        :class="{ active: active_buttons.short }"
        class="level"
      >
        short
      </button>
      <button
        @click="identify_level('normal'), normal_count++"
        :class="{ active: active_buttons.normal }"
        class="level"
      >
        normal
      </button>
      <button
        @click="identify_level('long'), long_count++"
        :class="{ active: active_buttons.long }"
        class="level"
      >
        long
      </button>
      <button @click="punactivate" :class="{ active: activepun }" class="level">pun</button>
    </div>
    <div id="counters">
      <div id="correct" class="playdetail">{{ correct_count }}</div>
      <div id="incorrect" class="playdetail">{{ type_input.length - correct_count }}</div>
      <div id="rest_character" class="playdetail">{{ type_input.length }} / {{ char.length }}</div>
      <div id="timer" class="playdetail">{{ Math.floor(time / 10) }}</div>
    </div>
    <div id="container" class="container" @click="click_to_focus">
      <div id="type_display" class="type_display" ref="type_display">
        <span :class="{ lost_focus: lost_focus }" v-for="(type, index) in type" :key="index">
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
    <div class="japaneseInputAleat" v-if="japaneseInput">
      <svg
        class="aleatIcon"
        xmlns="http://www.w3.org/2000/svg"
        height="40"
        viewBox="0 -960 960 960"
        width="40"
      >
        <path
          d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"
        />
      </svg>
      <div class="aleatSentence">日本語入力がオンになっています</div>
    </div>
    <div class="capslockInputAleat" v-if="capslockchecker">
      <svg
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
      <div class="aleatSentence">capslockがオンになっています</div>
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
  </body>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap');
#buttons {
  position: absolute;
  top: 10%;
  left: 50%;
  display: flex;
  justify-content: space-around;
  transform: translate(-50%, -50%);
  align-items: center;
  width: 30%;
  height: 5%;
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
  border-radius: 1px;
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
  font-size: 1.6rem;
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
  color: #8b8b8b;
  align-items: center;
  text-align: center;
}

.container .type_display {
  letter-spacing: 3px;
  top: 0;
  font-size: 3rem;
  display: grid;
  grid-template-columns: repeat(20, 1fr);
  grid-template-rows: repeat(3, 1fr);
  column-gap: 0px;
  grid-row-gap: -20px;
}

.container .char_display {
  bottom: 0;
  font-size: 2.5rem;
  display: grid;
  grid-template-columns: repeat(35, 1fr);
  grid-template-rows: repeat(3, 1fr);
  column-gap: 0px;
  grid-row-gap: -20px;
}
.char {
  font-size: 2rem;
}

.lost_focus {
  animation-name: spin_char;
  animation-duration: 1s;
  animation-iteration-count: infinite;
}
@keyframes spin_type {
  0% {
    transform: rotate(10deg);
  }
  100% {
    transform: rotate(370deg);
  }
}

@keyframes spin_char {
  0% {
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

@keyframes .cursor_after::after,
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
.japaneseInputAleat {
  top: 15%;
  background-color: rgba(97, 255, 142, 0.2);
}
.capslockInputAleat {
  top: 27%;
  background-color: rgba(97, 255, 142, 0.2);
}
.japaneseInputAleat,
.capslockInputAleat {
  position: absolute;
  display: flex;
  left: 0;
  width: 18%;
  height: 8%;
  padding: 13px;
  border-radius: 30px;
  letter-spacing: 2px;
  animation: appear 0.5s;
}
.aleatIcon {
  align-items: center;
  position: absolute;
  bottom: 0;
  font-size: 4rem;
  fill: #b7b7b7;
}
.aleatSentence {
  position: absolute;
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
</style>
