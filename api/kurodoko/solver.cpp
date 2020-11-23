#include <iomanip>
#include <chrono>
#include <vector>
#include <queue>
#include <set>
#include <map>
#include <stack>
#include <tuple>
#include <math.h>
#include <assert.h>
#include "z3++.h"

using namespace z3;

/** MISSING .h DEFINITIONS */

expr mk_or(expr_vector const &args)
{
  array<Z3_ast> _args(args);
  Z3_ast r = Z3_mk_or(args.ctx(), _args.size(), _args.ptr());
  args.check_error();
  return expr(args.ctx(), r);
}

expr mk_and(expr_vector const &args)
{
  array<Z3_ast> _args(args);
  Z3_ast r = Z3_mk_and(args.ctx(), _args.size(), _args.ptr());
  args.check_error();
  return expr(args.ctx(), r);
}

expr atmost(expr_vector const &es, unsigned bound)
{
  assert(es.size() > 0);
  context &ctx = es[0].ctx();
  array<Z3_ast> _es(es);
  Z3_ast r = Z3_mk_atmost(ctx, _es.size(), _es.ptr(), bound);
  ctx.check_error();
  return expr(ctx, r);
}

// fill in for <expr>.is_true()
bool expr_is_true(expr e)
{
  return e.decl().decl_kind() == Z3_OP_TRUE;
}

/* helpers */

expr_vector mk_bool_vec(int size, const char *prefix, context *c)
{
  assert(size > 0);
  expr_vector vec((*c));
  for (unsigned i = 0; i < size; i++)
  {
    std::stringstream vname;
    vname << prefix << i;
    vec.push_back((*c).bool_const(vname.str().c_str()));
  }
  return vec;
}

expr_vector mk_int_vec(int size, const char *prefix, context *c)
{
  assert(size > 0);
  expr_vector vec((*c));
  for (unsigned i = 0; i < size; i++)
  {
    std::stringstream vname;
    vname << prefix << i;
    vec.push_back((*c).int_const(vname.str().c_str()));
  }
  return vec;
}

/* ======================== */

#define max(a, b) ((a) > (b) ? (a) : (b))
#define min2(a, b) ((a) < (b) ? (a) : (b))
#define min(a, b, c) ((a) < (b) ? (a) < (c) ? (a) : (c) : (b) < (c) ? (b) : (c))

#define UNKNOWN 0
#define TRUE 1
#define FALSE -1

#define UNDEFINED -2
#define BLACK -1
#define WHITE 0

#define is_num(x) ((x) > WHITE)
#define is_white(x) ((x) > BLACK)
#define is_black(x) ((x) == BLACK)
#define is_undef(x) ((x) == UNDEFINED)

#define is_in_bounds(rows, cols, row, col) (0 <= (row) && (row) < (rows) && 0 <= (col) && (col) < (cols))

#define NDIRS 4

/*
  The directions a white cell can see.
*/
#define TOP 0
#define RIGHT 1
#define BOTTOM 2
#define LEFT 3
int const DIRECTIONS[NDIRS][2] = {{-1, 0}, {0, 1}, {1, 0}, {0, -1}};

/*
  The diagonal directions which connects the black cells.
*/
#define TOP_LEFT 0
#define TOP_RIGHT 1
#define BOTTOM_RIGHT 2
#define BOTTOM_LEFT 3
int const DIAGONALS[NDIRS][2] = {{-1, -1}, {-1, 1}, {1, 1}, {1, -1}};

#define NOT_VISITED 0
#define VISITING 1
#define VISITED 2

#define ENUMERATION 0
#define VISIBILITY 1
#define NAIVE_ENUMERATION 2

#define ROOTED_TREES 0
#define CONNECTIVITY_VIOLATIONS_DFS 1
#define CONNECTIVITY_VIOLATIONS_A_STAR 2
#define REACHABILITY 3
#define NAIVE_DFS 4

extern "C" struct options
{
  int check_unique;          // 1 (yes) | 0 (no)
  int use_heuristics;        // 1 (yes) | 0 (no)
  int number_encoding;       // 0 (enumeration) | 1 (visibility) | 2 (naive_enumeration)
  int connectivity_encoding; // 0 (rooted trees) | 1 (violations w/ dfs) | 2 (violations w/ a*) | 3 (reachability) | 4 (naive_dfs)
};

extern "C" struct solver_stats
{
  int size;
  char **keys;
  double *values;
};

extern "C" struct solver_result
{
  int satisfiable;
  int unique;
  int *solution;
  solver_stats *stats;
};

/*
  Collects the solver statistics into a solver_stats struct.
*/
solver_stats *get_statistics(stats s, unsigned additional_keys = 0)
{
  solver_stats *statistics = new solver_stats;
  statistics->size = (int)(s.size() + additional_keys);
  statistics->keys = new char *[s.size() + additional_keys];
  statistics->values = new double[s.size() + additional_keys];

  for (unsigned i = 0; i < s.size(); i++)
  {
    statistics->keys[i] = new char[s.key(i).size() + 1]{};
    s.key(i).copy(statistics->keys[i], sizeof(char) * (s.key(i).size() + 1));
    statistics->values[i] = s.is_uint(i) ? (double)s.uint_value(i) : s.double_value(i);
  }
  return statistics;
}

/*
  Returns and empty solver_stats struct.
*/
solver_stats *empty_stats()
{
  solver_stats *statistics = new solver_stats;
  statistics->size = 0;
  statistics->keys = nullptr;
  statistics->values = nullptr;
  return statistics;
}

/** 
  Pretty prints the given grid.
*/
void print_grid(const int rows, const int cols, const int *grid)
{
  for (int i = 0; i < rows * cols; i++)
  {
    is_num(grid[i])
        ? std::cout << std::setfill(' ')
                    << std::setw((int)ceil(log10((double)rows + cols - 1)))
                    << grid[i]
                    << " "
        : std::cout << std::setfill(' ')
                    << std::setw((int)ceil(log10((double)rows + cols - 1)))
                    << (is_white(grid[i])
                            ? "·"
                            : is_black(grid[i])
                                  ? "B"
                                  : "_")
                    << " ";

    if (i % cols == cols - 1)
      std::cout << std::endl;
  }
  std::cout << std::endl;
}

/**
 Pretty prints a solver_stats struct.
*/
void print_solver_stats(solver_stats *stats)
{
  std::cout << "{\n";
  for (unsigned i = 0; i < stats->size; i++)
  {
    std::cout << "  \"" << stats->keys[i] << "\": " << stats->values[i] << (i == stats->size - 1 ? "\n" : ",\n");
  }
  std::cout << "}" << std::endl;
}

/*
  Ensures that no black cells are adjacent, by making sure that
  one of every two adjacent cells is white.
*/
void add_adjacency_constraints(const int rows, const int cols, solver *s, context *c, expr_vector *white)
{
  for (unsigned i = 0; i < rows * cols; i++)
  {
    // cell or top neighbour are white
    if (i >= cols)
      (*s).add((*white)[i] || (*white)[i - cols]);
    // skip last col (has no right neighbour)
    if (i % cols > 0)
      (*s).add((*white)[i] || (*white)[i - 1]);
  }
}

