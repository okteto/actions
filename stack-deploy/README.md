# GitHub Actions for Okteto Cloud

## Automate your development workflows using Github Actions and Okteto Cloud
GitHub Actions gives you the flexibility to build an automated software development workflows. With GitHub Actions for Okteto Cloud you can create workflows to build, deploy and update your applications in Okteto Cloud.

Get started today with a [free Okteto Cloud account](https://cloud.okteto.com)!

# Github Action for Deploying a Stack in Okteto Cloud

You can use this action to [deploy a stacks](https://okteto.com/docs/cloud/stack) in Okteto Cloud as part of your automated development workflow.

# Example

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
    
    - name: "Create stack"
      uses: okteto/actions/create-stack@master
```

