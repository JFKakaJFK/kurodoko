# Kurodoko and Ohno API


## Build


```shell
export DOCKER_BUILDKIT=1
docker build -t jfkakajfk/kurodoko-api -f Dockerfile .
docker run -d -it --name kurodoko-api -p 3000:3000 jfkakajfk/kurodoko-api
docker exec -it kurodoko-api bash
python3 -m pipenv shell

docker stop kurodoko-api && docker rm kurodoko-api
```
## Develop

```shell
docker build -t kurodoko -f Dockerfile.dev .
docker run -d -it -v `pwd`:/usr/src/app/ --name kurodoko  -p 3000:3000 kurodoko
docker exec -it kurodoko bash
```
