# zentyping

*backend rust frontend vue + typescript*
## 📝 Overview

**zentyping** is a modern typing application built with a TS backend and Vue.js + TypeScript frontend. Practice your typing skills with a clean, responsive interface.

## ✨ Features

- 🚀 **Fast Performance**: TS + bun backend ensures minimal latency
- ⌨️ **Keydown event base**: manage every user input in keydown event
- 🎨 **Modern UI**: Clean interface built with Vue 3
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 📊 **Detailed Analytics**: Track your typing speed and accuracy
- 🔄 **Real-time Feedback**: Instant feedback on your typing performance

## 🖼️ Screenshot

![zentyping screenshot](https://via.placeholder.com/800x450?text=zentyping+screenshot)

## 🛠️ Tech Stack

- **Backend**: Typescript + express + mongo + bun as runtime
- **Frontend**: Vue 3 + TypeScript
- **Build Tool**: Vite
- **Package Manager**: Bun
This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

I recommed to use vscode , neovim ? , whatever you like to use.

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
bun i
```

### Compile and Hot-Reload for Development

```sh
bun run dev
```

### Type-Check, Compile and Minify for Production

```sh
bun run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
bun run lint
```
