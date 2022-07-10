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
## Using `gmnx` Plugins

### `@gmnx/gmnx-util`

### Generators

`generator`

Example usage:

```zsh
# Generate `libs/my-plugin/src/generators/my-generator`
nx g generator my-generator --project=my-plugin
```

Description:

Create a Generator for an Nx Plugin.

`gmnx-readme`

Example usage:

```zsh
# Generate readme.
nx g @gmnx/util:gmnx-readme
```

Description:

- Generates readme file.
- Takes all generators and executors in the workspace (except those opted out by 'meta.noDocument' flag) and documents description and examples for use.
- Meant to be used exclusively inside @gmnx repository.

### `@gmnx/project`

### Generators

`project`

Example usage:

```zsh
# Generate a list of projects with the base name 'project-name'.
nx g @gmnx/project:project project-name
```

Description:

- Generates a default project. More precisely, a list of projects: data model, shared library, cli, backend, web. Project is generated based on data model specified in `input/<project-name>-data-model.yaml`.

### `@gmnx/ws-util`

### Generators

`workspace-project`

Example usage:

```zsh
# Generate project called 'workspace' which will be used as a platform for utility executors.
nx g @gmnx/ws-util:workspace-project workspace
```

Description:

- Generates a bare-bones project that will contain some general-use executors.

`workspace-initial-setup`

Example usage:

```zsh
# Execute generator workspace-initial-setup.
nx g @gmnx/ws-util:workspace-initial-setup
```

Description:

Configures some workspace files to my spec.

### Executors

`cloc`

Example usage:

```zsh
# Recommended shortcut, to be set up in your shell rc file.
wcloc

# Short version.
nx cloc workspace

# Long version.
nx run workspace:cloc
```

Description:

- Utility that counts lines of code in the workspace.

`mongo-start`

Example usage:

```zsh
# Short version.
nx mongo-start workspace

# long version.
nx run workspace:mongo-start
```

Description:

- Starts (and creates if necessary) a Mongo docker container, with mongo on port `27017`.
- Data is stored in `~/docker/mongo`.

`mongo-stop`

Example usage:

```zsh
# Short version.
nx mongo-stop workspace

# long version.
nx run workspace:mongo-stop
```

Description:

- Stops Mongo docker container.

`publish-all`

Example usage:

```zsh
# Recommended shortcut, to be set up in your shell rc file.
wpublish

# Short version.
nx publish-all workspace

# Long version.
nx run workspace:publish-all
```

Description:

- Publishes all publishable projects in the workspace.
- Publishable projects are those that are not 'application' type, and which have a `package.json`.
- Before publish, all project versions are bumped (PATCH number is incremented). To be more precise, it works like this:
  - Find all `package.json` files.
  - Find the greatest version of in those `package.json` files.
  - Increment the PATCH part of that version.
  - Set that incremented version to EVERY `package.json` (every project will be published with the same version).
- Build all publishable projects.
- Publish all publishable projects.

`postgres-start`

Example usage:

```zsh
# Short version.
nx postgres-start workspace

# long version.
nx run workspace:postgres-start
```

Description:

- Starts (and creates if necessary) a Postgres docker container, with mongo on port `15432`.
- Data is stored in `~/docker/postgres`

`postgres-stop`

Example usage:

```zsh
# Short version.
nx postgres-stop workspace

# long version.
nx run workspace:postgres-stop
```

Description:

- Stops Postgres docker container.

## Example Usage of `gmnx` to Create a Workspace

- Example of generating a new monorepo from scratch, and a creation of a project.

- Generate monorepo.
  - Run `npx create-nx-workspace --preset=apps` inside the parent folder.
  - Enter monorepo name.
- Install required dependencies.
  - `npm install -D @gmnx/ws-util @gmnx/project`.
  - `npm install -D @nrwl/react @nrwl/nest`.
- Setup workspace.
  - Create `workspace` project.
    - Short (if configured): `gmnxgw`.
    - Or: `nx g @gmnx/ws-util:workspace-project workspace`.
  - Setup various workspace files.
    - Short (if configured): `gmnxgwis`.
    - Or: `nx g @gmnx/ws-util:workspace-initial-setup`.
- Setup project generation prerequisites.
  - Install all of my utility libraries and tools with `nx update-gmall workspace`.
  - Create and fill in `/input/example-data-model.yaml` file.
  - Commit changes.
- Create an example project.
  - `nx g @gmnx/project:project example`.
  - `npm install` to install any dependencies added by the project generator.
- Running the project.
  - Run Mongo container: `nx mongo-start workspace`.
  - Drop existing database: `nx drop example-cli`.
  - Create database: `nx create example-cli`.
  - Seed database.
    - Edit `example-cli/src/app/mongo/seed-db.ts`.
      - At least make it pass validation.
      - On top of that, change data in any way you need.
    - Run: `nx seed example-cli`.
