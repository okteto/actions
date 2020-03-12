# GitHub Actions for Okteto Cloud

Use these actions to deploy your Kubernetes applications directly into [Okteto Cloud](https://cloud.okteto.com).

# Actions available

## Login
Login to Okteto Cloud. This should be run before any other action.

### Inputs

#### `token`

**Required** Your okteto API token.

## Build
Build an image in Okteto Cloud and push it to the registry.

### Inputs

#### `tag`

**Required**  Name and tag in the `name:tag` format.

#### `file`
Name of the Dockerfile. Default `"Dockerfile"`.

#### `path`
The path to the files. Default `"."`.

#### `buildargs`

A list of environment variables as build-args

```yaml
      env:
        PACKAGE_NAME: svc-api
        VCS_REF: ${{ github.sha }}
      with:
        buildargs: PACKAGE_NAME,VCS_REF
```

## Deploy
Update the image using kustomize and then deploy a new version of your application into Okteto Cloud, using the credentials retrieved in the `namespace` step. 

### Inputs

#### `namespace`

**Required** The name of the Okteto Cloud namespace. It must already exist.

#### `tag`
**Required** Name and optionally a tag in the "name:tag" format. If the tag is not specified, it'll default to `latest`. 

#### `manifest`

The path to the manifest to modify. Default `"k8s.yml"`.

#### `waitOn`
Name of the resource to wait on. Must follow the `"resource/name"` format.

#### `registry`

Set this to `registry.cloud.okteto.net` for an image built and tagged with `registry.cloud.okteto.net/<namespace>/<image>:<tag>`.

```yaml
    - name: Login
      users: okteto/actions/login@master
      with:
        token: ${{ secrets.OKTETO_TOKEN }}
        
    - name: Build & Publish to Okteto registry
      uses: okteto/actions/build@master
      with:
        tag: registry.cloud.okteto.net/okteto-ns/image-name:tag

    - name: Get Kubeconfig
      uses: okteto/actions/namespace@master
      id: namespace
      with:
        namespace: okteto-ns

    - name: Deploy and Wait
      uses: okteto/actions/deploy@master
      with:
        namespace: okteto-ns
        manifest: k8s.yml
        tag: okteto-ns/image-name:tag
        waitOn: deployment/action-test
        registry: registry.cloud.okteto.net
```

## Namespace
Retrieve the credentials of the namespace from Okteto Cloud.

### Inputs

#### `namespace`

**Required** The name of the Okteto Cloud namespace. It must already exist.

# Example 

This example builds a container with your changes and deploys it to Okteto Cloud. It assumes the deployment is called `hello-world`, and uses the `actions-rberrelleza` namespace.

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
    
    - uses: okteto/actions/login@master
      with:
        token: ${{ secrets.OKTETO_TOKEN }}

    - uses: okteto/actions/namespace@master
      with:
        namespace: actions-rberrelleza

    - uses: okteto/actions/push@master
      with:
        namespace: actions-rberrelleza
        name: hello-world
        deploy: "true"
        
```

[Review this sample repo](https://github.com/rberrelleza/actions-test) to see a live example of the different available actions and the checks.

# Contributing

Pull requests are encouraged! This project adheres to the [Contributor Covenant code of conduct](code-of-conduct.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to hello@okteto.com.
