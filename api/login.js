import request from '@/utils/request'
import { removeToken } from '@/utils/auth'

const userMap = {
  admin: {
    roles: ['admin'],
    token: 'admin',
    introduction: '我是管理员',
    avatar: require('../assets/pandabus.png'),
    name: '管理员'
  },
  editor: {
    roles: ['editor'],
    token: 'editor',
    introduction: '我是运营',
    avatar: require('../assets/pandabus.png'),
    name: '运营人员'
  }
}

export function loginByUsername(mobile, password) {
  const data = {
    userName:mobile,
    password
  };
  return request(
    {
      url: '/ads-op/pub/login',
      method: 'post',
      data
    })
}

export function logout() {
  removeToken();
  const hostStr = window.location.host;
  let uriStr = "https://dev-sso.deepblueai.com";
  if(hostStr){
    if(hostStr.toLowerCase().startsWith("localhost")){
      uriStr = "https://dev-sso.deepblueai.com";
    }else if(hostStr.toLowerCase().startsWith("dev-")){
      uriStr = "https://dev-sso.deepblueai.com";
    }else if(hostStr.toLowerCase().startsWith("test-")){
      uriStr = "https://test-sso.deepblueai.com";
    }else if(hostStr.toLowerCase().startsWith("uat-")){
      uriStr = "https://uat-sso.deepblueai.com";
    }else{
      uriStr = "https://sso.deepblueai.com";
    }
  }
  window.location.href = `${uriStr}/api/auth/login?redirect_to=${location.protocol}//${location.host}/${location.hash}`;
}

export function getUserInfo() {
  return request({
    url:"/ads-op/home/init",
    // method: 'post',
    method: 'get',
  }).then(response=>{
    const data2 = response.data;
    return new Promise((resolve,reject)=>{
      if(data2.success){
        const userInfoType = data2.data.userInfoType;
        if(userInfoType == "ADMIN"){
          const tmpdata = userMap["admin"]
          resolve({data:tmpdata})
        }
        else if(userInfoType == "OP"){
          const tmpdata = userMap["editor"]
          resolve({data:tmpdata})
        }else {
          reject();
        }
      }else{
        reject()
      }
    })
  })
  // return new Promise((resolve,reject)=>{
  //      if (userMap[token]) {
  //       const data = userMap[token]
  //       resolve({data})
  //     } else {
  //       reject()
  //     }
  // })
}

