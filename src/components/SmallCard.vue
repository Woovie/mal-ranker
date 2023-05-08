<template>
    <img @dragstart="dragStart($event)" draggable="true" class="tierCard" :alt="this.animeDetails.altTag" :src="this.animeDetails.image" v-if="this.animeDetails && Object.keys(this.animeDetails).length > 0"  />
    <div v-else class="tierCard tierCardLoading">&nbsp;</div>
</template>

<script>
  export default {
    props: [
      'animeDetails'
    ],
    methods: {
      dragStart(event) {
        event.dataTransfer.setDragImage(event.target, 0, 0);
        event.dataTransfer.setData('animeDetails', JSON.stringify(this.animeDetails));
      }
    }
  }
</script>

<style>
.tierCard {
  max-height: 100%;
  object-fit: cover;
}

.tierCardLoading {
  background-color: hsla(0, 0%, 50%, 0.2);
  width: 100%;
  display: inline-block;
  position: relative;
  overflow: hidden;
  border-radius: 0.5rem;
}

.tierCardLoading::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    hsla(0, 0%, 0%, 0) 0,
    hsla(0, 0%, 100%, 0.05) 25%,
    hsla(0, 0%, 100%, 0.15) 50%,
    hsla(0, 0%, 100%, 0.05) 75%,
    hsla(0, 0%, 0%, 0)
  );
  animation: shimmer 2s infinite;
  content: '';
  overflow: hidden !important;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>