/*
  The absence of border to border paths of black cells and 
  the absence of black circles implies that all white cells are connected. 
  The proof via contradiction would look somewhat like this:

    Assume that not all white cells are connected, but there are no black 
    border to border paths and no black cycles.
    Then there exist two cells v and w such that there is no path of white cells 
    between them. This means that black cells block the path at some point. 
    If one follows the blocking black cells in one direction, one either ends up 
    at the same black cell (=> black cycle) or at the border. If one ends up at 
    the border, then backtracks to the first encountered black cell and follows 
    the blocking black cells, one again would end up at the border as the black 
    cells (=> border to border path of black cells). Of course if neither of the 
    previous cases is true, then a path around the black cells would exist which 
    would also be a contradiction.

  The absence of black border to border paths and black cycles also dictates that in a solution all connected components of black cells can be seen as directed acyclic graphs or more specifically rooted trees. This allows for a more efficient SMT encoding of the connectivity constraint:

  For each cell i 4 new boolean variables (one for each diagonal direction) 
  are added which are for a parent-child relation, where Pji denotes that j 
  is the parent of i. Each node has at most one parent, if two diagonally 
  adjacent cells are black there must exist a parent-child relation between 
  them (but only one, i.e. either Pij or Pji) and border cells have no parent 
  (as they are the root nodes).

  This already prohibits border to border black paths, as those would have 
  two root nodes and therefore one black cell along the path would have to 
  have two parent nodes, violating the at most one constraint. But cycles 
  would still be possible.

  This can be circumvented by also introducing an integer variable for the 
  depth of a cell in the tree for each cell.
  The depth of border cells then is 0, and if Pij then depth_j = depth_i + 1 
  for all of the parent-child variables.
  Cycles are not possible since the depth constraints would cause a conflict.

  TODO check what effects (if any) symmetry breaking, i.e. making white cells or 
  black cells with no neighbour have depth 0 and no parent, have regarding solving speed
  - my guess would be that the effects are minimal at best
*/
void add_connectivity_constraints(const int rows, const int cols, solver *s, context *c, expr_vector *white)
{
  // boolean relation, denotes that the cell in the given diagonal dir is
  // the current cells parent
  expr_vector parent = mk_bool_vec(rows * cols * NDIRS, "p", c);
  // depth of a cell in its tree
  expr_vector depth = mk_int_vec(rows * cols, "d", c);

  unsigned row, col, row1, col1;
  for (unsigned i = 0; i < rows * cols; i++)
  {
    row = i / cols;
    col = i % cols;
    if (row == 0 || row == rows - 1 || col == 0 || col == cols - 1)
    {
      // edge nodes are root nodes and therefore have no parents and depth 0
      for (unsigned d = 0; d < NDIRS; d++)
      {
        // has no parent
        (*s).add(!parent[NDIRS * i + d]);
        // if two diagonally adjacent cells are black, there exists a parent child relation
        row1 = row + DIAGONALS[d][0];
        col1 = col + DIAGONALS[d][1];
        if (is_in_bounds(rows, cols, row1, col1))
        {
          // eiter one of the cells is white, or the border cell is the parent of the other cell
          (*s).add((*white)[i] || (*white)[row1 * cols + col1] || parent[NDIRS * (row1 * cols + col1) + d + (d < 2 ? 2 : -2)]);
        }
      }
      // depth of border cell is 0
      (*s).add(depth[i] == 0);
    }
    else
    {
      // at most one parent
      expr_vector _p((*c));
      for (unsigned d = 0; d < NDIRS; d++)
      {
        row1 = row + DIAGONALS[d][0];
        col1 = col + DIAGONALS[d][1];
        if (is_in_bounds(rows, cols, row1, col1))
        {
          _p.push_back(parent[NDIRS * i + d]);

          // either one cell is white, or  there exists a parent child relation
          (*s).add((*white)[i] || (*white)[row1 * cols + col1] || parent[NDIRS * i + d] || parent[NDIRS * (row1 * cols + col1) + d + (d < 2 ? 2 : -2)]);
          // not both parent relations can be true
          (*s).add(!parent[NDIRS * i + d] || !parent[NDIRS * (row1 * cols + col1) + d + (d < 2 ? 2 : -2)]);

          // the depth of a node is 1 + the depth of the parent
          (*s).add(!parent[NDIRS * i + d] || depth[i] == 1 + depth[row1 * cols + col1]);
        }
        else
        {
          // if the parent is out of bounds, is cannot be a parent
          (*s).add(!parent[NDIRS * i + d]);
        }
      }
      // at most one parent
      (*s).add(atmost(_p, 1));
    }
  }
}

/**
  If a cell is white and not the number 1, then at least one of its neighbours must be white 
*/
bool add_connectivity_heuristic(const int rows, const int cols, solver *s, context *c, expr_vector *white, const int *puzzle, bool can_contain_number_one)
{
  unsigned row, col, row1, col1;
  for (unsigned i = 0; i < rows * cols; i++)
  {
    row = i / cols;
    col = i % cols;

    // number 1
    if (puzzle[i] == 1)
    {
      if (!can_contain_number_one)
        return false;
      expr_vector _p((*c));
      for (unsigned d = 0; d < NDIRS; d++)
      {
        row1 = row + DIRECTIONS[d][0];
        col1 = col + DIRECTIONS[d][1];
        if (is_in_bounds(rows, cols, row1, col1))
          _p.push_back(!(*white)[row1 * cols + col1]);
      }
      (*s).add(mk_and(_p));
    }
    else
    {
      expr_vector _p((*c));
      for (unsigned d = 0; d < NDIRS; d++)
      {
        row1 = row + DIRECTIONS[d][0];
        col1 = col + DIRECTIONS[d][1];
        if (is_in_bounds(rows, cols, row1, col1))
          _p.push_back((*white)[row1 * cols + col1]);
      }
      (*s).add(implies((*white)[i], mk_or(_p)));
    }
  }
  return true;
}

/**
  This method both adds the hints from the puzzle and the needed visibility constraints
  to enforce that each number contstraint is satisfied.

  The visibility constraint is satisfied by calculating the number of visible cells in each direction.
  Every cell has a variable for the number of visible cells in each direction. The visibility to the top
  is 0 for black cells in the top row and 1 for white cells in the top row. For each other cell
  the visibility is 0 if the cell is black and otherwhise 1 + the number of cells seen by the cell above.
  This is done for all directions.

  Then a numbered cell is satisfied if the sum of all visible cells - 3 (the cell itself was counted 4 times)
  is equal to the number.
  */
