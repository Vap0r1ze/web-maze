// Credit: https://github.com/dstromberg2/maze-generator

module.exports = function genMaze (x, y) {
  var totalCells = x * y
  var cells = new Array()
  var unvis = new Array()
  for (var i = 0; i < y; i++) {
    cells[i] = new Array()
    unvis[i] = new Array()
    for (var j = 0; j < x; j++) {
      cells[i][j] = [0, 0, 0, 0]
      unvis[i][j] = true
    }
  }
  
  // Set a random position to start from
  var currentCell = [ Math.floor(Math.random() * y), Math.floor(Math.random() * x) ]
  var path = [currentCell]
  unvis[currentCell[0]][currentCell[1]] = false
  var visited = 1

  while (visited < totalCells) {
    var pot = [
      [ currentCell[0] - 1, currentCell[1], 0, 2 ],
      [ currentCell[0], currentCell[1] + 1, 1, 3 ],
      [ currentCell[0] + 1, currentCell[1], 2, 0 ],
      [ currentCell[0], currentCell[1] - 1, 3, 1 ]
    ]
    var neighbors = new Array()

    for (var l = 0; l < 4; l++)
      if (pot[l][0] > -1 && pot[l][0] < y && pot[l][1] > -1 && pot[l][1] < x && unvis[pot[l][0]][pot[l][1]])
        neighbors.push(pot[l])

    if (neighbors.length) {
      var next = neighbors[Math.floor(Math.random()*neighbors.length)]
      cells[currentCell[0]][currentCell[1]][next[2]] = 1
      cells[next[0]][next[1]][next[3]] = 1
      unvis[next[0]][next[1]] = false
      visited++
      currentCell = [next[0], next[1]]
      path.push(currentCell)
    } else {
      currentCell = path.pop()
    }
  }
  return cells
}
