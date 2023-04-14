<script setup>
  import Tier from './components/Tier.vue';
  import Search from './components/Search.vue';
  import AnimeCard from './components/AnimeCard.vue';
import { createApp } from 'vue';
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
    <Tier bgcol="hsl(120, 100%, 80%)" tier="S"></Tier>
    <Tier bgcol="hsl(100, 100%, 80%)" tier="A"></Tier>
    <Tier bgcol="hsl(80, 100%, 80%)" tier="B"></Tier>
    <Tier bgcol="hsl(60, 100%, 80%)" tier="C"></Tier>
    <Tier bgcol="hsl(40, 100%, 80%)" tier="D"></Tier>
    <Tier bgcol="hsl(20, 100%, 80%)" tier="F"></Tier>
    <Tier bgcol="hsl(20, 0%, 80%)" tier="Unranked"></Tier>
  </div>
  <Search v-if="isShowingSearch" @chose-anime="choseAnime" @hide-search="hideSearch"></Search>
</template>

<script>
  export default {
    data() {
      return {
        isShowingSearch: false,
        animeRanks: {
          S: {
            storage: [],
          },
          A: {
            storage: [],
          },
          B: {
            storage: [],
          },
          C: {
            storage: [],
          },
          D: {
            storage: [],
          },
          F: {
            storage: [],
          },
          U: {
            storage: [],
          },
        },
        anime: {

        }

      }
    },
    methods: {
      showSearch() {
        if (!this.isShowingSearch) {
          this.isShowingSearch = true;
        }
      },
      hideSearch() {
        if (this.isShowingSearch) {
          this.isShowingSearch = false;
        }
      },
      choseAnime(animeDetails) {
        this.animeRanks.U.storage.push(animeDetails.id);
        this.anime[animeDetails.id] = animeDetails;
        this.createCard(animeDetails);
      },
      moveAnime() {

      },
      createCard(animeDetails) {
        const instance = createApp(AnimeCard, {
          title: animeDetails.preferredTitle.length > 0 ? animeDetails.preferredTitle : animeDetails.fallbackTitle,
          url: animeDetails.image,
        });

        const container = document.createElement('div');
        container.classList.add('animeCardHolder');

        instance.mount(container);
        document.querySelector('#Unranked').children[1].appendChild(container);
      }
    },
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

.tier:last-child {
  flex-grow: 1;
  display: flex;
}

.tier:last-child, .tierLabel {
  flex-grow: 1;
}

.tierLabel {
  display: flex;
}

.animeCardHolder {
  width: 4rem;
  height: 6rem;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.05rem;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
  margin-left: 0.25rem;
  /* border: 1px white solid; */
  font-size: 40px;
  transition: box-shadow 0.15s ease-in-out;
  transition: transform .2s;
}

.animeCardHolder:hover{
  box-shadow: hsla(40, 86%, 43%, 0.5) 0px 0.0625em 0.0625em, hsla(40, 86%, 43%, 0.5) 0px 0.125em 0.5em, hsla(40, 86%, 43%, 0.5) 0px 0px 0px 1px inset;
  transform: scale(1.5);
}
</style>