bool add_hints_and_visibility_constraints(const int rows, const int cols, solver *s, context *c, expr_vector *white, const int *puzzle, bool can_contain_number_one = true)
{
  std::vector<int> numbers;
  std::vector<bool> number_row(rows, false);
  std::vector<bool> number_col(cols, false);
  for (unsigned i = 0; i < rows * cols; i++)
  {
    if (is_num(puzzle[i]))
    {
      if (!can_contain_number_one && puzzle[i] == 1)
        return false;
      number_row[i / cols] = true;
      number_col[i % cols] = true;
      numbers.push_back(i);
      (*s).add((*white)[i]);
    }
    else if (is_white(puzzle[i]))
    {
      (*s).add((*white)[i]);
    }
    else if (is_black(puzzle[i]))
    {
      (*s).add(!(*white)[i]);
    }
  }

  if (!numbers.empty())
  {
    // the number of visible cells for each cell and direction
    expr_vector visible = mk_int_vec(rows * cols * NDIRS, "v", c);

    // add number constraints
    for (unsigned i = 0; i < numbers.size(); i++)
    {
      (*s).add(
          visible[NDIRS * numbers[i]] +
              visible[NDIRS * numbers[i] + 1] +
              visible[NDIRS * numbers[i] + 2] +
              visible[NDIRS * numbers[i] + 3] ==
          (puzzle[numbers[i]] + 3));
    }

    // add visibility encoding
    unsigned row, col;
    for (unsigned i = 0; i < rows * cols; i++)
    {
      if (number_row[i / cols] || number_col[i % cols])
      {
        for (unsigned d = 0; d < NDIRS; d++)
        {
          if (!number_row[i / cols] && d % 2 != 0)
            continue;
          if (!number_col[i % cols] && d % 2 == 0)
            continue;
          row = i / cols + DIRECTIONS[d][0];
          col = i % cols + DIRECTIONS[d][1];
          // at most all in this direction are visible
          (*s).add(visible[NDIRS * i + d] >= 0 && visible[NDIRS * i + d] <= (d % 2 == 0 ? rows : cols));
          if (is_in_bounds(rows, cols, row, col))
          {
            (*s).add(ite(
                (*white)[i],
                visible[NDIRS * i + d] == 1 + visible[NDIRS * (row * cols + col) + d],
                visible[NDIRS * i + d] == 0));
          }
          else
          {
            (*s).add(ite(
                (*white)[i],
                visible[NDIRS * i + d] == 1,
                visible[NDIRS * i + d] == 0));
          }
        }
      }
    }
  }
  return true;
}

/**
 Traverses a direction and collects all possible numbers of white cells seen in that
 direction. If another number is visible, it is also checked not to exceed that number.
*/
std::vector<std::pair<int, int>> compute_visibility_options(const int rows, const int cols, const int *puzzle, const int index, const int direction)
{
  unsigned row1 = index / cols + DIRECTIONS[direction][0],
           col1 = index % cols + DIRECTIONS[direction][1],
           smallest_number = puzzle[index],
           visible = 0, row2, col2;
  std::vector<std::pair<int, int>> options;
  options.reserve(direction % 2 == 0 ? rows : cols);

  do
  {
    if (is_in_bounds(rows, cols, row1, col1) && !is_black(puzzle[row1 * cols + col1]))
    {
      row2 = row1 + DIRECTIONS[direction][0];
      col2 = col1 + DIRECTIONS[direction][1];
      // if the next cell is not black or out of bounds then the next position can be black
      // and the current number of visible cells is an option
      if (is_undef(puzzle[row1 * cols + col1]) && (!is_in_bounds(rows, cols, row2, col2) || !is_black(puzzle[row2 * cols + col2])))
      {
        options.push_back(std::make_pair(visible, smallest_number));
      }
      // if a number is visited it is also checked that the new number is not exceeded
      else if (is_num(puzzle[row1 * cols + col1]) && puzzle[row1 * cols + col1] < smallest_number)
      {
        if (visible + 1 > puzzle[row1 * cols + col1])
          break;
        smallest_number = puzzle[row1 * cols + col1];
      }
    }
    else
    {
      // if the next cell is black|out of bounds, then this is the only remaining option
      options.push_back(std::make_pair(visible, smallest_number));
      break;
    }

    visible++;
    row1 = row2;
    col1 = col2;
  } while (visible < smallest_number);

  return options;
}

/*
  Creates the Z3 clause for a given option, where the option denotes how many cells
  a given cell sees in all 4 directions.
*/
expr add_number_option(const int rows, const int cols, const int index, const std::tuple<int, int, int, int> option, solver *s, context *c, expr_vector *white, bool add_black_cells = false)
{
  expr_vector clause((*c));
  int row = index / cols, col = index % cols;

  // all seen cells are white
  for (int i = row - std::get<TOP>(option); i <= row + std::get<BOTTOM>(option); i++)
    clause.push_back((*white)[i * cols + col]);
  for (int i = col - std::get<LEFT>(option); i < col; i++)
    clause.push_back((*white)[row * cols + i]);
  for (int i = col + 1; i <= col + std::get<RIGHT>(option); i++)
    clause.push_back((*white)[row * cols + i]);

  // add bordering black cells
  if (add_black_cells)
  {
    if (row - 1 - std::get<TOP>(option) >= 0)
      clause.push_back(!(*white)[(row - 1 - std::get<TOP>(option)) * cols + col]);
    if (row + 1 + std::get<BOTTOM>(option) < rows)
      clause.push_back(!(*white)[(row + 1 + std::get<BOTTOM>(option)) * cols + col]);
    if (col - 1 - std::get<LEFT>(option) >= 0)
      clause.push_back(!(*white)[row * cols + col - 1 - std::get<LEFT>(option)]);
    if (col + 1 + std::get<RIGHT>(option) < cols)
      clause.push_back(!(*white)[row * cols + col + 1 + std::get<RIGHT>(option)]);
  }
  return mk_and(clause);
}

/**
 Computes all possible number layouts for a given numbered cell and adds the corresponding
 clauses to the solver.
*/
bool add_number(const int rows, const int cols, const int *puzzle, const int index, solver *s, context *c, expr_vector *white)
{
  assert(is_num(puzzle[index]));

  std::tuple<int, int, int, int> always_white(puzzle[index], puzzle[index], puzzle[index], puzzle[index]);
  std::vector<std::tuple<int, int, int, int>> options;
  for (auto top : compute_visibility_options(rows, cols, puzzle, index, TOP))
  {
    for (auto bottom : compute_visibility_options(rows, cols, puzzle, index, BOTTOM))
    {
      if (top.first + bottom.first + 1 > min(top.second, bottom.second, puzzle[index]))
        continue;
      for (auto right : compute_visibility_options(rows, cols, puzzle, index, RIGHT))
      {
        if (top.first + right.first + bottom.first > puzzle[index])
          continue;
        for (auto left : compute_visibility_options(rows, cols, puzzle, index, LEFT))
        {
          if (right.first + left.first + 1 > min(right.second, left.second, puzzle[index]) || top.first + right.first + bottom.first + left.first + 1 != puzzle[index])
            continue;
          if (top.first < std::get<TOP>(always_white))
            std::get<TOP>(always_white) = top.first;
          if (right.first < std::get<RIGHT>(always_white))
            std::get<RIGHT>(always_white) = right.first;
          if (bottom.first < std::get<BOTTOM>(always_white))
            std::get<BOTTOM>(always_white) = bottom.first;
          if (left.first < std::get<LEFT>(always_white))
            std::get<LEFT>(always_white) = left.first;
          options.push_back(std::make_tuple(top.first, right.first, bottom.first, left.first));
        }
      }
    }
  }

  if (options.empty())
  {
    // no viable combination for this number -> puzzle is unsat
    return false;
  }
  else if (options.size() == 1)
  {
    // only one option => the number must be laid out this way
    (*s).add(add_number_option(rows, cols, index, options[0], s, c, white, true));
  }
  else
  {
    // add the fields which are white in all possible options
    (*s).add(add_number_option(rows, cols, index, always_white, s, c, white, false));
    // add 'one of the options' as clause
    // NOTE: while this should be at-most-one and at-least-one, a simple or suffices since
    // it ensures that one option holds and that only one option holds since all options
    // are distinct.
    expr_vector clauses((*c));
    for (auto opt : options)
    {
      clauses.push_back(add_number_option(rows, cols, index, opt, s, c, white, true));
    }
    (*s).add(mk_or(clauses));
  }
  return true;
}

