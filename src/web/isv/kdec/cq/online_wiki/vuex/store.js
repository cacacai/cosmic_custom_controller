import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new  Vuex.Store({
  state: {
      pageId: null,
      invoke: null,
    openInfo: {
      loginFlag: false,
      videoUrl: null,
      videoImg: null,
      playerFlag: false,
      lookMdContent: '',
      huidiao: false,
      huidiaoInfo: '',
      huidiao2: false,
      huidiaoInfo2: '',
      huidiao3: false,
      huidiaoInfo3: '',
      huidiao4: false,
      huidiaoInfo4: ''
    },
      list: null,
      addressList: null
  },
  mutations: {
    UPDATE_ALL_DATA (state, props) {
        const data = props.data
        if (data && data.eventName){
            switch (data.eventName) {
                case 'list':
                    state.list= data.data
                    break
                case 'addressList':
                    state.addressList = data.data
            }

        }
        // TODO  接收后台数据接口
      //console.log('change Data, ', props)
      //state.ganttData = Object.assign([], props.data)
    },
    INIT_DATA (state, pageId) {
        state.pageId = pageId
        state.invoke = window.kdinvokes[pageId].invoke
    }
  },
  getters: {
    openInfo: (state) => {
        return state.openInfo
    },
      itemList: (state) => {
        return state.list
      },
      addressList: (state) => {
        return state.addressList
      },
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
    docMenuItemDelete: ({ // json树 删除树
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

