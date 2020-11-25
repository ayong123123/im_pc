<template>
    <div class="picture on">
        <img src="@/assets/weChat/video_close.png" alt=""  @click="setVideoPlayer({data:'',state:false})">
        <video-player  class="video-player vjs-custom-skin"
                       ref="videoPlayer"
                       :playsinline="true"
                       :options="playerOptions"
        ></video-player>
    </div>
</template>

<script>
  import {mapState,mapMutations,mapActions,mapGetters} from 'vuex'
  export default {
    data () {
      return {
        playerOptions : {
          playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
          autoplay: false, //如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [{
            type: "",//这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
            src: "" //url地址
          }],
          poster: "", //你的封面地址
          // width: document.documentElement.clientWidth, //播放器宽度
          notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false,
            fullscreenToggle: true  //全屏按钮
          }
        }
      }
    },
    computed:{
      ...mapState([
        "chatListStore"
      ]),
      ...mapGetters([

      ]),
    },
    watch: {

    },
    created () {
      let videoData = JSON.parse(this.chatListStore.videoObj.data)
      this.playerOptions.sources[0].src = videoData.youpai_url
      this.playerOptions.poster = videoData.qiniu_image_url

      console.log(this.playerOptions)
    },
    mounted () {

    },
    methods:{
      ...mapActions([

      ]),
      ...mapMutations([
        "setVideoPlayer"
      ]),

    },
  }
</script>
<style lang="less" scoped>
    .picture {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        width: 600px;
        height: 90%;
        z-index: 1000;
        transition: .1s;
        &.on {
            transform: translate(-50%, -50%) scale(1);
            transition: .1s
        }
        img {
            cursor: pointer;
            width: 50px;
            height: 50px;
            position: absolute;
            top: 0;
            right: -50px;
            /*transform: translate(-50%, -50%);*/
            /*max-width: 100%;*/
            /*max-height: 100%;*/
        }
    }

</style>
