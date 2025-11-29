import { createRouter, createWebHistory } from 'vue-router';
import BooksPage from '@/components/pages/BooksPage.vue';
import AboutPage from '@/components/pages/AboutPage.vue';

const routes = [
  { path: '/', redirect: '/books' },
  { path: '/books', name: 'books', component: BooksPage },
  { path: '/about', name: 'about', component: AboutPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
