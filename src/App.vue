<template>
  <div id="app" class="min-h-screen flex flex-col overflow-y-hidden">
    <div class="top-bar flex items-center shadow-md px-4 h-12">
      <p class="flex-1 text-center text-lg">Level {{ level }}</p>
      <i class="material-icons hamburger cursor-pointer" @click="menuOpen = true">menu</i>
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
    <div v-if="menuOpen" class="menu-container absolute pin h-screen w-screen py-16">
      <div class="container mx-auto shadow-md flex flex-col h-full">
        <div class="menu-bar flex items-center px-4 h-12">
          <p class="text-2xl flex-1 text-center">Menu</p>
          <i class="material-icons close cursor-pointer" @click="menuOpen = false">close</i>
        </div>
        <Menu class="flex-1" padding="6"/>
      </div>
    </div>
  </div>
</template>

<script>
import genMaze from '@/utils/genMaze.js'
import Maze from '@/components/Maze.vue'
import Menu from '@/components/Menu.vue'

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
    Maze, Menu
  },
  watch: {
    level () {
      if (this.offline)
        this.newMaze()
    },
    intermission () {
      if (this.intermission)
        setTimeout(() => this.intermission--, 1000)
    }
  },
  data () {
    return {
      error: null,
      maze: null,
      level: 1,
      intermission: 0,
      ws: null,
      offline: true,
      menuOpen: false
    }
  },
  methods: {
    onKeyDown (e) {
      if (this.$refs.maze && !this.intermission && !this.menuOpen)
        this.$refs.maze.onKeyDown(e)
    },
    win () {
      this.intermission = 3
      this.level++
    },
    newMaze () {
      let s = this.level + 2
      this.maze = genMaze(s, s)
    },
    getCongratulation () {
      if (!congratsMap[this.level])
        congratsMap[this.level] = congratulations[Math.floor(Math.random() * congratulations.length)]
      return congratsMap[this.level]
    },
    onOpen () {
      // idk
    },
    onMessage (msg) {
      if (this.offline) return
      let data = msg.d
      switch (msg.e) {
        case 'NEW_MAZE':
          this.maze = data
        break
      }
    },
    goOnline () {
      let ws = this.ws = new WebSocket(`${location.protocol.replace('http', 'ws')}//${location.hostname}:8880`)
      ws.onopen = this.onOpen
      ws.onmessage = message => {
        try {
          this.onMessage(JSON.parse(message.data))
        } catch (err) {
          this.error = err
        }
      }
      this.offline = false
    },
    goOffline () {
      if (this.ws) {
        this.ws.close()
        this.ws = null
      }
      this.offline = true
    }
  },
  created () {
    this.newMaze()
  },
  mounted () {
    window.addEventListener('keydown', e => {
      this.onKeyDown(e)
    })
  },
  beforeDestroy () {
    this.goOffline()
  }
}
</script>

<style lang="scss">
body {
  overflow-y: hidden;
}
#app {
  background: #36393f;
  color: #fff;
  font-family: Catamaran, Lato, Helvetica, Arial, sans-serif;
}
.top-bar {
  background: #202225;
}
.intermission {
  background: rgba(0, 0, 0, .3);
}
.scroller {
  &::-webkit-scrollbar { width: 14px; height: 14px; }
  &::-webkit-scrollbar-thumb { background: #202225; }
  &::-webkit-scrollbar-track, &::-webkit-scrollbar-corner { background: #2f3136; }
  &::-webkit-scrollbar-thumb, &::-webkit-scrollbar-track {
    border: 3px solid #36393f;
    border-radius: 7px;
  }
  overflow-y: scroll;
}
.material-icons {
  .menu-bar &, .top-bar & {
    color: #a6a7a8;
  }
  &.close:hover { color: #f04747; }
  &.hamburger:hover { color: #fff; }
  transition: .2s color ease;
  user-select: none;
}
</style>

