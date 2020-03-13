# GitHub Actions for Okteto Cloud

## Automate your development workflows using Github Actions and Okteto Cloud
GitHub Actions gives you the flexibility to build an automated software development workflows. With GitHub Actions for Okteto Cloud you can create workflows to build, deploy and update your applications in Okteto Cloud.

Get started today with a [free Okteto Cloud account](https://cloud.okteto.com)!

# Github Action for Okteto Cloud Login

With the Okteto Cloud Login action you can automate you workflow to do an Okteto Cloud login using an API token. This action is a prerequisite for the rest of the [Okteto Cloud actions](https://github.com/okteto/actions).

# Configure your Okteto API Token

Copy [your Okteto API token](https://cloud.okteto.com/#/settings/setup) and save it [as a secret](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets) with the name `OKTETO_TOKEN` in the GitHub repository.

# Example

This example runs the login action and then activates a namespace.

```yaml
# File: .github/workflows/workflow.yml
on: [push]

name: example

jobs:

  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    
    - uses: okteto/actions/login@master
      with:
        token: ${{ secrets.OKTETO_TOKEN }}
    
    - uses: okteto/actions/namespace@master
      with:
        name: cindylopez
```

