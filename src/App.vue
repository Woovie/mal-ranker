<script setup>
  import Tier from './components/Tier.vue';
  import Search from './components/Search.vue';
  import AnimeCard from './components/AnimeCard.vue';
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
          "S": [],
          "A": [],
          "B": [],
          "C": [],
          "D": [],
          "F": [],
          "U": []
        },

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
      choseAnime(animeID) {

      },
      moveAnime() {

      },
      updateDisplayed() {
        for (let rank in this.animeRanks) {
          const animes = this.animeRanks[rank];
          for (let animeID of animes) {

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


</style>
