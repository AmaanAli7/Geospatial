<template>
  <div>
    <h1>User Dashboard</h1>
    <FileUpload @fileUploaded="fetchDatasets" />

    <div v-if="loading" class="loading">Loading datasets...</div>
    <div v-else-if="datasets.length === 0" class="empty">No datasets uploaded yet.</div>
    <div v-else>
      <h2>Uploaded Datasets:</h2>
      <ul>
        <li v-for="(dataset, index) in datasets" :key="index">
          {{ dataset.name }}
        </li>
      </ul>

      <Map :datasets="datasets" />
    </div>
  </div>
</template>

<script>
import FileUpload from '../components/FileUpload.vue';
import Map from '../components/MapView.vue';
import axios from 'axios';

export default {
  components: { FileUpload, Map },
  data() {
    return {
      datasets: [],
      loading: false,
    };
  },
  methods: {
    async fetchDatasets() {
      this.loading = true;
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/map/files`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        this.datasets = response.data.map(file => ({
          name: file.name,
          data: JSON.parse(file.data),
        }));
      } catch (error) {
        console.error('Error fetching datasets:', error);
        alert('Failed to load datasets');
      } finally {
        this.loading = false;
      }
    },
  },
  async mounted() {
    await this.fetchDatasets();
  },
};
</script>

<style>
.loading {
  font-size: 18px;
  color: #007bff;
}

.empty {
  font-size: 18px;
  color: #999;
}
</style>
