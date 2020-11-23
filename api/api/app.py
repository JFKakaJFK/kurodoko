from typing import Any
import os

from aiohttp import web
from tartiflette_aiohttp import register_graphql_handlers
import aiohttp_cors

__graphiql_options = {
    "endpoint": "/graphiql",
    "default_query": """
        query generate {
            generate(rows: 5, cols: 5, type: OHNO, difficulty: HARD, seed: "42") {
                type
                rows
                cols
                difficulty
                puzzle
            }
        }

        query solve {
            solve(type: OHNO, rows: 5, cols: 5, puzzle: [". . . 6 3", ". . B . .", "5 . 3 7 B", "B 3 . 4 .", "B . . 4 ."]) {
                satisfiable
                solution
            }
        }

        query nikoli($id: Int!) {
            nikoliKurodoko(id: $id) {
                type
                rows
                cols
                puzzle
                difficulty
            }
        }
    """,
    "default_variables": {
        "id": 42,
    }
}


async def index(request):
    return web.FileResponse(os.path.dirname(os.path.abspath(__file__)) + '/index.html')


def create_app() -> Any:
    """
    Returns the app for the api.
    """
    app = register_graphql_handlers(
        app=web.Application(),
        engine_sdl=os.path.dirname(os.path.abspath(__file__)) + "/sdl",
        engine_modules=[
            "api.query_resolvers",
            "api.directives.rate_limiting",
        ],
        executor_http_endpoint="/graphql",
        executor_http_methods=["POST"],
        graphiql_enabled=True,
        graphiql_options=__graphiql_options
    )

    app.add_routes([web.get('/', index)])

    # allow only the api per default
    cors = aiohttp_cors.setup(app, defaults={
        '*': aiohttp_cors.ResourceOptions(
            # os.getenv('ACCESS_CONTROL_ORIGIN', 'https://kurodoko.xyz'): aiohttp_cors.ResourceOptions(
            allow_credentials=True,
            expose_headers="*",
            allow_headers="*",
        )
    })

    # Configure CORS on all routes.
    for route in list(app.router.routes()):
        # if not isinstance(route.resource, web.StaticResource):  # <<< WORKAROUND
        cors.add(route)

    return app
