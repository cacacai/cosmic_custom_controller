<template>
  <div id="app">
    <sign-canvas class="sign-canvas" ref="SignCanvas" :options="options" v-model="value" />
    <div class="sign-btns">
      <el-row>
        <el-button  id="clear" @click="canvasClear()">清空</el-button>
        <el-button  id="save" @click="saveAsImg()">确认</el-button>
        <el-button id="cancel" @click="cancelSign()">取消</el-button>
      </el-row>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Main',
  data() {
    return {
      value: null,
      options: {
        isDpr: true, //是否使用dpr兼容高倍屏 [Boolean] 可选
        lastWriteSpeed: 1, //书写速度 [Number] 可选
        lastWriteWidth: 2, //下笔的宽度 [Number] 可选
        lineCap: "round", //线条的边缘类型 [butt]平直的边缘 [round]圆形线帽 [square]	正方形线帽
        lineJoin: "bevel", //线条交汇时边角的类型  [bevel]创建斜角 [round]创建圆角 [miter]创建尖角。
        canvasWidth: 1200, //canvas宽高 [Number] 可选
        canvasHeight: 500, //高度  [Number] 可选
        isShowBorder: true, //是否显示边框 [可选]
        bgColor: "#ffffff", //背景色 [String] 可选
        borderWidth: 1, // 网格线宽度  [Number] 可选
        borderColor: "#9a9898", //网格颜色  [String] 可选
        writeWidth: 5, //基础轨迹宽度  [Number] 可选
        maxWriteWidth: 30, // 写字模式最大线宽  [Number] 可选
        minWriteWidth: 5, // 写字模式最小线宽  [Number] 可选
        writeColor: "#101010", // 轨迹颜色  [String] 可选
        isSign: true, //签名模式 [Boolean] 默认为非签名模式,有线框, 当设置为true的时候没有任何线框
        imgType: "png", //下载的图片格式  [String] 可选为 jpeg  canvas本是透明背景的
      },
    };
  },
  computed: {
    ...mapGetters([
      'fileServer'
    ])
  },
  methods: {
    ...mapActions([
      'saveImg',
      'closeView'
    ]),
    /**
     * 清除画板
     */
    canvasClear() {
      this.$refs.SignCanvas.canvasClear();
    },

    /**
     * 保存图片, 向后台发送
     */
    saveAsImg() {
      const img = this.$refs.SignCanvas.saveAsImg()
      this.saveImg({'image':img,'url':this.fileServer})
      // alert(`image 的base64：${img}`);
      this.rollback()
    },
    cancelSign() {
      this.closeView({})
      this.rollback()
    }
    /**
     * 下载图片 this.$refs.SignCanvas.downloadSignImg()
     */
  },
};
</script>
<style lang="less">
@import "https://unpkg.com/element-ui/lib/theme-chalk/index.css";
* {
  margin: 0;
  padding: 0;
}
.sign-canvas {
  width: 100%;
  height: 100%;
  display: flex;
  margin: 20px auto;
}
#app {
  flex-direction: column;
  display: flex;
  align-items: center;

}
.sign-btns {
  display: flex;
  justify-content: space-between;
}
</style>
