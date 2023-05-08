<template>
  <div v-if="this.animeDetails && Object.keys(this.animeDetails).length > 0" @click="$emit('chose-anime', this.animeDetails)" class="searchListing">
    <div class="imageHolder">
      <img class="listingImage" :alt="this.animeDetails.altTag" :src="this.animeDetails.image" />
    </div>
    <div class="descriptionHolder">
      <div class="listingTitle">{{ this.animeDetails.title }}</div>
      <div class="listingDescription">{{ this.animeDetails.synopsis }}</div>
    </div>
  </div>
  <div v-else class="searchListing">
    <div class="imageHolder">
      <div class="listingImage searchCardLoading">&nbsp;</div>
    </div>
    <div class="descriptionHolder">
      <div class="listingTitle searchCardLoading">&nbsp;</div>
      <div class="listingDescription searchCardLoading">&nbsp;</div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'id'
  ],
  emits: [
    'chose-anime'
  ],
  inject: [
    "animeModule"
  ],
  data() {
    return {
      animeDetails: {},
    }
  },
  async created() {
    const details = await this.animeModule.getAnime(this.id);
    this.animeDetails = details;
  }
}
</script>

<style>
.searchListing {
  height: 10rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-bottom: 0.5rem;
}

.searchListing:first-child {
  padding-top: 0.5rem;
}

.listingImage {
  max-width: 6rem;
  max-height: 8rem;
  object-fit: scale-down;
}

.imageHolder {
  width: 6rem;
  min-width: 6rem;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 0.25rem;
  margin-right: 0.25rem;
}

.descriptionHolder {
  height: 100%;
  margin-left: 0.25rem;
  flex-grow: 1;
  padding-right: 0.25rem;
}

.listingTitle {
  line-height: 1rem;
  max-height: 2rem;
  padding-bottom: 0.5rem;
}

.listingDescription {
  max-height: 80%;
  line-height: 0.5rem;
  font-size: 0.5rem;
  overflow: hidden;
}

.searchCardLoading {
  background-color: hsla(0, 0%, 50%, 0.2);
  width: 100%;
  display: inline-block;
  position: relative;
  overflow: hidden;
  border-radius: 0.5rem;
}

.listingImage.searchCardLoading { 
  height: 100%;
}

.listingImage.searchCardLoading::after {
  animation: shimmer 2s infinite;
}

.searchCardLoading::after {
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
    hsla(0, 0%, 100%, 0.25) 50%,
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