/**
 Computes all number layouts for a given numbered cell and adds the corresponding
 clauses to the solver.
*/
bool add_number_naive(const int rows, const int cols, const int *puzzle, const int index, solver *s, context *c, expr_vector *white)
{
  assert(is_num(puzzle[index]));
  unsigned row = index / cols, col = index % cols, num = puzzle[index];

  std::vector<std::tuple<int, int, int, int>> options;
  for (int top = 0; top <= min2(row, num); top++)
  {
    for (int bottom = 0; bottom + row < rows && bottom + top < num; bottom++)
    {
      for (int right = 0; right + col < cols && top + right + bottom < num; right++)
      {
        for (int left = 0; left <= col && top + right + bottom + left < num; left++)
        {
          if (top + right + bottom + left + 1 == num)
            options.push_back(std::make_tuple(top, right, bottom, left));
        }
      }
    }
  }

  if (options.empty())
  {
    // no viable combination for this number -> puzzle is unsat
    return false;
  }
  else if (options.size() == 1)
  {
    // only one option => the number must be laid out this way
    (*s).add(add_number_option(rows, cols, index, options[0], s, c, white, true));
  }
  else
  {
    // add 'one of the options' as clause
    // NOTE: while this should be at-most-one and at-least-one, a simple or suffices since
    // it ensures that one option holds and that only one option holds since all options
    // are distinct.
    expr_vector clauses((*c));
    for (auto opt : options)
    {
      clauses.push_back(add_number_option(rows, cols, index, opt, s, c, white, true));
    }
    (*s).add(mk_or(clauses));
  }
  return true;
}

/*
  Adds the constraints of the puzzle instance and the possible number layouts.
*/
bool add_hints_and_enumerate_numbers(const int rows, const int cols, const int *puzzle, solver *s, context *c, expr_vector *white, bool can_contain_number_one = true, bool naive = false)
{
  if (!naive)
  {
    for (unsigned i = 0; i < rows * cols; i++)
    {
      if (is_num(puzzle[i]) && ((!can_contain_number_one && puzzle[i] == 1) || !add_number(rows, cols, puzzle, i, s, c, white)))
      {
        return false;
      }
      else if (is_white(puzzle[i]))
      {
        (*s).add((*white)[i]);
      }
      else if (is_black(puzzle[i]))
      {
        (*s).add(!(*white)[i]);
      }
    }
  }
  else
  {
    for (unsigned i = 0; i < rows * cols; i++)
    {
      if (is_num(puzzle[i]) && ((!can_contain_number_one && puzzle[i] == 1) || !add_number_naive(rows, cols, puzzle, i, s, c, white)))
      {
        return false;
      }
      else if (is_white(puzzle[i]))
      {
        (*s).add((*white)[i]);
      }
      else if (is_black(puzzle[i]))
      {
        (*s).add(!(*white)[i]);
      }
    }
  }
  return true;
}

/*
  A*, finds the shortest path between two black cells, which is added as clause to the solver.
*/
void a_star(const int rows, const int cols, const int *grid, const int row1, const int col1, const int row2, const int col2, solver *s, context *c, expr_vector *white)
{
  assert(is_black(grid[row1 * cols + col1]) && is_black(grid[row2 * cols + col2]));

  auto cmp = [](std::pair<int, int> a, std::pair<int, int> b) { return a.first > b.first; };
  std::priority_queue<std::pair<int, int>, std::vector<std::pair<int, int>>, decltype(cmp)> open(cmp);
  open.push(std::make_pair(0, row1 * cols + col1));

  std::set<int> closed;

  std::map<int, int> parent;
  std::map<int, int> cost;
  cost[row1 * cols + col1] = 0;

  int current, next, row, col, tcost;
  while (!open.empty())
  {
    current = open.top().second;
    open.pop();

    row = current / cols;
    col = current % cols;
    // if end is found, we collect and return the path
    if (row == row2 && col == col2)
    {
      expr_vector path((*c));
      path.push_back((*white)[current]);
      while (current != row1 * cols + col1)
      {
        current = parent[current];
        path.push_back((*white)[current]);
      }
      (*s).add(mk_or(path));
      return;
    }
    else
    {
      closed.insert(current);
      for (unsigned d = 0; d < NDIRS; d++)
      {
        next = (row + DIAGONALS[d][0]) * cols + col + DIAGONALS[d][1];
        if (is_in_bounds(rows, cols, row + DIAGONALS[d][0], col + DIAGONALS[d][1]) && is_black(grid[next]))
        {
          tcost = cost[current] + 1;
          if (cost.count(next) == 0 || tcost < cost[next])
          {
            parent[next] = current;
            cost[next] = tcost;
            if (closed.count(next) == 0)
            {
              open.push(std::make_pair(tcost + abs(row + DIAGONALS[d][0] - row2) + abs(col + DIAGONALS[d][1] - col2), next));
            }
          }
        }
      }
    }
  }
}

/**/
void find_cycles_and_border_cells(const int rows, const int cols, const int *grid, int index, int *visited, int *parent, unsigned *violations, std::vector<int> &border_cells, solver *s, context *c, expr_vector *white, bool use_a_star)
{
  visited[index] = VISITING;

  if (index < cols || index > rows * cols - cols || index % cols == 0 || index % cols == cols - 1)
  {
    if (!use_a_star)
    {
      // for each cell in border cells follow the parent relation until the other node is found
      // or until the root node is reached. Then add the path from the second border cell to the root node
      // => no path finding since we already know at least one path...
      // add to edges
      for (unsigned i = 0; i < border_cells.size(); i++)
      {
        (*violations)++;
        expr_vector path((*c));

        int current = index;
        // collect path to border cell | root
        while (current != border_cells[i] && current != -1)
        {
          path.push_back((*white)[current]);
          current = parent[current];
        }
        path.push_back((*white)[border_cells[i]]);
        // if root is reached (and root is not the cell we are looking for) add path from bc to root
        if (current == -1)
        {
          current = border_cells[i];
          while (parent[current] != -1)
          {
            current = parent[current];
            path.push_back((*white)[current]);
          }
        }
        (*s).add(mk_or(path));
      }
    }
    border_cells.push_back(index);
  }

  int row, col;
  for (unsigned d = 0; d < NDIRS; d++)
  {
    row = index / cols + DIAGONALS[d][0];
    col = index % cols + DIAGONALS[d][1];
    if (is_in_bounds(rows, cols, row, col) && is_black(grid[row * cols + col]))
    {
      if (visited[row * cols + col] == VISITING && parent[index] != row * cols + col)
      {
        // cycle
        (*violations)++;
        expr_vector cycle((*c));

        cycle.push_back((*white)[index]);
        int current = index;
        while (current != row * cols + col)
        {
          current = parent[current];
          cycle.push_back((*white)[current]);
        }
        (*s).add(mk_or(cycle));
      }
      else if (visited[row * cols + col] == NOT_VISITED)
      {
        parent[row * cols + col] = index;
        find_cycles_and_border_cells(rows, cols, grid, row * cols + col, visited, parent, violations, border_cells, s, c, white, use_a_star);
      }
    }
  }
  visited[index] = VISITED;
}

