# Nx Tools

## Creating Plugins

```zsh
# create plugin
nx g @nrwl/nx-plugin:plugin pluginname

# create generator (old way)
nx g @nrwl/nx-plugin:generator --project projectname generatorname

# create generator (new way)
gmnxgg projectname generatorname # needs to be setup in your shell rc file
nx g @gmnx/gmnx-util:generator --project projectname generatorname

# create executor
gmnxge projectname executorname # needs to be setup in your shell rc file
nx g @nrwl/nx-plugin:executor --project projectname executorname
```

## Publishing Plugins

If `workspace` project is set up in this workspace, and `publish-all` works properly, you can use any of the below:

```zsh
wpublish # example alias that can be setup in shell rc file
nx publish-all workspace
nx run workspace:publish-all
```

If the above does not work, just use:

```zsh
npm run publish-all
```

_It can happen that the `publish-all` executor does not work if you previously published a defective version and updated `package.json` to use that new version of `@gmnx/ws-util`._

## Updating Package Versions

`update-gmjs`

Example usage:

```zsh
nx update-gmjs:workspace
nx run workspace:update-gmjs
```

Description:

- Install or update all packages from `gmjs` repository (utility library).

`update-gmnx`

Example usage:

```zsh
nx update-gmnx:workspace
nx run workspace:update-gmnx
```

Description:

- Install or update all packages from `gmnx` repository (custom nx generators and executors).

`update-gmall`

Example usage:

```zsh
nx update-gmall:workspace
nx run workspace:update-gmall
```

Description:

- Install all packages from both `gmjs` and `gmnx` repositories.
