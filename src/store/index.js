import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    token: localStorage.getItem('token') || null, // Retrieve token from localStorage
    user: null, // User info if needed
  },
  mutations: {
    setToken(state, token) {
      state.token = token; // Save token in state
      localStorage.setItem('token', token); // Persist token in localStorage
    },
    clearToken(state) {
      state.token = null; // Remove token from state
      localStorage.removeItem('token'); // Remove token from localStorage
    },
    setUser(state, user) {
      state.user = user; // Save user info in state
    },
  },
  actions: {
    async login({ commit }, { email, password }) {
      try {
        // Send login request to backend
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/auth/login`, {
          email,
          password,
        });

        // Store the token and user data
        const token = response.data.token;
        commit('setToken', token);

        // Optionally fetch user info or save user info
        // Example: decode user ID from the token
        // Commit user data here if needed

        return true; // Indicate success
      } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
        throw new Error('Login failed. Please check your credentials.');
      }
    },
    logout({ commit }) {
      commit('clearToken'); // Clear token
    },
  },
  getters: {
    isAuthenticated(state) {
      return !!state.token; // Check if the user is authenticated
    },
    getToken(state) {
      return state.token; // Retrieve the token
    },
  },
});