/*
  Adds all violations of the constraint that all white cells need to be connected
  to the solver as clauses using depth first seach.
  Returns true if there were no violations
*/
unsigned add_connectivity_violations(const int rows, const int cols, const int *grid, solver *s, context *c, expr_vector *white, bool use_a_star = true)
{
  unsigned violations = 0;
  int *visited = new int[rows * cols]{};
  int *parent = new int[rows * cols];

  for (unsigned i = 0; i < rows * cols; i++)
  {
    if (is_black(grid[i]) && visited[i] == NOT_VISITED)
    {
      parent[i] = -1; // is root of current connected component
      std::vector<int> border_cells;
      find_cycles_and_border_cells(rows, cols, grid, i, visited, parent, &violations, border_cells, s, c, white, use_a_star);

      // collect border to border paths and add clauses
      if (use_a_star && border_cells.size() >= 2)
      {
        for (unsigned bc1 = 0; bc1 < border_cells.size() - 1; bc1++)
        {
          for (unsigned bc2 = bc1 + 1; bc2 < border_cells.size(); bc2++)
          {
            violations++;
            a_star(rows, cols, grid, border_cells[bc1] / cols, border_cells[bc1] % cols, border_cells[bc2] / cols, border_cells[bc2] % cols, s, c, white);
          }
        }
      }
    }
  }

  delete[] visited;
  delete[] parent;
  return violations;
}

/*
  Solves the puzzle by repeatedly adding connectivity violations as clauses until a solution
  without any violations is found.
*/
void solve_connectivity_violations(const int rows, const int cols, const int *puzzle, solver *s, context *c, expr_vector *white, options opt, solver_result *res, bool use_a_star = true)
{
  unsigned connectivity_iterations = 0, connectivity_violations = 0, violations;
  int *valuation = new int[rows * cols];
  std::string ci("connectivity_iterations");
  std::string cv("connectivity_violations");

  while (true)
  {
    if ((*s).check() == sat)
    {
      model m = (*s).get_model();
      for (unsigned i = 0; i < rows * cols; i++)
      {
        valuation[i] = expr_is_true(m.eval((*white)[i], true)) ? WHITE : BLACK;
      }

      violations = add_connectivity_violations(rows, cols, valuation, s, c, white, use_a_star);

      if (violations == 0)
      {
        res->satisfiable = TRUE;
        res->solution = valuation;
        res->stats = get_statistics((*s).statistics(), 2);
        res->stats->keys[res->stats->size - 2] = new char[ci.size() + 1]{};
        ci.copy(res->stats->keys[res->stats->size - 2], sizeof(char) * (ci.size() + 1));
        res->stats->values[res->stats->size - 2] = connectivity_iterations;
        res->stats->keys[res->stats->size - 1] = new char[cv.size() + 1]{};
        cv.copy(res->stats->keys[res->stats->size - 1], sizeof(char) * (ci.size() + 1));
        res->stats->values[res->stats->size - 1] = connectivity_violations;

        if (opt.check_unique)
        {
          if (res->unique == UNKNOWN)
          {
            res->unique = TRUE;

            // add not this solution as clause
            expr_vector _s((*c));
            for (unsigned i = 0; i < rows * cols; i++)
            {
              _s.push_back(is_black(valuation[i]) ? (*white)[i] : !(*white)[i]);
            }
            (*s).add(mk_or(_s));
          }
          else
          {
            res->unique = FALSE;
            return;
          }
        }
        else
        {
          return;
        }
      }
      else
      {
        connectivity_iterations++;
        connectivity_violations += violations;
      }
    }
    else
    {
      if (!(res->satisfiable == TRUE))
      {
        delete[] valuation;
        res->satisfiable = FALSE;
        res->stats = get_statistics((*s).statistics(), 2);
        res->stats->keys[res->stats->size - 2] = new char[ci.size() + 1]{};
        ci.copy(res->stats->keys[res->stats->size - 2], sizeof(char) * (ci.size() + 1));
        res->stats->values[res->stats->size - 2] = connectivity_iterations;
        res->stats->keys[res->stats->size - 1] = new char[cv.size() + 1]{};
        cv.copy(res->stats->keys[res->stats->size - 1], sizeof(char) * (ci.size() + 1));
        res->stats->values[res->stats->size - 1] = connectivity_violations;
      }
      return;
    }
  }
}

/*
  Solves the puzzle by repeatedly checking if all white cells are connected 
  and then adding new clauses for each iteration
*/
void solve_connectivity_naive(const int rows, const int cols, const int *puzzle, solver *s, context *c, expr_vector *white, options opt, solver_result *res)
{
  unsigned connectivity_iterations = 0, nwhite, nvisited, current, row, col;
  int *valuation = new int[rows * cols], *visited = new int[rows * cols], first_white;
  std::string ci("connectivity_iterations");

  while (true)
  {
    if ((*s).check() == sat)
    {
      model m = (*s).get_model();
      expr_vector black((*c));
      nwhite = 0;
      first_white = -1;
      for (unsigned i = 0; i < rows * cols; i++)
      {
        if (expr_is_true(m.eval((*white)[i], true)))
        {
          if (first_white == -1)
            first_white = i;
          valuation[i] = WHITE;
          nwhite++;
        }
        else
        {
          valuation[i] = BLACK;
          black.push_back((*white)[i]);
        }
      }

      for (unsigned i = 0; i < rows * cols; i++)
        visited[i] = NOT_VISITED;
      nvisited = 1;
      visited[first_white] = VISITED;
      std::stack<int> stack;
      stack.push(first_white);
      while (!stack.empty())
      {
        current = stack.top();
        stack.pop();
        // recurse for all unvisited white neighbours
        for (unsigned d = 0; d < NDIRS; d++)
        {
          row = current / cols + DIRECTIONS[d][0];
          col = current % cols + DIRECTIONS[d][1];
          if (is_in_bounds(rows, cols, row, col) && visited[row * cols + col] == NOT_VISITED && is_white(valuation[row * cols + col]))
          {
            // make the current cell visited
            nvisited++;
            visited[row * cols + col] = VISITED;
            stack.push(row * cols + col);
          }
        }
      }

      if (nwhite == nvisited)
      {
        res->satisfiable = TRUE;
        res->solution = valuation;
        res->stats = get_statistics((*s).statistics(), 1);
        res->stats->keys[res->stats->size - 1] = new char[ci.size() + 1]{};
        ci.copy(res->stats->keys[res->stats->size - 1], sizeof(char) * (ci.size() + 1));
        res->stats->values[res->stats->size - 1] = connectivity_iterations;

        if (opt.check_unique)
        {
          if (res->unique == UNKNOWN)
          {
            res->unique = TRUE;

            // add not this solution as clause
            expr_vector _s((*c));
            for (unsigned i = 0; i < rows * cols; i++)
            {
              _s.push_back(is_black(valuation[i]) ? (*white)[i] : !(*white)[i]);
            }
            (*s).add(mk_or(_s));
          }
          else
          {
            res->unique = FALSE;
            delete[] visited;
            return;
          }
        }
        else
        {
          delete[] visited;
          return;
        }
      }
      else
      {
        (*s).add(mk_or(black));
        connectivity_iterations++;
      }
    }
    else
    {
      if (!(res->satisfiable == TRUE))
      {
        delete[] valuation;
        res->satisfiable = FALSE;
        res->stats = get_statistics((*s).statistics(), 1);
        res->stats->keys[res->stats->size - 1] = new char[ci.size() + 1]{};
        ci.copy(res->stats->keys[res->stats->size - 1], sizeof(char) * (ci.size() + 1));
        res->stats->values[res->stats->size - 1] = connectivity_iterations;
      }
      delete[] visited;
      return;
    }
  }
}

