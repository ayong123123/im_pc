<template>
  <div class="Info-wrapper">
    <div class="newfriend">
      <div class="nickname">相册</div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    computed: {
    },
    methods: {
    }
  }
</script>

<style lang="less" scoped>
  .newfriend {
    height: 60px;
    padding: 28px 0 0 30px;
    box-sizing: border-box;
    border-bottom: 1px solid #e7e7e7;
    .nickname {
      font-size: 18px;
    }
  }
</style>

