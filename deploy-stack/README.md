# GitHub Actions for Okteto Cloud

## Automate your development workflows using Github Actions and Okteto Cloud
GitHub Actions gives you the flexibility to build an automated software development workflows. With GitHub Actions for Okteto Cloud you can create workflows to build, deploy and update your applications in Okteto Cloud.

Get started today with a [free Okteto Cloud account](https://cloud.okteto.com)!

## Github Action for Deploying a Stack in Okteto Cloud

You can use this action to [deploy a stack](https://okteto.com/docs/cloud/stack) in Okteto Cloud as part of your automated development workflow.

## Inputs

### `namespace`

The Okteto namespace to use. If not specified it will use the namespace specified by the `namespace` action.

### `name`

The name of the deployment. If not specified it will use the one in your `okteto.yml` file.

### `build` 

Set to `true` to build the images before deploying your stack.

### `working-directory`

The working directory of the action. Defaults to the root folder of the repo.

## Example usage

This example runs the login action and then creates the stack

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
    
    - uses: okteto/actions/namespace@master
    
    - name: "Create stack"
      uses: okteto/actions/create-stack@master
      with:
        build: "true"
```

