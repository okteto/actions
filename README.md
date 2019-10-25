# GitHub Actions for Okteto Cloud

Use these actions to deploy your Kubernetes applications directly into [Okteto Cloud](https://cloud.okteto.com).

# Actions available

- `namespace`: Retrieve the credentials of the namespace.
- `update`: Update the image and tag of your manifests.
- `deploy`: Deploy a new version of your application into Okteto Cloud.

# Example: Build a container, push it, and deploy it to Okteto Cloud

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
