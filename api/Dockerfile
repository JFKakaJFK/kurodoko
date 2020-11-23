FROM python:3.7

# dependencies for tartiflette-aiohttp
RUN apt-get update && apt-get install -y cmake bison flex libz3-dev

# install python virtual env & dependency manager
RUN pip install --user pipenv

# add python venv path to path
ENV PYTHONPATH=/usr/src/app/
ENV PATH="$PATH:/root/.local/bin"

# no writing pyc files to disc
ENV PYTHONDONTWRITEBYTECODE 1
# no buffering stdout and stderr
ENV PYTHONUNBUFFERED 1

# go to dir
WORKDIR /usr/src/app
# copy Pipfile
COPY Pipfile /usr/src/app/
# install dependencies # TODO fix locking issue
RUN pipenv install --skip-lock
# copy app to dir
COPY . /usr/src/app/

# compile the solvers
RUN make -C kurodoko -f Makefile lib && make -C kurodoko -f Makefile clean_objs
RUN make -C ohno -f Makefile lib && make -C ohno -f Makefile clean_objs

# start application
CMD ["pipenv", "run", "gunicorn", "--bind", "0.0.0.0:3000", "--workers", "3", "--worker-class", "aiohttp.GunicornWebWorker", "api.main:create_app()"]
