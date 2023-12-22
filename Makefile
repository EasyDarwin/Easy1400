

# ==================================================================================== #
# BUILD
# ==================================================================================== #



MODULE_NAME := $(notdir $(CURDIR))
RECENT_TAG := $(shell git describe --abbrev=0)
OFFSET_NUM := $(shell git log --graph --abbrev-commit --decorate --first-parent $(RECENT_TAG)..$(branch) | grep Author: | wc -l | tr -d ' ')
VERSION := $(RECENT_TAG).$(OFFSET_NUM)
HASH_AND_DATE := $(shell git log -n1 --pretty=format:"%h-%cd" --date=format:%y%m%d | awk '{print $1}')



all: build push

deploy: build/linux push

echo:
	@echo $(MODULE_NAME)
	@echo $(RECENT_TAG)
	@echo $(OFFSET_NUM)
	@echo $(VERSION)
	@echo $(HASH_AND_DATE)

build/linux:
	@sed -i "s/WEB_VERSION: '0.0.1'/WEB_VERSION: '${VERSION}-$(HASH_AND_DATE)'/" .umirc.ts
	@yarn build
	@git checkout .umirc.ts

build:
	@sed -i "" "s/WEB_VERSION: '0.0.1'/WEB_VERSION: '${VERSION}-$(HASH_AND_DATE)'/" .umirc.ts
	@yarn build
	# @git checkout .umirc.ts

push:
	@tar -zcvf dist.tar.gz ./dist
	@scp dist.tar.gz box3:/home/box3/apps/gat1400
	@rm -rf ./dist
	@rm -rf dist.tar.gz
	@ssh box3 'cd /home/box3/apps/gat1400 && tar -zxvf dist.tar.gz && rm -rf dist.tar.gz && rm -rf www && mv dist www'


addpage:
	npx umi g page ${path}
	code .umirc.ts
