<template>
  <div class="login">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
      <p>Don't have an account? <router-link to="/register">Register here</router-link></p>
    </form>
    
  </div>
</template>

<script>
import { ref } from 'vue'; // Import ref from Vue
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const store = useStore(); // Access Vuex store
    const router = useRouter(); // Access Vue Router

    const email = ref(''); // Declare refs for email and password
    const password = ref('');

    const login = async () => {
      try {
        // Dispatch Vuex login action
        await store.dispatch('login', { email: email.value, password: password.value });

        // Redirect to dashboard on success
        alert('Login successful!');
        router.push('/dashboard');
      } catch (error) {
        alert('Login failed! Please check your credentials.');
        console.error(error);
      }
    };

    return {
      email,
      password,
      login,
    };
  },
};
</script>

<style>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 1rem;
}

input {
  padding: 0.5rem;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
