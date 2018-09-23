<template>
  <div class="overflow-y-hidden flex items-center justify-center">
    <!-- <div class="maze h-full flex flex-col">
      <div v-for="y in (maze.length * 2 + 1)" :key="y" class="flex-1 flex">
        <div v-for="x in (maze[0].length * 2 + 1)" :key="x" class="flex-1" :class="{
          'maze-wall': mazeWall(x - 1, y - 1),
          'maze-player': player.x === x - 1 && player.y === y - 1
        }"></div>
      </div>
    </div> -->
    <canvas class="maze shadow" ref="canvas"/>
  </div>
</template>

<script>
export default {
  props: {
    maze: { type: Array, required: true }
  },
  watch: {
    maze () {
      this.player.x = 1
      this.player.y = 0
    },
    player: {
      handler () {
        this.drawMaze()
        this.drawPlayer()
      },
      deep: true
    }
  },
  data () {
    return {
      player: { x: 1, y: 0 },
      ctx: null
    }
  },
  methods: {
    mazeWall (x, y) {
      if (x < 0 || y < 0 || x > this.maze[0].length * 2 || y > this.maze.length * 2)
        return true
      if (x % 2 && y % 2)
        return
      if (x === 1 && y === 0)
        return
      if (x === this.maze[0].length * 2 && y === this.maze.length * 2 - 1)
        return
      let wallX = !(x % 2)
      let wallY = !(y % 2)
      let corner = wallX && wallY
      if (corner) {
        return true
      } else if (wallX) {
        if (x)
          return !this.maze[(y - 1) / 2][x / 2 - 1][1]
        else
          return !this.maze[(y - 1) / 2][0][3]
      } else if (wallY) {
        if (y)
          return !this.maze[y / 2 - 1][(x - 1) / 2][2]
        else
          return !this.maze[0][(x - 1) / 2][0]
      }
    },
    onKeyDown (e) {
      let oldPlayer = {
        x: this.player.x,
        y: this.player.y
      }
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          if (!this.mazeWall(this.player.x, this.player.y - 1))
            this.player.y--
        break
        case 'KeyD':
        case 'ArrowRight':
          if (!this.mazeWall(this.player.x + 1, this.player.y))
            this.player.x++
        break
        case 'KeyS':
        case 'ArrowDown':
          if (!this.mazeWall(this.player.x, this.player.y + 1))
            this.player.y++
        break
        case 'KeyA':
        case 'ArrowLeft':
          if (!this.mazeWall(this.player.x - 1, this.player.y))
            this.player.x--
        break
      }
      if (this.player.x === this.maze[0].length * 2 && this.player.y === this.maze.length * 2 - 1)
        this.win()
    },
    resize () {
      if (this.$el.clientHeight < this.$el.clientWidth) {
        this.$refs.canvas.height = this.$el.clientHeight
        this.$refs.canvas.width = this.$el.clientHeight
      } else {
        this.$refs.canvas.height = this.$el.clientWidth
        this.$refs.canvas.width = this.$el.clientWidth
      }
    },
    drawMaze () {
      let { width, height } = this.$refs.canvas
      this.ctx.fillStyle = '#2f3136'
      this.ctx.fillRect(0, 0, width, height)
      let s = (this.$refs.canvas.height / (this.maze.length * 2 + 1))
      this.ctx.fillStyle = '#43b581'
      this.ctx.fillRect(s, 0, s, s)
      this.ctx.fillStyle = '#f04747'
      this.ctx.fillRect(s * this.maze[0].length * 2, s * (this.maze.length * 2 - 1), s, s)
      this.ctx.fillStyle = '#2a2c31'
      this.ctx.strokeStyle = '#2a2c31'
      for (let y = 0; y < this.maze.length * 2 + 1; y++) {
        for (let x = 0; x < this.maze[0].length * 2 + 1; x++) {
          if (this.mazeWall(x, y)) {
            this.ctx.fillRect(s * x, s * y, s, s)
            this.ctx.strokeRect(s * x, s * y, s, s)
          }
        }
      }
    },
    drawPlayer (oldPlayer) {
      let s = (this.$refs.canvas.height / (this.maze.length * 2 + 1))
      if (oldPlayer) {
        this.ctx.fillStyle = '#2f3136'
        this.ctx.fillRect(s * oldPlayer.x, s * oldPlayer.y, s, s)
      }
      this.ctx.fillStyle = '#7289da'
      this.ctx.fillRect(s * this.player.x, s * this.player.y, s, s)
    },
    onWindowResize () {
      this.resize()
      this.drawMaze()
      this.drawPlayer()
    },
    win () {
      this.$emit('win')
    }
  },
  mounted () {
    this.ctx = this.$refs.canvas.getContext('2d')
    this.resize()
    this.drawMaze()
    this.drawPlayer()
    window.addEventListener('resize', this.onWindowResize)
  },
  destroyed () {
    window.removeEventListener('resize', this.onWindowResize)
  }
}
</script>

<style>
.maze {
  background: #2f3136;
}
.maze-wall {
  background: #2a2c31;
}
.maze-player {
  background: #7289da;
}
</style>
