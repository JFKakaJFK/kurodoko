#!/usr/bin/env python
import sys
import os

from aiohttp import web

from api.app import create_app


if __name__ == "__main__":
    """
    Run the app
    """
    sys.exit(web.run_app(
        create_app(),
        port=int(os.getenv('PORT', 8080))
    ))
