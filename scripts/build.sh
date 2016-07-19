#!/usr/bin/env bash

set -e # exit when error, no verbose

printf "\nBuilding...\n"

# clean
dist_dir="dist"
dist_dir_cdn="$dist_dir/umd"
mkdir -p "$dist_dir_cdn"
rm -rf "${dist_dir:?}"/*

# ES6 => ES5
babel -q index.js -o "$dist_dir/index.js"
babel -q src/ --out-dir "$dist_dir/src/" --ignore test.js

# UMD build
webpack --config webpack.config.umd.babel.js
dist_file="$dist_dir_cdn/reactAlgoliaSearchHelper.js"
dist_file_min="$dist_dir_cdn/reactAlgoliaSearchHelper.min.js"
source_map="reactAlgoliaSearchHelper.js.map"
source_map_min="reactAlgoliaSearchHelper.min.js.map"
dist_file_sourcemap="$dist_dir_cdn/${source_map}"
dist_file_sourcemap_min="$dist_dir_cdn/${source_map_min}"

uglifyjs "${dist_file}" \
  --in-source-map "${dist_file_sourcemap}" \
  --source-map "${dist_file_sourcemap_min}" \
  --source-map-url "${source_map_min}" \
  -c warnings=false \
  -m \
  -o "${dist_file_min}"

gzip_size=$(gzip -9 < "$dist_file_min" | wc -c | pretty-bytes)
echo "=> $dist_file_min gzipped will weight $gzip_size"