/*
  Adds the connectivity constraint using reachability, i.e. adds clauses to ensure that
  if two cells are white, then they must be connected (=reachable).

  Two cells are reachable with a path of length 2^0 iff they are direct neighbours and both cells 
  are white.
  Two cells are reachable with a path of length 2^L iff there exists a third cell which is reachable
  from both cells within 2^(L-1) steps, i.e. paths are chained together, where each concatenation
  doubles the path length.

  All white cells are connected, if every white cell can reach all of its diagonally adjacent
  white cells. This suffices to demand the connectedness of all white cells:

  White connected areas can only be disconnected by black cells. If a given black cell separates the white
  cells, then the white cells adjacent to this black cell (which are diagonally adjacent to each other)
  cannot reach each other. If this cannot happen, then all white cells must be connected.
*/
void add_reachablility_constraints(const int rows, const int cols, solver *s, context *c, expr_vector *white)
{
  unsigned nlevels = ceil(log2(rows * cols)), ncells = rows * cols, lsize = ncells * ncells, k, row, col;
  expr_vector reachable = mk_bool_vec((nlevels + 1) * ncells * ncells, "r", c);

  // lvl 2^0 = 1
  for (int i = 0; i < ncells - 1; i++)
  {
    for (int j = i + 1; j < ncells; j++)
    {
      if (abs(i / cols - j / cols) + abs(i % cols - j % cols) == 1)
      {
        (*s).add(reachable[ncells * i + j] == ((*white)[i] && (*white)[j]));
      }
      else
      {
        (*s).add(!reachable[ncells * i + j]);
      }
    }
  }

  // levels 2^1 - 2^(nlevels-1)
  for (unsigned l = 1; l < nlevels; l++)
  {
    for (int i = 0; i < ncells - 1; i++)
    {
      for (int j = i + 1; j < ncells; j++)
      {
        // cells can be reachable in 2^l steps iff the manhattan distance is <= 2^l
        if (abs(i / cols - j / cols) + abs(i % cols - j % cols) <= pow(2, l))
        {
          expr_vector _exists((*c));
          // if a cell is reachable it stays reachable
          _exists.push_back(reachable[lsize * (l - 1) + ncells * i + j]);

          // we begin at the topmost leftmost cell which can be reachable from the further
          // one of the two cells
          row = max(j / cols - pow(2, l - 1), 0);
          col = max(j % cols - (pow(2, l - 1) - j / cols + row), 0);
          k = row * cols + col;

          for (; k < i; k++)
          {
            _exists.push_back(reachable[lsize * (l - 1) + ncells * k + i] && reachable[lsize * (l - 1) + ncells * k + j]);
          }
          k++;
          for (; k < j; k++)
          {
            _exists.push_back(reachable[lsize * (l - 1) + ncells * i + k] && reachable[lsize * (l - 1) + ncells * k + j]);
          }
          k++;
          row = min2(i / cols + pow(2, l - 1), rows - 1);
          col = min2(i % cols + (pow(2, l - 1) - row + i / cols), cols - 1);
          for (; k <= row * cols + col; k++)
          {
            _exists.push_back(reachable[lsize * (l - 1) + ncells * i + k] && reachable[lsize * (l - 1) + ncells * j + k]);
          }

          (*s).add(reachable[lsize * l + ncells * i + j] == mk_or(_exists));
        }
        else
        {
          (*s).add(!reachable[lsize * l + ncells * i + j]);
        }
      }
    }
  }

  // for (unsigned i = 0; i < ncells - 1; i++)
  // {
  //   for (unsigned j = i + 1; j < ncells; j++)
  //   {
  //     (*s).add(!(*white)[i] || !(*white)[j] || reachable[lsize * nlevels + ncells * i + j]);
  //   }
  // }

  // for the last needed reachablility it is cheaper to only encode it for the cell pairs that need it
  // connectivity constraint (each white cell is connected to its diagoal adjacent white cells)
  for (unsigned i = 0; i < (rows - 1) * cols; i++)
  {
    unsigned j;
    row = i / cols + DIAGONALS[2][0];
    col = i % cols + DIAGONALS[2][1];
    if (is_in_bounds(rows, cols, row, col))
    {
      j = row * cols + col;

      expr_vector _exists((*c));
      // either one of the cells is black
      _exists.push_back(!(*white)[i]);
      _exists.push_back(!(*white)[j]);
      _exists.push_back(reachable[lsize * (nlevels - 1) + ncells * i + j]);

      // or the cells are connected in a way

      // we begin at the topmost leftmost cell which can be reachable from the further
      // one of the two cells
      row = max(j / cols - pow(2, nlevels - 1), 0);
      col = max(j % cols - (pow(2, nlevels - 1) - j / cols + row), 0);
      k = row * cols + col;
      for (; k < i; k++)
      {
        _exists.push_back(reachable[lsize * (nlevels - 1) + ncells * k + i] && reachable[lsize * (nlevels - 1) + ncells * k + j]);
      }
      k++;
      for (; k < j; k++)
      {
        _exists.push_back(reachable[lsize * (nlevels - 1) + ncells * i + k] && reachable[lsize * (nlevels - 1) + ncells * k + j]);
      }
      k++;
      row = min2(i / cols + pow(2, nlevels - 1), rows - 1);
      col = min2(i % cols + (pow(2, nlevels - 1) - row + i / cols), cols - 1);
      for (; k <= row * cols + col; k++)
      {
        _exists.push_back(reachable[lsize * (nlevels - 1) + ncells * i + k] && reachable[lsize * (nlevels - 1) + ncells * j + k]);
      }

      // if both cells are white they are reachable
      (*s).add(mk_or(_exists));
    }
    row = i / cols + DIAGONALS[3][0];
    col = i % cols + DIAGONALS[3][1];
    if (is_in_bounds(rows, cols, row, col))
    {
      j = row * cols + col;

      expr_vector _exists((*c));
      // either one of the cells is black
      _exists.push_back(!(*white)[i]);
      _exists.push_back(!(*white)[j]);
      _exists.push_back(reachable[lsize * (nlevels - 1) + ncells * i + j]);

      // or the cells are connected in a way

      // we begin at the topmost leftmost cell which can be reachable from the further
      // one of the two cells
      row = max(j / cols - pow(2, nlevels - 1), 0);
      col = max(j % cols - (pow(2, nlevels - 1) - j / cols + row), 0);
      k = row * cols + col;
      for (; k < i; k++)
      {
        _exists.push_back(reachable[lsize * (nlevels - 1) + ncells * k + i] && reachable[lsize * (nlevels - 1) + ncells * k + j]);
      }
      k++;
      for (; k < j; k++)
      {
        _exists.push_back(reachable[lsize * (nlevels - 1) + ncells * i + k] && reachable[lsize * (nlevels - 1) + ncells * k + j]);
      }
      k++;
      row = min2(i / cols + pow(2, nlevels - 1), rows - 1);
      col = min2(i % cols + (pow(2, nlevels - 1) - row + i / cols), cols - 1);
      for (; k <= row * cols + col; k++)
      {
        _exists.push_back(reachable[lsize * (nlevels - 1) + ncells * i + k] && reachable[lsize * (nlevels - 1) + ncells * j + k]);
      }

      // if both cells are white they are reachable
      (*s).add(mk_or(_exists));
    }
  }
}

