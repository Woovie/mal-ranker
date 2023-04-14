<template>
  <div @click="$emit('hideSearch')" id="searchBoxHolder">
    <div @click.stop id="searchBox">
      <p>Click background to cancel</p>
      <input @input="clearResultsDebounce()" aria-label="search" v-model="searchString" type="text" placeholder="Search for an anime" id="searchInput" />
      <div id="searchResults">
        <!-- <SearchLoading v-if="querying"></SearchLoading> -->
      </div>
    </div>
  </div>
</template>

<script>
  import { createApp, h } from 'vue';
  import axios from 'axios';
  import { debounce } from '../debounce.js';
  import SearchResult from './SearchResult.vue';

  export default {
    data() {
      return {
        searchString: '',
        axiosInstance: axios.create({
          baseURL: '/api',
          timeout: 2000,
          responseType: 'json',
          method: 'get',
        }),
        querying: false,
      }
    },
    methods: {
      async searchForAnime() {
        const responseHolder = document.querySelector('#searchResults');
        if (this.searchString.length >= 3) {
          this.querying = true;

          const results = await this.axiosInstance.get('/anime', {
            params: {
              q: this.searchString,
              limit: 10,
            }
          });

          for (const node of results.data.data) {
            const anime = node.node;

            const modifiedSearchResult = h(
              SearchResult,
              {
                onChoseAnime: (animeDetails) => this.selectAnime(animeDetails),
              }
            );

            const instance = createApp(modifiedSearchResult, {
              id: anime.id,
              title: anime.title,
              imageURL: anime.main_picture.large,
            });

            const container = document.createElement('div');
            container.classList.add('searchListingContainer');

            instance.mount(container);

            responseHolder.appendChild(container);
          }
        }
      },
      selectAnime(animeDetails) {
        this.$emit('choseAnime', animeDetails);
        this.$emit('hideSearch');
      },
    },
    created() {
      this.debouncedSearch = debounce(function(){
        this.searchForAnime();
      }, 500);// Average human brain response time that's acceptable
      this.clearResultsDebounce = function(){
        const responseHolder = document.querySelector('#searchResults');
        while (responseHolder.firstChild) {
          responseHolder.removeChild(responseHolder.firstChild);
        }
        this.debouncedSearch();
      };
    },
    mounted() {
      document.querySelector('#searchInput').focus();
    }
  }
</script>

<style>
#searchBoxHolder {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: hsla(0, 0%, 0%, 0.3);
}

#searchBox {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 80%;
}

#searchInput {
  font-size: 1.25rem;
  border-radius: 0.25rem;
  background-color: black;
  color: white;
  border: solid white 1px;
  padding: 0.2rem;
  box-sizing: border-box;
  width: 100%;
}

#searchResults {
  max-height: 24rem;
  overflow-y: scroll;
  overflow-x: clip;
  width: 100%;
}

.searchListingContainer{
  height: 8rem;
  padding-bottom: 0.25rem;
  padding-top: 0.25rem;
}

.searchListingContainer:nth-child(odd) {
  background-color: hsl(0, 0%, 100%, 0.1);
}

.searchListingContainer:nth-child(even) {
  background-color: hsl(0, 0%, 100%, 0.2);
}

.searchListingContainer:hover {
  background-color: hsl(0, 0%, 100%, 0.3);
}
</style>