<template>
    <!-- 版本发布多选的第一第一版vue组件   by cheng-->
    <div>
        <el-row>
            <el-col :span="11">
                <div>
                    <div class="channel-title">选择省、市、网点</div>
                    <div class="show-channel" v-loading="channelDataLoading">
                        <el-tree
                            :data="channelData"
                            show-checkbox
                            node-key="id"
                            :default-expanded-keys="[9999999]"
                            :props="defaultProps"
                            @check-change="selectThis"
                            :check-strictly="false"
                            @current-change="changeTest"
                            ref="trees"
                            highlight-current
                        ></el-tree>
                    </div>
                </div>
            </el-col>
            <el-col :span="2">
                <el-button @click="toLeft">--></el-button>
            </el-col>
            <el-col :span="11">
                <div>
                    <div class="channel-title">
                        已选择
                        <span @click="cancelAll">撤销全部选择</span>
                    </div>
                    <div class="show-channel" v-loading="selectLoading">
                        <el-tree
                            class="show-el-tree"
                            :data="filterData"
                            node-key="node"
                            :props="defaultProps"
                            ref="tree"
                            highlight-current
                            :render-content="renderContent"
                        ></el-tree>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import { getAllChannel, getChildren } from "./actions.js";
export default {
    props: {},
    name: "ChannelMuti",
    created() {
        this.getData();
    },
    data() {
        return {
            tags: [],
            channelDataLoading: true,
            channelData: [
                {
                    id: 9999999,
                    label: "全选",
                    children: []
                }
            ],
            selectLoading: false, //已选择区域的loading
            channelList: [],
            defaultProps: {
                children: "children",
                label: "label"
            },

            filterData: [], //过滤后的数据
            provinceId: [], //过滤后的省
            cityId: [] //过滤后的市
        };
    },
    methods: {
        changeTest(data, node) {
            // console.log(data)
        },
        remove(node, data) {
            //node是点击的当前节点
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.id === data.id);
            children.splice(index, 1);
            if (parent.data.children) {
                if (parent.data.children.length == 0) {
                    //如果父级没有子集的话  父级也需要自动删除
                    let flagIndex;
                    if (parent.data.type == "province") {
                        flagIndex = parent.parent.data.findIndex(
                            d => d.id === parent.data.id
                        );
                        parent.parent.data.splice(flagIndex, 1);
                    } else if (parent.data.type == "city") {
                        flagIndex = parent.parent.data.children.findIndex(
                            d => d.id === parent.data.id
                        );
                        parent.parent.data.children.splice(flagIndex, 1);
                        if (parent.parent.data.children.length == 0) {
                            //如果父级的父级也没有子集
                            flagIndex = parent.parent.parent.data.findIndex(
                                d => d.id === parent.data.id
                            );
                            parent.parent.parent.data.splice(flagIndex, 1);
                        }
                    }
                }
            }
            this.$refs.trees.setChecked(data.id, false, true);
        },
        renderContent(h, { node, data, store }) {
            return (
                <span class="test-span">
                    <span>
                        <span>{node.label}</span>
                    </span>
                    <span>
                        <span
                            class="delete-btn"
                            type="text"
                            on-click={() => this.remove(node, data)}
                        >
                            ×
                        </span>
                    </span>
                    <span style="display: none;"></span>
                </span>
            );
        },
        toLeft() {
            if (this.tags.length == 0) {
                //并未勾选新的数据
                this.$message.error("请先勾选数据！");
                return;
            }
            this.selectLoading = true;
            let arr = [];
            for (var i = 0; i < this.tags.length; i++) {
                if (this.tags[i].type == "province") {
                    this.provinceId.push(this.tags[i].id);
                    arr.push(this.tags[i].id);
                }
            }
            for (var j = 0; j < this.tags.length; j++) {
                if (this.tags[j].type == "city") {
                    this.cityId.push(this.tags[j].id);
                    if (this.provinceId.indexOf(this.tags[j].parentId) == -1) {
                        arr.push(this.tags[j].id);
                    }
                }
            }
            for (var k = 0; k < this.tags.length; k++) {
                if (this.tags[k].type == "point") {
                    if (this.cityId.indexOf(this.tags[k].parentId) == -1) {
                        arr.push(this.tags[k].id);
                    }
                }
            }
            var obj = {
                id: arr.join(","),
                channelLevel: 3
            };
            getChildren(obj, res => {
                if (res.success) {
                    this.filterData = res.data;
                    this.selectLoading = false;
                } else {
                    console.error(res.msg);
                }
            });
            this.$emit("myMultiChannel", this.tags, this.cancelAll);
        },
        cancelAll() {
            this.$refs.trees.setCheckedKeys([]);
            this.filterData = [];
            this.tags = [];
        },
        handleClose(tag) {
            this.tags.splice(this.tags.indexOf(tag), 1);
            this.$refs.tree.setChecked(tag.id, false, false);
        },
        selectThis(val, isSelect) {
            //选中当前节点
            if (isSelect) {
                this.tags.push({
                    children: val.children,
                    id: val.id,
                    label: val.label,
                    parentId: val.parentId,
                    shortName: val.shortName,
                    type: val.type
                });
            } else {
                var _this = this;
                this.tags.map(function(v, i) {
                    if (v.id == val.id) {
                        _this.tags.splice(i, 1);
                        // console.log(val.$treeNodeId)
                        // console.log(_this.$refs.trees.getCurrentNode)
                        // _this.$refs.tree.setChecked(v.id, false, true);
                        // console.log(val)
                        // _this.remove({parent: null}, val)
                    }
                });
            }
        },
        getData() {
            //组件已加载便得到省的数据
            let obj = {};
            getAllChannel(obj, res => {
                if (res.success) {
                    this.channelData[0].children = res.data;
                    this.channelDataLoading = false;
                } else {
                    console.error(res.msg);
                }
            });
        }
    }
};
</script>
<style scoped>
.show-el-tree {
    border: 0;
}
.el-form-item {
    width: 180px;
}
.channel-title {
    font-size: 16px;
    font-family: "Microsoft YaHei";
}
.channel-title span {
    font-size: 12px;
    float: right;
    cursor: pointer;
    color: blue;
}
.show-channel {
    height: 400px;
    overflow: auto;
    border: 1px solid rgba(0, 0, 0, 0.25);
}
.el-col-10 {
    /*margin-right: 20px;*/
}
.el-button {
    margin-top: 180px;
    margin-left: 20px;
}
</style>