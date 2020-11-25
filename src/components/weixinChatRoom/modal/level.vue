<template>
    <span :style="(!msg.userMsg || msg.send_uid != getUserId)? {'margin-left':'7px'} :''" v-if="indexStore.indexData.chatDisplayLevel == 1">
        <span class="level" v-if="(msg.level && msg.level_name)"><span class="lv">LV</span><span class="grade">{{msg.level}}</span>{{msg.level_name}}</span>
        <span class="level" v-if="msg.reserved"><span class="lv">LV</span><span class="grade">{{JSON.parse(msg.reserved).level}}</span>{{JSON.parse(msg.reserved).levelName}}</span>
    </span>
</template>

<script>
    import {mapGetters,mapState}  from 'vuex'
  export default {
    props:['msg'],
    name: 'level',
    data() {
      return {

      }
    },
    computed: {
      ...mapGetters([
        'getUserId',
      ]),
      ...mapState([
        "indexStore"
      ])
    },
    created () {
      // chatDisplayLevel
    },
    methods:{

    }
  }
</script>

<style scoped>

</style>
