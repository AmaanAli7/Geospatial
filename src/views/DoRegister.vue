<template>
    <div class="login">
      <h2>Register</h2>
      <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  </template>
  
  <script>
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  
  export default {
    data() {
      return { email: '', password: '' };
    },
    setup() {
      const store = useStore();
      const router = useRouter();
  
      const login = async () => {
        try {
          await store.dispatch('login', { email: this.email, password: this.password });
          router.push('/dashboard');
        } catch (error) {
          alert('Login failed!');
        }
      };
  
      return { login };
    },
  };
  </script>
  