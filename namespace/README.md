# GitHub Actions for Okteto Cloud

## Automate your development workflows using Github Actions and Okteto Cloud
GitHub Actions gives you the flexibility to build an automated software development workflows. With GitHub Actions for Okteto Cloud you can create workflows to build, deploy and update your applications in Okteto Cloud.

Get started today with a [free Okteto Cloud account](https://cloud.okteto.com)!

# Github Action for Activating a Namespace in Okteto Cloud

You can use this action to activate a namespace in Okteto Cloud, download the corresponding kubeconfig and set it as the current context.

> Remember that the namespace name must have your github ID as a suffix.

## Inputs

### `namespace`

The namespace to activate. If empty, it will use your personal namespace.

## Outputs

### `kubeconfig`

The path to the generated `kubeconfig` file.

# Example

This example runs the login action and then activates a namespace.

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
    
    - name: "Create devlopment environments namespace"
      uses: okteto/actions/namespace@master
      with:
        name: devenvs-cindylopez
```

