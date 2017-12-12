import axios from 'axios'
import config from '@/api/config/config'
export function fetch(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params, config)
            .then(response => {
                alert('Api--ok');
                console.log(response);
                resolve(response.data);
            })
            .catch((error) => {
              console.log(error)
               reject(error)
            })
    })
}

export default {
  // 获取我的页面的后台数据
  mineBaseMsgApi() {
     alert('进入api.js')
    return fetch('http://my.datuhongan.com/oa/machine/show-all-channel-log',{});
  }
}
