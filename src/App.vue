<script setup>
console.log('sex')

</script>
<template>
  <header>
    <h1>just typing</h1>
  </header>
  <button id="sex"></button>
</template>

<style scoped>
#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  font-weight: normal;
}

body {
  font-family: Arial, sans-serif;
  background-color: #20ecff;
  margin: 0;
  padding: 0;
}
.container {
  max-width: 1200px;
  margin: 20px auto;
  overflow: hidden;
  padding: 0 20px;
}
header {
  background-color: #6d6d6d;
  color: #fff;
  padding: 10px 0;
  text-align: center;
}
h1 {
  font-size: 3rem;
}
#sex {
  background-color: #7c7c7c;
  color: #b30000;
  padding: 10px 0;
  text-align: center;
  margin: 20px auto;
  display: block;
  width: 200px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
