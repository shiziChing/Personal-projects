<template>
	<el-row class="container">
		<el-col :span="24" class="header">
			<el-col :span="4" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
				{{collapsed?'':sysName}}
			</el-col>
			<el-col :span="1">
				<div class="tools" @click.prevent="collapse">
					<i class="fa icomoon-node"></i>
				</div>
			</el-col>
			<el-col :span="17">
				<div>
					<!-- <ul>
						<li :class="{'active':isSelect,'nav-top':true}" v-for="item in $router.options.routes" v-if="!item.hidden" @click="selected(item)">{{item.name}}</li>
					</ul> -->
					<el-menu :default-active="activeIndex" class="" mode="horizontal" @select="handleSelect" router>
  						<el-menu-item :router='true' v-for="(item, index) in $router.options.routes" :index="index"
							:key="item.path" v-if="!item.hidden" class="title"><i :class="item.iconCls"></i>{{item.name}}</el-menu-item>
  					</el-menu>
				</div>
			</el-col>
			<el-col :span="2" class="userinfo">
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner"><img :src="sysUserAvatar" /> {{sysUserName}}</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>我的消息</el-dropdown-item>
						<el-dropdown-item>设置</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
		<el-col :span="24" class="main">
			<aside :class="collapsed?'menu-collapsed':'menu-expanded'">
				<!--导航菜单-->
				<el-menu :default-active="0" :class="collapsed?'hou':'qian'" @open="handleopen" @close="handleclose" @select="handleselect1"
					 unique-opened router v-show="!collapsed">
					<template v-for="(item,index) in childrenRouter" v-if="!item.hidden">
						<!-- <el-submenu :index="index+''" v-if="!item.leaf">
							<template slot="title">{{item.name}}</template>
							<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
						</el-submenu> -->
						<el-menu-item :index="item.path" :key="item.path" class="mouseover" v-if="item.leaf" :class="$route.path==item.path?'now-node':''"
						 style="background-color: #eef1f6;color: #48576a; "> <i :class="item.iconCls"></i>{{item.name}}</el-menu-item>

						<el-submenu :index="index" v-if="!item.leaf" :key="item.leaf">
					        <template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
					        <el-menu-item-group v-for="child in item.children" :key="child.path">
					          <li class="line-son" @click="$router.push(child.path)"  :class="$route.path==child.path?'now-node':''"><i :class="child.iconCls"></i>{{child.name}}</li>

					        </el-menu-item-group>

					     </el-submenu>

						<!-- <el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>   el-menu-item is-active   :class="$route.path==item.path?'now-node':''"-->
					</template>
				</el-menu>
				<!--导航菜单-折叠后-->
				<ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
					<li v-for="(item,index) in childrenRouter" v-if="!item.hidden" class="el-submenu item" :key="item">
						<template v-if="!item.leaf">
							<div class="el-submenu__title" :class="$route.path==item.path?'now-node':''" style="padding-left: 20px;"
							@mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i :class="item.iconCls"></i></div>
							<ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
								<li v-for="child in item.children" :class="$route.path==child.path?'now-node':''" :key="child.path"
								class="el-menu-item sons" style="padding-left: 40px;" @click="$router.push(child.path)">{{child.name}}</li>
							</ul>
						</template>
						<template v-else>
							<li class="el-submenu">
								<div class="el-submenu__title el-menu-item lone" :class="$route.path==item.path?'now-node':''"
								style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;" @click="$router.push(item.path)"><i :class="item.iconCls"></i></div>
							</li>
						</template>
					</li>
				</ul>
			</aside>
			<section class="content-container">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="breadcrumb-container">
						<!-- <strong class="title">{{$route.name}}</strong> -->

						<el-breadcrumb separator="/" class="breadcrumb-inner">
							<i class="icomoon-home2 fl"></i>
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
	</el-row>
</template>

