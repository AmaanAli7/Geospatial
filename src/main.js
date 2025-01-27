import { createApp } from 'vue'
import App from './App.vue';
import router from './router'
import store from './store';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';


createApp(App).use(store).use(router).mount('#app');
