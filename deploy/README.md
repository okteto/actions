# GitHub Actions for Okteto Cloud

## Automate your development workflows using Github Actions and Okteto Cloud
GitHub Actions gives you the flexibility to build an automated software development workflows. With GitHub Actions for Okteto Cloud you can create workflows to build, deploy and update your applications in Okteto Cloud.

Get started today with a [free Okteto Cloud account](https://cloud.okteto.com)!

# Github Action for Deploying your Application in Okteto Cloud

You can use this action to update the image and update your application running in Okteto Cloud.

# Example

This example runs the login action and then builds and pushes an image to the Okteto Registry and deploys a kubernetes application to Okteto Cloud.

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
        namespace: cindylopez
    
    - name: "Build"
      uses: okteto/actions/build@master
      with:
        tag: registry.cloud.okteto.net/cindylopez/hello-world:${{ github.sha }}
    
    - name: "Deploy"
      uses: okteto/actions/deploy@master
      with:
        namespace: cindylopez
        manifest: k8s.yml
        tag: hello-world:${{ github.sha }}
        waitOn: deployment/hello-world
        registry: registry.cloud.okteto.net
```

# Inputs

## `namespace`

**Required** The name of the Okteto Cloud namespace. It must already exist.

## `tag`
**Required** Name and optionally a tag in the "name:tag" format. If the tag is not specified, it'll default to `latest`. 

## `manifest`

The path to the manifest to modify. Default `"k8s.yml"`.

## `waitOn`
Name of the resource to wait on. Must follow the `"resource/name"` format.

## `registry`

Set this to `registry.cloud.okteto.net` for an image built and tagged with `registry.cloud.okteto.net/<namespace>/<image>:<tag>`.