
## AI Site Runner

* Core Architecture
  * Docker Swarm underlying connectivity across all nodes
  * Selenium (Grid) network with single centralized hub for test queuing
  * Selenium nodes per geography. Dedicated 4GB+ CoreOs instance for Chrome sessions managed by Selenium. 
  * Centralized web application to manage test reporting and test data storage.

### Step 1
Setup Docker Swarm and Selenium hub.
* Create a CoreOS instance (1 processor 2GB) (digitalocean, aws, etc..)
* SSH into the instance and run the following:
```
docker swarm init
docker network create -d overlay selenium-grid
docker service create --network selenium-grid --name hub -p 4444:4444 selenium/hub
```
* Here we're creating a docker service for the Selenium hub.
* Leave this terminal window open. You'll be back in a sec.

### Step 2
Setup the Selenium node(s) that will connect to the hub
* Create a CoreOS instance (2 processor 4GB+) (digitalocean, aws, etc..)
  * Make a note of the host name of this instance.
* SSH into this new instance and join the docker swarm. This command is generated for you in Step one. If you lost it,
run 'docker swarm join-token worker' from the hub instance.
```
docker swarm join --token [token] [ip]:[port]
```
* Add the latest AdBlock Plus extension for Chrome to this (and all future) nodes. There are 2 ways to 
share a data volume with docker (mount and bind). We are using bind in our commands so the extension has to be on each machine running a selenium node.
```
LATEST_ABP=$(curl https://downloads.adblockplus.org/devbuilds/adblockpluschrome/ | tac | tac | grep '.crx' -m 1 | awk -F'[-;]' '{print $2}' | sed -e 's/\".*$//') &&
curl -O "https://downloads.adblockplus.org/devbuilds/adblockpluschrome/adblockpluschrome-$LATEST_ABP" &&
rm -rf abp-latest &&
unzip "adblockpluschrome-$LATEST_ABP" -d abp-latest &&
chmod -R 777 abp-latest/*
```
* You can leave this session open as you'll need it again in a moment to review the logs.

### Step 3
* Go back into the main hub instance from Step one. 
* Let's deploy the selenium node docker service. This will start the Selenium Chrome client on the Step 2 machine.
```
#Digital Ocean
docker service create --network selenium-grid --name selenium-node-chrome-sfo --constraint 'node.hostname==sfo1-node-01' -p 5560:5560 --mount type=bind,src=/home/core/abp-latest/,dst=/abp-latest/ --mount type=bind,src=/dev/shm,dst=/dev/shm -e HUB_PORT_4444_TCP_ADDR=hub -e HUB_PORT_4444_TCP_PORT=4444 -e NODE_MAX_INSTANCES=1 -e NODE_MAX_SESSION=1 --replicas 1 selenium/node-chrome bash -c 'SE_OPTS="-browser applicationName=sfo1-node,browserName=chrome,maxInstances=1 -host $HOSTNAME -port 5560" /opt/bin/entry_point.sh'

#Amazon
#there's a docker DNS issue on AWS - so harcode the hub IP
https://forums.docker.com/t/container-dns-resolution-in-ingress-overlay-network/21399/2
docker service create --network selenium-grid --name selenium-node-chrome-au --constraint 'node.hostname==au1-node-01' -p 5561:5561 --mount type=bind,src=/home/core/abp-latest/,dst=/abp-latest/ --mount type=bind,src=/dev/shm,dst=/dev/shm -e HUB_PORT_4444_TCP_ADDR=198.199.115.13 -e HUB_PORT_4444_TCP_PORT=4444 -e NODE_MAX_INSTANCES=1 -e NODE_MAX_SESSION=1 --replicas 1 selenium/node-chrome bash -c 'SE_OPTS="-browser applicationName=au1-node,browserName=chrome,maxInstances=1 -host $HOSTNAME -port 5561" /opt/bin/entry_point.sh'
```
* There are 3 specific variables environment related variables in that command:
  1) applicationName=sfo1-node
* This paramter gives our test script a hook so that it will run on this specific SFO node.
  2) --name selenium-node-chrome-sfo
* This is just a command to identify this machine within docker. Should be kept in sync with the others.
  3) node.hostname==sfo1-node-01
* This is the hostname of the actual coreos instance. It tells docker to constrain the selenium environment to only this CoreOS vm.
* If you're creating an instance for another region, you'll want to replace 'sfo' above with that regions airport or country code.
```
sudo hostname au1-node-01
sudo hostnamectl set-hostname au1-node-01

Check current hostname
hostnamectl
```

### Step 4
Setup the reporting and data storage server.
* Create another CoreOS instance and ssh into it. (2GB+ of memory recommended)
* Start an empty Postgres database
```
docker run -p 5432:5432 --name siterunner_pg -e POSTGRES_PASSWORD=mysecretpassword -d postgres
or 
docker start siterunner_pg
```
* [need a docker image for this] Start the server
```
docker build -t wesleyhales/site_runner .
docker run -p 3000:3000 --link siterunner_pg:postgres -d wesleyhales/site_runner
```

#### Create database table
```
docker run -it --rm --link siterunner_pg:postgres postgres psql -h postgres -U postgres
CREATE DATABASE SITERUNNER;
\c siterunner;
CREATE EXTENSION citext;
  CREATE TABLE timingdata (
    id serial primary key,
    data jsonb,
    image text,
    email citext unique
  );
```

### Deploy web app from source
```
rm -rf archive.zip && zip -r archive.zip * && scp archive.zip core@159.203.167.69:~ 
rm -rf 1.0.0/ && unzip archive.zip -d 1.0.0 && cd 1.0.0 && docker build -t wesleyhales/sitemonitor . && docker run -p 3000:3000 --link siterunner_pg:postgres -d wesleyhales/sitemonitor
```

### Kick off the tests
```
curl http://159.203.167.69:3000/delete
curl http://159.203.167.69:3000/startTest?nodeName=lon1-node
curl http://159.203.167.69:3000/startTest?nodeName=sfo1-node
```



### Roadmap
* Use Selenium Grid API to show node and hub statistics around queue's, browser usage and version, etc...
  * https://github.com/nicegraham/selenium-grid2-api
  * https://stackoverflow.com/questions/41983811/api-for-getting-the-selenium-nodes-status-from-the-grid-host

#### Examples
```
##need to increase Browser_Timeout from 5 seconds to 30 for org.apache.http.NoHttpResponseException http://hub:4444


### add a host override to docker service with --host [host:ip]

##automate tests with systemd
https://coreos.com/os/docs/latest/scheduling-tasks-with-systemd-timers.html

## on web node for upgrade
rm -rf 1.0.0/ && unzip Archive.zip -d 1.0.0 && cd 1.0.0 && docker build -t wesleyhales/sitemonitor .&& docker run -p 3000:3000 --link siterunner_pg:postgres -d wesleyhales/sitemonitor

DROP TABLE timingdata;

INSERT INTO timingdata (data) VALUES ('{"1":{"foo":"bar"}}'::jsonb);
SELECT * FROM timingdata WHERE data = '{"property":"bonnier"}';

docker cp siterunner.sql siterunner_pg:/siterunner.sql

docker run -it --rm --link siterunner_pg:postgres -v script:/script postgres psql -f /script/siterunner.sql -h postgres -U postgres
docker run -i --rm --link siterunner_pg:postgres postgres psql -f siterunner.sql -h postgres -U postgres < siterunner.sql
-f /siterunner.sql
```