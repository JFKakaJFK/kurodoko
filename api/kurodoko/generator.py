import time as t
import random as r
import math as m
import secrets

from . import solver as s

import utils as u

DIFFICULTY_FEATURES = [
    {
        'key': 'conflicts',
        'weight': 1.2,
        'inverse': False,
        u.EASY: 0.056484,
        u.MEDIUM: 0.090577,
        u.HARD: 0.116345
    },
    {
        'key': 'decisions',
        'weight': 1.7,
        'inverse': False,
        u.EASY: 0.123950,
        u.MEDIUM: 0.313655,
        u.HARD: 0.430811
    },
    {
        'key': 'propagations',
        'weight': 1,
        'inverse': False,
        u.EASY: 4.450242,
        u.MEDIUM: 13.840906,
        u.HARD: 19.733808
    },
    {
        'key': 'binary propagations',
        'weight': 1,
        'inverse': False,
        u.EASY: 4.183718,
        u.MEDIUM: 13.157986,
        u.HARD: 18.729243
    },
    {
        'key': 'mk clause',
        'weight': .8,
        'inverse': False,
        u.EASY: 1.822596,
        u.MEDIUM: 3.014489,
        u.HARD: 3.709164
    },
    {
        'key': 'del clause',
        'weight': .8,
        'inverse': True,
        u.EASY: 1.007723,
        u.MEDIUM: 0.999623,
        u.HARD: 0.836749
    },
    {
        'key': 'rlimit count',
        'weight': .7,
        'inverse': False,
        u.EASY: 95.894522,
        u.MEDIUM: 152.058771,
        u.HARD: 184.480561
    },
    {
        'key': 'num allocs',
        'weight': .7,
        'inverse': False,
        u.EASY: 1.113149e+08,
        u.MEDIUM: 9.919828e+08,
        u.HARD: 2.465924e+09
    },
    {
        'key': 'connectivity_iterations',
        'weight': 1.2,
        'inverse': False,
        u.EASY: 0.006118,
        u.MEDIUM: 0.008100,
        u.HARD: 0.010892
    }
    ,{
        'key': 'connectivity_violations',
        'weight': 1,
        'inverse': False,
        u.EASY: 0.013063,
        u.MEDIUM: 0.037198,
        u.HARD: 0.041168
    }
]

def is_above_difficulty_threshold(stats, difficulty, absolute_threshold = None, relative_threshold = .5, tolerance=.05):
    """Returns True iff the stats indicate that the puzzle is above the wanted difficulty else False"""
    
    def feature_to_weight(feature):
        val = stats.get(feature['key'], None)
        limit = feature.get(difficulty, None)
        if val is None or limit is None:
            return 0
        return feature.get('weight', 1) if (val < limit + limit * tolerance if feature.get('inverse', False) else val > limit - limit * tolerance) else 0

    res = sum(map(feature_to_weight, DIFFICULTY_FEATURES))
    return res / len(DIFFICULTY_FEATURES) > relative_threshold if absolute_threshold is None else res > absolute_threshold


def fill(rows, cols):
    """
    generates a grid with only black cells,
    then adds all hints and returns the puzzle and its solution.
    """
    ncells = rows * cols
    # TODO mu (avg num of black cells for size) and sigma (var of # of black cells)
    nblacks = max(
        0, min(ncells // 2 + 1, round(r.gauss(mu=ncells*.375, sigma=ncells * .05))))

    nwhites = ncells
    puzzle = [[u.UNDEFINED for col in range(cols)] for row in range(rows)]

    cells = [i for i in range(ncells)]

    # 1. First a puzzle without numbers is randomly filled with black cells
    #    such that no rules are violated.
    #    O((rows*cols)^2)
    r.shuffle(cells)
    for i in cells:
        if ncells - nwhites >= nblacks:
            break
        row = i // cols
        col = i % cols
        if not u.is_undefined(puzzle[row][col]):
            continue
        # color the cell black if it is not yet colored
        puzzle[row][col] = u.BLACK
        nwhites -= 1
        # check if all non-black cells are connected
        if not u.white_connected(rows, cols, puzzle, nwhites):
            puzzle[row][col] = u.WHITE
            nwhites += 1
            continue
        # make the adjacent cells white
        for (x, y) in u.DIRECTIONS:
            row1 = row + x
            col1 = col + y
            if 0 <= row1 < rows and 0 <= col1 < cols:
                puzzle[row1][col1] = u.WHITE

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

    # fill in all numbers and remove the black cells (make them undefined)
    for i in range(ncells):
        row = i // cols
        col = i % cols
        if u.is_black(puzzle[row][col]):
            puzzle[row][col] = u.UNDEFINED
        else:
            puzzle[row][col] = str(sum(seen[row][col]) - 3)

    return (puzzle, solution)


def generate(rows, cols, difficulty=None, seed=None, unique=True, max_time=None):
    """
    Generate a unique kurodoko puzzle

    1. First a puzzle without numbers is randomly filled with black cells
       such that no rules are violated.

    2. Then the number of visible cells is added for all white cells.

    3. Lastly the numbered cells are randomly removed one by one while the 
       uniqueness in maintained until the desired difficulty is achieved.


    In order to speed things up (its cheaper to generate multiple puzzles than to remove a hint and check uniqueness)
    after 1&2 a certain number of hints are removed directly and if the puzzle is not unique then steps 1 and 2 are
    repeated until a unique puzzle is found.

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
        'type': u.KURODOKO,
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
        res['puzzle'] = ['1']
        res['solution'] = [u.WHITE]
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
        for i in range(round(ncells * .5)):
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
        solution = s.solve(rows, cols, u.get_puzzle(puzzle), check_unique=unique,
                           use_heuristics=True, number_method='enumeration', connectivity_method='violations')
        solving_time += t.time() - stime

        # if removing the hint adds more solutions or makes the puzzle too difficult, the hint is added again
        if (unique and not solution['unique']) or is_above_difficulty_threshold(solution['stats'], difficulty, absolute_threshold=2, tolerance=.1):
            if solution['unique']:
                print(f'hint [{row}|{col}|{val}] stays for difficulty reasons.')
            puzzle[row][col] = val
    # todo remove
    print(f'solving time: {solving_time}s')

    res['puzzle'] = u.get_puzzle(puzzle)
    res['generation_time'] = t.time() - res['generation_time']
    return res
