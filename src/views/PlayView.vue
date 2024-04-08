<template>
  <body>
    <div id="buttons" class="buttons">
      <button
        @click="activate('level1')"
        :class="{ active: activeteButton === 'level1' }"
        class="level"
      >
        short
      </button>
      <button
        @click="activate('level2')"
        :class="{ active: activeteButton === 'level2' }"
        class="level"
      >
        normal
      </button>
      <button
        @click="activate('level3')"
        :class="{ active: activeteButton === 'level3' }"
        class="level"
      >
        long
      </button>
      <button
        @click="activate('level4')"
        :class="{ active: activeteButton === 'level4' }"
        class="level"
      >
        pun
      </button>
    </div>
    <div id="counter" class="counter">
      <div id="correct" class="correct"></div>
      <div id="incorrect" class="incorrect"></div>
      <div id="timer" class="timer"></div>
    </div>
    <div id="container" class="container">
      <div id="typeDisplay" class="typeDisplay">{{ sentence }}</div>
      <div id="charDisplay" class="charDisplay">{{}}</div>
    </div>
    <textarea
      id="typeInput"
      class="typeInput"
      autocomplete="off"
      v-model="typeInput"
      autofocus
      @input="logtype"
    ></textarea>
  </body>
</template>

<style scoped>
.active {
  background-color: #000000;
  color: #000000;
  font-size: 9rem;
}
* {
  box-sizing: border-box;
  padding: 0;
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

.buttons .short:hover {
  transition: box-shadow 1s;
  box-shadow: 0 5px 20px rgba(138, 168, 125, 0.7); /*上下右左?*/
  border-color: transparent;
}
.buttons .normal:hover {
  transition: box-shadow 1s;
  box-shadow: 0 5px 20px rgba(185, 255, 252, 0.7);
  border-color: transparent;
}

.buttons .long:hover {
  transition: box-shadow 1s;
  box-shadow: 0 5px 20px rgba(252, 164, 164, 0.7);
  border-color: transparent;
}

.container {
  position: absolute;
  align-items: center;
  top: 30%;
  background-color: rgb(238, 238, 238);
  width: 70%;
  height: 40%;
  font-weight: 400;
  display: flex;
  flex-direction: column;
}

.container .typeDisplay {
  flex: 1;
  background-color: tomato;
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
  background-color: #c2aac9;
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
</style>

<script>
// import { ref } from 'vue'

export default {
  setup() {
    function shortjson() {
      return fetch('../problems/nopun/short.json')
        .then((res) => res.json())
        .then((data) => {
          const ids = Object.keys(data)
          const randomId = ids[Math.floor(Math.random() * ids.length)]
          const sentence = data[randomId].sentence
          const char = data[randomId].char
          return { sentence, char }
        })
        .catch((err) => console.log(err))
    }

    function normaljson() {
      return fetch('../problems/nopun/normal.json')
        .then((res) => res.json())
        .then((data) => {
          const ids = Object.keys(data)
          const randomId = ids[Math.floor(Math.random() * ids.length)]
          const sentence = data[randomId].sentence
          const char = data[randomId].char
          return { sentence, char }
        })
        .catch((err) => console.log(err))

      function longjson() {
        return fetch('../problems/nopun/long.json')
          .then((res) => res.json())
          .then((data) => {
            const ids = Object.keys(data)
            const randomId = ids[Math.floor(Math.random() * ids.length)]
            const sentence = data[randomId].sentence
            const char = data[randomId].char
            return { sentence, char }
          })
          .catch((err) => console.log(err))
      }
    }
  },
  data() {
    return {
      // activeteButton: null
    }
  },
  methods: {
    // activate(level) {
    //   this.activeteButton = level
    // }
  }
}
</script>
