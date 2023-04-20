<template>
  <div :id="tier" class="tier">
    <div class="tierLabel" :style="cssProps">
      {{ tier }}
    </div>
    <div v-if="!hasChildNodes" @dragenter.prevent @dragover.prevent="draggedOver($event)" @drop.prevent="droppedOn($event)" class="tierDropzone"></div>
    <div v-else @dragenter.prevent @dragover.prevent="draggedOver($event)" @drop.prevent="droppedOn($event)" class="tierDropzone">&nbsp;</div>
  </div>
</template>

<script>
  export default {
    name: 'Tier',
    props: [
      'tier',
      'bgcol',
    ],
    computed: {
      cssProps() {
        return {
          '--bg-color': this.bgcol,
        }
      }
    },
    methods: {
      droppedOn(event) {
        if (event.target.classList.contains('tierDropzone')) {
          const id = event.dataTransfer.getData("id");
          const title = event.dataTransfer.getData("title");
          const url = event.dataTransfer.getData("url");
          this.$emit('droppedAnime', id, title, url, event.target.parentElement.id);
        }
      },
      draggedOver(event) {
        if (event.target.classList.contains('tierDropzone')) {
          // console.log(event);
        }
      },
      hasChildNodes() {
        console.log(this);
      }
    }
  }
</script>

<style>
  .dropzone {
    flex-grow: 1;
  }
</style>

<style scoped>
  .tier {
    display: flex;
    flex-direction: row;
  }
  .tierLabel {
    background-color: var(--bg-color);
    font-weight: 500;
    color: black;
    flex-shrink: 1;
    padding: 0.5rem;
    min-width: 4rem;
    justify-content: center;
    align-items: center;
    min-height: 4rem;
    max-width: 4rem;
    flex-shrink: 1;
  }

  .tierDropzone{
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    height: 100%;
  }
</style>