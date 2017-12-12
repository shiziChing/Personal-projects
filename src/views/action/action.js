
// import * as type from '@/vuex/mutation-types-oa.js'
import { setMsg } from '@/api/tools'
import axios from 'axios'
import config from '@/api/config/config'
// console.log(setMsgFn)
//审核管理---注册审核列表

export const getRegisterAudit = (formData,page,callback) => {
  axios.post( 'http://my.datuhongan.com/oa/machine/show-all-channel-log?page='+page,formData,config).then(res => {

    let data = res.data;
    if (data.code===0) {
        JS_VUE.$store.dispatch('getMineBaseApi',data);
        callback(setMsg(true,data.msg,0,data.data))
    }else {
        callback(setMsg(false, data.msg,data.code,data.data))
    }
  }).catch(err => {
    console.log(err)
  })
}

//示例-登陆

// export const logns = ({ dispatch, state },fromData,flag,callback) => {

//   axios.post('/user/login',fromData,config).then(function(res){
//     let data = res.data;
//     if (data.code===0) {

//       dispatch(type.SET_SLIBER,'')
//       callback(setMsg(true,data.msg,0,data.data))

//     }else {
//         callback(setMsg(false, data.msg,data.code,data.data))
//     }
//   }).catch(err => {
//     console.log(err)
//   })

// }
export const getRoleList = (callback) => {
  axios.post('http://ms.datudev.net/common/user_role/get_list', {}, config).then(res => {
    let data = res.data;
    if (data.code===0) {
        callback(setMsg(true,data.msg,0,data.data))
    }else {
        callback(setMsg(false, data.msg,data.code,data.data))
    }
  }).catch(err => {
    console.log(err)
  })
}

//审核类型列表--审核模块会使用到
export const getReviewStatus = (callback) => {
  axios.post('http://ms.datudev.net/common/audit_type/get_list', {}, config).then(res => {
    let data = res.data;
    if (data.code===0) {
        //dispatch(type.SET_TABLE_LIST,data.data)
        callback(setMsg(true,data.msg,0,data.data))
    }else {
        callback(setMsg(false, data.msg,data.code,data.data))
    }
  }).catch(err => {
    console.log(err)
  })
}
//审核管理---查看未通过信息

export const getRefuseData = (formData,callback) => {
  axios.post('http://ms.datudev.net/admin/audit/get_reg_refuse_reason',formData,config).then(res => {
    let data = res.data;
    if (data.code===0) {
        //dispatch(type.SHOW_DETAIL,data.data)
        callback(setMsg(true,data.msg,0,data.data))
    }else {
        callback(setMsg(false, data.msg,data.code,data.data))
    }
  }).catch(err => {
    console.log(err)
  })
}
//审核管理---注册审核--批量通过或者拒绝单独通过或者拒绝用的都是一个接口

export const throughReview = (formData,callback) => {
  axios.post('http://ms.datudev.net/admin/audit/reg_audit',formData,config).then(res => {
    let data = res.data;
    if (data.code===0) {

        callback(setMsg(true,data.msg,0,data.data))
    }else {
        callback(setMsg(false, data.msg,data.code,data.data))
    }
  }).catch(err => {
    console.log(err)
  })
}
