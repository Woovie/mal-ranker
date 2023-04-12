<script setup>
import axios from 'axios';
</script>

<template>
  <div>
    <img :alt="altString" :src="url" />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        title: '',
        url: ''
      };
    },
    props: [
      'animeID',
    ],
    created() {
      const results = axios.get(`/anime/${this.animeID}`, {
        timeout: 2000,
        responseType: 'json',
      });
      console.log(results);
    },
    computed: {
      altString() {
        return`Picture of ${this.title}`;
      }
    }
  }
</script>

<style>

</style>