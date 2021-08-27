<template>
  <div class="managetreelook">
    <div class="infotitle">
      <div class="leftchange">
        <span>文档管理</span>
        <el-select v-model="docListPoint"
                   @change="showChange"
                   placeholder="请选择需要显示的文档类型">
          <el-option v-for="item in options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </div>

      <div class="searchdevb">
        <div class="searchinput2"
             :class="inputfocusflag ? 'focus':''">
          <el-input type="text"
                    placeholder="输入关键字进行过滤"
                    @focus="inputfocusflag = true"
                    @blur="inputfocusflag = false"
                    v-model="filterText"
                    prefix-icon="el-icon-search"
                    clearable>
          </el-input>
        </div>

        <div class="devappro maneditbtn"
             v-if="!iframeClick"
             @click="editdialog = !editdialog">移动</div>

        <div class="devappro"
             v-show="docListPoint !== 'greenStart' && docListPoint !== 'manage' ">
          <a v-if="docListPoint === 'develop'"
             href="/index/docshome/developNew?type=develop"
             target="_blank">预览开发指南</a>
          <a v-if="docListPoint === 'apiCenter'"
             href="/index/docshome/developNew?type=apiCenter"
             target="_blank">预览接口文档</a>
          <a v-if="docListPoint === 'greenStart'"
             href="/index/docshome/developNew?type=greenStart"
             target="_blank">预览新手入门</a>
          <a v-if="docListPoint === 'design'"
             href="/index/docshome/developNew?type=design"
             target="_blank">预览应用指南</a>
          <a v-if="docListPoint === 'research'"
             href="/index/docshome/developNew?type=research"
             target="_blank">预览研发管理</a>
        </div>
      </div>
    </div>

    <div class="infocontent">

      <div class="treebox">
        <div class="treeleft">
          <!-- <el-input class="treefilter"
                    placeholder="输入关键字进行过滤"
                    :clearable="true"
                    v-model="filterText">
          </el-input> -->
          <!-- <div class="showdma">
          <el-switch v-model="showdelete"
                     active-text="显示删除节点"
                     inactive-text="隐藏删除节点">
          </el-switch>
        </div> -->
          <el-tree :data="jsonloop"
                   :props="defaultProps"
                   node-key="id"
                   @node-click="handleNodeClick"
                   :default-expanded-keys="idArr"
                   :highlight-current="true"
                   :expand-on-click-node="false"
                   :render-content="renderContent"
                   :filter-node-method="filterNode"
                   ref="tree2"
                   draggable
                   :allow-drop="allowDrop"
                   :allow-drag="allowDrag"
                   @node-drag-start="handleDragStart"
                   @node-drag-end="handleDragEnd"
                   @node-drop="handleDrop">
          </el-tree>
        </div>
        <div class="treeright">
          <div class="curinfor"
               v-if="!iframeClick">
            <div class="titcur">
              <span>当前节点信息</span>
              <a :href="'/index/docsNew/'+checkloop.data.id"
                 v-if="checkloop.data.docId"
                 target="_blank">点击预览</a>
            </div>
            <div>节点id：<el-input type="text"
                        disabled="disabled"
                        v-model="checkloop.data.id"></el-input>
            </div>
            <div>节点名称：<el-input type="text"
                        v-model="checkloop.data.name"></el-input>
            </div>
            <!-- <div>节点路径：<el-input type="text"
                      v-model="checkloop.data.address"></el-input>
            </div> -->
            <!-- <div>文件名字：<el-input type="text"
                        v-model="checkloop.data.fileName"></el-input>
            </div> -->
            <!-- <div v-if="checkloop.data.docId">markdown ID：
              <el-input type="text"
                        disabled="disabled"
                        v-model="checkloop.data.docId"></el-input>
            </div> -->
            <div v-if="checkloop.data.id">状态：<br />
              <el-radio-group v-model="checkloop.data.status"
                              class="c"
                              @change="statuschange">
                <el-radio-button :label="0">启用</el-radio-button>
                <el-radio-button :label="1">禁用</el-radio-button>
                <el-radio-button :label="2">删除</el-radio-button>
              </el-radio-group>
            </div>
            <!-- <div v-if="checkloop.node.level === 2">收缩flag：<br />
            <el-radio-group v-model="checkloop.data.flag">
              <el-radio-button label="true"></el-radio-button>
              <el-radio-button label="false"></el-radio-button>
            </el-radio-group>
          </div> -->
            <div v-if="checkloop.node.level === 2 && checkloop.data.id">是否开启特殊模式（仅展示第一个节点）：<br />
              <el-radio-group v-model="checkloop.data.showAll"
                              @change="treeedit">
                <el-radio-button :label="1">true</el-radio-button>
                <el-radio-button :label="0">false</el-radio-button>
              </el-radio-group>
            </div>

            <div v-if="checkloop.node.level === 2 && checkloop.data.id">选择文档显示位置（谨慎选择）：<br />
              <!-- <el-radio-group v-model="checkloop.data.address"
                              @change="treeedit">
                <el-radio-button label="greenStart">新手入门</el-radio-button>
                <el-radio-button label="develop">开发指南</el-radio-button>
                <el-radio-button label="apiCenter">接口文档</el-radio-button>
                <el-radio-button label="design">应用指南</el-radio-button>
                <el-radio-button label="research">研发管理</el-radio-button>
                <el-radio-button label="manage">管理员</el-radio-button>
              </el-radio-group> -->
              <el-select v-model="checkloop.data.address"
                         placeholder="请选择显示位置"
                         @change="treeTypeChange">
                <el-option v-for="item in options"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
                <!-- <el-option label="新手入门"
                           value="greenStart"></el-option>
                <el-option label="开发指南"
                           value="develop"></el-option>
                <el-option label="接口文档"
                           value="apiCenter"></el-option>
                <el-option label="应用指南"
                           value="design"></el-option>
                <el-option label="研发管理"
                           value="research"></el-option>
                <el-option label="管理员"
                           value="manage"></el-option> -->
              </el-select>
            </div>
            <div style="height:68px"
                 v-if="checkloop.node.level === 2 && checkloop.data.id">上传小图标：<br />
              <el-upload class="avatar-uploader"
                         :action="UploadUrl()"
                         :show-file-list="false"
                         :on-success="handleAvatarSuccess"
                         :before-upload="beforeAvatarUpload">
                <img v-if="docAvatar"
                     :src="docAvatar"
                     class="avatar">
                <i v-else
                   class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
            <!-- <div v-if="checkloop.node.level === 3 || checkloop.data.address === 'workFlowScript'">是否包含PDF：<br />
            <el-radio-group v-model="checkloop.data.isPdf">
              <el-radio-button label="true"></el-radio-button>
              <el-radio-button label="false"></el-radio-button>
            </el-radio-group>
          </div> -->

            <div v-show="(checkloop.node.level === 3 || !checkloop.data.childMenus || checkloop.data.childMenus.length ===  0) && checkloop.data.id">节点类型：<br />
              <el-radio-group v-model="checkloop.data.type"
                              @change="treeedit">
                <el-radio-button :label="0">内链</el-radio-button>
                <el-radio-button :label="1">外链</el-radio-button>
              </el-radio-group>
            </div>

            <div v-if="checkloop.node.level !== 1 && checkloop.node.level !== 2 && checkloop.data.id && checkloop.data.type === 0">重定向（内链地址）：
              <el-button size="mini"
                         @click="dialogTable = true">选择</el-button>
              <span @click="clearRedirect"
                    style="margin-left:10px;cursor: pointer">移除</span>
              <div>
                <el-input type="text"
                          :disabled="true"
                          v-model="checkloop.data.redirect"></el-input>
              </div>
            </div>

            <div v-show="checkloop.data.id && checkloop.data.type === 1">外链地址：<el-input type="text"
                        v-model="checkloop.data.link"></el-input>
            </div>

            <el-button type="button"
                       class="lookmark noback"
                       @click="editMd(checkloop.data.docId)"
                       v-show="(!checkloop.data.childMenus || checkloop.data.childMenus.length ===  0) && checkloop.data.id && checkloop.data.type === 0">
              <a href="javascript:void(0)">编辑markdown</a>
            </el-button>

            <div class="curbtn">
              <!-- <div class="deletebtn"
                   @click="treedelete"><a href="javascript:void(0)">删除</a></div> -->
              <!-- <div class="confirmbtn"
                   @click="treeedit"><a href="javascript:void(0)">保存</a></div> -->
              <el-button type="button"
                         class="lookmark"
                         @click="treeedit"><a href="javascript:void(0)">保存</a>
              </el-button>
            </div>

            <div v-show="editdialog"
                 class="nodedial">
              <div class="titcur">
                <span>节点移动位置</span>
                <p class="tcur_p">需在操作后保存一下移动的所有叶子节点，拖拽移动一个没有子节点的除外</p>
              </div>
              <div>请输入节点id：<el-input type="text"
                          v-model="editNode.id"></el-input>
              </div>
              <div>请输入父节点id：<el-input type="text"
                          v-model="editNode.parentId"></el-input>
              </div>
              <div class="curbtn">
                <div class="confirmbtn"
                     @click="editdialog = false"><a href="javascript:void(0)">关闭</a></div>
                <div class="confirmbtn"
                     @click="editcomfirm"><a href="javascript:void(0)">保存</a></div>

              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <el-dialog title="提示"
               :append-to-body="true"
               :visible.sync="lookMdFlag"
               custom-class="dialogMd"
               :close-on-click-modal="false"
               @closed="dialogMdclose">
      <div>
        <Mkd :mdConfig="mdConfig"
             :saveMd="saveMd"></Mkd>
      </div>
    </el-dialog>

    <el-dialog title="请选择文档"
               :visible.sync="dialogTable"
               custom-class="FixedHeightDialog"
               width="1200px">
      <div style="position: relative">
        <tree-manage @iframeCallback="iframeCallback"
                     :iframeClick="iframeOpen"></tree-manage>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogTable = false">取消</el-button>
        <el-button type="primary"
                   class="btncolor"
                   @click="adddialogclick">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Mkd from '../componentes/Mkd.vue'
