<script setup>
  import Tier from './components/Tier.vue';
  import Search from './components/Search.vue';
  import SmallCard from './components/SmallCard.vue';
  import { createApp, h } from 'vue';
  import Base64url from 'crypto-js/enc-base64url';
  import Utf8 from 'crypto-js/enc-utf8';
  import AnimeManager from './anime-manager.js';
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
  <div id="tiers">
    <div id="fauxnav"></div>
    <div id="tierContainer"></div>
  </div>
  <Search v-if="isShowingSearch" @chose-anime="choseAnime" @hide-search="hideSearch"></Search>
</template>

<script>
  export default {
    async mounted() {
      const currentURL = new URL(window.location.href);
      const searchParams = currentURL.searchParams;

      const tierList = searchParams.get('tierList');
      const tiers = searchParams.get('tiers');

      if (tierList) {
        try {
          this.rankings = JSON.parse(Utf8.stringify(Base64url.parse(tierList)));
        } catch (error) {
          console.log(`Tried loading bad tierList data: ${error}.\ntierList: ${tierList}\nPlease send this to @Woovie on Discord or woovie@woovie.net.`);
        }
      }

      if (tiers) {
        try {
          this.tiers = JSON.parse(Utf8.stringify(Base64url.parse(tiers)));
        } catch (error) {
          console.log(`Tried loading bad tiers data: ${error}.\ntiers: ${tiers}\nPlease send this to @Woovie on Discord or woovie@woovie.net.`);
        }
      }

      const tierContainer = document.querySelector('#tierContainer');

      for (let tier of this.tiers) {
        if (tier.render) {
          const modifiedTier = h(Tier, {
            onDroppedAnime: (animeDetails, tier) => this.droppedAnime(animeDetails, tier),
          });

          const tierInstance = createApp(modifiedTier, {
            bgcol: tier.color,
            tier: tier.name,
          });

          const container = document.createElement('div');
          container.classList.add('tier');

          tierInstance.mount(container);

          tierContainer.appendChild(container);
        }

        if (tier.default) {
          this.default = tier;
        }
      }

      if (!this.default) {
        console.log(`No default was provided! Here's the tiers: ${this.tiers}`)
        this.default = this.tiers[0];
      }

      for (let id in this.rankings) {
        const animeDetails = await this.animeModule.requestAnime(id);
        const card = this.createCard(animeDetails);
        tierContainer.children[this.rankings[id]].children[1].appendChild(card);
      }
    },
    data() {
      return {
        isShowingSearch: false,
        tiers: [
          {
            "name": "S",
            "color": "9f9",
            "render": true
          },
          {
            "name": "A",
            "color": "bf9",
            "render": true
          },
          {
            "name": "B",
            "color": "df9",
            "render": true
          },
          {
            "name": "C",
            "color": "ff9",
            "render": true
          },
          {
            "name": "D",
            "color": "fd9",
            "render": true
          },
          {
            "name": "F",
            "color": "fc9",
            "render": true
          },
          {
            "name": "Unranked",
            "color": "ccc",
            "render": true,
            "default": true,
          },
        ],
        rankings: {},
        animeModule: AnimeManager,
      }
    },
    provide() {
      return {
        animeModule: this.animeModule,
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
        if(!(animeDetails.id in this.rankings)) {
          const tier = this.tiers.indexOf(this.default);
          this.rankings[animeDetails.id] = tier;

          const smallCardInstance = this.createCard(animeDetails);

          tierContainer.children[tier].children[1].appendChild(smallCardInstance); // Mind melt
        } else {
          console.log("Error: anime already chosen");
        }
      },

      createCard(animeDetails) {
        const instance = createApp(SmallCard, {animeDetails});

        const container = document.createElement('div');
        container.classList.add('smallCardHolder');
        container.id = `card${animeDetails.id}`;

        instance.mount(container);
        return container;
      },

      droppedAnime(animeDetails, tier) {
        this.rankings[animeDetails.id] = tier;

        const card = this.createCard(animeDetails);
        document.querySelector(`#card${animeDetails.id}`).remove();
        document.querySelector('#tierContainer').children[tier].children[1].appendChild(card);

        const currentURL = new URL(window.location.href);
        const searchParams = currentURL.searchParams;

        searchParams.set(
          'tierList',
          Base64url.stringify(
            Utf8.parse(
              JSON.stringify(this.rankings)
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
    min-height: 2rem;
    padding-left: var(--titlebar-pad);
    padding-right: var(--titlebar-pad);
    display: flex;
    align-items: center;
    top: 0;
    position: fixed;
    box-sizing: border-box;
    width: 100%;
  }

  #navRight {
    display: flex;
    align-items: center;
    flex-shrink: 1;
  }

  #navLeft {
    flex-grow: 1;
  }

  #tiers {
    height: 100%;
    display: flex;
    align-content: stretch;
    flex-direction: column;
    column-count: 1;
  }

  #fauxnav {
    --titlebar-pad: 2rem;
    height: 2rem;
    min-height: 2rem;
    padding-left: var(--titlebar-pad);
    padding-right: var(--titlebar-pad);
    display: flex;
    align-items: center;
  }

  #addNew {
    padding: 0.25rem;
    background-color: white;
    color: black;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    text-decoration: none;
  }

  #tierContainer {
    display: flex;
    flex-direction: column;
    column-count: 1;
    align-content: stretch;
    flex-grow: 1;
  }

  .smallCardHolder {
    width: 4rem;
    height: 6rem;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.05rem;
    padding: 0.5rem;
    font-size: 40px;
    transition: transform .2s;
  }

  .smallCardHolder:hover {
    transform: scale(1.5);
  }

  .tier {
    display: flex;
    flex-direction: row;
  }

  .hoverCardContainer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: red;
  }
</style>
