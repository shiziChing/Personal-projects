


import OA from '@/App'


import Login from '@/views/Login.vue'
import NotFound from '@/views/404.vue'
import Home from '@/views/Home.vue'
import Main from '@/views/Main.vue'
import Table from '@/views/nav1/Table.vue'
import Form from '@/views/nav1/Form.vue'
import user from '@/views/nav1/user.vue'
import Page4 from '@/views/nav2/Page4.vue'
import Page5 from '@/views/nav2/Page5.vue'
import Page6 from '@/views/nav3/Page6.vue'
import echarts from '@/views/charts/echarts.vue'


// 路由示例

// export default [{ 
//         path: '/',
//         name:'',
//         component: Home,                
//         children: [ 
//            {
//                 path: 'audit',
//                 component: OA,
//                 name: '审核管理',
//                 iconCls: 'el-icon-message',//图标样式class
//                 children: [
//                     { path: '/main', component: Main, name: '主页', hidden: true },
//                     { path: '/table', component: Table, name: 'Table'},
//                     { path: '/form', component: Form, name: '注册审核' },
//                     { path: '/user', component: user, name: '身份变更审核' },
//                 ]
//             },
//             {
//                 path: 'navTwo',
//                 component: OA,
//                 name: '导航二',
//                 iconCls: 'icomoon-camera',
//                 children: [
//                     { path: '/page4', component: Page4, name: '页面4' },
//                     { path: '/page5', component: Page5, name: '页面5' }
//                 ]
//             },
//             {
//                 path: 'page6',
//                 component: OA,
//                 name: '导航三',
//                 iconCls: 'fa icomoon-node',
//                 leaf: true
                
//             },
//             {
//                 path: 'chart',
//                 component: OA,
//                 name: 'Charts',
//                 iconCls: 'fa icomoon-node',
//                 children: [
//                     { path: '/echarts', component: echarts, name: 'echarts' }
//                 ]
//             }
//         ]

//     },
//     {
//         path: '/login',
//         component: Login,
//         name: '',
//         hidden: true
//     },
//     {
//         path: '/404',
//         component: NotFound,
//         name: '',
//         hidden: true
//     },
//     {   //指定项目打开或者未知路由时跳转的页面
//         path: '*',
//         redirect: { path: '/404' }
//     }
    
// ]


const routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '首页',
        iconCls: 'fa icomoon-home2',
        children: [
            { path: '/page6', component: Page6, name: '我的工作台', iconCls: 'icomoon-camera', leaf:true},
            { path: '/echarts', component: echarts, name: 'echart', iconCls: 'icomoon-camera', leaf:true},
            
        ]
    },
    {
        path: '/',
        component: Home,
        name: '审核管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/table', component: Table, name: 'Table', iconCls: 'icomoon-camera', leaf:true},
            { path: '/form', component: Form, name: '注册审核' , iconCls: 'icomoon-camera', leaf:true},
            { path: '/user', component: user, name: '身份变更审核', iconCls: 'icomoon-camera', leaf:true},
        ]
    },
    {
        path: '/',
        component: Home,
        name: '导航二',
        iconCls: 'icomoon-camera',
        children: [
            { path: '/page4',iconCls: 'icomoon-camera', component: Page4, name: '页面4', leaf:true},
            { path: '/page5',iconCls: 'icomoon-camera', component: Page5, name: '页面5', leaf:true}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '导航三',
        iconCls: 'fa icomoon-node',
        //leaf: true,//只有一个节点   leaf:true
        children: [
            { path: '/three', component: Page6, name: 'three', iconCls: 'icomoon-camera', leaf:true},
            { path: '/page7', component: Page6, name: 'four', iconCls: 'icomoon-camera', leaf:true},
            {
                path: '/box',
                component: OA,
                name: 'demo',
                iconCls: 'icomoon-camera',
                children: [
                    { path: '/son1', component: Page5, iconCls: 'icomoon-camera', name: 'son1', leaf:true},
                    { path: '/son2', component: Page6, iconCls: 'icomoon-camera', name: 'son2', leaf:true}
                ]

            }
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'Charts',
        iconCls: 'fa icomoon-node',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts', iconCls: 'icomoon-camera', leaf:true}
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;