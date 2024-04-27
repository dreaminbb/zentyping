<template>
  <body>
    <div id="buttons" class="buttons">
      <button
        @click="
          activate('short');
          shortCount++
        "
        :class="{ active: activeButtons.short }"
        class="level"
      >
        short
      </button>
      <button
        @click="
          activate('normal');
          normalCount++
        "
        :class="{ active: activeButtons.normal }"
        class="level"
      >
        normal
      </button>
      <button
        @click="
          activate('long');
          longCount++
        "
        :class="{ active: activeButtons.long }"
        class="level"
      >
        long
      </button>
      <button @click="punactivate" :class="{ active: activepun }" class="level">pun</button>
    </div>
    <div id="counters">
      <div id="correct" class="playdetail">{{ correct_count }}</div>
      <div id="incorrect" class="playdetail">{{ this.typeInput.length - this.correct_count }}</div>
      <div id="rest_character" class="playdetail">
        {{ this.typeInput.length }} / {{ this.char.length }}
      </div>
    </div>
    <div id="container" class="container">
      <div id="typeDisplay" class="typeDisplay" ref="type_display">{{ type }}</div>
      <div id="charDisplay" class="charDisplay" ref="char_display">
        <span class="char" v-for="(character, index) in char" :key="index">
          {{ character }}
        </span>
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
      <div class="aleatSentence">capslockがオンになっています</div>
    </div>

    <textarea
      ref="typeInput"
      id="typeInput"
      class="typeInput"
      autocomplete="off"
      spellcheck="false"
      autocapitalize="none"
      autocorrect="off"
      autofocus
      v-model="typeInput"
      @input="typing"
      @keydown="inputKeydown"
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
  content: 'penis';
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
  width: 18%;
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
.typeDisplay,
.charDisplay {
  position: absolute;
  display: flex;
  width: 100%;
  height: 50%;
  color: #8b8b8b;
  align-items: center;
  text-align: center;
}

.container .typeDisplay {
  letter-spacing: 3px;
  top: 0;
  font-size: 3rem;
}

.container .charDisplay {
  bottom: 0;
  font-size: 2.5rem;
  display: grid;
  grid-template-columns: repeat(35, 1fr);
  grid-template-rows: repeat(4, 1fr);
  grid-column-gap: 0;
  grid-row-gap: -10px;
}