<script>
	import { mapGetters } from 'vuex';
	export default {
		mounted() {
			var user = sessionStorage.getItem('user');
			if (user) {
				user = JSON.parse(user);
				this.sysUserName = user.name || '';
				this.sysUserAvatar = user.avatar || '';
			}
			this.childrenRouter = JSON.parse(sessionStorage.getItem('router'));
			var keyValue = sessionStorage.getItem('key');
		    this.activeIndex = keyValue==null?2:keyValue;
			console.log(this.getMineBaseMsg)
		},
		created() {
			// this.$store.dispatch('getMineBaseApi');
			console.log(this)
		},
		computed: {
			...mapGetters([
				'getMineBaseMsg'
			])
		},
		data() {
			return {
				sysName:'逍遥',
				collapsed:false,
				sysUserName: '',
				sysUserAvatar: '',
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				},
				isSelect:false,
				activeIndex:2,
				childrenRouter:[]
			}
		},
		methods: {
			jump(){
				console.log(1)
			},
			onSubmit() {
				// console.log('submit!');
			},
			handleopen() {
				// console.log(this.collapsed);
			},
			handleclose() {
				//console.log('handleclose');
			},
			handleselect1 (a, b) {
				console.log(a);
				console.log(b);
				console.log(this.$router)
			},
			handleSelect(key, keyPath) {
		        // console.log(key, keyPath)
		        console.log(this.$router)
		        for(var i=0; i < this.$router.options.routes.length; i++){
		        	this.childrenRouter = this.$router.options.routes[key].children;
		        }
		       	sessionStorage.setItem('key', key);

		      },
			selected(event){
				this.isSelect = true;
				console.log(event)
			},
			//退出登录
			logout () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					sessionStorage.removeItem('user');
					sessionStorage.removeItem('key');
					_this.$router.push('/login');
				}).catch(() => {

				});


			},
			//折叠导航栏
			collapse:function(){
				this.collapsed=!this.collapsed;
				// console.log(this.$router.options.routes)
			},
			showMenu(i,status){
				this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
			}
		}


	}

</script>

<style scoped lang="scss">
	.mouseover:hover{
		background-color: rgba(102,102,102,0.15)!important;
	}
	.fl{
		float: left;
	}

	.line-son:hover{
		background-color: rgba(102,102,102,0.15)!important;
	}
	.title{
		color: #fff;
	}
	.title:hover{
		background-color: #d3f5ef;
	}
	.el-menu-item{
		margin-bottom: 0 !important;
		border-bottom: 0 !important;
	}
	.sons{
		height: 56px;
		line-height: 56px;
	}
	.line-son{
		padding: 0 20px 0 46px;
	}
	.lone{
		min-width: 0;
	}
	.el-col-14{
		background-color: #fff;
	}
	i{
		margin-right: 10px;
		vertical-align: middle;
	}
	.nav-top{
		float: left;
		margin-right: 10px;
		cursor: pointer;

	}

	.el-menu-item{
		margin-bottom: 0;
		padding-bottom: 0;
	}
	.el-menu--horizontal{
		background-color: #20a0ff;
	}
	.is-active{
		background-color: #8ec8e2;
	    color: #fff;
	    border-radius: 4px;
	}
	.now-node{
		background-color: rgba(102,102,102,0.42)!important;
	    color: #fff!important;
	    border-radius: 4px;
	}
	.flag{
		background-color: #eef1f6!important;color: #48576a;

	}
	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.header {
			height: 60px;
			line-height: 60px;
			background: #20a0ff;
			color:#fff;
			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					color:#fff;
					img {
						width: 40px;
						height: 40px;
						border-radius: 20px;
						margin: 10px 0px 10px 10px;
						float: right;
					}
				}
			}
			.logo {
				//width:230px;
				height:60px;
				font-size: 22px;
				padding-left:20px;
				padding-right:20px;
				border-color: rgba(238,241,146,0.3);
				border-right-width: 1px;
				border-right-style: solid;
				img {
					width: 40px;
					float: left;
					margin: 10px 10px 10px 18px;
				}
				.txt {
					color:#fff;
				}
			}
			.logo-width{
				width:230px;
				transition: all 0.5s;
			}
			.logo-collapse-width{
				width:60px;
				transition: all 0.5s;
			}
			.tools{
				padding: 0px 23px;
				width:14px;
				height: 60px;
				line-height: 60px;
				cursor: pointer;
			}
		}
		.active{
			    background-color: #5c90d2;
			    color: #fff;
			    border-radius: 4px;
			}
		.main {
			display: flex;
			// background: #324057;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;
			aside {
				flex:0 0 230px;
				width: 230px;
				// position: absolute;
				// top: 0px;
				// bottom: 0px;
				.el-menu{
					height: 100%;
				}
				.qian{
					width: auto!important;
					overflow: auto!important;
					transition: all 0.5s;
				}
				.collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
					}

				}
			}
			.menu-collapsed{
				flex:0 0 60px;
				width: 60px;
			}
			.menu-expanded{
				flex:0 0 230px;
				width: 230px;
			}
			.content-container {
				/*// background: #f1f2f7;*/
				flex:1;

				overflow-y: scroll;
				padding: 20px;
				.breadcrumb-container {
					height: 90px;
					font-size: 14px;
					/*line-height: 90px;*/
					background-color: rgba(204,204,204,0.13);

					.title {
						width: 200px;
						float: left;
						color: #475669;
					}
					.breadcrumb-inner {
						float: left;
					}
				}
				.content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
				}
			}
		}
	}
</style>
