<template>
	<div>
	<!-- 条件筛选 -->
		<el-form label-width="140px">
			  <el-form-item label="请选择筛选条件：">
			    	<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
				    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
				      <el-checkbox v-for="city in screenings" :label="city" :key="city">{{city}}</el-checkbox>
				    </el-checkbox-group>
			  </el-form-item>
		</el-form>

		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
			<!-- 渠道接口 -->

				<!-- 渠道部分 -->
				<el-form-item class="agent" v-if="checkedCities.indexOf('渠道筛选')!=-1">
					<!-- <item :isShowAll="false" :model="model" @channelId='getcid'></item> -->
					<span>渠道</span>
				</el-form-item>

				<el-form-item v-if="checkedCities.indexOf('身份筛选')!=-1">
					<el-select v-model="role" placeholder="身份选择" multiple clearable @change="roleChange">
						<el-option v-for="item in roleData" :label="item.name" :value="item.id" :key="item.id"></el-option>

  					</el-select>
				</el-form-item>
				<!-- 报警类别接口 -->
				<el-form-item v-if="checkedCities.indexOf('状态筛选')!=-1">
					<el-select v-model="formData.audit_status" placeholder="状态选择" clearable>
						<el-option v-for="item in reviewData" :label="item.name" :value="item.id" :key="item.id"></el-option>

  					</el-select>
				</el-form-item>
				<el-form-item v-if="checkedCities.indexOf('日期筛选')!=-1">
					 <el-date-picker v-model="timeStart" type="date" placeholder="请选择开始日期" @change="startChange"></el-date-picker>
				</el-form-item>
				<el-form-item v-if="checkedCities.indexOf('日期筛选')!=-1">
					 <el-date-picker v-model="timeEnd" type="date" placeholder="请选择结束日期" @change="endChange"></el-date-picker>
				</el-form-item>
				<el-form-item v-if="checkedCities.indexOf('姓名筛选')!=-1">
					<el-input placeholder="请输入姓名" v-model="formData.nickname"></el-input>
				</el-form-item>
				<el-form-item v-if="checkedCities.indexOf('身份证筛选')!=-1">
					<el-input placeholder="请输入身份证号" v-model="formData.idcard"></el-input>
				</el-form-item>
				<el-form-item v-if="checkedCities.indexOf('手机号筛选')!=-1">
					<el-input placeholder="请输入手机号" v-model="formData.phone"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary"  @click="searchFor">搜索</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary"  @click="toReset">重置搜索条件</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary"  @click="allThrough">批量通过</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="allRefused">批量拒绝</el-button>
				</el-form-item>


				<el-form-item class="exportExcel">
					<el-button type="primary" @click="exportExcel">导出</el-button>
				</el-form-item>

			</el-form>
		</el-col>
		<!-- 条件输入部分end -->

		<!-- 信息部分展示start -->
		<el-table :data="tableData" style="width: 100%" v-loading="listLoading" class="tableImg"  @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" :selectable="isSelected"></el-table-column>
			<el-table-column prop="nickname" label="姓名"  show-overflow-tooltip width="120"></el-table-column>
			<el-table-column  prop='phone' label="电话"  show-overflow-tooltip width="120"></el-table-column>
			<el-table-column  prop='role' label="身份"  show-overflow-tooltip width="120"></el-table-column>
			<el-table-column  prop='idcard' label="身份证"  show-overflow-tooltip></el-table-column>
			<el-table-column  prop='reg_time' label="注册时间"  show-overflow-tooltip width="180"></el-table-column>
			<el-table-column  prop='reg_area' label="注册区域"  show-overflow-tooltip width="120"></el-table-column>

			<el-table-column  label="状态"  show-overflow-tooltip :context="_self" inline-template align="center">
				<div>
					<span v-if="row.audit_status==1">未审核</span>
					<span v-if="row.audit_status==2">已通过</span>
					<span v-if="row.audit_status==3">未通过</span>
				</div>
			</el-table-column>
			<el-table-column  label="操作"  show-overflow-tooltip :context="_self" inline-template align="center">
				<div>
					<el-button class="toView" v-if="row.audit_status==3" @click="toView(row.id)">查看</el-button>
					<el-button class="toView" v-if="row.audit_status==1" @click="toRefused(row.id)">拒绝</el-button>
					<el-button v-if="row.audit_status==1" type="primary" @click="toThrough(row.id)">通过</el-button>
				</div>
			</el-table-column>
    	</el-table>
    	<!--工具条底部-->
		<!-- <el-col :span="24" class="toolbar">
			<el-pagination  @current-change="handleCurrentChange" :current-page="currentPage" layout="prev, pager, next, jumper, total" :page-count="number" :total="recordCount">
    		</el-pagination>
		</el-col> -->
		<el-dialog v-model="dialogFormVisible" @close="closeDialog">
			<span slot="title">{{title}}</span>
			<p v-if="(count==0)&&(title!='拒绝')&&(title!='通过')&&(title!='查看')&&(refuseObj.id == '')&&(throughObj.id == '')" class='warn'>您还未选择，请选择！</p>
			<p v-if="title=='批量拒绝'">已经选中<span class='count'>{{count}}</span>条申请记录，确定批量拒绝吗？</p>
			<p v-if="title=='批量拒绝'">请填写拒绝原因</p>
			<p v-if="title=='拒绝'">请填写拒绝原因</p>
			<el-input v-model="textarea" auto-complete="off" type="textarea" v-if="title=='批量拒绝'"></el-input>
			<el-input v-model="textarea" auto-complete="off" type="textarea" v-if="title=='拒绝'"></el-input>
			<p v-if="title=='批量通过'">已经选中<span class='count'>{{count}}</span>条申请记录，确定批量通过吗？</p>

			<p v-if="title=='通过'">已经选中<span class='count'>1</span>条申请记录，确定通过吗？</p>
			<p v-if="title=='查看'">被拒绝原因</p>
			<label v-if="title=='查看'">{{refuseMessage}}</label>
  			<div slot="footer" class="dialog-footer">
    			<el-button @click="dialogFormVisible = false">取 消</el-button>
   				<el-button type="primary" @click="infoSubmit" :disabled="(count==0)&&(title != '拒绝')&&(title != '通过')&&(refuseObj.id == '')&&(throughObj.id == '')?true:false" v-if="title!='查看'">确 定</el-button>
   				<!-- <el-button type="primary" @click="auditFn">取 消</el-button> -->
 			</div>
		</el-dialog>
		<el-dialog title="导出" v-model="exceldialogVisible" size="tiny">
			<span>确定导出吗？</span>
  			<span slot="footer" class="dialog-footer">
    			<el-button @click="exceldialogVisible = false">取 消</el-button>
    			<el-button type="primary" @click="excelSuccess">确 定</el-button>
  			</span>
		</el-dialog>
	</div>
