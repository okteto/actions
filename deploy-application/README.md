# Deploy Application action

Use this actions to deploy an application in [Okteto Cloud](https://cloud.okteto.com).


## Prerequisites

- Login to https://cloud.okteto.com and create a namespace.
- Retrieve your API token from https://cloud.okteto.com.
- [Create a secret](https://help.github.com/en/github/automating-your-workflow-with-github-actions/virtual-environments-for-github-actions#creating-and-using-secrets-encrypted-variables) in your repository named `OKTETO_TOKEN`, with your token as the value.

## Example

```yaml
on: 
  pull_request

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: checkout
      uses: actions/checkout@master
    
    - name: Login
      uses: okteto/actions/login@master
      with:
        token: ${{ secrets.OKTETO_TOKEN }}

    - name: Create namespace
      uses: okteto/actions/create-namespace@master
      with:
        namespace: movies-preview-rberrelleza
    
    - name: Deploy Application
      uses: okteto/actions/deploy-application@master
      with:
        application: movies
        name: pr-${{ github.event.number }}
        configuration: preview-config.yaml

    - name: Push API Changes
      uses: okteto/actions/push@master
      with:
        working-directory: api

    - name: Push Frontend Changes
      uses: okteto/actions/push@master
      with:
        working-directory: frontend
    
    - name: comment PR
      uses: unsplash/comment-on-pr@master
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        msg: "Preview environment available at https://pr-${{ github.event.number }}-movies-preview-rberrelleza.cloud.okteto.net"
```

# Contributing

Pull requests are encouraged! This project adheres to the [Contributor Covenant code of conduct](code-of-conduct.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to hello@okteto.com.
