#!/usr/bin/env bash

set -e # exit when error, no verbose

printf "\nBuilding...\n"

dist_dir="dist"

# clean
mkdir -p "$dist_dir"
rm -rf "${dist_dir:?}"/*

# ES6 => ES5
babel -q index.js -o "$dist_dir/index.js"
babel -q src/ --out-dir "$dist_dir/src/" --ignore test.js
