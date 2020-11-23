import typing as t
import heapq as h

import numpy as np

from utils.directions import DIRECTIONS, DIAGONALS
from utils.representation import is_black


def __dfs(rows: int, cols: int, row: int, col: int, puzzle: t.List[t.List[str]], visited: t.List[t.List[bool]]) -> int:
    """
    Depth first search, assumes that edges only exist between adjacent
    white cells and ignores black cells.
    """
    visited[row, col] = True
    nvisited = 1
    for (x, y) in DIRECTIONS:
        row1 = row + x
        col1 = col + y
        if 0 <= row1 < rows and 0 <= col1 < cols and \
                not visited[row1, col1] and not is_black(puzzle[row1][col1]):
            nvisited += __dfs(rows, cols, row1, col1, puzzle, visited)
    return nvisited


def __white_connected_r(rows: int, cols: int, puzzle: t.List[t.List[str]], nwhites: int) -> bool:
    """
    Checks if nwhites white cells are connected to each other using
    a recursive version of depth first search
    """
    visited = np.full((rows, cols), False)
    # get the position of the first white cell
    row, col = 0, 0
    if is_black(puzzle[row][col]):
        if cols == 1:
            row = 1
        else:
            col = 1
    return nwhites == __dfs(rows, cols, row, col, puzzle, visited)


def __white_connected_i(rows: int, cols: int, puzzle: t.List[t.List[str]], nwhites: int) -> bool:
    """
    Checks if nwhites white cells are connected to each other using
    an iterative version of depth first search
    """
    visited = np.full((rows, cols), False)
    # get the position of the first white cell
    row, col = 0, 0
    if is_black(puzzle[row][col]):
        if cols == 1:
            row = 1
        else:
            col = 1

    # iterative dfs
    nvisited = 0
    stack = [(row, col)]
    while len(stack) > 0:
        row, col = stack.pop()
        if visited[row, col]:
            continue
        nvisited += 1
        visited[row, col] = True
        for (x, y) in DIRECTIONS:
            row1 = row + x
            col1 = col + y
            if 0 <= row1 < rows and 0 <= col1 < cols and \
                    not visited[row1, col1] and not is_black(puzzle[row1][col1]):
                stack.append((row1, col1))

    return nwhites == nvisited


def white_connected(rows: int, cols: int, puzzle: t.List[t.List[str]], nwhites: int) -> bool:
    """
    Depending on the problem size the iterative or recursive version is returned
    """
    return __white_connected_r(rows, cols, puzzle, nwhites) if rows * cols < 1000 else __white_connected_i(rows, cols, puzzle, nwhites)


def __adjacent(rows: int, cols: int, grid: t.List[t.List[str]], row: int, col: int) -> t.List[t.Tuple]:
    """
    Returns all diagonally adjacent cells of a black cell.
    """
    adjacent = []
    for (x, y) in DIAGONALS:
        r, c = row + x, col + y
        if 0 <= r < rows and 0 <= c < cols and is_black(grid[r][c]):
            adjacent.append((r, c))
    return adjacent


def a_star(rows, cols, grid, r1, c1, r2, c2):
    """
    A* search for grid graphs, where each cell in the path has the same color.
    """
    assert (is_black(grid[r1][c1]) and is_black(grid[r2][c2])) or (
        not is_black(grid[r1][c1]) and not is_black(grid[r2][c2]))

    openHeap = []
    h.heappush(openHeap, (0, r1 * cols + c1))
    closeSet = set()

    parent = {}

    cost = {}
    cost[r1 * cols + c1] = 0

    while len(openHeap) > 0:
        current = h.heappop(openHeap)[1]
        row, col = current // cols, current % cols
        # if we are at the target node we just backtrack to the start
        if row == r2 and col == c2:
            path = [(row, col)]
            while current in parent:
                current = parent[current]
                path.append((current // cols, current % cols))
            return path

        closeSet.add(current)
        for (r, c) in __adjacent(rows, cols, grid, row, col):
            if is_black(grid[r][c]) != is_black(grid[r2][c2]):
                continue
            tcost = cost[row * cols + col] + 1
            if tcost < cost.get(r * cols + c, rows*cols):
                parent[r * cols + c] = current
                cost[r * cols + c] = tcost
                if r * cols + c not in closeSet:
                    h.heappush(
                        openHeap, (tcost + abs(r-r2)+abs(c-c2), r * cols + c))
    return []


NOT_VISITED = 0
VISITING = 1
VISITED = 2


def __dfs_ce(rows: int, cols: int, grid: t.List[t.List[str]], row: int, col: int, visited: t.List[t.List[int]], parent: t.Dict = {}, edges: t.List[int] = [], cycles: t.List[t.List[int]] = []) -> t.Tuple:
    visited[row, col] = VISITING
    if row == 0 or row == rows - 1 or col == 0 or col == cols - 1:
        edges.append((row, col))
    for (r, c) in __adjacent(rows, cols, grid, row, col):
        if not is_black(grid[r][c]):
            continue
        if visited[r, c] == VISITING and parent[row*cols+col] != r*cols+c:
            cycle = [(row, col)]
            current = row * cols + col
            while current != r*cols+c:
                current = parent[current]
                cycle.append((current // cols, current % cols))
            cycles.append(cycle)
        if visited[r, c] == NOT_VISITED:
            parent[r * cols + c] = row * cols + col
            __dfs_ce(rows, cols, grid, r, c, visited, parent, edges, cycles)

    visited[row, col] = VISITED
    return (edges, cycles)


def find_connectivity_violations(rows: int, cols: int, grid: t.List[t.List[str]]) -> t.List[t.Any]:
    # 0 = not visited, 1 = visiting, 2 = fully visited
    visited = np.full((rows, cols), NOT_VISITED)
    #[[NOT_VISITED for col in range(cols)] for row in range(rows)]

    # violations are cycles of black cells or edge to edge paths of black cells
    violations = []

    for i in range(rows * cols):
        row, col = i // cols, i % cols
        if is_black(grid[row][col]) and visited[row, col] == NOT_VISITED:
            # collect component
            # find cycles
            # collect edge cells
            # -> if len(edge cells) >= 2 -> for all edge cell combinations find the shortest paths (A*)
            _edges, _cycles = __dfs_ce(
                rows, cols, grid, row, col, visited, {}, [], [])

            violations += _cycles
            if len(_edges) >= 2:
                for j in range(len(_edges) - 1):
                    for k in range(j + 1, len(_edges)):
                        # add the shortest path between the black edges to the violations
                        violations.append(a_star(
                            rows, cols, grid, _edges[j][0], _edges[j][1], _edges[k][0], _edges[k][1]))
    return violations
