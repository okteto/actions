# GitHub Actions for Okteto Cloud

## Automate your development workflows using Github Actions and Okteto Cloud
GitHub Actions gives you the flexibility to build an automated software development workflows. With GitHub Actions for Okteto Cloud you can create workflows to build, deploy and update your applications in Okteto Cloud.

Get started today with a [free Okteto Cloud account](https://cloud.okteto.com)!

## Github Action for Building your Containers in Okteto Cloud

You can use this action to build an image from a Dockerfile using Okteto Cloud.

## Inputs

### `tag`

**Required**  Name and tag in the `name:tag` format.

### `file`

Name of the Dockerfile. Default `"Dockerfile"`.

### `path`

The path to the files. Default `"."`.

### `buildargs`

A list of environment variables as build-args

```yaml
      env:
        PACKAGE_NAME: svc-api
        VCS_REF: ${{ github.sha }}
      with:
        buildargs: PACKAGE_NAME,VCS_REF
```

## Example usage

This example runs the login action and then builds and pushes an image.

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
    
    - name: "Build"
      uses: okteto/actions/build@master
      with:
        tag: registry.cloud.okteto.net/cindy/hello-world:${{ github.sha }}
```

