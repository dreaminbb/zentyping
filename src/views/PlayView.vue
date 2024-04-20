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
      <div id="charDisplay" class="charDisplay">
        <span class="char" v-for="(character, index) in char" :key="index">{{ character }}</span>
      </div>
    </div>
    <textarea
      id="typeInput"
      class="typeInput"
      autocomplete="off"
      autofocus
      @input="logtype"
    ></textarea>
  </body>
</template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  user-select: none;
}
body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  justify-content: center;
  overflow: hidden;
  font-family: 'poppins', sans-serif;
}

#buttons {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-around;
  transform: translate(-50%, -50%);
  align-items: center;
  width: 30%;
  height: 5%;
  border-radius: 80px;
  background-color: rgb(255, 255, 255);
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
  border-radius: 900px;
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
  top: 30%;
  width: 80%;
  height: 40%;
  font-weight: 400;
  display: flex;
  flex-direction: column;
}

.container .typeDisplay {
  flex: 1;
  white-space: pre-wrap; /* 改行と空白を保持し、必要に応じて改行 */
  word-break: break-word; /* 単語が要素の幅を超える場合に改行 */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #ffffff;
  position: relative;
  outline: none;
  height: 40%;
  width: 100%;
  overflow-wrap: break-word; /* 途中で改行する */
  font-size: 3.5rem;
}

/* 文字（ローマ字を表示させるところ） */
.container .charDisplay {
  flex: 1;
  align-items: center;
  position: absolute;
  bottom: 0%;
  height: 20%;
  width: 100%;
  justify-content: center;
  text-align: center;
  white-space: pre-wrap; /* 改行と空白を保持し、必要に応じて改行 */
  word-break: break-word; /* 単語が要素の幅を超える場合に改行 */
  color: #ffffff;
  position: relative;
  outline: none;
  padding: 0;
  height: 20%;
  font-size: 2.5rem;
  width: 100%;
  overflow-wrap: break-word; /* 途中で改行する */
  letter-spacing: 3px;
}

.current::after {
  content: '|';
  margin: -7px;
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
.typeinput:focus {
  outline: none;
}

.correct {
  color: #ffffff;
}

.incorrect {
  color: #ff0000;
}

.typeInput {
  position: absolute;
  top: -1000px;
  background: transparent;
  text-decoration: none;
  outline: none;
  border: none;
  resize: none; /* テキストエリアのリサイズを禁止 */
  width: 100%;
  height: 200px;
}
.active {
  color: #fcfcfc;
}
</style>

<script>
import { ref } from 'vue'

export default {
  data() {
    return {
      activeButtons: {
        short: false,
        normal: false,
        long: false
      },
      data: null,
      activepun: false,
      type: '',
      char: '',
      ShortProblem: null,
      NormalProblem: null,
      LongProblem: null,
      shortCount: 0,
      normalCount: 0,
      longCount: 0
    }
  },
  setup() {
    const logtype = ref('')
    return { logtype }
  },
  methods: {
    //選択されたボタンのをアクティブの状態にする
    async getFromAPI() {
      const response = await fetch('http://localhost:1919/')
      return await response.json()
    },
    activate(level) {
      const levels = ['short', 'normal', 'long']
      for (const key in this.activeButtons) {
        if (key === level) {
          this.activeButtons[key] = true
        } else if (levels.includes(key)) {
          this.activeButtons[key] = false
        }
      }
      const idenifylevel = (level) => {
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
      }
      idenifylevel(level)
      if (
        ['shortCount', 'normalCount', 'longCount'].some(
          (count) => this[count] === this.NormalProblem.length
        )
      ) {
        this.shortCount = this.normalCount = this.longCount = 0
        console.log(this.shortCount)
        this.data = null
        const data = this.getFromAPI()
        this.ShortProblem = data[0]
        this.NormalProblem = data[1]
        this.LongProblem = data[2]
        this.idenifylevel(level)
      }
    },
    punactivate() {
      this.activepun = !this.activepun
    }
  },
  async mounted() {
    this.activeButtons.normal = true
    this.activepun = false
    const data = await this.getFromAPI()
    this.ShortProblem = data[0]
    this.NormalProblem = data[1]
    this.LongProblem = data[2]
    this.type = this.NormalProblem[0].type
    this.char = this.NormalProblem[0].char.split('')
  }
}
</script>