</template>
<script>

	import NProgress from 'nprogress'
	// import Item from '../../../default/common/agent_channel'
	import {getRegisterAudit, getRefuseData, throughReview, getRoleList, getReviewStatus} from "../action/action.js"

	export default{
	
    created () {
           this.getData(1);
           this.getBasic();
        },
    components:{
			// Item
		},
		data(){

				return{
					checkAll: true,//条件筛选的是否全选
			        checkedCities: [],
			        screenings: ['渠道筛选', '身份筛选', '状态筛选', '日期筛选', '姓名筛选', '身份证筛选', '手机号筛选' ],//条件筛选的所以可筛选条件
			        isIndeterminate: true,
			        role:[],
					timeStart:'',
					timeEnd:'',
					input: '',//手机号或者名字
					model:'',//渠道对应信息
					dialogFormVisible: false,
        			textarea:'', //控制弹层
        			title:'', //控制弹出框的标题
        			count:0, //控制批量通过的条数
        			formData:{//获取列表信息的参数对象
        				audit_status:'',
        				role_id:'',
        				channel_id:'',
        				start_date:'',
        				end_date:'',
        				phone:'',
        				nickname:'',
        				idcard:'',
        				excel:0
        			},
        			tableData:[],//用于接受列表数据的变量
        			number:'', //全部的页数
        			recordCount:'',//数据的总条目数
        			refuseMessage:'', //被拒绝原因
        			refuseObj:{id:'',reason:'', audit:''},  //拒绝提交的参数
        			throughObj:{id:'', audit:''}, //通过提交的接口
        			multipleSelection:[],
        			idArr:[],  //批量通过或者批量拒绝的id
        			currentPage:1,
        			listLoading: false,
        			roleData:[],
        			reviewData:[],
        			exceldialogVisible:false, // 导出弹层
        			excelUrl:''

				}
		},
		methods:{
			excelSuccess(){
				window.location.href = this.excelUrl;
				this.exceldialogVisible = false;
				this.formData.excel = 0;
			},
			toReset(){ //重置
				this.formData = {
        				audit_status:'',
        				role_id:'',
        				channel_id:'',
        				start_date:'',
        				end_date:'',
        				phone:'',
        				nickname:'',
        				idcard:'',
        				excel:0
        			}
        		this.role = [];
        		this.timeEnd = '';
        		this.timeStart = '';
        		this.getData(this.currentPage);
			},
			handleCheckAllChange(event) { //筛选条件选择部分
	          this.checkedCities = event.target.checked ? this.screenings : [];
	          this.isIndeterminate = false;

	        },
	        handleCheckedCitiesChange(value) {  //筛选条件选择部分
	          let checkedCount = value.length;
	          this.checkAll = checkedCount === this.screenings.length;
	          this.isIndeterminate = checkedCount > 0 && checkedCount < this.screenings.length;
	        },
			roleChange(val){
				var arr = [];
				val.map(item=>{
					arr.push(item)
				})
				this.formData.role_id = arr;
			},
			startChange(val){
				if (val!=undefined) {
					this.formData.start_date = val.split(' - ')[0].split('-').join('');
				}else{
					this.formData.start_date = '';
				}
			},
			endChange(val){
				if (val!=undefined) {
					this.formData.end_date = val.split(' - ')[0].split('-').join('');
				}else{
					this.formData.end_date = '';
				}
			},
			handleCurrentChange(val){  //分页
				this.currentPage = val;
				this.getData(this.currentPage)
			},
			exportExcel(){
				this.formData.excel = 1;
				this.exceldialogVisible = true;
				getRegisterAudit(this.formData,this.currentPage,(res)=>{

					if (res.success) {
						this.excelUrl = res.data.url;
                    }else{
                    	this.tableData=[];
                        if(res.code=='error'){
                            this.$router.push('/login')
                        }else if(res.code=='404'){
                        	this.$router.push('/404')
                        }else{
                            this.$message.error(res.msg);
                        }
                    }
				})
			},
			allThrough(){  //批量通过
				this.dialogFormVisible = true;
				this.title = '批量通过';

			},
			allRefused(){  //批量拒绝
				this.dialogFormVisible = true;
				this.title = '批量拒绝';
			},
			isSelected(row,index){
				return row.audit_status==1?true:false;
			},
			handleSelectionChange(val) {
        		this.multipleSelection = val;  //切换选择
        		this.count = val.length;
        		var arr=[];
        		this.multipleSelection.forEach(item=>{
        			arr.push(item.id);
        		})
        		this.idArr=arr;
        		if (val=='') {
        			this.idArr = [];
        		}
      		},
			dateChange(val){
				if (val != '') {
					var arr = val.split('-');
					this.formData.reg_time = arr.join('');
				}
			},
			getData(page){   //获取列表
			
				var obj=this.formData;
				// NProgress.start();
				// getRegisterAudit(obj,page,(res)=>{
				// 	if (res.success) {
				// 		// NProgress.done();
				// 		// this.$store.state.common.user_infos = res.data.list;
				// 	this.tableData=res.data.list;
    			// 	this.number=res.data.paginate.page_count;
    			// 	this.recordCount=res.data.paginate.record_count;
    			// 	this.listLoading = false;
				// 	}else{
				// 		this.tableData=[];
				// 		if(res.code=='error'){
				// 			this.$router.push('/login')
				// 		}else if(res.code=='404'){
				// 			this.$router.push('/404')
				// 		}else{
				// 			this.$message.error(res.msg);
				// 		}
				// 	}
				// });
			},
			getBasic(){ //获取基础数据，包括身份筛选数据，状态筛选数据
				// getRoleList((res)=>{
				// 	if (res.success) {
				// 		this.roleData=res.data;
                //     }else{
                //     	this.roleData=[];
                //         if(res.code=='error'){
                //             this.$router.push('/login')
                //         }else if(res.code=='404'){
                //         	this.$router.push('/404')
                //         }else{
                //             this.$message.error(res.msg);
                //         }
                //     }
				// });
				// getReviewStatus((res)=>{
				// 	if (res.success) {
				// 		this.reviewData=res.data;
                //     }else{
                //     	this.reviewData=[];
                //         if(res.code=='error'){
                //             this.$router.push('/login')
                //         }else if(res.code=='404'){
                //         	this.$router.push('/404')
                //         }else{
                //             this.$message.error(res.msg);
                //         }
                //     }
				// })
			},
			getcid(val){//获取渠道信息
				this.formData.channel_id = valid;
			},
			toView(id){
				this.dialogFormVisible = true;
				this.title = '查看';
				var obj = {
					id: id
				}
				NProgress.start();
				getRefuseData(obj,(res)=>{
					if (res.success) {
						NProgress.done();
						this.refuseMessage=res.data.reason;
                    }else{
                    	this.refuseMessage='';
                        if(res.code=='error'){
                            this.$router.push('/login')
                        }else if(res.code=='404'){
                        	this.$router.push('/404')
                        }else{
                            this.$message.error(res.msg);
                        }
                    }
				})

			},
			toRefused(id){//点击拒绝
				this.dialogFormVisible = true;
				this.title = '拒绝';
				this.refuseObj = {
					id: [id],
					reason:this.textarea
				}

			},
			toThrough(id){//点击通过
				this.dialogFormVisible = true;
				this.title = '通过';
				this.throughObj = {
					id: [id]
				}
			},
			closeDialog(){
				this.refuseMessage = '';
			},
			auditFn(obj, message){
				throughReview(obj,(res)=>{
						if (res.success) {
							NProgress.done();
							this.$message({
						          message: message,
						          type: 'success'
						        });
							this.idArr = [];
							this.textarea = '';
						    this.getData(this.currentPage)
                	    }else{
                	    	this.idArr = [];
							this.textarea = '';
                	        if(res.code=='error'){
                	            this.$router.push('/login')
                	        }else if(res.code=='404'){
	                        	this.$router.push('/404')
	                        }else{
                	            this.$message.error(res.msg);
                	        }
                	    }
					})
			},
			infoSubmit(){
				var obj;
				if (this.title == '拒绝') {
					this.refuseObj.reason = this.textarea;
					this.refuseObj.audit = 3;
					obj = this.refuseObj;
					this.auditFn(obj, '成功拒绝！');

				}else if(this.title == '通过'){
					this.throughObj.audit = 2;
					obj = this.throughObj
					this.auditFn(obj, '成功通过！')
				}else if (this.title=='批量通过') {
					obj={
						id: this.idArr,
						audit:2
					}
					this.auditFn(obj, '成功批量通过！')
				}else if (this.title=='批量拒绝') {
					obj={
						id: this.idArr,
						reason: this.textarea,
						audit:3
					}
					this.auditFn(obj, '成功批量拒绝！');
				}
				this.dialogFormVisible = false;
			},
			searchFor(){
			  this.getData(this.currentPage);

			}


		}
	}
</script>
<style scoped>
	p{
		text-align: center;
		font-size: 20px;
		font-weight: 600;
	}
	.count{
		color: green;
		font-size: 30px;
		margin-left: 5px;
		margin-right: 5px;
	}
	.warn{
		font-size: 24px;
		font-weight: 800;
		font-family: "微软雅黑";
		color: red;
	}
	.el-input-group{
		width: 200px;
	}
	.el-form--inline{
		width: 100%;
	}
</style>
