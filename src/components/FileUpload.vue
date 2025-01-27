<template>
  <div>
    <h3>Upload GeoJSON/KML</h3>
    <input type="file" @change="uploadFile" accept=".geojson,.kml" />
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      errorMessage: null, // For error messages
    };
  },
  methods: {
    async uploadFile(event) {
      const file = event.target.files[0];

      if (!file) {
        this.errorMessage = 'Please select a file to upload.';
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        // Send file to the backend
        const response = await axios.post(
          'http://localhost:5000/upload/geojson', // Backend API endpoint
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`, // Auth token from localStorage
            },
          }
        );

        alert('File uploaded successfully!');
        console.log('Response:', response.data);
        this.errorMessage = null; // Clear any previous error messages
      } catch (error) {
        // Error handling
        console.error('Upload error:', error);
        this.errorMessage =
          error.response?.data?.error || 'File upload failed. Please try again.';
      }
    },
  },
};
</script>
