import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Outline from '../views/Outline.vue'
import Article from '../views/Article.vue'
import Setting from '../views/Setting.vue'
import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/outline',
    name: 'Outline',
    component: Outline
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path:'/article',
    name:'Article',
    component: Article
  },
  {
    path:'/setting',
    name:'Setting',
    component: Setting
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
