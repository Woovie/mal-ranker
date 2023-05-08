<template>
  <div @click="$emit('hideSearch')" id="searchBoxHolder">
    <div @click.stop id="searchBox">
      <p>Click background or press escape to cancel search</p>
      <input @input="clearResultsDebounce()" aria-label="search" v-model="searchString" type="text" placeholder="Search for an anime" id="searchInput" />
      <div id="searchResults">
      </div>
    </div>
  </div>
</template>

<script>
  import { debounce } from '../debounce.js';
  import BigCard from './BigCard.vue';
  import { h, createApp } from 'vue';

  export default {
    data() {
        return {
            searchString: "",
            cards: [],
            querying: false,
        };
    },
    inject: [
      "animeModule"
    ],
    methods: {
        async searchForAnime() {
            if (this.searchString.length >= 3) {
                const results = await this.animeModule.searchAnime(this.searchString);
                const responseHolder = document.querySelector("#searchResults");
                for (let anime of results.data.data) {
                  anime = anime.node;
                  const container = document.createElement('div');
                  container.classList.add('bigCardHolder');
                  const cardModified = h(BigCard, {
                    onChoseAnime: (animeDetails) => this.selectAnime(animeDetails),
                  });
                  const card = createApp(cardModified, {
                    id: anime.id,
                  });
                  card.provide('animeModule', this.animeModule);
                  card.mount(container);
                  responseHolder.appendChild(container);
                }
            }
        },
        selectAnime(animeDetails) {
          this.$emit("choseAnime", animeDetails);
          this.$emit("hideSearch");
        },
    },
    created() {
        this.debouncedSearch = debounce(function () {
            this.searchForAnime();
        }, 500);
        this.clearResultsDebounce = function () {
            const responseHolder = document.querySelector("#searchResults");
            while (responseHolder.firstChild) {
                responseHolder.removeChild(responseHolder.firstChild);
            }
            this.debouncedSearch();
        };
    },
    mounted() {
        document.querySelector("#searchInput").focus();
    },
    components: [
        BigCard,
    ],
}
</script>

<style>
#searchBoxHolder {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  display: flex;
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
  height: 80%;
  overflow-y: auto;
  overflow-x: clip;
  width: 100%;
}

#searchResults::-webkit-scrollbar-track
{
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	border-radius: 10px;
	background-color: none;
}

#searchResults::-webkit-scrollbar
{
	width: 12px;
	background-color: none;
}

#searchResults::-webkit-scrollbar-thumb
{
	border-radius: 10px;
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
	background-color: white;
}

.bigCardHolder {
  margin-bottom: 0.25rem;
  margin-top: 0.25rem;
}

.bigCardHolder:hover {
  background-color: hsl(0, 0%, 100%, 0.3);
}
</style>