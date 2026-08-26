.PHONY: build strict test e2e serve

build:
	./scripts/build-example.sh

strict:
	./scripts/test-hugo.sh

e2e:
	npm run test:e2e

test:
	npm test

serve:
	./scripts/serve-example.sh
