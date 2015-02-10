#!/bin/sh

# check the license headers
results=`licensecheck -r -c '\.(js|scss|html)$' ./ | grep -v "MIT"`
if ! test -z "$results"; then
  echo "*** License check FAILED. Please check following files:"
  licensecheck -r -c '\.(js|scss|html)$' ./ | grep -v "MIT"
  exit 1
fi

echo "License check PASSED"

npm install
bower install
gulp

debuild -us -uc
