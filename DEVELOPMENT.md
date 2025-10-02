# Developing the CDT GDB Debug Adapter Extension for Visual Studio Code

This document provides instructions and hints for how to build and develop this extension. More information on contributions to this project can be found in the [contribution guidelines](/CONTRIBUTING.md).

## Building

### Building the extension

We use yarn to as our package manager. To build, simply do

```
yarn
yarn build
```

You can also run the build in watch mode using

```
yarn watch
```

### Co-developing cdt-gdb-adapter

If you are working on the cdt-gdb-adapter you can check it out to a different location and then link it in.

From the cdt-gdb-adapter project run

```
yarn link
```

Then from this project run

```
yarn link cdt-gdb-adapter
```

You can set up a VS Code workspace that has both folders. Also make sure you have builds running in each folder to pick up updates (e.g. `yarn watch`).

The way to debug cdt-gdb-adapter works with the same principle as the example Mock Debug Adapter provided by VS Code.
For detailed instructions please refer to [Development Setup for Mock Debug](https://code.visualstudio.com/api/extension-guides/debugger-extension#development-setup-for-mock-debug).

The short step-by-step version is:

1. Launch this extension with the `Extension` launch configuration ([cdt-gdb-vscode's launch.json](https://github.com/eclipse-cdt-cloud/cdt-gdb-vscode/blob/004a59f329136c2d5eb23e11e54b1f3f51b4d197/.vscode/launch.json#L8))
2. Launch cdt-gdb-adapter in server mode with either `Server` or `Server (Target adapter)` depending on whether you want to use local debugging or target debugging, corresponding to `"type": "gdb"` and `"type": "gdbtarget"` respectively. ([cdt-gdb-adapter's launch.json](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/blob/92bb15046fea82256742a69f0b240129a1949a76/.vscode/launch.json#L4-L21))
3. Add a breakpoint somewhere useful, such as [`launchRequest`](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/blob/6ba0de8e466f4953501181f53ecdfb14c7988973/src/desktop/GDBTargetDebugSession.ts#L94)
4. Add `"debugServer": 4711` to the launch configuration in the extension development host. The `4711` is the port number that cdt-gdb-adapter is listening on.
5. Debug the C/C++ program in the extension development host.

## Releasing

### Prepare a release with a Pull Request

- Check if security scans require dependency updates in [package.json](./package.json).
  See [here](https://github.com/eclipse-cdt-cloud/cdt-gdb-vscode/security/code-scanning).
- Update [CHANGELOG.md](./CHANGELOG.md).
    - Make sure it contains a section with the new version at the top of the file.  
      If individual commits after the last release already added a new section,
      then rename this section accordingly.
    - Review the commit history since the last release and add any user facing changes which
      haven't been added yet.
        - Add references to issues/PRs where possible. Use the format of previous releases.  
          Putting the displayed issue number in backticks is important to avoid that a web
          frontend automatically adds links. For example if referencing an issue/PR outside
          this repository which has the same number like an issue in the cdt-gdb-vscode repository.
        - Prefix issues from the sibling project `cdt-gdb-adapter` with their name if a change was
          made in cdt-gd-vscode to resolve it.
    - If an update of `cdt-gdb-adapter` is included, then add a section `Update to cdt-gdb-adapter vX.Y.Z`.  
      Include the release notes as listed in [`cdt-gdb-adapter` CHANGELOG](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/blob/main/CHANGELOG.md).  
      Make sure to prefix issue and PR links correctly if they point to the cdt-gdb-adapter repository.
- Update the `version` entry in [package.json](./package.json) to the new version.  
  If the release only introduces defect fixes without significant feature changes,
  then bump the third ("patch") version digit.  
  Bump the second ("minor") version digit when new features have been added.  
  Update the first ("major") version digit if there are changes that remove features
  or significantly change existing behavior.

### Start the publishing

After the PR has been reviewed and merged, go to the GitHub [releases page](https://github.com/eclipse-cdt-cloud/cdt-gdb-vscode/releases):

- Click `Draft a new release`.
- Click the `Select Tag` dropdown and enter the new version in the form `vX.Y.Z`.
- Click the `Generate release notes` button. This inserts a release name based on the
  selected tag. And creates a list of commits since the last release as release notes
  that are shown on GitHub.
    - If an update of `cdt-gdb-adapter` is included, then add a section `Update to cdt-gdb-adapter vX.Y.Z`.  
      Include the release notes as listed in [`cdt-gdb-adapter` CHANGELOG](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/blob/main/CHANGELOG.md).  
      Make sure to prefix issue and PR links correctly if they point to the cdt-gdb-adapter repository.
- Select whether the release is a pre-release and/or if it is the latest release to show
  on the GitHub repository page. Usually, no change of the defaults is required.
- Click the `Publish release` button. This creates a new release and pushes the defined tag.
  The tag push triggers a GitHub action which builds, tests, uploads release artifacts to GitHub,
  and finally pushes releases to the [Open VSX Registry](https://open-vsx.org/extension/eclipse-cdt/cdt-gdb-vscode)
  and the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=eclipse-cdt.cdt-gdb-vscode).
  It may take a few minutes for this and the release's asset list to complete, and for the extensions to show up
  on the other registries.

Note: If CI should fail before the GitHub asset upload, you can either try to retrigger the failing GitHub action.
Alternatively, you can manually remove the release and (!) the tag and retry with the same
version after fixing the issues.  
Should one of the registry pushes fail while the other succeeds, you can try to rerun the failing GitHub action.
If more fixing is needed, you unfortunately may need to bump the version number again.

Important: Making a CDT GDB Debug Adapter release requires you to be a [committer](https://www.eclipse.org/membership/become-a-member/committer/).
