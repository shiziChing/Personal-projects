<template>
	<el-form ref="form" :model="form" label-width="80px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
		<el-form-item label="活动名称">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
		<el-form-item label="活动区域">
			<el-select v-model="form.region" placeholder="请选择活动区域">
				<el-option label="区域一" value="shanghai"></el-option>
				<el-option label="区域二" value="beijing"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="活动时间">
			<el-col :span="11">
				<el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
			</el-col>
			<el-col class="line" :span="2">-</el-col>
			<el-col :span="11">
				<el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
			</el-col>
		</el-form-item>
		<el-form-item label="即时配送">
			<el-switch on-text="" off-text="" v-model="form.delivery"></el-switch>
		</el-form-item>
		<el-form-item label="活动性质">
			<el-checkbox-group v-model="form.type">
				<el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
				<el-checkbox label="地推活动" name="type"></el-checkbox>
				<el-checkbox label="线下主题活动" name="type"></el-checkbox>
				<el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
			</el-checkbox-group>
		</el-form-item>
		<el-form-item label="特殊资源">
			<el-radio-group v-model="form.resource">
				<el-radio label="线上品牌商赞助"></el-radio>
				<el-radio label="线下场地免费"></el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item label="活动形式">
			<el-input type="textarea" v-model="form.desc"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="test">立即创建</el-button>
			<el-button @click.native.prevent>取消</el-button>
			<span class="count" @click="count_increase">我点击了：{{count}}下</span>
			<el-button @click="count_increase">增加</el-button>
			<select @change="count_select">
				<option value="1">1</option>
				<option value="2">2</option>
				<option value="3">3</option>
				<option value="4">4</option>
			</select>
			<el-button @click="count_decrease">减少</el-button>
		</el-form-item>
	</el-form>

</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				}
			}
		},
		computed: mapGetters([
    'count'
  	]),
		methods: {
			onSubmit() {
				console.log('submit!');
			},
			test(){
				// console.log(this.count)
				// this.$store.commit('increment')
				console.log(JS_VUE.$store===this.$store)
				console.log(this)
				// this.$store.dispatch('increase')
			},
			count_increase(){
				this.$store.dispatch('increase',"add")
				console.log(this.$store.state.mine.count)
			},
			count_decrease(){
				this.$store.dispatch('increase',"acc")
			},
			count_select(value){
				this.$store.dispatch('selectval',value.target.value)
			}
		}
	}

</script>
<style media="screen" scoped>
	.count{
		width: 20px;
		height: 20px;
	}
</style>
