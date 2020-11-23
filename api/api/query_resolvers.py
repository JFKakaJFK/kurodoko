from typing import Any, List, Optional, Dict
import os
import json

from tartiflette import Resolver

import kurodoko as k
import ohno as o
import utils as u


@Resolver("Query.solve")
async def resolve_solve(
    parent: Optional[Any],
    args: Dict[str, Any],
    ctx: Dict[str, Any],
    info: "ResolveInfo",
) -> Dict[str, Any]:
    """
    Resolver for solving both Kurodoko and Ohno puzzles.
    :param parent: initial value filled in to the engine `execute` method
    :param args: computed arguments related to the field
    :param ctx: context filled in at engine initialization
    :param info: information related to the execution and field resolution
    :type parent: Optional[Any]
    :type args: Dict[str, Any]
    :type ctx: Dict[str, Any]
    :type info: ResolveInfo
    :return: the solution to the given puzzle
    :rtype: Dict[str, Any]
    """

    u.validate(
        rows=args.get('rows', None),
        cols=args.get('cols', None),
        puzzle_type=args.get('type', None),
        puzzle=args.get('puzzle', None),
    )

    solve = k.solve if args['type'] == u.KURODOKO else o.solve

    return solve(rows=args['rows'], cols=args['cols'], puzzle=args['puzzle'])


@Resolver("Query.generate")
async def resolve_generate(
    parent: Optional[Any],
    args: Dict[str, Any],
    ctx: Dict[str, Any],
    info: "ResolveInfo",
) -> Dict[str, Any]:
    """
    Resolver for generating both Kurodoko and Ohno puzzles.
    :param parent: initial value filled in to the engine `execute` method
    :param args: computed arguments related to the field
    :param ctx: context filled in at engine initialization
    :param info: information related to the execution and field resolution
    :type parent: Optional[Any]
    :type args: Dict[str, Any]
    :type ctx: Dict[str, Any]
    :type info: ResolveInfo
    :return: the solution to the given puzzle
    :rtype: Dict[str, Any]
    """

    u.validate(
        rows=args.get('rows', None),
        cols=args.get('cols', None),
        puzzle_type=args.get('type', None),
        difficulty=args.get('difficulty', None)
    )

    gen = k.generate if args['type'] == u.KURODOKO else o.generate
    return gen(rows=args['rows'], cols=args['cols'], difficulty=args.get('difficulty', None), seed=args.get('seed', None))


@Resolver("Query.nikoliKurodoko")
async def resolve_nikoli(
    parent: Optional[Any],
    args: Dict[str, Any],
    ctx: Dict[str, Any],
    info: "ResolveInfo",
) -> Optional[Dict[str, Any]]:
    """
    Resolver for generating both Kurodoko and Ohno puzzles.
    :param parent: initial value filled in to the engine `execute` method
    :param args: computed arguments related to the field
    :param ctx: context filled in at engine initialization
    :param info: information related to the execution and field resolution
    :type parent: Optional[Any]
    :type args: Dict[str, Any]
    :type ctx: Dict[str, Any]
    :type info: ResolveInfo
    :return: the solution to the given puzzle
    :rtype: Dict[str, Any]
    """
    if 1 <= args['id'] <= 99:
        with open(os.path.dirname(os.path.abspath(__file__)) + '/../data/nikoli.json', 'r') as f:
            puzzles = json.load(f)
            return puzzles[args['id'] - 1]


@Resolver("Query.allNikoliKurodokos")
async def resolve_all_nikoli(
    parent: Optional[Any],
    args: Dict[str, Any],
    ctx: Dict[str, Any],
    info: "ResolveInfo",
) -> List[Dict[str, Any]]:
    """
    Resolver for generating both Kurodoko and Ohno puzzles.
    :param parent: initial value filled in to the engine `execute` method
    :param args: computed arguments related to the field
    :param ctx: context filled in at engine initialization
    :param info: information related to the execution and field resolution
    :type parent: Optional[Any]
    :type args: Dict[str, Any]
    :type ctx: Dict[str, Any]
    :type info: ResolveInfo
    :return: the solution to the given puzzle
    :rtype: Dict[str, Any]
    """
    with open(os.path.dirname(os.path.abspath(__file__)) + '/../data/nikoli.json', 'r') as f:
        return json.load(f)
