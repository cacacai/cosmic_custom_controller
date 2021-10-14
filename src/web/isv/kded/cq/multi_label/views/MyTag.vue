<template>
  <el-tag v-bind='$attrs' v-on='$listeners' effect='dark' size='small' :disable-transitions='true' @click='clickChild' @close='clickChild'>
    <slot></slot>
  </el-tag>
</template>
<script>
export default {
  name: 'MyTag',
  methods: {
    clickChild() {
      this.$emit("click-child")
    }
  }
}
</script>
