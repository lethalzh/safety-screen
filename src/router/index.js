import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

//@ts-check
/**
 * @type [RouteConfig]
 */
const routes = [
    {
        path: '/',
        redirect: '/login'
    }, {
        path: '/screen',
        redirect: '/screen',
        component: ()=> import('@/pages/ScreenPage.vue'),
        children: [
            {
                path: 'home',
                name: "Home",
                component: ()=> import('@/pages/home/HomePage.vue')
            }, {
                path: 'safe-production',
                name: "SafeProduction",
                component: ()=> import('@/pages/safe-production/SafeProductionPage.vue')
            }, {
                path: 'environmental-monitor',
                name: "MonitorPage",
                component: ()=> import('@/pages/environmental-monitor/MonitorPage.vue')
            }, {
                path: 'electric',
                name: "Electric",
                component: ()=> import('@/pages/electric/ElectricPage.vue')
            }, {
                path: 'synthesize-manage',
                component: ()=> import('@/pages/synthesize-manage/SynthesizeManagePage.vue')
            }
        ]
    }, {
        path: '/all-video',
        name: 'AllVideoPage',
        component: ()=> import('@/pages/AllVideoPage.vue')
    }, {
        path: '/login',
        name: 'Login',
        component: ()=> import('@/pages/login/LoginPage.vue')
    },
]

const createRouter = (validate) => new VueRouter({
	scrollBehavior: (to, from, savedPosition) => {
		if (savedPosition) {
			return savedPosition
		} else {
			return { x: 0, y: 0 }
		}
	},
	base: process.env.NODE_ENV === 'development'?'/':'/',
	routes
})

const router = createRouter(routes)

export default router