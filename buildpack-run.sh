#!/bin/bash

# leave only production dependencies in node_modules
echo "npm prune --production"
npm prune --production

# remove typescript incremental build metadata
find dist -name "*.tsbuildinfo" -type f -exec rm --verbose '{}' \;
