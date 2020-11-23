import os
import time
from ctypes import RTLD_GLOBAL, CDLL, Structure, POINTER, c_int, byref, c_double, c_char_p
import numpy as np

import utils as u

CDLL('/usr/lib/x86_64-linux-gnu/libz3.so', mode=RTLD_GLOBAL)
lib = CDLL(os.path.dirname(
    os.path.abspath(__file__)) + '/lib_solver.so')


class Options(Structure):
    """Struct for solver options"""
    _fields_ = [
        ('check_unique', c_int),
        ('number_encoding', c_int)
    ]


class SolverStatistics(Structure):
    """Struct for solver statistics"""
    _fields_ = [
        ('size', c_int),
        ('keys', POINTER(c_char_p)),
        ('values', POINTER(c_double))
    ]


class Result(Structure):
    """Struct for solver result"""
    _fields_ = [
        ('satisfiable', c_int),
        ('unique', c_int),
        ('solution', POINTER(c_int)),
        ('stats', POINTER(SolverStatistics))
    ]


lib.solve.argtypes = [c_int, c_int, np.ctypeslib.ndpointer(
    dtype=np.int32), Options, POINTER(Result)]
lib.free_solution.argtypes = [POINTER(Result)]


def solve(rows, cols, puzzle, check_unique=None, number_method=None):
    # solver options
    num_options = {'enumerate': 0, 'visibility': 1}

    # create struct for solver options
    options = Options(
        1 if check_unique else 0,
        num_options.get(number_method, 0)
    )

    # encodes the puzzle in the needed representation of integers
    # where -2 is undefined, -1 is black and 0 is white,
    # numbers bigger than 0 are number hints
    arr = np.full((rows*cols), -2, dtype=np.int32)
    for i in range(rows):
        row = puzzle[i].split(' ')
        for j in range(cols):
            if u.is_number(row[j]):
                arr[i*cols+j] = int(row[j])
            elif u.is_black(row[j]):
                arr[i*cols+j] = -1
            elif u.is_white(row[j]):
                arr[i*cols+j] = 0
    # create result struct and solve
    res = Result(0, 0, None, None)
    lib.solve(rows, cols, arr, options, byref(res))

    # collect stats
    solver_stats = res.stats.contents
    s = {}
    for i in range(solver_stats.size):
        s[solver_stats.keys[i].decode('utf-8')] = \
            int(solver_stats.values[i]) if solver_stats.values[i].is_integer() \
            else solver_stats.values[i]

    # generate result dict
    rvals = {0: None, 1: True, -1: False}
    rcolors = {0: u.WHITE, -1: u.BLACK}
    result = {
        'satisfiable': rvals[res.satisfiable or 0],
        'solution': None if not rvals[res.satisfiable or 0] or not res.solution else [' '.join([rcolors[res.solution[i*cols+j]] for j in range(cols)]) for i in range(rows)],
        'unique': rvals[res.unique or 0],
        'stats': s
    }

    # free the used memory
    lib.free_solution(byref(res))
    return result


class Solver():
    """Wrapper for actual solve method"""

    def __init__(self, rows, cols):
        self.rows = rows
        self.cols = cols

    def solve(self, puzzle, **kwargs):
        return solve(self.rows, self.cols, puzzle, **kwargs)


if __name__ == '__main__':
    rows, cols = 5, 5
    puzzle = [
        ". B 4 . .",
        ". . 5 4 .",
        ". . . . .",
        "2 2 . . 1",
        "B . 3 . ."
    ]

    print(f'(PYTHON) starting ...')
    t = time.time()
    s = Solver(rows, cols)
    res = s.solve(puzzle, check_unique=True)
    #res = solve(rows, cols, puzzle, check_unique=True)
    t = time.time() - t
    print(f'(PYTHON) total time: {t}s')

    print(res)

    if res['satisfiable']:
        u.print_puzzle(res['solution'])
