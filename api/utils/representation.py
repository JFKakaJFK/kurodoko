import typing as t

from utils.difficulty import DIFFUCULTIES
from utils.puzzle_types import PUZZLE_TYPES, KURODOKO

UNDEFINED = '.'
BLACK = 'B'
WHITE = 'W'


def is_undefined(val: str) -> bool:
    """Returns true iff the cell value is undefined."""
    return val == UNDEFINED


def is_black(val: str) -> bool:
    """Returns true iff the cell is black."""
    return val == BLACK


def is_white(val: str) -> bool:
    """Returns true iff the cell is white."""
    return val == WHITE or val.isdigit()


def is_number(val: str) -> bool:
    """Returns true iff the cell contains a number."""
    return val.isdigit()


def validate(puzzle_type: str, rows: int, cols: int, puzzle: t.List[str] = None, difficulty: str = None) -> None:
    """Validates a given puzzle data and throws an Exception if the puzzle data is not valid."""
    if not puzzle_type in PUZZLE_TYPES:
        raise Exception(f'The puzzle type must be one of {PUZZLE_TYPES}')
    if difficulty is not None and difficulty not in DIFFUCULTIES:
        raise Exception(
            f'The (optional) difficulty must be one of {DIFFUCULTIES}')
    if not isinstance(rows, int) or not isinstance(cols, int):
        raise Exception(f'rows and cols must both be of type int')

    if rows <= 0 or cols <= 0:
        raise Exception(
            f'The number of rows and columns must both be greater than 0 (Found rows: {rows}, cols: {cols})')

    if puzzle is None:
        return

    if not isinstance(puzzle, list) or len(puzzle) != rows:
        raise Exception(f'The puzzle must be a list of length {rows}')

    for row in puzzle:
        if not isinstance(row, str):
            raise Exception(
                f'Each row of the puzzle is a string of the cells delimited by a whitespace')

        cells = row.split(' ')
        if len(cells) != cols:
            raise Exception(
                f'Each row must have {cols} elements. (Found a row with length {len(cells)})')
        for cell in cells:
            if cell not in '.WB' and not cell.isdigit():
                raise Exception(
                    f'Each cell must be one of [".", "W", "B"] or a number.')
            if cell.isdigit() and (int(cell) < 1 or int(cell) > rows + cols - (1 if puzzle_type == KURODOKO else 2)):
                raise Exception(
                    f'Each number must be between 1 and the biggest allowed number (rows + cols - {rows + cols - (1 if puzzle_type == KURODOKO else 2)})')


def get_puzzle_list(puzzle: t.List[str]) -> t.List[t.List[str]]:
    """
    Turns the list of strings into the list of cell strings
    """
    return [row.split(' ') for row in puzzle]


def get_puzzle(puzzle: t.List[t.List[str]]) -> t.List[str]:
    """
    Turns a list of lists into a puzzle
    """
    return [' '.join(row) for row in puzzle]


def print_puzzle(puzzle: t.List[str]) -> None:
    """
    Pretty prints a puzzle in the string represenation
    """
    for row in puzzle:
        for val in row.split(' '):
            v = '🔲'
            if val == 'B':
                v = '⬛'
            if val == 'W':
                v = '⬜'
            if val == '~':
                v = '🔸'
            elif val.isdigit() and int(val) >= 1:
                v = val + '️⃣ ' if int(val) < 10 else val
            print(v, end='')
        print()
    print()
