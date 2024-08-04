<script lang="ts" setup>
import { inject, type Ref, provide } from 'vue'

// const is_login = inject('is_login') as Ref<boolean>

const tools = inject('tools') as Ref<boolean>
const header_focus_class = inject('header_focus_class') as Ref<boolean>
const header_normal_class = inject('header_normal_class') as Ref<boolean>
provide('tools', tools)
provide('header_focus_class', header_focus_class)
provide('header_normal_class', header_normal_class)
</script>
<template>
  <body>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link
      href="https://fonts.googleapis.com/css2?family=Yuji+Hentaigana+Akari&display=swap"
      rel="stylesheet"
    />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,-25"
    />
    <div id="usr_info_frame"></div>
    <div id="button_frame">
      <router-link to="/ranking" id="ranking" class="button_rwp">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon"
          height="50px"
          viewBox="0 -960 960 960"
          width="50px"
          fill="#e8eaed"
        >
          <path
            d="M377-198v-60h463v60H377Zm0-252v-60h463v60H377Zm0-253v-60h463v60H377ZM189-161q-28.05 0-48.02-19Q121-199 121-227.5t19.5-48q19.5-19.5 48-19.5t47.5 19.98q19 19.97 19 48.02 0 27.23-19.39 46.61Q216.23-161 189-161Zm0-252q-28.05 0-48.02-19.68Q121-452.36 121-480t19.98-47.32Q160.95-547 189-547q27.23 0 46.61 19.68Q255-507.64 255-480t-19.39 47.32Q216.23-413 189-413Zm-1-253q-27.64 0-47.32-19.68T121-733q0-27.64 19.68-47.32T188-800q27.64 0 47.32 19.68T255-733q0 27.64-19.68 47.32T188-666Z"
          />
        </svg>
      </router-link>
      <router-link to="/write" id="write" class="button_rwp">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon"
          height="50px"
          viewBox="0 -960 960 960"
          width="50px"
          fill="#e8eaed"
        >
          <path
            d="M160-120v-170l527-526q12-12 27-18t30-6q16 0 30.5 6t25.5 18l56 56q12 11 18 25.5t6 30.5q0 15-6 30t-18 27L330-120H160Zm80-80h56l393-392-28-29-29-28-392 393v56Zm560-503-57-57 57 57Zm-139 82-29-28 57 57-28-29ZM560-120q74 0 137-37t63-103q0-36-19-62t-51-45l-59 59q23 10 36 22t13 26q0 23-36.5 41.5T560-200q-17 0-28.5 11.5T520-160q0 17 11.5 28.5T560-120ZM183-426l60-60q-20-8-31.5-16.5T200-520q0-12 18-24t76-37q88-38 117-69t29-70q0-55-44-87.5T280-840q-45 0-80.5 16T145-785q-11 13-9 29t15 26q13 11 29 9t27-13q14-14 31-20t42-6q41 0 60.5 12t19.5 28q0 14-17.5 25.5T262-654q-80 35-111 63.5T120-520q0 32 17 54.5t46 39.5Z"
          />
        </svg>
      </router-link>
      <router-link to="/play" id="play" class="button_rwp">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon"
          height="50px"
          viewBox="0 -960 960 960"
          width="50px"
          fill="#e8eaed"
        >
          <path
            d="M160-200q-33 0-56.5-23.5T80-280v-400q0-33 23.5-56.5T160-760h640q33 0 56.5 23.5T880-680v400q0 33-23.5 56.5T800-200H160Zm0-80h640v-400H160v400Zm160-40h320v-80H320v80ZM200-440h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80ZM200-560h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80ZM160-280v-400 400Z"
          />
        </svg>
      </router-link>
    </div>
  </body>
</template>

<style lang="scss" scoped>
#usr_info_frame {
  position: absolute;
  display: flex;
  height: 50%;
  width: 60%;
  left: 15%;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 10px rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

#button_frame {
  position: absolute;
  display: flex;
  background-color: transparent;
  height: 40%;
  left: 80%;
  width: 100px;
  bottom: 30%;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
}

.button_rwp {
  fill: var();
  width: 100px;
  height: 100px;
  border-radius: 50%;
  text-align: center;
  justify-content: center;

  &:hover {
    transition: 0.5s;
    transform: translateY(-1px);
    filter: brightness(150%);
    box-shadow: rgba(151, 65, 252, 0.2) 0 15px 20px -5px;
  }
}

.icon {
  position: absolute;
  transform: translate(-50%, 50%);
  color: rgba(255, 255, 255, 0.5);
}
</style>
