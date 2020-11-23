import time as t
import random as r
import math as m
import secrets

from . import solver as s

import utils as u


def is_above_difficulty_threshold(stats, difficulty):
    """Returns True iff the stats indicate that the puzzle is above the wanted difficulty else False"""
    # TODO use actual solving data
    return False
    if difficulty == u.EASY:
        return stats.get('decisions', 0) > 100 or stats.get('conflicts', 0) > 25
    elif difficulty == u.MEDIUM:
        return stats.get('decisions', 0) > 150 or stats.get('conflicts', 0) > 100
    else:
        return False


def fill(rows, cols):
    """
    generates a grid with only black cells,
    then adds all hints and returns the puzzle and its solution.
    """
    ncells = rows * cols
    # TODO mu (avg num of black cells for size) and sigma (var of # of black cells)
    nblacks = max(
        0, min(ncells // 2 + 1, round(r.gauss(mu=ncells*.4, sigma=ncells * .075))))

    puzzle = [[u.UNDEFINED for col in range(cols)] for row in range(rows)]

    cells = [i for i in range(ncells)]

    # 1. First a puzzle without numbers is randomly filled with black cells
    #    such that no rules are violated. (All non black cells see at least one other non black cell)
    # O(rows*cols)
    r.shuffle(cells)
    for i in cells:
        if nblacks <= 0:
            break
        row = i // cols
        col = i % cols

        puzzle[row][col] = u.BLACK
        nblacks -= 1

        # check if all white neighbours still see at least one non black cell
        for (x, y) in u.DIRECTIONS:
            row1 = row + x
            col1 = col + y
            if 0 <= row1 < rows and 0 <= col1 < cols and not u.is_black(puzzle[row1][col1]):
                sees_one = False
                for (x1, y1) in u.DIRECTIONS:
                    r1 = row1 + x1
                    c1 = col1 + y1
                    if 0 <= r1 < rows and 0 <= c1 < cols and not u.is_black(puzzle[r1][c1]):
                        sees_one = True
                        break
                if not sees_one:
                    puzzle[row][col] = u.WHITE
                    nblacks += 1
                    break

    # O(rows*cols)
    solution = [' '.join([u.BLACK if u.is_black(
        puzzle[row][col]) else u.WHITE for col in range(cols)]) for row in range(rows)]

    # 2. Then the number of visible cells is added for all white cells.
    #    O(rows*cols)
    seen = [[[0 for i in range(4)] for col in range(cols)]
            for row in range(rows)]
    for i in range(ncells):
        vcol = i % cols
        trow = i // cols
        brow = rows - trow - 1
        hrow = i % rows
        lcol = i // rows
        rcol = cols - lcol - 1
        # top
        if not u.is_black(puzzle[trow][vcol]):
            seen[trow][vcol][0] = seen[trow - 1][vcol][0] + 1 if trow > 0 else 1
        # right
        if not u.is_black(puzzle[hrow][rcol]):
            seen[hrow][rcol][1] = seen[hrow][rcol + 1][1] + \
                1 if rcol < cols - 1 else 1
        # bottom
        if not u.is_black(puzzle[brow][vcol]):
            seen[brow][vcol][2] = seen[brow + 1][vcol][2] + \
                1 if brow < rows - 1 else 1
        # left
        if not u.is_black(puzzle[hrow][lcol]):
            seen[hrow][lcol][3] = seen[hrow][lcol - 1][3] + 1 if lcol > 0 else 1

    # fill in all numbers
    for i in range(ncells):
        row = i // cols
        col = i % cols
        if not u.is_black(puzzle[row][col]):
            puzzle[row][col] = str(sum(seen[row][col]) - 4)

    return (puzzle, solution)


def generate(rows, cols, difficulty=None, seed=None, unique=True, max_time=None):
    """
    Generate a unique Oh No puzzle

    1. First a puzzle without numbers is randomly filled with black cells
       such that no rules are violated.

    2. Then the number of visible cells is added for all white cells.

    3. Lastly cell values are randomly removed one by one while the 
       uniqueness in maintained until the desired difficulty is achieved.

    The resulting puzzle is then returned as dictionary of the form {
        'type': 'KURODOKO'|'OHNO',
        'difficulty': 'EASY'|'MEDIUM'|'HARD',
        'rows': number of rows,
        'cols': number of cols,
        'puzzle': puzzle,
        'solution': solution,
        'seed': seed
    }

    Arguments
    ---------
    rows: the number of rows of the new puzzle
    cols: the number of cols of the new puzzle
    (difficulty): the wanted difficulty of the puzzle
    (seed): the seed for the prng
    """
    if rows < 1 or cols < 1:
        raise Exception(
            f'Both the number of rows and columns must be greater than 0 (were {rows} and {cols})')

    difficulty = difficulty or u.MEDIUM

    if unique is None:
        unique = True

    res = {
        'type': u.OHNO,
        'difficulty': difficulty,
        'rows': rows,
        'cols': cols,
        'puzzle': None,
        'solution': None,
        'generation_time': t.time(),
        'seed': seed if seed is not None else secrets.token_urlsafe(6)
    }

    # the only unique 1x1 puzzle must have the number 1 and is solved...
    if rows == 1 and cols == 1:
        res['puzzle'] = [u.BLACK]
        res['solution'] = [u.BLACK]
        res['generation_time'] = t.time() - res['generation_time']
        return res

    r.seed(res['seed'])
    ncells = rows * cols
    cells = [i for i in range(ncells)]

    usable = False
    while not usable:
        # 1. and 2.
        puzzle, res['solution'] = fill(rows, cols)

        r.shuffle(cells)
        for i in range(round(ncells * .2)):
            row = cells[i] // cols
            col = cells[i] % cols
            puzzle[row][col] = u.UNDEFINED

        usable = not unique or s.solve(rows, cols, u.get_puzzle(
            puzzle), check_unique=unique).get('unique', False)

    # 3. Lastly the numbered cells are randomly removed one by one while the
    #    uniqueness in maintained until the desired difficulty is achieved.
    #    O(rows*cols*O(solving puzzle))
    solving_time = 0

    r.shuffle(cells)
    for i in cells:
        if max_time is not None and t.time() - res['generation_time'] >= max_time:
            break

        row = i // cols
        col = i % cols
        # remove the hint
        if u.is_undefined(puzzle[row][col]):
            continue
        val, puzzle[row][col] = puzzle[row][col], u.UNDEFINED

        stime = t.time()
        solution = s.solve(rows, cols, u.get_puzzle(puzzle),
                           check_unique=unique, number_method='enumeration')
        solving_time += t.time() - stime

        # if removing the hint adds more solutions or makes the puzzle too difficult, the hint is added again
        if (unique and not solution['unique']) or is_above_difficulty_threshold(solution['stats'], difficulty):
            puzzle[row][col] = val
    # todo remove
    print(f'solving time: {solving_time}s')

    res['puzzle'] = u.get_puzzle(puzzle)
    res['generation_time'] = t.time() - res['generation_time']
    return res