/*
  Solves puzzles where one dimension is one.

  The white connectivity constraint then subsumes the black adjacency (there only exists exactly
  one path from cell a to cell b => if both are white then all in between must be white, therefore
  there can be no adjacent black cells anyway). Therefore only the first and the last cells can
  be black (only if the length is 2, then at least one of them has to be white).

  The number constraint here just enumerates all possible options (at most N options for number N).
*/
void solve_dimension_one(const int length, const int *puzzle, solver *s, context *c, expr_vector *white, options opt, solver_result *res)
{
  // number constraints
  for (unsigned i = 0; i < length; i++)
  {
    if (is_num(puzzle[i]) && !add_hints_and_enumerate_numbers(length, 1, puzzle, s, c, white, true))
    {
      res->satisfiable = FALSE;
      res->stats = empty_stats();
      return;
    }
    else if (is_white(puzzle[i]))
    {
      (*s).add((*white)[i]);
    }
    else if (is_black(puzzle[i]))
    {
      (*s).add(!(*white)[i]);
    }
  }

  // black adjacency and white connectivity
  if (length == 2)
  {
    (*s).add((*white)[0] || (*white)[1]);
  }
  else
  {
    for (unsigned i = 1; i < length - 1; i++)
      (*s).add((*white)[i]);
  }

  switch ((*s).check())
  {
  case unsat:
    res->satisfiable = FALSE;
    res->stats = get_statistics((*s).statistics());
    break;
  case sat:
    res->satisfiable = TRUE;
    res->solution = new int[length];
    res->stats = get_statistics((*s).statistics());
    model m = (*s).get_model();

    if (opt.check_unique)
    {
      expr_vector _s((*c));
      for (unsigned i = 0; i < length; i++)
      {
        res->solution[i] = expr_is_true(m.eval((*white)[i], true)) ? WHITE : BLACK;
        _s.push_back(expr_is_true(m.eval((*white)[i], true)) ? !(*white)[i] : (*white)[i]);
      }
      // if the formula is still satisfiable when the first solution
      // is blocked, then it is not unique
      (*s).add(mk_or(_s));
      res->unique = ((*s).check() == sat) ? FALSE : TRUE;
    }
    else
    {
      for (unsigned i = 0; i < length; i++)
      {
        res->solution[i] = expr_is_true(m.eval((*white)[i], true)) ? WHITE : BLACK;
      }
    }
    break;
  }
}

extern "C" void free_solution(solver_result *res);
extern "C" void solve(const int rows, const int cols, int *puzzle, options opt, solver_result *res);

/*
  Solves a puzzle which is entered as stream, where the input is as followed:

  H N W
  R C
  V1 V2 .... VR*C

  where H(heuristics), N(number encoding), W(connectivity encoding),
  R/C are the number of rows/cols and V1 - VR*C are the cell values 
  (-2:UNDEFINED, -1:BLACK, 0:WHITE, 1-(R*C-1) NUMBER). Note that newlines do not
  matter, every token just needs to be separated by a space.

  The solving solver_result then is written to the given output stream as JSON object
  with the keys satisfiable and solution.
*/
void solve_from_stream(std::istream &in, std::ostream &out)
{
  options opt = options{0,0,0,0};
  int rows, cols;

  if (!((in >> opt.use_heuristics) && (in >> opt.number_encoding) && (in >> opt.connectivity_encoding) && (in >> rows >> cols)))
  {
    out << "{\"satisfiable\":null,\"solution\":null}\n";
    return;
  }

  int *puzzle = new int[rows * cols];  

  for (unsigned k = 0; k < rows * cols; k++){
    if (!(in >> puzzle[k]))
    {
      delete[] puzzle;
      out << "{\"satisfiable\":null,\"solution\":null}\n";
      return;
    }
  };

  solver_result res = {UNKNOWN, UNKNOWN, nullptr};

  solve(rows, cols, puzzle, opt, &res);

  // Return the solver_result as JSON
  if (res.satisfiable == TRUE)
  {
    std::string s;
    s.reserve(rows * cols * 2 + rows * 2);

    for (int i = 0; i < rows * cols; i++)
    {
      if (i % cols == 0)
      {
        s.append("\"");
      }
      s.append(res.solution[i] == WHITE ? "W" : "B");
      if (i % cols == cols - 1)
      {
        s.append(i / cols == rows - 1 ? "\"" : "\",");
      }
      else
      {
        s.append(" ");
      }
    }
    out << "{\"satisfiable\":true,\"solution\":[" << s << "]}\n";
  }
  else
  {
    out << "{\"satisfiable\":false,\"solution\":null}\n";
  }

  delete[] puzzle;
  free_solution(&res);
}

/*
  Solves an example puzzle.
*/
void solve_example()
{
  try
  {
    int rows = 5, cols = 5;
    int puzzle[rows * cols] = {
        +3, -2, -2, -2, -2,
        -2, -2, -2, -2, -2,
        -2, -2, -2, -2, -2,
        -2, -2, -2, +5, -2,
        +6, -2, -2, -2, +9};

    print_grid(rows, cols, puzzle);

    // unique, heuristics, number, connectivity
    options opt = {1, TRUE, NAIVE_ENUMERATION, NAIVE_DFS};
    solver_result res = {UNKNOWN, UNKNOWN, nullptr};

    unsigned __int64 now = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::system_clock::now().time_since_epoch()).count();

    solve(rows, cols, puzzle, opt, &res);

    now = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::system_clock::now().time_since_epoch()).count() - now;
    std::cout << "total solving time: " << ((double)now) / 1000.0 << "s" << std::endl;

    if (res.satisfiable == TRUE)
    {
      std::cout << "SAT" << std::endl;
      if (opt.check_unique)
        std::cout << ((res.unique == TRUE) ? "UNIQUE" : "NOT UNIQUE") << std::endl;
      print_grid(rows, cols, res.solution);
    }
    else
    {
      std::cout << "UNSAT" << std::endl;
    }
    std::cout << "STATISTICS\n";
    print_solver_stats(res.stats);
    free_solution(&res);
  }
  catch (exception &ex)
  {
    std::cout << "unexpected error: " << ex << "\n";
  }
}

