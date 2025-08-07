#!/bin/bash
cd /home/runner/workspace/backend
export JAVA_HOME=/nix/store/2vwkssqpzykk37r996cafq7x63imf4sp-openjdk-21+35
export PATH=$JAVA_HOME/bin:$PATH
java -jar target/soma-backend-1.0.0.jar --server.port=8080 --spring.profiles.active=dev