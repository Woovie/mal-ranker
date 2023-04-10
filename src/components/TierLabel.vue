<template>
  <div class="tierLabel" :style="cssProps">
    {{ tier }}
  </div>
</template>

<script>
  export default {
    name: 'TierLabel',
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

<style scoped>
div {
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
</style>