<script setup>
  import Tier from './components/Tier.vue';
  import TierLabel from './components/TierLabel.vue';
  import TierDropzone from './components/TierDropzone.vue';
  import axios from 'axios';
</script>

<template>
  <div id="navbar">
    <div id="navLeft">
      Anime Tier List
    </div>
    <div id="navRight">
      <a @click="showSearch" href="#" role="button" id="addNew">Add New</a>
    </div>
  </div>
  <div id="tierContainer">
    <Tier>
      <TierLabel bgcol="hsl(120, 100%, 80%)" tier="S">

      </TierLabel>
      <TierDropzone>

      </TierDropzone>
    </Tier>
    <Tier>
      <TierLabel bgcol="hsl(100, 100%, 80%)" tier="A">

      </TierLabel>
      <TierDropzone>
        
      </TierDropzone>
    </Tier>
    <Tier>
      <TierLabel bgcol="hsl(80, 100%, 80%)" tier="B">

      </TierLabel>
      <TierDropzone>
        
      </TierDropzone>
    </Tier>
    <Tier>
      <TierLabel bgcol="hsl(60, 100%, 80%)" tier="C">

      </TierLabel>
      <TierDropzone>
        
      </TierDropzone>
    </Tier>
    <Tier>
      <TierLabel bgcol="hsl(40, 100%, 80%)" tier="D">

      </TierLabel>
      <TierDropzone>
        
      </TierDropzone>
    </Tier>
    <Tier>
      <TierLabel bgcol="hsl(20, 100%, 80%)" tier="F">

     </TierLabel>
     <TierDropzone>
        
      </TierDropzone>
    </Tier>
    <Tier>
      <TierLabel bgcol="hsl(20, 0%, 80%)" tier="Unranked">

     </TierLabel>
     <TierDropzone>
        
      </TierDropzone>
    </Tier>
  </div>
  <div v-if="isShowingSearch" @click="hideSearch" id="searchBoxHolder">
    <div @click.stop id="searchBox">
      <p>Click background to cancel</p>
      <input @input="searchForAnime" aria-label="search" v-model="searchString" type="text" placeholder="Search for an anime" id="searchInput" />
      <div id="searchResults">

      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isShowingSearch: false,
        animes: [],
        searchString: '',
        axiosInstance: axios.create({
          baseURL: '/api',
          timeout: 1000,
          headers: {
            'Content-Type': 'application/json',
          },
          responseType: 'json',
          method: 'get',
        })
      }
    },
    methods: {
      showSearch(event) {
        if (!this.isShowingSearch) {
          this.isShowingSearch = true;
        }
      },
      hideSearch(event) {
        if (this.isShowingSearch) {
          this.searchString = '';
          this.isShowingSearch = false;
        }
      },
      async searchForAnime() {
        if (this.searchString.length >= 3) {
          const results = await this.axiosInstance.get('/anime', {
            params: {
              q: this.searchString,
              limit: 10,
            }
          });
          console.log(results);
          const responseHolder = document.querySelector('#searchResults');
          while (responseHolder.firstChild) {
            responseHolder.removeChild(responseHolder.firstChild);
          }
          for (const node of results.data.data) {
            const anime = node.node;
            const animeContainer = document.createElement('div');
            responseHolder.appendChild(animeContainer);
            animeContainer.classList.add('animeListing');

            const imageContainer = document.createElement('img');
            animeContainer.appendChild(imageContainer);
            imageContainer.classList.add('animeImage');
            imageContainer.src = anime.main_picture.medium;

            const animeTitle = document.createElement('p');
            animeContainer.appendChild(animeTitle);
            animeTitle.innerText = anime.title;
          }
        } else {
          const responseHolder = document.querySelector('#searchResults');
          while (responseHolder.firstChild) {
            responseHolder.removeChild(responseHolder.firstChild);
          }
        }
      }
    }
  }
</script>

<style>
#navbar {
  --titlebar-pad: 2rem;
  background-color: red;
  height: 2rem;
  padding-left: var(--titlebar-pad);
  padding-right: var(--titlebar-pad);
  display: flex;
  align-items: center;
}

#navRight {
  display: flex;
  align-items: center;
}

#navLeft {
  flex-grow: 1;
}

#addNew {
  padding: 0.25rem;
  background-color: white;
  color: black;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  text-decoration: none;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

#tierContainer {
  display: flex;
  flex-direction: column;
  column-count: 1;
  align-content: stretch;
  flex-grow: 1;
}

#tierContainer :last-child {
  flex-grow: 1;
  display: flex;
}

#tierContainer :last-child, .tierLabel {
  flex-grow: 1;
}

.tierLabel {
  display: flex;
}

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
  width: 50%;
}

#searchBox p {
  font-size: 0.75rem;
}

#searchInput {
  font-size: 1.25rem;
  border-radius: 0.25rem;
  background-color: black;
  color: white;
  border: solid white 1px;
  padding: 0.2rem;
  width: 100%;
}

#searchResults {
  max-height: 16rem;
  overflow-y: scroll;
  width: 100%;
}

.animeListing {
  width: 100%;
  min-height: 2rem;
  max-height: 8rem;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.animeListing p {
  overflow-wrap: break-word;
  max-height: 8rem;
  overflow: hidden;
}

.animeImage {
max-height: 8rem;
width: 4rem;
}
</style>
