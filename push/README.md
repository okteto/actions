# GitHub Actions for Okteto Cloud

## Automate your development workflows using Github Actions and Okteto Cloud
GitHub Actions gives you the flexibility to build an automated software development workflows. With GitHub Actions for Okteto Cloud you can create workflows to build, deploy and update your applications in Okteto Cloud.

Get started today with a [free Okteto Cloud account](https://cloud.okteto.com)!

# Github Action for Pushing your Changes to Okteto Cloud

You can use this action to automatically build your container, push it to the Okteto Registry and deploy it into Okteto Cloud. This is a great way to create preview environments for your pull requests.

[This document](https://okteto.com/docs/reference/cli/index.html#push) has more information on this workflow.

## Inputs

### `namespace`

The Okteto namespace to use. If not specified it will use the namespace specified by the `namespace` action.

### `name`

The name of the deployment. If not specified it will use the one in your `okteto.yml` file.

### `deploy` 

Create the deployment if it doesn't exist. If not specified the action will fail if the deployment doesn't exist.

### `working-directory`

The working directory of the action. Defaults to the root folder of the repo.

# Example usage

This example runs the login action, activates a namespace, deploys a kubernetes application and then pushes your changes.

```yaml
# File: .github/workflows/workflow.yml
on: [push]

name: example

jobs:

  devflow:
    runs-on: ubuntu-latest
    steps:
    
    - uses: okteto/actions/login@master
      with:
        token: ${{ secrets.OKTETO_TOKEN }}
    
    - name: "Activate Namespace"
      uses: okteto/actions/namespace@master
      with:
        name: cindylopez
    
    - name: "Deploy application"
      uses: okteto/actions/apply@master
      with:
        namespace: cindylopez
        manifest: k8s.yaml

    - name: "Push changes"
      uses: okteto/actions/push@master
      with:
        namespace: cindylopez
        name: hello-world
```

