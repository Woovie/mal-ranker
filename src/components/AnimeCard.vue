<template>
    <img class="tierCard" :alt="altString" :src="url" />
</template>

<script>
  export default {
    props: [
      'title',
      'url'
    ],
    computed: {
      altString() {
        return`Picture of ${this.title}`;
      }
    }
  }
</script>

<style>
.tierCard {
  max-height: 100%;
  object-fit: cover;
}
</style>