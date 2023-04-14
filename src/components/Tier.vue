<template>
  <div :id="tier" class="tier">
    <div class="tierLabel" :style="cssProps">
      {{ tier }}
    </div>
    <div class="tierDropzone"></div>
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
    }
  }
</script>

<style>
  .dropzone {
    flex-grow: 1;
  }
</style>

<style scoped>
  .tierLabel {
    background-color: var(--bg-color);
    font-weight: 500;
    color: black;
    flex-shrink: 1;
    padding: 0.5rem;
    min-width: 4rem;
    justify-content: center;
    align-items: center;
    display: flex;
    min-height: 4rem;
    max-width: 4rem;
  }

  .tierDropzone{
    display: flex;
    flex-direction: row;
  }
</style>