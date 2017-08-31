#!/usr/bin/env bash

docker volume create --name chrome-data &&
LATEST_ABP=$(curl https://downloads.adblockplus.org/devbuilds/adblockpluschrome/ | tac | tac | grep '.crx' -m 1 | awk -F'[-;]' '{print $2}' | sed -e 's/\".*$//') &&
curl -O "https://downloads.adblockplus.org/devbuilds/adblockpluschrome/adblockpluschrome-$LATEST_ABP" &&
rm -rf abp-latest &&
unzip "adblockpluschrome-$LATEST_ABP" -d abp-latest &&
chmod -R 755 abp-latest/*