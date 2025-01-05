# Pseudocode for our A\* implementation

```
function reconstructPath(cameFrom, current)
    totalPath = [current]
    while current exists in cameFrom:
        current = cameFrom[current]
        totalPath.unshift(current)
    return totalPath

 
function aStar(start, goal, board, h)
    // Convert pixel coordinates to grid coordinates
    startCoords = board.getCoordFromPos(start)
    goalCoords = board.getCoordFromPos(goal)

    // Initialize data structures
    gScore = new Map()  // Cost of path from start to node
    fScore = new Map()  // Estimated total cost through node
    cameFrom = new Map()  // Used to reconstruct the path
    openSet = new PriorityQueue()

    // Initialize start node
    gScore[startCoords] = 0
    fScore[startCoords] = h(startCoords)
    openSet.enqueue(startCoords, fScore[startCoords])

    while openSet not empty:
        current = openSet.dequeue()
        
        if current equals goalCoords:
            return reconstructPath(cameFrom, current)
        
        // Check all four neighbors (N, S, E, W)
        for each neighbour in board.getNeighbours(current):
            tile = board.getTileAtCoord(neighbour)
            if tile is null or otherwise illegal:
                continue
                
            tentativeGScore = gScore[current] + tile.weight
            
            if tentativeGScore < gScore[neighbour]:
                // This path to neighbour is better than any 		       // previous one
                cameFrom[neighbour] = current
                gScore[neighbour] = tentativeGScore
                newFScore = tentativeGScore + h(neighbour)
                fScore[neighbour] = newFScore
                
                if neighbour not in openSet:
                    openSet.enqueue(neighbour, newFScore)
    
    return empty path // No path found
```
