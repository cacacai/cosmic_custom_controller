<template>
  <div class="mkd_area">
    <mavon-editor v-model="mdConfig.content"
                  :ishljs="true"
                  :toolbars="toolbars"
                  :toolbarsFlag="mdConfig.toolbarsFlag!==false"
                  :subfield="mdConfig.subfield!==false"
                  :editable="true"
                  :boxShadow="mdConfig.boxShadow!==false"
                  :defaultOpen="'preview'"
                  ref=md
                  :imageClick="$imageClick"
                  @save="$save"
                  @imgAdd="$imgAdd"></mavon-editor>
  </div>
</template>
<script>
import { mapGetters,mapActions} from 'vuex';
import axios from 'axios'
export default {
  data () {
    return {
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: false, // 下划线
        strikethrough: true, // 中划线
        mark: false, // 标记
        superscript: false, // 上角标
        subscript: false, // 下角标
        quote: true, // 引用
        ol: false, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: false, // 左对齐
        aligncenter: false, // 居中
        alignright: false, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true // 预览
      },
      toolbarsFlag: true,
      subfield: true,
      boxShadow: true,
      content: ''
    }
  },
  computed: {
    ...mapGetters([
      'openInfo'
    ])
  },
  props: ['saveMd', 'mdConfig'],
  methods: {
    // 点击保存按钮触发事件
    $save (value, render) {
      if (!value) {
        this.openInfo.huidiao = true
        this.openInfo.huidiaoInfo = '提交时文档不能为空'
        return
      }
      this.saveMd(value)
    },
    downLoad (content, fileName) {
      var aEle = document.createElement('a')

      var blob = new Blob([content])

      aEle.download = fileName

      aEle.href = window.URL.createObjectURL(blob, { type: 'text/plain;charset=utf-8' })

      aEle.click()
    },
    $imgAdd (pos, $file) { // 绑定@imgAdd event
      // 第一步.将图片上传到服务器.
      var formdata = new FormData()
      formdata.append('file', $file)
      const instance = axios.create({
        withCredentials: true
      })
      instance.post(window.location.protocol + '//' + window.location.host + '/kd/ecos/file/node/upload', formdata).then((res) => {
        // 第二步.将返回的url替换到文本原位置![...](./0) -> ![...](url)
        /**
        * $vm 指为mavonEditor实例，可以通过如下两种方式获取
        * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
        * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
        */
        this.$refs.md.$img2Url(pos, window.location.protocol + '//' + window.location.host + '/kd/ecos/file/getById/' + res.data.data.id)
      }).catch(res => {
        this.$store.dispatch('VerifiFailure', res)
      })
    },
    $imgDel (filename) {
      console.log(filename)
    },
    $imageClick (aa) {
      return false
    }
  }
}
</script>
