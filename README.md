# GitHub Actions for Okteto Cloud

GitHub Actions gives you the flexibility to build an automated software development lifecycle workflow.

A set of GitHub Actions for deploying applications into Okteto Cloud.

Get started today with [a free account](https://cloud.okteto.com)!

# Usage

## Build a container, push it, and deploy it to Okteto Cloud

```
on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@master
    
    - run: |
        docker build . -t okteto/hello:${{ github.sha }}
        docker push okteto/hello:${{ github.sha }}
      
    - uses: okteto/actions/update@master
      with:
        manifests: |
          manifests/deployment.yml
          manifests/service.yml
        image: okteto/hello
        tag: ${{ github.sha }}
        

    - uses: okteto/actions/namespace@master
      with:
        token: ${{ OKTETO_TOKEN }}
        namespace: action-rberrelleza
        
    - uses: okteto/actions/deploy@master
      with:
        namespace: action-rberrelleza
        manifests: |
          manifests/deployment.yml
          manifests/service.yml
```

# Contributing

Pull requests are encouraged! This project adheres to the [Contributor Covenant code of conduct](code-of-conduct.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to hello@okteto.com.
