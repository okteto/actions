# GitHub Actions for Okteto Cloud

Use these actions to deploy your Kubernetes applications directly into [Okteto Cloud](https://cloud.okteto.com).

# Actions available

- `namespace`: Retrieve the credentials of the namespace from Okteto Cloud.
- `update`: Update the image and tag of your manifests with the images you just build.
- `deploy`: Deploy a new version of your application into Okteto Cloud, using the credentials retrieved in the `namespace` step.

# Example: Build a container, push it, and deploy it to Okteto Cloud

## Prerequisites

- Login to https://cloud.okteto.com and create a namespace.
- Retrieve your API token from https://cloud.okteto.com.
- [Create a secret](https://help.github.com/en/github/automating-your-workflow-with-github-actions/virtual-environments-for-github-actions#creating-and-using-secrets-encrypted-variables) in your repository named `OKTETO_TOKEN`, with your token as the value.

```
on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@master
    
    - run: |
        docker login -u ramiro -p ${{ secrets.DOCKER_PASSWORD}}
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
        token: ${{ secrets.OKTETO_TOKEN }}
        namespace: action-rberrelleza
        
    - uses: okteto/actions/deploy@master
      with:
        namespace: action-rberrelleza
        manifests: |
          manifests/deployment.yml
          manifests/service.yml
```

[Review this sample repo](https://github.com/rberrelleza/actions-test) to see a live example of the different available actions.

# Contributing

Pull requests are encouraged! This project adheres to the [Contributor Covenant code of conduct](code-of-conduct.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to hello@okteto.com.
