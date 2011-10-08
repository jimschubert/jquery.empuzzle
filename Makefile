JS = $(shell find src -type f \( -iname "*.js" ! -iname "*.min.js" \) )
MINIFY = $(JS:.js=.min.js)

all: clean minify

minify: $(MINIFY)

clean:
	rm -f $(MINIFY)

%.min.js: %.js
	node ./node_modules/uglify-js/bin/uglifyjs -o $@ $<

.PHONY: clean js minify
