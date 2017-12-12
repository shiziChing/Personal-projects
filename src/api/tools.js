

/**
 * 用函数规定返回的errMsg数据类型
 */
export const setMsg = (state, msg,code,data) => {
	let codes="";
	if(code==300){
		codes='error'
	}else if(code==301){
		codes='404'
	}else{
		codes=code
	}
  return {
    success: state,
    msg: msg,
    code:codes,
    data:data
  }
}

//获取cookie
export const getCookie=(name)=>{
    var v = window.document.cookie.match('(^|;) ?'+name+'=([^;]*)(;|$)');
    return v ? v[2] : null;
}


//设置cookie
export const  cookies=(name,data,times)=>{
    var timestamp2 = new Date();
    if(times){
      timestamp2.setTime(timestamp2.getTime()+times*24*60*60000); //设置date为当前时间+time
      document.cookie=name+"="+data+"; expires="+timestamp2.toGMTString(); //将date赋值给expires
    }else{
      document.cookie=name+"="+data;
    }

}

//为了删除指定名称的cookie，可以将其过期时间设定为一个过去的时间
export const  delCookie=(name)=>{
    var date = new Date();
    date.setTime(date.getTime() - 10000);
    document.cookie = name + "=a; expires=" + date.toGMTString();
}
