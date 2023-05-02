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
      if (tierList) {
        this.rankings = JSON.parse(Utf8.stringify(Base64url.parse(tierList)));
      }
      
      const tierContainer = document.querySelector('#tierContainer');

      for (let tier of this.tiers) {
        if (!(tier.name in this.rankings)) {
          this.rankings[tier.name] = [];
        }

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

          

          for (let id of this.rankings[tier.name]) {
            const animeDetails = await this.animeModule.getAnime(id);
            const card = this.createCard(animeDetails);
            document.querySelector(`#${tier.name}`).children[1].appendChild(card);
          }
        }
      }
    },
    data() {
      return {
        isShowingSearch: false,
        tiers: [
          {
            name: 'S',
            color: "hsl(120, 100%, 80%)",
            render: true
          },
          {
            name: 'A',
            color: "hsl(100, 100%, 80%)",
            render: true
          },
          {
            name: 'B',
            color: "hsl(80, 100%, 80%)",
            render: true
          },
          {
            name: 'C',
            color: "hsl(60, 100%, 80%)",
            render: true
          },
          {
            name: 'D',
            color: "hsl(40, 100%, 80%)",
            render: true
          },
          {
            name: 'F',
            color: "hsl(20, 100%, 80%)",
            render: true
          },
          {
            name: 'Unranked',
            color: "hsl(120, 0%, 80%)",
            render: true,
            default: true
          },
          {
            name: 'all',
            render: false
          },
        ],
        rankings: {},
        animeModule: AnimeManager,
        anime: {},
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
        if(!this.rankings.all.includes(animeDetails.id)) {
          this.rankings.Unranked.push(animeDetails.id);
          this.rankings.all.push(animeDetails.id);
          this.anime[animeDetails.id] = animeDetails;
          const smallCardInstance = this.createCard(animeDetails);
          document.querySelector('#Unranked').children[1].appendChild(smallCardInstance);
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
        let foundRank = null;
        for (let rank in this.rankings) {// this.rankings[rank]
          if (rank === 'all') continue;
          if (this.rankings[rank].includes(animeDetails.id)) {
            this.rankings[rank].splice(this.rankings[rank].indexOf(animeDetails.id), 1);
            this.rankings[tier].push(animeDetails.id);
          }
        }
        const card = this.createCard(animeDetails);
        document.querySelector(`#card${animeDetails.id}`).remove();
        document.querySelector(`#${tier}`).children[1].appendChild(card);

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

  .tier:last-child {
    flex-grow: 1;
    display: flex;
  }

  .tier:last-child, .tierLabel {
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
    padding-right: 0;
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
