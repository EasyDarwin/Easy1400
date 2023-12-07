
build:
	yarn build

push:
	tar -zcvf dist.tar.gz dist
	scp ./dist.tar.gz box3:/home/box3/apps/gat1400
	ssh box3 "cd /home/box3/apps/gat1400;tar -zxvf dist.tar.gz;rm -rf www;mv dist www;"
