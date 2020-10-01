
yarn-install:
	rm -rf node_modules || true
	/bin/bash bash/swap-files.sh -c swappackagejson.sh -m webpack -- yarn

dev: yarn-install
	yarn dev
	# then run in second console:
	#     node merge.js config-dist.yml generated.sh

build: yarn-install
	yarn build

gui:
	@printf "\nrun:\n    node merge.js\n\n"

generate:
	@/bin/bash merge-generator.sh

dev-prepare:
	@echo "run:\n\nsource dev-prepare.sh\n\n"




nt: # test .npmignore
	@npm pack

u: # update npm and git (generates new tag)
	@/bin/bash update.sh

uf: # update even if there is nothing new committed
	@/bin/bash update.sh force