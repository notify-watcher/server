image$(. scripts/docker_image.sh)
tag=$(. scripts/docker_tag.sh)

docker push $image \
  && docker push $image:$tag