.current-after::after,
.current-before::before {
  content: '|';
  animation: blink 1s infinite;
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

.typeInput:focus {
  outline: none;
}

.typeInput {
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
    left: -50%;
  }
  30% {
    left: -40%;
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
<script>
export default {
  data() {
    return {
      activeButtons: {
        short: false,
        normal: false,
        long: false
      },
      data: null,
      character: '',
      activepun: false,
      type: '',
      char: '',
      ShortProblem: null,
      NormalProblem: null,
      LongProblem: null,
      shortCount: 1,
      normalCount: 1,
      longCount: 1,
      typeInput: '',
      isComposing: false,
      japaneseInput: false
    }
  },
  async mounted() {
    const data = await this.getFromAPI()
    this.$refs.typeInput.focus()
    this.ShortProblem = data[0]
    this.NormalProblem = data[1]
    this.LongProblem = data[2]
    try {
      if (localStorage.getItem('activeButtons')) {
        this.activeButtons = JSON.parse(localStorage.getItem('activeButtons'))
        if (this.activeButtons.short === true) {
          this.type = this.ShortProblem[0].type
          this.char = this.ShortProblem[0].char
        }
        if (this.activeButtons.normal === true) {
          this.type = this.NormalProblem[0].type
          this.char = this.NormalProblem[0].char
        }
        if (this.activeButtons.long === true) {
          this.type = this.LongProblem[0].type
          this.char = this.LongProblem[0].char
        }
      } else {
        this.activeButtons.normal = true
        this.type = this.NormalProblem[0].type
        this.char = this.NormalProblem[0].char
      }
      if (localStorage.getItem('activepun')) {
        this.activepun = JSON.parse(localStorage.getItem('activepun'))
      } else {
        this.activepun = false
        console.log('activepun is not set in localStorage')
      }
    } catch (error) {
      console.error('Error parsing JSON from localStorage:', error)
    }
    this.$nextTick(() => {
      this.$refs.char_display.querySelector('span').classList.add('current-before')
    })
    console.log(this.type.length)
    console.log(this.char.length)
    this.correct_count = 0
  },
  methods: {
    async getFromAPI() {
      try {
        const response = await fetch('http://localhost:1919/')
        return await response.json()
      } catch (error) {
        this.type = 'something went wrong (:'
        this.type = '>_<'
      }
    },
    async activate(level) {
      const levels = ['short', 'normal', 'long']
      for (const key in this.activeButtons) {
        if (key === level) {
          this.activeButtons[key] = true
        } else if (levels.includes(key)) {
          this.activeButtons[key] = false
        }
      }
      localStorage.setItem('activeButtons', JSON.stringify(this.activeButtons))
      this.$refs.char_display.querySelectorAll('span').forEach((span) => {
        span.classList.remove('correct', 'incorrect', 'current-after')
      })
      if (level === 'short') {
        const positionShort = this.ShortProblem[this.shortCount]
        this.type = positionShort.type
        this.char = positionShort.char
      }
      if (level === 'normal') {
        const positionNormal = this.NormalProblem[this.normalCount]
        this.type = positionNormal.type
        this.char = positionNormal.char
      }
      if (level === 'long') {
        const positionLong = this.LongProblem[this.longCount]
        this.type = positionLong.type
        this.char = positionLong.char
      }

      if (
        ['shortCount', 'normalCount', 'longCount'].some(
          (count) => this[count] === this.NormalProblem.length
        )
      ) {
        this.shortCount = this.normalCount = this.longCount = 0
        this.data = null
        const data = await this.getFromAPI()
        this.ShortProblem = data[0]
        this.NormalProblem = data[1]
        this.LongProblem = data[2]
        await this.activate(level)
      }
      this.typeInput = ''
      this.$refs.typeInput.focus()
      this.correct_count = 0
    },
    punactivate() {
      this.activepun = !this.activepun
      localStorage.setItem('activepun', JSON.stringify(this.activepun))
    },

    typing() {
      this.$refs.char_display.querySelector('span').classList.remove('current-before')
      const inputLength = this.typeInput.length
      const spanFromChar = this.$refs.char_display.querySelectorAll('span')

      console.log(Array.from(this.$refs.char_display.querySelectorAll('span')))
      spanFromChar.forEach((span, index) => {
        if (index < this.typeInput.length) {
          if (span.textContent === this.typeInput[index]) {
            span.classList.add('correct')
            span.classList.remove('incorrect')
          } else {
            span.classList.remove('correct')
            span.classList.add('incorrect')
          }
        } else {
          span.classList.remove('correct', 'incorrect')
        }
        if (index === inputLength - 1) {
          span.classList.add('current-after')
        } else {
          span.classList.remove('current-after')
        }
      })
      this.correct_count = Array.from(this.$refs.char_display.querySelectorAll('span'))
        .slice(0, this.typeInput.length)
        .filter((span) => span.classList.contains('correct')).length
    },
    inputKeydown(event) {
      if (this.isComposing) {
        this.japaneseInput = true
      }
      if (
        event.key === 'Backspace' &&
        Array.from(this.$refs.char_display.querySelectorAll('span'))
          .slice(0, this.typeInput.length)
          .every((span) => span.classList.contains('correct'))
      ) {
        event.preventDefault()
      }
      if (event.getModifierState('CapsLock')) {
        this.capslockchecker = true
      }
    },
    compositionStart() {
      this.isComposing = true
      this.japaneseInput = false
    },
    compositionEnd() {
      this.isComposing = false
    }
  },
  watch: {}
}
</script>
