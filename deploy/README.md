# GitHub Actions for Okteto Cloud

## Automate your development workflows using Github Actions and Okteto Cloud
GitHub Actions gives you the flexibility to build an automated software development workflows. With GitHub Actions for Okteto Cloud you can create workflows to build, deploy and update your applications in Okteto Cloud.

Get started today with a [free Okteto Cloud account](https://cloud.okteto.com)!

## Github Action for Deploying your Application in Okteto Cloud

You can use this action to update the image and update your application running in Okteto Cloud.

This is deprecated in favor of the [push action](../push).

## Inputs

### `namespace`

The Okteto namespace to use. If not specified it will use the namespace specified by the `namespace` action.

### `manifest`

The path to the Kubernetes manifest. It can be a file or a directory. Defaults to `k8s.yml`.

### `tag` 

The new image name and optionally a tag in the "name:tag" format.

### `waitOn`

Wait until the mentioned resource is ready. Must follow the "resource/name" format (e.g. `deployment/hello-world`).

### `registry`

Set this to `registry.cloud.okteto.net` for an image built and tagged with `registry.cloud.okteto.net/<namespace>/<image>:<tag>`.

## Example usage

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