export default {
  name: 'OnlineWiki',
  components: {
    Mkd
    // 'el-tree': Tree
  },
  data () {
    return {
      inputfocusflag: false,
      jsonloop: null, // 部分值
      alljsonloop: null, // 全部保留所有值
      lookMdFlag: false,
      editdialog: false,
      dialogTable: false,
      isEditDoc: null,
      docAvatar: null,
      checkloop: {
        'node': {},
        'data': {}
      },
      addPersonObj: null, // 新增内链专用
      mdConfig: {
        content: ''
      },
      defaultProps: {
        children: 'childMenus',
        label: function (data, node) {
          return data.name
        }
      },
      iframeOpen: {
        flag: true
      },
      filterText: '',
      idArr: [],
      curTree: null,
      editNode: {
        id: '',
        parentId: ''
      },
      options: [],
      docListPoint: ''
    }
  },
  props: ['iframeClick'],
  mounted () {
    this.init()
  },
  computed: {
    ...mapGetters([
      'openInfo',
        'itemList',
        'addressList'
    ])
  },
  methods: {
    ...mapActions([
        'addressListGet',
      'docMenuItemAdminGet',
      'docMenuItemAdd',
      'docMenuItemPut',
      'docMenuItemOrderPut',
      'docMenuItemPatch',
      'docMenuItemDelete',
      'documentPost',
      'documentGet',
      'documentPut',
      'editAddress',
      'docMenuItemAvatar'
    ]),
    init () {
      this.addressListGet({})
      //this.docListPoint = 'develop'
      // this.showChange(this.docListPoint)
    },
    showChange (type) {
      this.reset()
      this.docMenuItemAdminGet({
        "address":type
      })
    },
    showchange2 (type) {
      this.jsonloop[0].childMenus = this.alljsonloop[0].childMenus.filter(item => {
        if (!type || type === 'develop') {
          return item.address === 'develop' || item.address == null
        }
        return item.address === type
      })
    },
    handleDragStart (node, ev) {
      this.curTree = JSON.parse(JSON.stringify(this.jsonloop[0].childMenus))
      console.log('节点开始拖拽时触发的事件', node)
    },
    handleDragEnd (draggingNode, dropNode, dropType, ev) {
      console.log('拖拽结束时（可能未成功）触发的事件: ', dropNode && dropNode.label, dropType)
    },
    handleDrop (draggingNode, dropNode, dropType, ev) {
      this.$confirm('此操作将移动节点位置, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'outerbtn',
        type: 'warning'
      }).then(() => {
        var obj = {
          'id': draggingNode.data.id,
          'parentId': dropType === 'inner' ? dropNode.data.id : dropNode.data.parentId
        }
        // obj.navId = this.getNavId(dropNode)
        // //////obj.address = this.getAddress(dropNode)
        obj.nodelist = []
        var arrlist = []
        if (obj.parentId) {
          arrlist = this.nodeSearch(this.jsonloop, obj.parentId)
        } else {
          arrlist = this.jsonloop[0]
        }
        // 为了减小体积
        for (let k = 0; k < arrlist.childMenus.length; k++) {
          obj.nodelist.push(arrlist.childMenus[k].id)
        }
        this.docMenuItemOrderPut(obj).then(res => {
          this.jsonloop = [{
            'id': null,
            'name': '全部',
            'docId': null,
            'status': 0,
            'childMenus': res.data
          }]
          this.alljsonloop = [{
            'id': null,
            'name': '全部',
            'docId': null,
            'status': 0,
            'childMenus': res.data
          }]
          this.showchange2(this.docListPoint)
        }).catch(res => {
          this.jsonloop[0].childMenus = this.curTree
          this.$store.dispatch('VerifiFailure', res)
        })
        console.log('拖拽成功完成时触发的事件: ', dropNode.label, dropType)
      }).catch(() => {
        this.jsonloop[0].childMenus = this.curTree
      })
    },
    allowDrop (draggingNode, dropNode, type) {
      if (this.iframeClick && this.iframeClick.flag) {
        return false
      }
      // 第一层不能放下
      if (dropNode.level === 1) {
        return false
      }
      // 只有状态正常的节点才能允许移动到下面
      if (dropNode.data.status !== 0 && type === 'inner') {
        return false
      } else {
        return true
      }
    },
    allowDrag (draggingNode) {
      if (this.iframeClick && this.iframeClick.flag) {
        return false
      }
      // 第一层不能抓起
      if (draggingNode.level === 1) {
        return false
      }
      // 除了根节点和没保存的节点不能移动
      return !(!draggingNode.data.id)
    },
    nodeSearch (jsontree, queryString) { // 根据address找到相应树节点
      var str = ''
      if ((typeof jsontree === 'object') && (jsontree.constructor === Object.prototype.constructor)) {
        var arrey = []
        arrey.push(jsontree)
      } else {
        arrey = jsontree
      }
      for (var i = 0; i < arrey.length; i++) {
        var node = arrey[i]
        if (node.id === queryString + '') {
          // 想继续做的操作函数(node)
          return node
        }
        if (node.childMenus && node.childMenus.length > 0 && str === '') {
          str = this.nodeSearch(node.childMenus, queryString)
        }
      }
      return str
    },
    editMd (docId) {
      this.lookMdFlag = true
      if (docId) {
        this.documentGet({ 'id': docId }).then(res => {
          if (res.data) {
            this.isEditDoc = res.data.id
            this.mdConfig.content = res.data.content
          } else {
            this.isEditDoc = null
            this.mdConfig.content = ''
          }
        }).catch(res => {
          this.isEditDoc = null
          this.$store.dispatch('VerifiFailure', res)
        })
      } else {
        this.isEditDoc = null
        this.mdConfig.content = ''
      }
    },
    saveMd (value) {
      if (!this.checkloop.data.id) {
        this.openInfo.huidiao = true
        this.openInfo.huidiaoInfo = '请先保存节点再编写文档'
        return
      }
      if (!this.isEditDoc) {
        this.documentPost({ 'id': this.checkloop.data.id, 'content': value }).then(res => {
          // console.log(res)
          // this.lookMdFlag = false
          this.openInfo.huidiao = true
          this.openInfo.huidiaoInfo = '保存成功'
          this.checkloop.data.docId = res.data.id
        }).catch(res => {
          this.$store.dispatch('VerifiFailure', res)
        })
      } else {
        this.documentPut({ 'id': this.isEditDoc, 'content': value }).then(res => {
          // console.log(res)
          // this.lookMdFlag = false
          this.openInfo.huidiao = true
          this.openInfo.huidiaoInfo = '保存成功'
          this.checkloop.data.docId = res.data.id
        }).catch(res => {
          this.$store.dispatch('VerifiFailure', res)
        })
      }
    },
    add (data) {
      console.log(data)
      // var getRandom = (new Date()).getTime()
      const newChild = { id: null, name: 'new node', childMenus: [], 'docId': null, parentId: data.id, 'type': 0, 'status': 0 }
      if (!data.childMenus) {
        this.$set(data, 'childMenus', [])
      }
      data.childMenus.push(newChild)
    },
    renderContent (h, { node, data, store }) {
      return (
        <span class={`custom-tree-node ${data.status === 0 ? '' : data.status === 1 ? 'disableclass' : 'deleteclass'}`}>
          <span class="customspan">{node.label}</span>
          {(data.docId == null || data.docId === '') && data.status === 0 && (data.id || data.root)
            ? <span>
              <el-button size="mini" type="text" on-click={() => this.add(data)}>add</el-button>
            </span>
            : <span></span>
          }
        </span>)
    },
    remove (node, data) {
      const parent = node.parent
      const childMenus = parent.data.childMenus || parent.data
      const index = childMenus.findIndex(d => d.id === data.id)
      childMenus.splice(index, 1)
    },
    reset () {
      this.checkloop.data = {}
    },
    handleNodeClick (data, node) {
      console.log(data)
      this.reset()
      // this.checkloop.data = JSON.parse(JSON.stringify(data))
      this.checkloop.data = data
      this.checkloop.node = node
      if (this.checkloop.data.avatar) {
        this.docAvatar = window.location.protocol + '//' + window.location.host + '/kd/ecos/file/getById/' + this.checkloop.data.avatar
      } else {
        this.docAvatar = null
      }

      if (this.iframeClick && this.iframeClick.flag) {
        if (data.docId && data.type === 0) {
          this.$emit('iframeCallback', [data])
        } else {
          this.openInfo.huidiao = true
          this.openInfo.huidiaoInfo = '请选择有文档的节点'
        }
      }
    },
    treeedit () {
      if (this.checkloop.data.name === '') {
        this.openInfo.huidiao = true
        this.openInfo.huidiaoInfo = '节点名称不能为空'
        return
      }
      var obj = null
      if (!this.checkloop.data.id) { // 新增节点
        if (JSON.stringify(this.checkloop.data) === '{}') {
          this.openInfo.huidiao = true
          this.openInfo.huidiaoInfo = '请选中一个节点'
          return
        }
        obj = {
          'name': this.checkloop.data.name,
          'parentId': this.checkloop.data.parentId,
          'address': this.docListPoint
        }
        // obj.navId = this.getNavId(this.checkloop.node)
        // obj.address = this.getAddress(this.checkloop.node)
        this.docMenuItemAdd(obj).then(res => {
          this.checkloop.data.id = res.data.id
          this.checkloop.data.address = res.data.address
          this.checkloop.data.showAll = res.data.showAll
          this.checkloop.data.type = res.data.type
          this.openInfo.huidiao = true
          this.openInfo.huidiaoInfo = '新增成功'
        }).catch(res => {
          this.$store.dispatch('VerifiFailure', res)
        })
      } else { // 修改节点
        obj = {
          'id': this.checkloop.data.id,
          'name': this.checkloop.data.name,
          'showAll': this.checkloop.data.showAll,
          'redirect': this.checkloop.data.redirect,
          'address': this.checkloop.data.address,
          'type': this.checkloop.data.type,
          'link': this.checkloop.data.link
        }
        // obj.navId = this.getNavId(this.checkloop.node)
        // obj.address = this.getAddress(this.checkloop.node)
        this.docMenuItemPut(obj).then(res => {
          this.openInfo.huidiao = true
          this.openInfo.huidiaoInfo = '保存成功'
        }).catch(res => {
          this.$store.dispatch('VerifiFailure', res)
        })
      }
    },
    treeTypeChange () {
      var obj = null
      obj = {
        'id': this.checkloop.data.id,
        'name': this.checkloop.data.name,
        'showAll': this.checkloop.data.showAll,
        'redirect': this.checkloop.data.redirect,
        'address': this.checkloop.data.address,
        'type': this.checkloop.data.type,
        'link': this.checkloop.data.link
      }
      this.docMenuItemPut(obj).then(res => {
        this.openInfo.huidiao = true
        this.openInfo.huidiaoInfo = '保存成功'
        this.docListPoint = obj.address
        this.showchange2(obj.address)
      }).catch(res => {
        this.$store.dispatch('VerifiFailure', res)
      })
    },
    // getNavId (node) {
    //   if (!node.parent) {
    //     return null
    //   }
    //   if (node.parent.level === 2) {
    //     if (node.parent.data.showAll === 1) {
    //       return node.parent.data.id
    //     } else {
    //       return node.data.id
    //     }
    //   } else {
    //     return this.getNavId(node.parent)
    //   }
    // },
    // getAddress (node) {
    //   if (!node.parent) {
    //     return null
    //   }
    //   if (node.parent.level === 1) {
    //     return node.data.address
    //   } else {
    //     return this.getAddress(node.parent)
    //   }
    // },
    statuschange () {
      // 当已经入库的节点删除时
      var obj = this.checkloop.data
      this.docMenuItemPatch(obj).then(res => {
        this.openInfo.huidiao = true
        this.openInfo.huidiaoInfo = '修改状态成功'

        const treeList = this.nodeSearch(this.jsonloop, obj.id)
        this.nodeListChange(treeList, obj.status)
      }).catch(res => {
        this.$store.dispatch('VerifiFailure', res)
      })
    },
    nodeListChange (obj, status) { // 修改树下面所有节点的status状态
      if (obj.childMenus) {
        for (let i = 0; i < obj.childMenus.length; i++) {
          obj.childMenus[i].status = status
          if (obj.childMenus[i].childMenus) {
            this.nodeListChange(obj.childMenus[i], status)
          }
        }
      }
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    editcomfirm () {
      var obj = {
        id: this.editNode.id,
        parentId: this.editNode.parentId
      }
      this.editAddress(obj).then(res => {
        this.jsonloop = [{
          'id': null,
          'name': '全部',
          'docId': null,
          'status': 0,
          'childMenus': res.data
        }]
        this.alljsonloop = [{
          'id': null,
          'name': '全部',
          'docId': null,
          'status': 0,
          'childMenus': res.data
        }]
        this.openInfo.huidiao = true
        this.openInfo.huidiaoInfo = '位置修改成功'
        this.editNode = {
          id: '',
          parentId: ''
        }
        this.editdialog = false
        this.showchange2(this.docListPoint)
      }).catch(res => {
        this.$store.dispatch('VerifiFailure', res)
      })
    },
    dialogMdclose () {
      this.mdConfig.content = '# abc...'
    },
    UploadUrl () { // 返回上传的地址
      return window.location.protocol + '//' + window.location.host + '/kd/ecos/file/node/upload'
    },
    handleAvatarSuccess (result, file) {
      if (result.success) {
        this.docMenuItemAvatar({ 'id': this.checkloop.data.id, 'avatar': result.data.id }).then(res => {
          this.checkloop.data.avatar = res.data.avatar
          this.docAvatar = window.location.protocol + '//' + window.location.host + '/kd/ecos/file/getById/' + res.data.avatar
          console.log(res)
        }).catch(res => {
          this.openInfo.huidiao = true
          this.openInfo.huidiaoInfo = '图标上传失败啦'
          this.$store.dispatch('VerifiFailure', res)
        })
      } else {
        this.openInfo.huidiao = true
        this.openInfo.huidiaoInfo = '上传失败'
      }
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.openInfo.huidiao = true
        this.openInfo.huidiaoInfo = '上传图标只能是 JPG/PNG 格式！'
      }
      if (!isLt2M) {
        this.openInfo.huidiao = true
        this.openInfo.huidiaoInfo = '上传图标大小不能超过 2MB！'
      }
      return isJPG && isLt2M
    },
    iframeCallback (arr) {
      if (arr.length) {
        let row = arr[arr.length - 1]
        console.log(row)
        this.addPersonObj = row
        this.$forceUpdate()
      }
    },
    adddialogclick () {
      if (this.addPersonObj) {
        if (this.addPersonObj.id === this.checkloop.data.id) {
          this.openInfo.huidiao = true
          this.openInfo.huidiaoInfo = '不能将 ' + this.addPersonObj.name + ' 设置为内链，原因：自身不能成为自身的内链'
          return
        }
        this.$confirm('确定将 ' + this.addPersonObj.name + ' 添加为 ' + this.checkloop.data.name + ' 的内链吗？确定后点击保存按钮提交', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal: false,
          customClass: 'appbtnroval'
        }).then(() => {
          this.checkloop.data.redirect = this.addPersonObj.id
          this.dialogTable = false
        }).catch(() => { })
      } else {
        this.dialogTable = false
      }
    },
    clearRedirect () {
      if (!this.checkloop.data.redirect) return
      this.$confirm('确定移除 ' + this.checkloop.data.name + ' 的内链吗？确定后点击保存按钮提交', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        customClass: 'appbtnroval'
      }).then(() => {
        this.checkloop.data.redirect = ''
      }).catch(() => { })
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree2.filter(val)
    },
    itemList (val) {
      this.jsonloop = [{
        'id': null,
        'root': true,
        'name': '全部',
        'docId': null,
        'status': 0,
        'childMenus': val
      }]
      this.alljsonloop = [{
        'id': null,
        'root': true,
        'name': '全部',
        'docId': null,
        'status': 0,
        'childMenus': val
      }]
      // 一级目录数据  默认打开一级目录的数据
      this.jsonloop[0].childMenus.forEach(m => {
        this.idArr.push(m.id)
      })
    },
    addressList (val) {
      this.options = val
      if (val[0]){
        this.docListPoint = val[0].label
        this.showChange(val[0].value)
      }
    }
  }
}
</script>
