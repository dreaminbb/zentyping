<template>
  <body>
    <div id="buttons" class="buttons">
      <button @click="activate('short')" :class="{ active: activeButtons.short }" class="level">
        short
      </button>
      <button @click="activate('normal')" :class="{ active: activeButtons.normal }" class="level">
        normal
      </button>
      <button @click="activate('long')" :class="{ active: activeButtons.long }" class="level">
        long
      </button>
      <button @click="punactivate" :class="{ active: activepun }" class="level">pun</button>
    </div>
    <div id="counter" class="counter">
      <div id="correct" class="correct"></div>
      <div id="incorrect" class="incorrect"></div>
      <div id="timer" class="timer"></div>
    </div>
    <div id="container" class="container">
      <div id="typeDisplay" class="typeDisplay">{{ type }}</div>
      <div id="charDisplay" class="charDisplay" ref="spans">
        <span class="char" v-for="(character, index) in char" :key="index">
          {{ character }}
        </span>
      </div>
    </div>
    <textarea
      ref="typeInput"
      id="typeInput"
      class="typeInput"
      autocomplete="off"
      autofocus
      v-model="typeInput"
      @input="typing"
      @keydown="inputKeydown"
    ></textarea>
  </body>
</template>

<style>
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
  padding: 0;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-word;
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
  letter-spacing: 1px;
  bottom: 0;
  font-size: 2.5rem;
}

.current-after::after,
.current-before::before {
  content: '|';
  padding: 0;
  margin: 0;
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
      shortCount: 0,
      normalCount: 0,
      longCount: 0,
      typeInput: '',
      correctCount: 0,
      incorrectCount: 0
    }
  },
  async mounted() {
    const data = await this.getFromAPI()
    this.$refs.typeInput.focus()
    this.activeButtons.normal = true
    this.activepun = false
    this.ShortProblem = data[0]
    this.NormalProblem = data[1]
    this.LongProblem = data[2]
    this.type = this.NormalProblem[0].type
    this.char = this.NormalProblem[0].char
    this.$nextTick(() => {
      this.$refs.spans.querySelector('span').classList.add('current-before')
    })
  },
  methods: {
    async getFromAPI() {
      const response = await fetch('http://localhost:1919/')
      return await response.json()
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
      this.$refs.spans.querySelectorAll('span').forEach((span) => {
        span.classList.remove('correct', 'incorrect', 'current-after')
      })
      if (level === 'short') {
        const positionShort = this.ShortProblem[this.shortCount]
        this.type = positionShort.type
        this.char = positionShort.char
        this.shortCount++
      }
      if (level === 'normal') {
        const positionNormal = this.NormalProblem[this.normalCount]
        this.type = positionNormal.type
        this.char = positionNormal.char
        this.normalCount++
      }
      if (level === 'long') {
        const positionLong = this.LongProblem[this.longCount]
        this.type = positionLong.type
        this.char = positionLong.char
        this.longCount++
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
    },
    punactivate() {
      this.activepun = !this.activepun
    },

    typing(event) {
      this.$refs.spans.querySelector('span').classList.remove('current-before')
      const inputLength = this.typeInput.length
      const spanFromChar = this.$refs.spans.querySelectorAll('span')
      spanFromChar.forEach((span, index) => {
        if (index < this.typeInput.length) {
          if (span.textContent === this.typeInput[index]) {
            span.classList.add('correct')
            span.classList.remove('incorrect')
            if (event.key === 'Backspace') {
              event.preventDefault()
            }
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
    },
    inputKeydown(event) {
      if (
        event.key === 'Backspace' &&
        Array.from(this.$refs.spans.querySelectorAll('span'))
          .slice(0, this.typeInput.length)
          .every((span) => span.classList.contains('correct'))
      ) {
        event.preventDefault()
      }
    }
  }
}
</script>
