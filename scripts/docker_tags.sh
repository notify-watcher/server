#!/bin/bash

tags() {
  local image_name="notifywatcher1/server"
  local git_tag=$(git describe --abbrev=0)
  git_tag=${git_tag/v/}

  local mayor_minor_path=(${git_tag//./ })
  local mayor="${mayor_minor_path[0]}"
  local minor="${mayor}.${mayor_minor_path[1]}"
  local patch="${minor}.${mayor_minor_path[2]}"

  echo "${image_name}:latest ${image_name}:${mayor} ${image_name}:${minor} ${image_name}:${patch}"
}

echo $(tags)
