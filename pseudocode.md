# Pseudocode for our A* implementation
```
// Returns a unique string key for grid coordinates
function getCoordKey(coords)
   return coords.row.toString() + coords.col.toString()

// Reconstructs the path from start to goal using the cameFrom map
function reconstructPath(cameFrom, current)
   totalPath := [current]
   while current exists
       current := cameFrom[getCoordKey(current)]
       if current exists
           totalPath.insertAtStart(current)
   return totalPath

// Custom comparator for PriorityQueue that prioritizes lower f-scores
function compareDistance(a, b, fScore)
   return fScore[getCoordKey(b)] - fScore[getCoordKey(a)]

// A* pathfinding optimized for grid-based movement with terrain costs
// Returns array of grid coordinates from start to goal, or false if no path exists
function aStar(start, goal, board, heuristicFunction)
   startCoords := board.getCoordFromPos(start)
   goalCoords := board.getCoordFromPos(goal)

   gScore := empty object
   gScore[getCoordKey(startCoords)] := 0

   fScore := empty object
   fScore[getCoordKey(startCoords)] := heuristicFunction(startCoords, goalCoords)

   cameFrom := empty object

   // Using both PriorityQueue and Set for efficient operations
   openSetCoords := empty Set
   openSet := new PriorityQueue(compareDistance)
   openSet.enqueue(startCoords)
   openSetCoords.add(startCoords)

   while openSet is not empty
       current := openSet.dequeue()
       currentKey := getCoordKey(current)
       currentGScore := gScore[currentKey] ?? Infinity

       if current.row equals goalCoords.row AND current.col equals goalCoords.col
           return reconstructPath(cameFrom, current)

       neighbours := board.tiles.neighbours(current.row, current.col)
       
       for each neighbour in neighbours
           neighbourKey := getCoordKey(neighbour)
           neighbourGScore := gScore[neighbourKey] ?? Infinity
           
           tile := board.getTileAtCoord(neighbour)
           if tile is null
               continue
           
           // Factor in terrain cost for pathfinding
           tentativeGScore := currentGScore + tile.getPathfindingCost()
           
           if tentativeGScore < neighbourGScore
               cameFrom[neighbourKey] := current
               gScore[neighbourKey] := tentativeGScore
               fScore[neighbourKey] := tentativeGScore + heuristicFunction(neighbour, goalCoords)
               
               if neighbour not in openSetCoords
                   openSet.enqueue(neighbour)
                   openSetCoords.add(neighbour)

   return false
   ```

## Time- and Spacecomplexity

*Time complexity:* O(RC * log(RC))
*Space complexity:* O(RC)

Hvor R er rows og C er columns i grid'et