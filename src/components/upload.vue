<template>
	<!-- <div @click="init" class="init"></div> -->
		<div>
			<i class="el-icon-plus avatar-uploader-icon init" id="video-upload-btn" @click="init" v-if="showType==1">
				<span class="upload-i">{{message}}</span>

			</i>
			<!-- <i class="el-icon-plus avatar-uploader-icon init" id="video-upload-btn" @click="test" v-if="isCompleted"> -->
				<!-- <span class="upload-i">{{message}}</span> -->
				<!-- <span class="tip">您还未完后上传</span> -->
			<!-- </i> -->
			<el-button type="primary" size="small" @click="init" v-if="showType==2">{{message}}</el-button>
			<!-- <div class="local-upload" v-if="showType==3" @drop="dorpTest" @click="init">
		    	<i class="el-icon-upload"></i>
				<div class="el-upload__text">将文件拖到此处，或<span>点击上传</span></div>
				<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
		    </div> -->
		</div>
	
</template>
<script>
//注意： showType 指的是上传的ul以及功能的方式   by cheng//2017.11.24
//showType ：1，方形上传  2，按钮上传 3， 拖拽上传


	//接口地址  by  cheng
	const ad_refact_urls = {
		test: "http://test.net/",  //测试服
		pre: "http://pre.com/",  //预发
		line: "http://online.com/"   //线上
	};
	const ad_refact_url = ad_refact_urls.test;
	let _btn,  //按钮
		_showTip, //展示提示方法
		_file, //file控件
		_shardSize = 5 * 1024 * 1024, //每个碎片大小
		_shardCount, //总碎片数量
		_async = 1,       //同时上传的碎片数
		_token = null,      //上传Token
		_stats,       //其他参数
		_succeed = 0,
		_errored = 0,
		_abort = false;
		
	var _fileName,  //上传的文件名称
		_fileObj, //上传文件
		_fileSize, //文件大小
		_fileForms, //分片后要上传的数据包
		_allowExts = null, //允许上传的文件格式
		_upNum = 0; //已经进入上传队列的数目

	var _upUrl;
	var _this;
	var uploadId;
	var objectKey;
	var fileExt;
	var initPartStrTest = ad_refact_url + 'upload/initpart';
	var uploadurlTest = ad_refact_url + 'upload/competepart';
	var partList = new Array();


	export default {
	    name: 'Upload',
	  	props: ["message", "showButton", "disabled", "showType"],
	    mounted() {
	      // const _this = this;
	      // this.editor = UE.getEditor('editor', this.config); // 初始化UE
	      // this.editor.addListener("ready",
	      // function() {
	      //   _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
	      // });
	    },
	    data(){
	    	return { 
	    		isCompleted: false
	    	}
	    },
	    methods: {
	    	dorpTest(){
	    		this.sliceFile()
	    	},
	      	init(){
	      		var that = this;
				var fileid = 'upfile-'+parseInt(Math.random()*100000);
				_file = document.createElement('input');
				_file.type = 'file';
				_file.id = fileid;
				_file.name = fileid;
				_file.style.display = 'none';

				_file.click();
				_file.onchange = function(){ that.sliceFile()};
				
			},

			sliceFile(){
				partList = [];
	      		var upUrl = ad_refact_url + 'upload/uploadpart';
	    		var config = {exts:'zip|jpg|png|jpeg|apk|sql|bin|conf|dmg|mp4'};
				_this = this;
				_succeed = 0;
				_showTip = null;
				_shardSize = 2 * 1024 * 1024;
				_async = 1;
				_token = null;
				_stats = null;
				_upNum = 0;
				var that = this;
				//_btn = document.getElementById(btn);
				_upUrl = upUrl;
				if(typeof(config) == 'object'){
					if(typeof(config.callback) == 'function'){
						_showTip = config.callback;
					}
					if(typeof(config.chunk) == 'number'){
						_shardSize = config.chunk;
					}
					if(typeof(config.async) == 'number'){
						_async = config.async;
					}
					if(typeof(config.token) == 'string'){
						_token = config.token;
					}
					if(typeof(config.parame) == 'object'){
						_stats = config.parame;
					}
					if(typeof(config.exts) == 'string'){
						_allowExts = config.exts.toUpperCase();
					}
				}
				_succeed = 0;
				_errored = 0;
				_abort = false;
				_upNum = 0;
				var fileName = _file.value;
				var ldot = fileName.lastIndexOf(".");
	  			fileExt = fileName.substring(ldot + 1);
				fileExt = fileExt.toUpperCase();
				if(_allowExts){
					var exts = _allowExts.split('|');
					var isValid = false;
					for (var i = 0; i < exts.length; i++) {
						if(exts[i] == fileExt){
							isValid = true;
						}
					};
					if(!isValid){
						this.showTip('文件格式错误！','error');
						return;
					}
				};
				this.showTip('文件准备中...','notice');
				_fileObj = _file.files[0],  //文件对象
				_fileSize = _fileObj.size;
			    _shardCount = Math.ceil(_fileSize / _shardSize);  //总片数
			    _fileName = parseInt(Math.random()*100000)+_fileObj.name;
			    // console.log(_fileName)
			    var lastFileName;
			    for(var i=0; i<_fileName.length; i++){
			    	if (_fileName[i]==='.') {
			    		// console.log(i)
			    		lastFileName = _fileName.substring(i+1, _fileName.length)
			    	}
			    }
			    sessionStorage.setItem('lastFileName', lastFileName)

			    this.showTip('文件准备上传','notice');
	            this.timedGetText(initPartStrTest, 5000, function(res){
	            	res=JSON.parse(res);
	                if(res.code==0){
	                	// console.log(res.data);
	                    uploadId=res.data.uploadId;
	                    objectKey=res.data.objectKey;
	                    // console.log(objectKey)
	                    var forms = new Array();

	                    for(var i = 0;i < _shardCount; ++i){
	                        //计算每一片的起始与结束位置
	                        var form = _this.setForm(i);
	                        var formObj = {
	                            status:0,
	                            form:form
	                        };
	                        forms.push(formObj);
	                    }
	                    _fileForms = forms;
	                   _this.upFile();

	                }
	            });
	            // _this.upFile();

	        },

			setForm(num){
				var start = num * _shardSize,
				end = Math.min(_fileSize, start + _shardSize);

				var form = new FormData();
				form.append("file", _fileObj.slice(start,end));  //slice方法用于切出文件的一部分
	            form.append("length", end-start);
	            form.append("count", _shardCount);
	            form.append("fileName", _fileName);
	            // form.append("length", _shardSize);
			    form.append("offset", start);
			    form.append("partNumber", num+1);        //当前是第几片
	            form.append('projectName','mos');
	            form.append('bucketName','datu-ad');
	            form.append('moduleName','api');
	            form.append("uploadId", uploadId);
	            form.append("objectKey", objectKey);

	            //如果传入了Token，则设置Token
			    if(_token != null){
			    	form.append('shard-token',_token);
				}
				//如果传入了其他参数
				if(_stats != null){
					for(var stat in _stats){
						form.append(stat,_stats[stat]);
					}
				}
				return form;
			},
			upFile(){
				if(_errored>0 || _abort) return
	            for(var j=0;j<_fileForms.length;j++){
	                if(_upNum < _async){
	                    if(_fileForms[j].status == 0){
	                        _fileForms[j].status = 1;
	                        _upNum ++;
	                        this.ajaxUp(_fileForms[j]);                        
	                        break;
	                    }
	                }else{
	                    break;
	                }
	            }
			},
			timedGetText( url, time, callback ){ //发送http请求
			    var request = new XMLHttpRequest();
			    var timeout = false;
			    var timer = setTimeout( function(){
			        timeout = true;
			        request.abort();
			    }, time );
			    request.open( "post", url );
			    request.onreadystatechange = function(){
			        if( request.readyState !== 4 ) return;
			        if( timeout ) return;
			        clearTimeout( timer );
			        if( request.status === 200 ){
			            callback( request.responseText );
			        }
			    }
			    // var postData = {"projectName":"aa","bucketName":"bb","moduleName":"cc","extension":"dd"};
	            var postData = new FormData();
	            postData.append('projectName','mos');
	            postData.append('bucketName','datu-ad');
	            postData.append('moduleName','api');
	            postData.append('extension', sessionStorage.getItem('lastFileName'));
	            // var postData="projectName=aa&bucketName=b&moduleName=cc&extension=dd";
				//这里需要将json数据转成post能够进行提交的字符串  name1=value1&name2=value2格式

			    request.send( postData );
			},
			ajaxUp(formObject){
				// console.log(formObject);
				var form = formObject.form;
				// console.log(form);
				// console.log(uploadId);
				var that = this;
				var xhr = this.createXMLHttpRequest();
				xhr.upload.addEventListener("progress", uploadProgress(), false);
			    xhr.addEventListener("load", uploadComplete, false);
			    xhr.addEventListener("error", uploadFailed, false);
			    xhr.addEventListener("abort", uploadCanceled, false);
			    xhr.open("POST",_upUrl,true);
			    xhr.send(form);
			    xhr.onreadystatechange = function () {
	                if(xhr.readyState == 4){
	                    if(xhr.status == 200){
	                        var responseText = JSON.parse(xhr.responseText);
	                         // console.log(responseText);
	                        // console.log(responseText.data.etag);
	                        if (responseText.code == 0) {
	                        	// var item = new Array();
	                            // item['partNumber'] = responseText.data.partNumber;
	                            // item['etag'] = responseText.data.etag;
	                            // partList.push(item);
	                            partList.push(responseText.data);
							}
	                    }
	                }
	            }
	            var myXHR = this.createXMLHttpRequest;
	            var __this = this;//vue组件对象
			    function uploadComplete(){
		            _succeed++;
					_upNum--;
					if(_succeed == _shardCount){
		            	//TODO  全部上传完成
		            	_this.showTip(100,'process');
		            	_this.showTip('正在合并文件','merge');
		            	var merge_xhr = myXHR();
		            	merge_xhr.onreadystatechange = function(){
		            		if(merge_xhr.readyState == 4){
	        					if(merge_xhr.status == 200){
	        						_this.showTip(merge_xhr.responseText,'success');
		            				_file.value = '';
		            				__this.$emit('myResponse',merge_xhr.responseText); //true表示上传成功
	        					}
	        				}
		            	}
	                    partList = partList.join(' ');
	                    _upUrl = uploadurlTest;
		            	merge_xhr.open('POST',_upUrl,true);
		            	var mergeForm = new FormData();
	                    mergeForm.append('bucketName','datu-ad');
	                    mergeForm.append('count',_shardCount);
	                    mergeForm.append("fileName", _fileName);
	                    mergeForm.append("uploadId", uploadId);
	                    mergeForm.append("objectKey", objectKey);
	                    mergeForm.append("partList", partList);
		            	merge_xhr.send(mergeForm);
		            }else{
		            	_this.showTip(parseInt(_succeed/_shardCount*100),'process');
		            	_this.upFile(partList);
		            }
		            // console.log(partList)
				};
				function uploadFailed(){
					this.showTip('上传出错','failed');
					_errored++;
				};
				function uploadCanceled(){
					this.showTip('上传终止','cancel');
					_abort = true;
				};
				function uploadProgress(ev){
					/*
					var percent = 0;
		            if(ev.lengthComputable) {
		                percent = 100 * ev.loaded/ev.total;
		            }
		            */
				};

			},
			showTip(tip,flag){
				if(flag == 'success' || flag == 'failed' || flag == 'error' || flag == 'cancel'){
					//_btn.disabled = false;
				}
				if(_showTip != null){
					_showTip(_fileObj,tip,flag);
				}else{
					this.tipDisplay(tip,flag)
				}
			},

			tipDisplay(tip,flag){
				if(!document.getElementById(_file.id+'-tip')) {
					this.createTipDiv();
				}
				var tipDiv = document.getElementById(_file.id+'-tip');
				tipDiv.style.display = 'block';
				if(flag == 'notice'){
					tipDiv.firstChild.innerHTML = tip;
				}else if(flag == 'process'){
					document.getElementById(_file.id+'-process-bg').style.display = 'block';
					tipDiv.firstChild.innerHTML = '已完成：'+tip+'%';
					document.getElementById(_file.id+'-process').style.width = tip+'%';
				}else if(flag == 'success'){
					document.getElementById(_file.id+'-process').style.width = '100%';
					tipDiv.firstChild.innerHTML = '上传成功';
					// if(_btn.getAttribute('data-shardUpload')){
					// 	var eid = _btn.getAttribute('data-shardUpload');
					// 	document.getElementById(eid).value = tip;
					// }
					setTimeout(function(){tipDiv.style.display = 'none';},2000);
				}else{
					tipDiv.firstChild.innerHTML = tip;
					document.getElementById(_file.id+'-process-bg').style.display = 'none';
				}
			},
			createTipDiv(){
				var tipDiv = document.createElement('DIV');
					tipDiv.style.position = 'fixed';
					tipDiv.style.right='0';
					tipDiv.style.bottom = '0';
					tipDiv.style.width = '200px';
					tipDiv.style.padding = '10px';
					tipDiv.style.backgroundColor = '#fff';
					tipDiv.style.border = '1px solid #dedede';
					tipDiv.id = _file.id+'-tip';
					tipDiv.style.position = 'fixed';
					tipDiv.style.zIndex = '10001';
					tipDiv.style.right = '100px';
					tipDiv.style.bottom = '100px';
					//TODO 设置className
				var tipHTML = '<div style="text-align:center;margin-bottom:5px;font-size:14px"></div><div style="width:100%;height:20px;background-color:#dedede;border-radius:20px;overflow:hidden" id="'+_file.id+'-process-bg"><span style="display:block;background-color:green;height:20px;width:0px;float:left" id="'+_file.id+'-process"></span></div>';
					tipDiv.innerHTML = tipHTML;
				document.body.appendChild(tipDiv);
			},
			createXMLHttpRequest() {
		    	var XMLHttpReq;
			    try {
			        XMLHttpReq = new ActiveXObject("Msxml2.XMLHTTP");//IE高版本创建XMLHTTP
			    }
			    catch(E) {
			        try {
			            XMLHttpReq = new ActiveXObject("Microsoft.XMLHTTP");//IE低版本创建XMLHTTP
			        }
			        catch(E) {
			            XMLHttpReq = new XMLHttpRequest();//兼容非IE浏览器，直接创建XMLHTTP对象
			        }
			    }
			    return XMLHttpReq;
			}

		}

  	}
</script>
<style scoped>
	.el-icon-upload{
		font-size: 67px;
	    color: #97a8be;
	    margin: 40px 0 16px;
	    line-height: 50px;
	}	
	.el-upload__text{
		color: #97a8be;
	    font-size: 14px;
	    text-align: center
	}
	.el-upload__text span{
		color:#20a0ff;
	}
	.local-upload{
		width: 100%;
		height: 300px;
		background-color: #fff;
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		box-sizing: border-box;
		
		text-align: center;
		cursor: pointer;
		position: relative;
		overflow: hidden;

		border-radius: 5px;
	}
	.local-upload:hover{
		border: 1px dashed rgba(32, 160, 255, 0.52);
	}
	.init{
		font-size: 28px;
	    color: #8c939d;
	    width: 178px;
	    height: 178px;
	    line-height: 178px;
	    text-align: center;
	    border: 1px dashed #999;
	    cursor: pointer;
	    position: relative;
	}
	.upload-i{
		font-size: 12px !important;
	}
	.init:hover{
		border: 1px dashed rgba(32, 160, 255, 0.52);
	}
	
</style>