int main()
{
#ifndef EXAMPLE
  solve_from_stream(std::cin, std::cout);
  //std::istringstream in("1 0 3 17 17 -2 -2 -2 -2 -2 -2 -2 -2 11 -2 -2 -2 -2 -2 -2 -2 -2 -2 -2 -2 4 6 -2 -2 -2 -2 -2 -2 -2 5 4 -2 -2 -2 -2 -2 3 -2 -2 4 -2 -2 -2 -2 -2 4 -2 -2 5 -2 -2 -2 5 -2 -2 -2 -2 6 -2 -2 -2 3 -2 -2 -2 -2 3 -2 -2 7 -2 -2 -2 -2 4 -2 -2 -2 5 -2 -2 -2 -2 3 -2 -2 -2 4 -2 -2 3 -2 -2 -2 -2 -2 5 -2 -2 8 -2 -2 -2 -2 -2 4 7 -2 -2 -2 5 -2 -2 -2 6 6 -2 -2 -2 -2 -2 -2 -2 -2 -2 -2 4 -2 6 -2 -2 -2 -2 -2 -2 -2 7 -2 -2 -2 -2 -2 6 -2 -2 -2 4 -2 -2 -2 -2 -2 2 -2 -2 -2 -2 -2 -2 -2 3 -2 2 -2 -2 -2 -2 -2 -2 -2 -2 -2 -2 3 3 -2 -2 -2 2 -2 -2 -2 6 4 -2 -2 -2 -2 -2 4 -2 -2 6 -2 -2 -2 -2 -2 4 -2 -2 2 -2 -2 -2 7 -2 -2 -2 -2 7 -2 -2 -2 7 -2 -2 -2 -2 6 -2 -2 6 -2 -2 -2 -2 6 -2 -2 -2 5 -2 -2 -2 -2 5 -2 -2 -2 5 -2 -2 3 -2 -2 -2 -2 -2 4 -2 -2 2 -2 -2 -2 -2 -2 7 6 -2 -2 -2 -2 -2 -2 -2 4 3 -2 -2 -2 -2 -2 -2 -2 -2 -2 -2 -2 3 -2 -2 -2 -2 -2 -2 -2 -2");
  //solve_from_stream(in, std::cout);
#else
  solve_example();
#endif
}

/*
  Frees all allocated memory in the solution
*/
extern "C" void free_solution(solver_result *res)
{
  for (unsigned i = 0; i < res->stats->size; i++)
  {
    delete[] res->stats->keys[i];
  }
  delete[] res->stats->keys;
  delete[] res->stats->values;
  delete res->stats;
  delete[] res->solution;
  res->solution = nullptr;
}

/*
  Solves a Kurodoko puzzle instance
*/
extern "C" void solve(const int rows, const int cols, int *puzzle, options opt, solver_result *res)
{
  assert(rows > 0 && cols > 0);
  assert(opt.check_unique == 0 || opt.check_unique == 1);
  assert(opt.use_heuristics == 0 || opt.use_heuristics == 1);
  assert(opt.number_encoding == ENUMERATION || opt.number_encoding == VISIBILITY || opt.number_encoding == NAIVE_ENUMERATION);
  assert(0 <= opt.connectivity_encoding && opt.connectivity_encoding <= 4);
  
  // init solver_result struct
  res->satisfiable = UNKNOWN;
  res->unique = UNKNOWN;
  res->solution = nullptr;
  res->stats = nullptr;

  context c;
  solver s(c);

  expr_vector white = mk_bool_vec(rows * cols, "w", &c);

  if (rows == 1 || cols == 1)
  {
    return solve_dimension_one(max(rows, cols), puzzle, &s, &c, &white, opt, res);
  }

  add_adjacency_constraints(rows, cols, &s, &c, &white);

  if (opt.use_heuristics)
  {
    if (!add_connectivity_heuristic(rows, cols, &s, &c, &white, puzzle, false))
    {
      res->satisfiable = FALSE;
      res->stats = empty_stats();
      return;
    }
  }

  if (opt.number_encoding == ENUMERATION || opt.number_encoding == NAIVE_ENUMERATION)
  {
    if (!add_hints_and_enumerate_numbers(rows, cols, puzzle, &s, &c, &white, false, opt.number_encoding == NAIVE_ENUMERATION))
    {
      res->satisfiable = FALSE;
      res->stats = empty_stats();
      return;
    }
  }
  else
  {
    if (!add_hints_and_visibility_constraints(rows, cols, &s, &c, &white, puzzle, false))
    {
      res->satisfiable = FALSE;
      res->stats = empty_stats();
      return;
    }
  }

  if (opt.connectivity_encoding == ROOTED_TREES)
  {
    add_connectivity_constraints(rows, cols, &s, &c, &white);
  }
  else if (opt.connectivity_encoding == REACHABILITY)
  {
    add_reachablility_constraints(rows, cols, &s, &c, &white);
  }

  if (opt.connectivity_encoding == CONNECTIVITY_VIOLATIONS_DFS || opt.connectivity_encoding == CONNECTIVITY_VIOLATIONS_A_STAR)
  {
    return solve_connectivity_violations(rows, cols, puzzle, &s, &c, &white, opt, res, opt.connectivity_encoding == CONNECTIVITY_VIOLATIONS_A_STAR);
  }
  else if (opt.connectivity_encoding == NAIVE_DFS)
  {
    return solve_connectivity_naive(rows, cols, puzzle, &s, &c, &white, opt, res);
  }
  else
  {
    switch (s.check())
    {
    case unsat:
      res->satisfiable = FALSE;
      res->stats = get_statistics(s.statistics());
      break;
    case sat:
      res->satisfiable = TRUE;
      res->solution = new int[rows * cols];
      res->stats = get_statistics(s.statistics());

      model m = s.get_model();

      if (opt.check_unique)
      {
        expr_vector _s(c);
        for (unsigned i = 0; i < rows * cols; i++)
        {
          res->solution[i] = expr_is_true(m.eval(white[i], true)) ? WHITE : BLACK;
          _s.push_back(expr_is_true(m.eval(white[i], true)) ? !white[i] : white[i]);
        }
        // if the formula is still satisfiable when the first solution
        // is blocked, then it is not unique
        s.add(mk_or(_s));
        res->unique = (s.check() == sat) ? FALSE : TRUE;
      }
      else
      {
        for (unsigned i = 0; i < rows * cols; i++)
        {
          res->solution[i] = expr_is_true(m.eval(white[i], true)) ? WHITE : BLACK;
        }
      }
      break;
    }
  }
}