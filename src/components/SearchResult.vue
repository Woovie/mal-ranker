<template>
  <div @click="$emit('chose-anime', {id: this.id.toString(), preferredTitle: this.calculatedTitle, fallbackTitle: this.title, image: this.imageURL})" class="searchListing">
    <div class="imageHolder">
      <img class="listingImage" :alt="altTagDesc" :src="imageURL" />
    </div>
    <div class="descriptionHolder">
      <div class="listingTitle">{{ this.calculatedTitle.length > 0 ? this.calculatedTitle : this.title }}</div>
      <div class="listingDescription">{{ this.description }}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      mediaTypes: {
        'ona': 'ONA',
        'ova': 'OVA',
        'movie': 'Movie',
        'tv': 'TV',
        'special': 'Special',
        'music': 'Music',
      },
      axiosInstance: axios.create({
        baseURL: '/api',
        timeout: 2000,
        responseType: 'json',
        method: 'get',
      }),
      resultObject: undefined,
      alternativeTitles: '',
      mediaType: '',
      description: '',
      calculatedTitle: '',
    }
  },
  props: [
    'id',
    'title',
    'imageURL',
  ],
  emits: [
    'chose-anime'
  ],
  created() {
    this.getDetails();
  },
  methods: {
    async getDetails(){
      const results = await this.axiosInstance.get(`/anime/${this.id}`, {
        params: {
          fields: 'alternative_titles,background,created_at,end_date,genres,main_picture,mean,media_type,num_list_users,num_scoring_users,nsfw,num_episodes,pictures,popularity,rank,rating,start_date,start_season,statistics,status,studios,synopsis,title,updated_at',// there's so. much. data.
        }
      });
      this.resultObject = results.data;
      this.alternativeTitles = this.resultObject.alternative_titles;
      this.mediaType = this.mediaTypes[this.resultObject.media_type] ? this.mediaTypes[this.resultObject.media_type] : `!!!!! ${this.resultObject.media_type}`;
      this.description = this.resultObject.synopsis;
      this.start = this.resultObject.start_date;
      this.end = this.resultObject.end_date;
      this.titleCalc();
    },
    titleCalc() {
      let finalTitle = `${this.title} (${this.mediaType})`;
      if (this.resultObject) {
        if ('alternativeTitles' in this && 'en' in this.alternativeTitles && this.alternativeTitles.en.length > 0) {// "title":"Tensei shitara Slime Datta Ken 3rd Season", "en":"That Time I Got Reincarnated as a Slime Season 3"
          finalTitle = `${this.alternativeTitles.en} (${this.mediaType})`;
        }
        let start = this.start.slice(0, 4);
        let end = '';
        if (this.end) {
          end = this.end.slice(0, 4);
        }
        if (start === end) {
          finalTitle += ` ${start}`;
        } else {
          finalTitle += ` ${start}—${end}`;
        }
      }
      this.calculatedTitle = finalTitle;
    }
  },
  computed: {
    altTagDesc() {
      return `The cover art for ${this.title}`
    }
  },
  mounted() {

  },
}
</script>

<style>
.searchListing {
  height: 8rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
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
}

.descriptionHolder {
  height: 100%;
  margin-left: 0.25rem;
  flex-grow: 1;
  padding-right: 0.25rem;
}

.listingTitle {
  line-height: 1rem;
  padding-bottom: 0.25rem;
}

.listingDescription {
  height: 6rem;
  font-size: 0.5rem;
  overflow: hidden;
}
</style>