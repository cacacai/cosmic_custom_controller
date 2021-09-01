import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new  Vuex.Store({
  state: {
      pageId: null,
      invoke: null,
      fileServer: null,
      list: [],
      addressList: [],
      nodeData: null,
      docId: null,
      docContent: null
  },
  mutations: {
    UPDATE_ALL_DATA (state, props) {
        const data = props.data
        if (data && data.eventName){
            switch (data.eventName) {
                case 'list':
                case 'editOrder':
                    state.list= data.data
                    break
                case 'addressList':
                    state.addressList = data.data
                    break
                case 'addNode':
                    state.nodeData = data.data
                    break
                case 'addDocument':
                case 'updateDocument':
                    state.docId = data.data.id
                    break
                case 'getDocument':
                    state.docContent = data.data
                    break
                // 前后端同时修改数据，没有回调数据更新。
                case 'updateById':
                case 'updateStatus':
                    break
            }

        }
      //console.log('change Data, ', props)
      //state.ganttData = Object.assign([], props.data)
    },
    INIT_DATA (state, pageId) {
        state.pageId = pageId
        state.invoke = window.kdinvokes[pageId].invoke
        state.fileServer = window.kdinvokes[pageId].fileServer
    }
  },
  getters: {
      fileServer: state => state.fileServer,
      itemList: (state) => {
        return state.list
      },
      addressList: (state) => {
        return state.addressList
      },
      nodeData: (state) => {
          return state.nodeData
      },
      newDocId: state => state.docId,
      docContent: state => state.docContent
  },
  actions: {
      addressListGet:({ // 获取所有文档列表
                       rootState
                   }, obj) => {
          return rootState.invoke('addressList', obj)
      },
    docMenuItemAdminGet: ({ // 获取所有文档列表
                            rootState
                          }, obj) => {
        return rootState.invoke('list', obj)
    },
    docMenuItemAdd: ({ // json树 新增
                       rootState
                     }, obj) => {
        return rootState.invoke('addNode', obj)
    },
    docMenuItemPut: ({ // json树 修改树
                       rootState
                     }, obj) => {
        return rootState.invoke('updateById', obj)
    },
    docMenuItemOrderPut: ({ // json树 修改树顺序
                            rootState
                          }, obj) => {
        return rootState.invoke('editOrder', obj)
    },
    docMenuItemPatch: ({ // json树 修改状态 0：启用，1：禁用，2：删除
                         rootState
                       }, obj) => {
        return rootState.invoke('updateStatus', obj)
    },
    docMenuItemDelete: ({ // json树 删除树 暂时没有对应的处理事件，通过修改状态处理
                          rootState
                        }, obj) => {
        return rootState.invoke('deleteById', obj)
    },
    documentPost: ({ // 提交文档
                     rootState
                   }, obj) => {
        return rootState.invoke('addDocument', obj)
    },
    documentGet: ({ // 获取文档
                    rootState
                  }, obj) => {
        return rootState.invoke('getDocument', obj)
    },
    documentPut: ({ // 提交文档
                    rootState
                  }, obj) => {
        return rootState.invoke('updateDocument', obj)
    },
    editAddress: ({ // json树 修改位置
                    rootState
                  }, obj) => {
        return rootState.invoke('editAddress', obj)
    },
    docMenuItemAvatar: ({ // json树 新增
                          rootState
                        }, obj) => {
        return rootState.invoke('avatar', obj)
    }
  }
})

