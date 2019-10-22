#!/bin/bash

echo $(git describe 2> /dev/null || echo 'latest')
