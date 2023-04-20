<template>
    <img @dragstart="dragStart($event)" draggable="true" class="tierCard" :alt="altString" :src="url" />
</template>

<script>
  export default {
    props: [
      'title',
      'url',
      'id'
    ],
    computed: {
      altString() {
        return`Picture of ${this.title}`;
      }
    },
    methods: {
      dragStart(event) {
        event.dataTransfer.setDragImage(event.target, 0, 0);
        event.dataTransfer.setData("id", this.id);
        event.dataTransfer.setData("title", this.title);
        event.dataTransfer.setData("url", this.url);
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