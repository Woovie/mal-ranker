<template>
  <div class="tierLabel" :style="cssProps">
    {{ tier }}
  </div>
  <div @dragenter.prevent @dragover.prevent="draggedOver($event)" @drop.prevent="droppedOn($event)" class="tierDropzone"></div>
</template>

<script>
  export default {
    name: 'Tier',
    props: [
      'tier',
      'bgcol',
    ],
    computed: {
      cssProps() {
        return {
          '--bg-color': `#${this.bgcol}`,
        }
      }
    },
    methods: {
      droppedOn(event) {
        if (event.target.classList.contains('tierDropzone')) {
          const animeDetails = event.dataTransfer.getData('animeDetails');
          if (animeDetails.length > 0){
            try {
              const jsonData = JSON.parse(animeDetails);
              this.$emit('droppedAnime', jsonData, [...document.querySelector("#tierContainer").children].indexOf(event.target.parentElement));
            } catch (error) {
              console.log(`Error interpreting dragged data: ${error}\nData: ${animeDetails}\nLength: ${animeDetails.length}`);
            }
          } else {
            console.log(`Error handling drag event, animeDetails data transfer payload was empty.`);
          }
        }
      },
      draggedOver(event) {
        if (event.target.classList.contains('tierDropzone')) {
          // console.log(event);
        }
      },
      hasChildNodes() {
        console.log(this);
      }
    },
    emits: [
      "droppedAnime"
    ]
  }
</script>

<style>
  .dropzone {
    flex-grow: 1;
  }

  .tierLabel {
    font-weight: 500;
    color: black;
    flex-shrink: 1;
    padding: 0.5rem;
    min-width: 4rem;
    justify-content: center;
    align-items: center;
    min-height: 6rem;
    max-width: 4rem;
    flex-shrink: 1;
    display: flex;
  }

  .tierDropzone{
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    flex-wrap: wrap;
  }
</style>

<style scoped>
  .tierLabel {
    background-color: var(--bg-color);
  }
</style>