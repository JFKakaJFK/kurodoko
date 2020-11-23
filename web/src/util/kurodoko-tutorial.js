import React from 'react'
import { UNDEFINED, WHITE, BLACK } from './puzzle-representation'

const kurodokoTutorial = [
  {
    description: () => <p>
      The number 9 in the bottom right cell denotes that this cell needs to see exactly 9 cells.
    </p>,
    rows: 5,
    cols: 5,
    grid: [
      [
        { value: '3', locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
      ], [
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
      ], [
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
      ], [
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: '5', locked: true },
        { value: UNDEFINED, locked: true },
      ], [
        { value: '6', locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: '9', locked: true, highlighted: true },
      ]
    ],
    clickAnywhereToAdvance: true,
  }, {
    description: () => <p>
      The cell can see all cells in the same row and column - 4 to the top, 4 to its left and itself.
      Since the cell needs to see 9 cells in total, it needs to see all highligted cells.
    </p>,
    rows: 5,
    cols: 5,
    grid: [
      [
        { value: '3', locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, solution: WHITE, locked: true, highlighted: true },
      ], [
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, solution: WHITE, locked: true, highlighted: true },
      ], [
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, solution: WHITE, locked: true, highlighted: true },
      ], [
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: '5', locked: true },
        { value: UNDEFINED, solution: WHITE, locked: true, highlighted: true },
      ], [
        { value: '6', locked: true, highlighted: true },
        { value: UNDEFINED, solution: WHITE, locked: true, highlighted: true },
        { value: UNDEFINED, solution: WHITE, locked: true, highlighted: true },
        { value: UNDEFINED, solution: WHITE, locked: true, highlighted: true },
        { value: '9', locked: true, highlighted: true },
      ]
    ],
    clickAnywhereToAdvance: true,
  }, {
    description: () => <p>
      Mark them with a dot to show that these cells must be white. You can do this by tapping each cell once. Cells with numbers are always white.
    </p>,
    rows: 5,
    cols: 5,
    grid: [
      [
        { value: '3', locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, solution: WHITE, highlighted: true },
      ], [
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, solution: WHITE, highlighted: true },
      ], [
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, solution: WHITE, highlighted: true },
      ], [
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: '5', locked: true },
        { value: UNDEFINED, solution: WHITE, highlighted: true },
      ], [
        { value: '6', locked: true },
        { value: UNDEFINED, solution: WHITE, highlighted: true },
        { value: UNDEFINED, solution: WHITE, highlighted: true },
        { value: UNDEFINED, solution: WHITE, highlighted: true },
        { value: '9', locked: true },
      ]
    ],
    clickAnywhereToAdvance: false,
  }, {
    description: () => <p>
      Nicely done. Now lets look at the 6 in the bottom left.
      This cell already sees 5 cells and the only remaining direction is upwards.
    </p>,
    rows: 5,
    cols: 5,
    grid: [
      [
        { value: '3', locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: '5', locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: '6', locked: true, highlighted: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: '9', locked: true },
      ]
    ],
    clickAnywhereToAdvance: true,
  }, {
    description: () => <p>
      Therefore this cell must be white. Mark it with a dot.
    </p>,
    rows: 5,
    cols: 5,
    grid: [
      [
        { value: '3', locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: UNDEFINED, solution: WHITE, highlighted: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: '5', locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: '6', locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: '9', locked: true },
      ]
    ],
    clickAnywhereToAdvance: false,
  },
  {
    description: () => <p>
      Now the 6 sees 6 cells. If it would see any more, it would see too many.
      Therefore this cell must be black to block the view. Make it black by tapping the cell twice.
    </p>,
    rows: 5,
    cols: 5,
    grid: [
      [
        { value: '3', locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: UNDEFINED, solution: BLACK, highlighted: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: WHITE, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: '5', locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: '6', locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: '9', locked: true },
      ]
    ],
    clickAnywhereToAdvance: false,
  },
  {
    description: () => <p>
      Black cells cannot be next to each other. Hence, these cells must be white. Mark them with a dot.
    </p>,
    rows: 5,
    cols: 5,
    grid: [
      [
        { value: '3', locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: UNDEFINED, solution: WHITE, highlighted: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: BLACK, locked: true },
        { value: UNDEFINED, solution: WHITE, highlighted: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: WHITE, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: '5', locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: '6', locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: '9', locked: true },
      ]
    ],
    clickAnywhereToAdvance: false,
  },
  {
    description: () => <p>
      Now this 3 already sees 2 cells and can only see more cells to the right.
    </p>,
    rows: 5,
    cols: 5,
    grid: [
      [
        { value: '3', locked: true, highlighted: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: WHITE, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: BLACK, locked: true },
        { value: WHITE, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: WHITE, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: '5', locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: '6', locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: '9', locked: true },
      ]
    ],
    clickAnywhereToAdvance: true,
  },
  {
    description: () => <p>
      Therefore this cell must be white. Mark it with a dot.
    </p>,
    rows: 5,
    cols: 5,
    grid: [
      [
        { value: '3', locked: true },
        { value: UNDEFINED, solution: WHITE, highlighted: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: WHITE, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: BLACK, locked: true },
        { value: WHITE, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: WHITE, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: '5', locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: '6', locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: '9', locked: true },
      ]
    ],
    clickAnywhereToAdvance: false,
  },
  {
    description: () => <p>
      Now the 3 sees exactly 3 cells.
      Since it cannot see more cells, this cell must be black. Make it black now.
    </p>,
    rows: 5,
    cols: 5,
    grid: [
      [
        { value: '3', locked: true },
        { value: WHITE, locked: true },
        { value: UNDEFINED, solution: BLACK, highlighted: true },
        { value: UNDEFINED, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: WHITE, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: BLACK, locked: true },
        { value: WHITE, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: WHITE, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: '5', locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: '6', locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: '9', locked: true },
      ]
    ],
    clickAnywhereToAdvance: false,
  },
  {
    description: () => <p>
      Black cells cannot be adjacent and therefore these cells need to be white.
      Mark them with a dot.
    </p>,
    rows: 5,
    cols: 5,
    grid: [
      [
        { value: '3', locked: true },
        { value: WHITE, locked: true },
        { value: BLACK, locked: true },
        { value: UNDEFINED, solution: WHITE, highlighted: true },
        { value: WHITE, locked: true },
      ], [
        { value: WHITE, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, solution: WHITE, highlighted: true },
        { value: UNDEFINED, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: BLACK, locked: true },
        { value: WHITE, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: WHITE, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: '5', locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: '6', locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: '9', locked: true },
      ]
    ],
    clickAnywhereToAdvance: false,
  },
  {
    description: () => <p>
      All white cells need to be connected to each other.
      If this cell is black, then the top left white cells are disconnected from the others.
      Therefore this cell cannot be black. Mark it with a dot.
    </p>,
    rows: 5,
    cols: 5,
    grid: [
      [
        { value: '3', locked: true },
        { value: WHITE, locked: true },
        { value: BLACK, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: WHITE, locked: true },
        { value: UNDEFINED, solution: WHITE, highlighted: true },
        { value: WHITE, locked: true },
        { value: UNDEFINED, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: BLACK, locked: true },
        { value: WHITE, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: WHITE, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: '5', locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: '6', locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: '9', locked: true },
      ]
    ],
    clickAnywhereToAdvance: false,
  },
  {
    description: () => <p>
      Nice, now only the cell with the number 5 is left.
      The cell already sees 3 cells and needs to see 2 more.
    </p>,
    rows: 5,
    cols: 5,
    grid: [
      [
        { value: '3', locked: true },
        { value: WHITE, locked: true },
        { value: BLACK, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: UNDEFINED, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: BLACK, locked: true },
        { value: WHITE, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: WHITE, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: '5', locked: true, highlighted: true },
        { value: WHITE, locked: true },
      ], [
        { value: '6', locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: '9', locked: true },
      ]
    ],
    clickAnywhereToAdvance: true,
  },
  {
    description: () => <p>
      If both of the highlighted cells would be white,
      then the 5 would see at least 6 cells in total.
    </p>,
    rows: 5,
    cols: 5,
    grid: [
      [
        { value: '3', locked: true },
        { value: WHITE, locked: true },
        { value: BLACK, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: UNDEFINED, locked: true, highlighted: true },
        { value: WHITE, locked: true },
      ], [
        { value: BLACK, locked: true },
        { value: WHITE, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true, highlighted: true },
        { value: WHITE, locked: true },
      ], [
        { value: WHITE, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: '5', locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: '6', locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: '9', locked: true },
      ]
    ],
    clickAnywhereToAdvance: true,
  },
  {
    description: () => <p>
      Therefore the 5 can see at most one more cell to the top.
      In order to see 5 cells it needs to see at least one to the left.
    </p>,
    rows: 5,
    cols: 5,
    grid: [
      [
        { value: '3', locked: true },
        { value: WHITE, locked: true },
        { value: BLACK, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: UNDEFINED, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: BLACK, locked: true },
        { value: WHITE, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: WHITE, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, solution: WHITE, highlighted: true },
        { value: '5', locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: '6', locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: '9', locked: true },
      ]
    ],
    clickAnywhereToAdvance: false,
  },
  {
    description: () => <p>
      Now the 5 can see 4 cells and needs to see one more.
      If this cell is white, then the 5 would see too many cells.
      Make it black.
    </p>,
    rows: 5,
    cols: 5,
    grid: [
      [
        { value: '3', locked: true },
        { value: WHITE, locked: true },
        { value: BLACK, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: UNDEFINED, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: BLACK, locked: true },
        { value: WHITE, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: WHITE, locked: true },
        { value: UNDEFINED, solution: BLACK, highlighted: true },
        { value: WHITE, locked: true },
        { value: '5', locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: '6', locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: '9', locked: true },
      ]
    ],
    clickAnywhereToAdvance: false,
  },
  {
    description: () => <p>
      Alright, now the 5 needs to see one cell more and it can only look upwards.
      Therefore this cell must be white.
    </p>,
    rows: 5,
    cols: 5,
    grid: [
      [
        { value: '3', locked: true },
        { value: WHITE, locked: true },
        { value: BLACK, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: UNDEFINED, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: BLACK, locked: true },
        { value: WHITE, locked: true },
        { value: UNDEFINED, locked: true },
        { value: UNDEFINED, solution: WHITE, highlighted: true },
        { value: WHITE, locked: true },
      ], [
        { value: WHITE, locked: true },
        { value: BLACK, locked: true },
        { value: WHITE, locked: true },
        { value: '5', locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: '6', locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: '9', locked: true },
      ]
    ],
    clickAnywhereToAdvance: false,
  },
  {
    description: () => <p>
      The 5 already sees 5 cells, therefore it must not see
      any more and this cell needs to be black.
    </p>,
    rows: 5,
    cols: 5,
    grid: [
      [
        { value: '3', locked: true },
        { value: WHITE, locked: true },
        { value: BLACK, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: UNDEFINED, solution: BLACK, highlighted: true },
        { value: WHITE, locked: true },
      ], [
        { value: BLACK, locked: true },
        { value: WHITE, locked: true },
        { value: UNDEFINED, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: WHITE, locked: true },
        { value: BLACK, locked: true },
        { value: WHITE, locked: true },
        { value: '5', locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: '6', locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: '9', locked: true },
      ]
    ],
    clickAnywhereToAdvance: false,
  },
  {
    description: () => <p>
      Awesome. Now only one cell is left! <br />
      Can you fill in the last cell?
      Remember, all white cells need to be connected!
    </p>,
    rows: 5,
    cols: 5,
    grid: [
      [
        { value: '3', locked: true },
        { value: WHITE, locked: true },
        { value: BLACK, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: BLACK, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: BLACK, locked: true },
        { value: WHITE, locked: true },
        { value: UNDEFINED, solution: WHITE, highlighted: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: WHITE, locked: true },
        { value: BLACK, locked: true },
        { value: WHITE, locked: true },
        { value: '5', locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: '6', locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: '9', locked: true },
      ]
    ],
    clickAnywhereToAdvance: false,
  },
  {
    description: () => <p>
      Well done, you have completed the tutorial!
    </p>,
    rows: 5,
    cols: 5,
    grid: [
      [
        { value: '3', locked: true },
        { value: WHITE, locked: true },
        { value: BLACK, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: BLACK, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: BLACK, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: WHITE, locked: true },
        { value: BLACK, locked: true },
        { value: WHITE, locked: true },
        { value: '5', locked: true },
        { value: WHITE, locked: true },
      ], [
        { value: '6', locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: WHITE, locked: true },
        { value: '9', locked: true },
      ]
    ],
    clickAnywhereToAdvance: true,
  },
]

export default kurodokoTutorial