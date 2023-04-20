<script setup>
  import Tier from './components/Tier.vue';
  import Search from './components/Search.vue';
  import AnimeCard from './components/AnimeCard.vue';
  import { createApp } from 'vue';
  import Base64url from 'crypto-js/enc-base64url';
  import Utf8 from 'crypto-js/enc-utf8';
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
    <Tier @dropped-anime="droppedAnime" bgcol="hsl(120, 100%, 80%)" tier="S"></Tier>
    <Tier @dropped-anime="droppedAnime" bgcol="hsl(100, 100%, 80%)" tier="A"></Tier>
    <Tier @dropped-anime="droppedAnime" bgcol="hsl(80, 100%, 80%)" tier="B"></Tier>
    <Tier @dropped-anime="droppedAnime" bgcol="hsl(60, 100%, 80%)" tier="C"></Tier>
    <Tier @dropped-anime="droppedAnime" bgcol="hsl(40, 100%, 80%)" tier="D"></Tier>
    <Tier @dropped-anime="droppedAnime" bgcol="hsl(20, 100%, 80%)" tier="F"></Tier>
    <Tier @dropped-anime="droppedAnime" bgcol="hsl(20, 0%, 80%)" tier="Unranked"></Tier>
  </div>
  <Search v-if="isShowingSearch" @chose-anime="choseAnime" @hide-search="hideSearch"></Search>
</template>

<script>
  export default {
    async mounted() {
      const currentURL = new URL(window.location.href);
      const searchParams = currentURL.searchParams;
      this.animeRanks = JSON.parse(Utf8.stringify(Base64url.parse(searchParams.get('tierList'))));

      for (let rank in this.animeRanks) {
        if (rank === 'all') continue;

        for (let animeID of this.animeRanks[rank]) {
          const fullObject = await this.axiosInstance.get(`/anime/${animeID}`, {
            params: {
              fields: 'alternative_titles,end_date,genres,main_picture,media_type,num_episodes,pictures,start_date,studios,synopsis,title',
            }
          });
          const animeDetails = fullObject.data;

          console.log(animeDetails);

          this.mediaType = this.mediaTypes[animeDetails.media_type] ? this.mediaTypes[animeDetails.media_type] : `!!!!! ${animeDetails.media_type}`;

          let title = `${animeDetails.title} (${animeDetails.mediaType})`;
          if ('alternativeTitles' in animeDetails && 'en' in animeDetails.alternativeTitles && animeDetails.alternativeTitles.en.length > 0) {
            title = `${animeDetails.alternativeTitles.en} (${animeDetails.mediaType})`;
          }
          if ('start' in animeDetails) {
            let start = animeDetails.start.slice(0, 4);
            let end = '';
            if (animeDetails.end) {
              end = animeDetails.end.slice(0, 4);
            }
            if (start === end) {
              title += ` ${start}`;
            } else {
              title += ` ${start}—${end}`;
            }
          }

          console.log(animeDetails.main_picture.large);

          const card = this.createCard({
            id: animeDetails.id,
            preferredTitle: title,
            fallbackTitle: animeDetails.title,
            image: animeDetails.main_picture.large,
          });

          document.querySelector(`#${rank}`).children[1].appendChild(card);
        }
      }
    },
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
        isShowingSearch: false,
        animeRanks: {
          S: [],
          A: [],
          B: [],
          C: [],
          D: [],
          F: [],
          U: [],
          all: [],
        },
        anime: {

        },
        axiosInstance: axios.create({
          baseURL: '/api',
          timeout: 60000,
          responseType: 'json',
          method: 'get',
        }),
        mediaType: '',
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
        if(!this.animeRanks.all.includes(animeDetails.id)) {
          this.animeRanks.U.push(animeDetails.id);
          this.animeRanks.all.push(animeDetails.id);
          this.anime[animeDetails.id] = animeDetails;
          const animeCard = this.createCard(animeDetails);
          document.querySelector('#Unranked').children[1].appendChild(animeCard);
        } else {
          console.log("Error: anime already chosen");
        }
      },
      createCard(animeDetails) {
        const instance = createApp(AnimeCard, {
          id: animeDetails.id,
          title: animeDetails.preferredTitle.length > 0 ? animeDetails.preferredTitle : animeDetails.fallbackTitle,
          url: animeDetails.image,
        });

        const container = document.createElement('div');
        container.classList.add('animeCardHolder');
        container.id = `card${animeDetails.id}`;

        instance.mount(container);
        return container;
      },
      droppedAnime(id, preferredTitle, image, tier) {
        let foundRank = null;
        for (let rank in this.animeRanks) {// this.animeRanks[rank]
          if (rank === 'all') continue;
          if (this.animeRanks[rank].includes(id)) {
            this.animeRanks[rank].splice(this.animeRanks[rank].indexOf(id), 1);
            this.animeRanks[tier].push(id);
          }
        }
        console.log(JSON.stringify(this.animeRanks));
        console.log();
        const card = this.createCard({
          id,
          preferredTitle,
          image,
        });
        document.querySelector(`#card${id}`).remove();
        document.querySelector(`#${tier}`).children[1].appendChild(card);

        const currentURL = new URL(window.location.href);
        const searchParams = currentURL.searchParams;

        searchParams.set(
          'tierList',
          Base64url.stringify(
            Utf8.parse(
              JSON.stringify(this.animeRanks)
            )
          )
        );

        currentURL.search = searchParams.toString();
        window.history.pushState({}, '', currentURL.toString());
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
