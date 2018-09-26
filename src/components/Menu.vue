<template>
  <div class="menu scroller" :class="[`px-${pad}`]">
    <div class="h-full" :class="[`py-${pad}`]">
      <!-- <div class="">
        <p class="">1v1</p>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  props: ['padding'],
  data () {
    console.log(this.padding)
    return {
      pad: this.padding || 0
    }
  }
}
</script>

<style lang="scss">
.menu-container {
  background: rgba(0, 0, 0, .3);
}
.menu-bar {
  background: #2a2c31;
}
.menu {
  background: #36393f;
}
</style>
