<template>
  <!-- 待选标签 -->
  <div>
    <div style="display: flex" v-for='(category, categoryIndex) in categories' :key="category.id">
      <!-- 分类 -->
      <span class="not-active">{{category.name}}：</span>

      <span v-if="category.count" class="not-active" @click="clearCategory(category, categoryIndex)"> 不限</span>
      <MyTag v-else>不限</MyTag>

      <!-- 标签 -->
      <div v-for='(child, childIndex) in category.children'>
        <MyTag v-if="child.active" :closable='true' @click-child='clickChild(category, categoryIndex, child, childIndex)'>
          {{ child.name }}
        </MyTag>
        <span v-else class="not-active" @click='clickChild(category, categoryIndex, child, childIndex)'>{{ child.name }}</span>
      </div>
    </div>
    <!-- 已选标签 -->
    <div v-if='conditions.length'>
      <span class="not-active" @click="clearCondition">清空已选：</span>
      <el-tag
          v-for='(condition, index) in conditions'
          :key="condition.id"
          type="primary"
          :closable="true"
          size="small"
          :disable-transitions="true"
          @close='removeCondition(condition, index)'
          @click='removeCondition(condition, index)'>
        {{condition.name}}
      </el-tag>
    </div>
  </div>

</template>
<script>
import Vue from "vue";

Vue.use(Tag)

// 简单封装一个公用组件
import MyTag from "./MyTag.vue";
import {Tag,Message} from "element-ui";
import {mapActions, mapGetters} from "vuex";
Array.prototype.deleteIndex = function(index){
  return this.slice(0, index).concat(this.slice(parseInt(index, 10) + 1));
}
export default {
  name: 'Main',
  components: {
    MyTag
  },
  data() {
    return {
      categories: [], // 分类标签，可从外部加载配置
      conditions: [] // 已选条件
    }
  },
  computed: {
    ...mapGetters([
      'tagList'// 苍穹更新到从vuex中的标签列表数据
    ]),
  },
  mounted() {
    this.categories = this.tagList
  },
  watch: {
    //监听后台的标签列表数据更新
    itemList(val) {
      this.categories = val
    },
    // 监听条件变化，按照请求接口拼装请求参数
    conditions(val){
      this.sendSelectTags(val)
    }
  },
  methods: {
    ...mapActions([
      'sendSelectTags'// 向后台发送数据请求
    ]),
    // 处理标签点击事件，未选中则选中，已选中则取消选中
    clickChild(category, categoryIndex, child, childIndex) {
      if (this.conditions.length >= 3 && (child.active === false || child.active === undefined)){
        //限制只能选择3个
        Message('只能选择3个数据');
        return
      }
      let uid = `${categoryIndex}-${childIndex}`
      child.uid = uid;
      console.log(uid)
      // 取消选择
      if (child.active === true) {
        category.count--;
        child.active = false;
        this.conditions.forEach((conditionChild, index) => {
          if (conditionChild.uid === child.uid) {
            this.conditions.splice(index, 1);
          }
        });
        // 选择
      } else {
        category.count++;
        child.active = true;
        this.conditions.push(child);
      }
    },
    // 清除已选整个类别标签
    clearCategory(category, categoryIndex) {
      category.count = 0;
      // 可选列表均为未选中状态
      category.children.forEach(child => {
        child.active = false;
      })
      // 清空该类已选元素
      for (let index = this.conditions.length - 1; index >= 0; index--) {
        const conditionChild = this.conditions[index];
        if (conditionChild.uid.startsWith(categoryIndex)) {
          this.conditions.splice(index, 1);
        }
      }
    },
    // 移除一个条件
    removeCondition(condition, index) {
      let categoryIndex = condition.uid.split("-")[0];
      this.categories[categoryIndex].count --;
      this.conditions.splice(index, 1)
      condition.active = false;
    },
    // 清空所有条件
    clearCondition() {
      for(let i = this.conditions.length-1; i >=0 ; i--){
        this.removeCondition(this.conditions[i], i);
      }
    }
  }
}
</script>
<style>
@import "https://unpkg.com/element-ui/lib/theme-chalk/index.css";
.not-active {
  display: inline-block;
  font-size: 12px;
  margin: 5px 8px;
}

span {
  margin: 0 2px;
}
</style>
