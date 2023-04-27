import axios from 'axios';

export default {
  mediaTypes: {
    'ona': 'ONA',
    'ova': 'OVA',
    'movie': 'Movie',
    'tv': 'TV',
    'special': 'Special',
    'music': 'Music',
  },

  animes: {

  },

  axiosInstance: axios.create({
    baseURL: '/api',
    timeout: 60000,
    responseType: 'json',
    method: 'get',
  }),

  getAnime(id) {
    if (id in this.animes) {
      return this.animes[id];
    } else {
      return this.requestAnime(id);
    }
  },

  async requestAnime(id) {
    id = id.toString();
    if (!this.animes[id]) {
      const results = await this.axiosInstance.get(`/anime/${id}`, {
        params: {
          fields: 'alternative_titles,background,created_at,end_date,genres,main_picture,mean,media_type,num_list_users,num_scoring_users,nsfw,num_episodes,pictures,popularity,rank,rating,start_date,start_season,statistics,status,studios,synopsis,title,updated_at',
        }
      });
  
      if ('data' in results) {
        results.data.id = id;
        const title = this.titleCalculate(results.data);
        this.animes[id] = {
          ...results.data,
          title,
          image: results.data.main_picture.large || results.data.main_picture.medium,
          altTag: `Covert art for ${title}`,
        }

        return this.animes[id];
      } else { 
        return null;
      }
    } else {
      return this.animes[id];
    }
  },

  async searchAnime(searchString) {
    const results = await this.axiosInstance.get('/anime', {
      params: {
        q: searchString,
        limit: 10,
      }
    });
    return results;
  },

  titleCalculate(payload) {
    let titleString = payload.title;

    if ('alternative_titles' in payload && 'en' in payload.alternative_titles && payload.alternative_titles.en.length > 0) {
      titleString = payload.alternative_titles.en;
    }

    const mediaType = payload.media_type in this.mediaTypes ? this.mediaTypes[payload.media_type] : `!!!!! ${payload.media_type}`;

    let titleDate = '';

    if ('start' in payload) {
      let start = payload.start.slice(0, 4);
      let end = '';
      if (payload.end) {
        end = payload.end.slice(0, 4);
      }
      titleDate = start === end ? ` ${start}` : ` ${start}—${end}`;
    }

    return `${titleString} (${mediaType})${titleDate}`
  }
}