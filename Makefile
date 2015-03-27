HOMEDIR = $(shell pwd)
GITDIR = /var/repos/fuck-it-up.git
PM2 = $(HOMEDIR)/node_modules/pm2/bin/pm2

test:
	node tests/basictests.js

start: start-fuck-it-up
	$(PM2) start fuck-it-up.js --name fuck-it-up

stop:
	$(PM2) stop fuck-it-up || echo "Didn't need to stop process."

list:
	$(PM2) list

sync-worktree-to-git:
	git --work-tree=$(HOMEDIR) --git-dir=$(GITDIR) checkout -f

npm-install:
	cd $(HOMEDIR)
	npm install
	npm prune

post-receive: sync-worktree-to-git npm-install stop start
