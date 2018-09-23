<template>
  <div id="app" class="min-h-screen flex flex-col overflow-y-hidden">
    <div class="text-center level-bar shadow-md">
      <p class="py-2">Level {{ level }}</p>
    </div>
    <div class="flex-1 flex flex-col">
      <Maze v-if="maze" :maze="maze" class="flex-1" ref="maze" @win="win"/>
      <div v-if="intermission" class="intermission absolute pin h-full">
        <div class="flex flex-col justify-center items-center h-full">
          <p class="text-4xl font-semibold mb-1">{{ getCongratulation() }}</p>
          <p class="text-xl">Next level in {{ intermission }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import genMaze from '@/utils/genMaze.js'
import Maze from '@/components/Maze.vue'

const congratulations = [
  'Congratulations!',
  'Good job!',
  'Amazing!',
  'Outstanding!',
  'Too fast!',
  'Navigation expert!',
  'Speedy gonzales!!',
  'Keep it up!'
]
const congratsMap = []

export default {
  components: {
    Maze
  },
  watch: {
    level () {
      this.newMaze()
    },
    intermission () {
      if (this.intermission)
        setTimeout(() => this.intermission--, 1000)
      else
        this.level++
    }
  },
  data () {
    return {
      error: null,
      maze: null,
      level: 1,
      intermission: 0
    }
  },
  methods: {
    onKeyDown (e) {
      if (this.$refs.maze && !this.intermission)
        this.$refs.maze.onKeyDown(e)
    },
    win () {
      this.intermission = 3
    },
    newMaze () {
      let s = this.level + 2
      this.maze = genMaze(s, s)
    },
    getCongratulation () {
      if (!congratsMap[this.level])
        congratsMap[this.level] = congratulations[Math.floor(Math.random() * congratulations.length)]
      return congratsMap[this.level]
    }
  },
  created () {
    this.newMaze()
  },
  mounted () {
    window.addEventListener('keydown', e => {
      this.onKeyDown(e)
    })
  }
}
</script>

<style>
body {
  overflow-y: hidden;
}
#app {
  background: #36393f;
  color: #fff;
  font-family: Catamaran, Lato, Helvetica, Arial, sans-serif;
}
.level-bar {
  background: #202225;
}
.intermission {
  background: rgba(0, 0, 0, .3)
}
</style>

