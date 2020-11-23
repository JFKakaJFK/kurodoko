import React from 'react'
import { UNDEFINED, WHITE, BLACK } from './puzzle-representation'

const ohnoTutorial = [
  {
    description: () => <p>
      A cell can see the other cells in the same row and column.
      Red cells block the view of white cells and each white cell needs to see at least one other white cell.
      This means, that the cell with the number 2 in the bottom row can see the highlighted cells.
    </p>,
    rows: 4,
    cols: 4,
    grid: [
      [
        { value: UNDEFINED, locked: true },
        { value: '2', locked: true },
        { value: UNDEFINED, locked: true, highlighted: true },
        { value: UNDEFINED, locked: true }
      ], [
        { value: BLACK, locked: true },
        { value: UNDEFINED, locked: true },
        { value: '4', locked: true, highlighted: true },
        { value: UNDEFINED, locked: true }
      ], [
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: '3', locked: true, highlighted: true },
        { value: '3', locked: true }
      ], [
        { value: '1', locked: true, highlighted: true },
        { value: UNDEFINED, locked: true, highlighted: true },
        { value: '2', locked: true },
        { value: UNDEFINED, locked: true, highlighted: true }
      ]
    ],
    clickAnywhereToAdvance: true,
  },
  {
    description: () => <p>
      The number in the cell means that the cell should see exactly 2 other cells.
      Cells with numbers are always white. This means the 2 cannot see any more cells than the
      two numbered cells above.
    </p>,
    rows: 4,
    cols: 4,
    grid: [
      [
        { value: UNDEFINED, locked: true },
        { value: '2', locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true }
      ], [
        { value: BLACK, locked: true },
        { value: UNDEFINED, locked: true },
        { value: '4', locked: true, highlighted: true },
        { value: UNDEFINED, locked: true }
      ], [
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: '3', locked: true, highlighted: true },
        { value: '3', locked: true }
      ], [
        { value: '1', locked: true },
        { value: UNDEFINED, locked: true },
        { value: '2', locked: true },
        { value: UNDEFINED, locked: true }
      ]
    ],
    clickAnywhereToAdvance: true,
  },
  {
    description: () => <p>
      These 3 cells need to be red to make sure that the 2 does not see too many cells.
      Make them Red by tapping each cell twice.
    </p>,
    rows: 4,
    cols: 4,
    grid: [
      [
        { value: UNDEFINED, locked: true },
        { value: '2', locked: true },
        { value: UNDEFINED, solution: BLACK, highlighted: true },
        { value: UNDEFINED, locked: true }
      ], [
        { value: BLACK, locked: true },
        { value: UNDEFINED, locked: true },
        { value: '4', locked: true },
        { value: UNDEFINED, locked: true }
      ], [
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: '3', locked: true },
        { value: '3', locked: true }
      ], [
        { value: '1', locked: true },
        { value: UNDEFINED, solution: BLACK, highlighted: true },
        { value: '2', locked: true },
        { value: UNDEFINED, solution: BLACK, highlighted: true }
      ]
    ],
    clickAnywhereToAdvance: false,
  },
  {
    description: () => <p>
      Well done! Lets look at the highlighted 1 next. It needs to see one more cell and can only look
      upwards.
    </p>,
    rows: 4,
    cols: 4,
    grid: [
      [
        { value: UNDEFINED, locked: true },
        { value: '2', locked: true },
        { value: BLACK, locked: true },
        { value: UNDEFINED, locked: true }
      ], [
        { value: BLACK, locked: true },
        { value: UNDEFINED, locked: true },
        { value: '4', locked: true },
        { value: UNDEFINED, locked: true }
      ], [
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: '3', locked: true },
        { value: '3', locked: true }
      ], [
        { value: '1', locked: true, highlighted: true },
        { value: BLACK, locked: true },
        { value: '2', locked: true },
        { value: BLACK, locked: true },
      ]
    ],
    clickAnywhereToAdvance: true,
  },
  {
    description: () => <p>
      This cell needs to be white in order to make sure that the cell below
      cees 1 other cell. Make it white by tapping it once.
    </p>,
    rows: 4,
    cols: 4,
    grid: [
      [
        { value: UNDEFINED, locked: true },
        { value: '2', locked: true },
        { value: BLACK, locked: true },
        { value: UNDEFINED, locked: true }
      ], [
        { value: BLACK, locked: true },
        { value: UNDEFINED, locked: true },
        { value: '4', locked: true },
        { value: UNDEFINED, locked: true }
      ], [
        { value: UNDEFINED, solution: WHITE, highlighted: true },
        { value: UNDEFINED, locked: true },
        { value: '3', locked: true },
        { value: '3', locked: true }
      ], [
        { value: '1', locked: true },
        { value: BLACK, locked: true },
        { value: '2', locked: true },
        { value: BLACK, locked: true },
      ]
    ],
    clickAnywhereToAdvance: false,
  },
  {
    description: () => <p>
      Now look at this 3. It already can 3 other cells and must not see any more.
    </p>,
    rows: 4,
    cols: 4,
    grid: [
      [
        { value: UNDEFINED, locked: true },
        { value: '2', locked: true },
        { value: BLACK, locked: true },
        { value: UNDEFINED, locked: true }
      ], [
        { value: BLACK, locked: true },
        { value: UNDEFINED, locked: true },
        { value: '4', locked: true },
        { value: UNDEFINED, locked: true }
      ], [
        { value: WHITE, locked: true },
        { value: UNDEFINED, locked: true },
        { value: '3', locked: true, highlighted: true },
        { value: '3', locked: true }
      ], [
        { value: '1', locked: true },
        { value: BLACK, locked: true },
        { value: '2', locked: true },
        { value: BLACK, locked: true },
      ]
    ],
    clickAnywhereToAdvance: true,
  },
  {
    description: () => <p>
      Since the 3 already sees enough the highlighted cell must be black. Make it black now.
    </p>,
    rows: 4,
    cols: 4,
    grid: [
      [
        { value: UNDEFINED, locked: true },
        { value: '2', locked: true },
        { value: BLACK, locked: true },
        { value: UNDEFINED, locked: true }
      ], [
        { value: BLACK, locked: true },
        { value: UNDEFINED, locked: true },
        { value: '4', locked: true },
        { value: UNDEFINED, locked: true }
      ], [
        { value: WHITE, locked: true },
        { value: UNDEFINED, solution: BLACK, highlighted: true },
        { value: '3', locked: true },
        { value: '3', locked: true }
      ], [
        { value: '1', locked: true },
        { value: BLACK, locked: true },
        { value: '2', locked: true },
        { value: BLACK, locked: true },
      ]
    ],
    clickAnywhereToAdvance: false,
  },
  {
    description: () => <p>
      Awesome, now look at the top left cell with the number 2.
      It needs to see 2 other cells and it can only see one to the left and one downwards.
      Therefore both of these cells must be white. Make them white now.
    </p>,
    rows: 4,
    cols: 4,
    grid: [
      [
        { value: UNDEFINED, solution: WHITE, highlighted: true },
        { value: '2', locked: true },
        { value: BLACK, locked: true },
        { value: UNDEFINED, locked: true }
      ], [
        { value: BLACK, locked: true },
        { value: UNDEFINED, solution: WHITE, highlighted: true },
        { value: '4', locked: true },
        { value: UNDEFINED, locked: true }
      ], [
        { value: WHITE, locked: true },
        { value: BLACK, locked: true },
        { value: '3', locked: true },
        { value: '3', locked: true }
      ], [
        { value: '1', locked: true },
        { value: BLACK, locked: true },
        { value: '2', locked: true },
        { value: BLACK, locked: true },
      ]
    ],
    clickAnywhereToAdvance: false,
  },
  {
    description: () => <p>
      Great, now only two cells are left. Can you solve the puzzle?
    </p>,
    rows: 4,
    cols: 4,
    grid: [
      [
        { value: WHITE, locked: true },
        { value: '2', locked: true },
        { value: BLACK, locked: true },
        { value: UNDEFINED, solution: WHITE, highlighted: true }
      ], [
        { value: BLACK, locked: true },
        { value: WHITE, locked: true },
        { value: '4', locked: true },
        { value: UNDEFINED, solution: WHITE, highlighted: true }
      ], [
        { value: WHITE, locked: true },
        { value: BLACK, locked: true },
        { value: '3', locked: true },
        { value: '3', locked: true }
      ], [
        { value: '1', locked: true },
        { value: BLACK, locked: true },
        { value: '2', locked: true },
        { value: BLACK, locked: true },
      ]
    ],
    clickAnywhereToAdvance: false,
  },
  {
    description: () => <p>
      Well done, you have finished the tutorial!
    </p>,
    rows: 4,
    cols: 4,
    grid: [
      [
        { value: WHITE, locked: true },
        { value: '2', locked: true },
        { value: BLACK, locked: true },
        { value: WHITE, locked: true }
      ], [
        { value: BLACK, locked: true },
        { value: WHITE, locked: true },
        { value: '4', locked: true },
        { value: WHITE, locked: true }
      ], [
        { value: WHITE, locked: true },
        { value: BLACK, locked: true },
        { value: '3', locked: true },
        { value: '3', locked: true }
      ], [
        { value: '1', locked: true },
        { value: BLACK, locked: true },
        { value: '2', locked: true },
        { value: BLACK, locked: true },
      ]
    ],
    clickAnywhereToAdvance: true,
  },
]
export default ohnoTutorial