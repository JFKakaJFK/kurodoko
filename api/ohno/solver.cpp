#include <iomanip>
#include <chrono>
#include <vector>
#include <tuple>
#include <math.h>
#include <assert.h>
#include "z3++.h"

using namespace z3;

/*
  MISSING .h DEFINITIONS (can be removed once libz3-dev is the most 
  up do date version which of Z3 which should already support these operations) 
*/

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

#define ENUMERATION 0
#define VISIBILITY 1

extern "C" struct options
{
  int check_unique;    // 1 (yes) | 0 (no)
  int number_encoding; // 0 (enumeration) | 1 (visibility)
};

extern "C" struct solver_stats
{
  int size;
  char **keys;
  double *values;
};

extern "C" struct result
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

/**
  If a cell is white, then at least one of its neighbours must be white 
*/
void add_white_sees_one(const int rows, const int cols, solver *s, context *c, expr_vector *white)
{
  unsigned row, col;
  for (unsigned i = 0; i < rows * cols; i++)
  {
    expr_vector clause((*c));
    clause.push_back(!(*white)[i]);
    for (unsigned d = 0; d < NDIRS; d++)
    {
      row = i / cols + DIRECTIONS[d][0];
      col = i % cols + DIRECTIONS[d][1];
      if (is_in_bounds(rows, cols, row, col))
        clause.push_back((*white)[row * cols + col]);
    }

    // adding this as implies and not directly as cnf clause (-not white or nb white)
    // does not seem to impact the performance at all
    // (*s).add(implies((*white)[i], mk_or(clause)));
    (*s).add(mk_or(clause));
  }
}

/**
  This method both adds the hints from the puzzle and the needed visibility constraints
  to enforce that each number contstraint is satisfied.

  The visibility constraint is satisfied by calculating the number of visible cells in each direction.
  Every cell has a variable for the number of visible cells in each direction. The visibility to the top
  is 0 for black cells in the top row and 1 for white cells in the top row. For each other cell
  the visibility is 0 if the cell is black and otherwhise 1 + the number of cells seen by the cell above.
  This is done for all directions.

  Then a numbered cell is satisfied if the sum of all visible cells - 4 (the cell itself was counted 4 times)
  is equal to the number.
  */
void add_hints_and_visibility_constraints(const int rows, const int cols, solver *s, context *c, expr_vector *white, const int *puzzle)
{
  std::vector<int> numbers;
  std::vector<bool> number_row(rows, false);
  std::vector<bool> number_col(cols, false);
  for (unsigned i = 0; i < rows * cols; i++)
  {
    if (is_num(puzzle[i]))
    {
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
          (puzzle[numbers[i]]) + 4);
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
           visible = 0;
  std::vector<std::pair<int, int>> options;
  options.reserve(direction % 2 == 0 ? rows : cols);

  do
  {
    if (is_in_bounds(rows, cols, row1, col1) && !is_black(puzzle[row1 * cols + col1]))
    {
      if (is_undef(puzzle[row1 * cols + col1]))
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
    row1 += DIRECTIONS[direction][0];
    col1 += DIRECTIONS[direction][1];
  } while (visible <= smallest_number);

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
      if (top.first + bottom.first > min(top.second, bottom.second, puzzle[index]))
        continue;
      for (auto right : compute_visibility_options(rows, cols, puzzle, index, RIGHT))
      {
        if (top.first + right.first + bottom.first > puzzle[index])
          continue;
        for (auto left : compute_visibility_options(rows, cols, puzzle, index, LEFT))
        {
          if (right.first + left.first > min(right.second, left.second, puzzle[index]) || top.first + right.first + bottom.first + left.first != puzzle[index])
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

/*
  Adds the constraints of the puzzle instance and the possible number layouts.
*/
bool add_hints_and_enumerate_numbers(const int rows, const int cols, const int *puzzle, solver *s, context *c, expr_vector *white)
{
  for (unsigned i = 0; i < rows * cols; i++)
  {
    if (is_num(puzzle[i]) && !add_number(rows, cols, puzzle, i, s, c, white))
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
  return true;
}

extern "C" void free_solution(result *res);
extern "C" void solve(const int rows, const int cols, int *puzzle, options opt, result *res);

/*
  Solves an example puzzle
*/
void solve_example()
{
  try
  {
    int rows = 5, cols = 5;
    int puzzle[rows * cols] = {
        -2, -1, +4, -2, -2,
        -2, -2, +5, +4, -2,
        -2, -2, -2, -2, -2,
        +2, +2, -2, -2, +1,
        -1, -2, +3, -2, -2};

    print_grid(rows, cols, puzzle);

    // check_unique, number encoding
    options opt = {TRUE, ENUMERATION};
    result res = {UNKNOWN, UNKNOWN, nullptr};

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

/*
  Solves a puzzle which is entered as stream, where the input is as followed:

  N R C
  V1 V2 .... VR*C

  where N(number encoding), R/C are the number of rows/cols and V1 - VR*C are the cell values 
  (-2:UNDEFINED, -1:BLACK, 0:WHITE, 1-(R*C-1) NUMBER). Note that newlines do not
  matter, every token just needs to be separated by a space.

  The solving result then is written to the given output stream as JSON object
  with the keys satisfiable and solution.
*/
void solve_from_stream(std::istream &in, std::ostream &out)
{
  int numbers, rows, cols;

  in >> numbers >> rows >> cols;

  options *opt = new options{0, numbers};

  int *puzzle = new int[rows * cols];

  for (unsigned k = 0; k < rows * cols; k++)
  {
    in >> puzzle[k];
  }

  if (in.fail())
  {
    delete opt;
    delete[] puzzle;
    out << "{\"satisfiable\":null,\"solution\":null}\n";
    return;
  }

  result res = {UNKNOWN, UNKNOWN, nullptr};

  solve(rows, cols, puzzle, *opt, &res);

  // Return the result as JSON
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
        s.append(i / rows == rows - 1 ? "\"" : "\",");
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

  delete opt;
  delete[] puzzle;
  free_solution(&res);
}

int main()
{
  solve_example();

  // solve_from_stream(std::cin, std::cout);
}

/*
  Frees all allocated memory in the solution
*/
extern "C" void free_solution(result *res)
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
  Solves a Oh No puzzle instance
*/
extern "C" void solve(const int rows, const int cols, int *puzzle, options opt, result *res)
{
  assert(rows > 0 && cols > 0);
  assert(opt.check_unique == 0 || opt.check_unique == 1);
  assert(opt.number_encoding == ENUMERATION || opt.number_encoding == VISIBILITY);

  // init result struct
  res->satisfiable = UNKNOWN;
  res->unique = UNKNOWN;
  res->solution = nullptr;
  res->stats = nullptr;

  context c;
  solver s(c);

  expr_vector white = mk_bool_vec(rows * cols, "w", &c);

  add_white_sees_one(rows, cols, &s, &c, &white);

  if (opt.number_encoding == VISIBILITY)
  {
    add_hints_and_visibility_constraints(rows, cols, &s, &c, &white, puzzle);
  }
  else
  {
    if (!add_hints_and_enumerate_numbers(rows, cols, puzzle, &s, &c, &white))
    {
      res->satisfiable = FALSE;
      res->stats = empty_stats();
      return;
    }
  }

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