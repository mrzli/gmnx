# Nx Tools

## Creating Plugins

```zsh
# create plugin
nx g @nrwl/nx-plugin:plugin pluginname

# create generator (old way)
nx g @nrwl/nx-plugin:generator --project projectname generatorname

# create generator (new way)
nx g @gmnx/util:generator --project projectname generatorname

# create executor
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

_It can happen that the `publish-all` executor does not work if you previously published a defective version and updated `package.json` to use that new version of `@gmnx/util`._

## Using `gmnx` Plugins

### `@gmnx/util`

#### Generators

`util`

Example usage:

```zsh
nx g @gmnx/util:util workspace
```

Description:

- Generates a bare-bones project that will contain some general-use executors.
  
`generator`

Example usage:

```zsh
nx g @gmnx/util:generator --project projectname generatorname
```

Description:

- Generates a generator.

#### Executors

`cloc`

Example usage:

```zsh
wcloc
nx cloc workspace
nx run workspace:cloc
```

Description:

- Utility that counts lines of code in the workspace.

`mongo-start`

Example usage:

```zsh
nx mongo-start:workspace
nx run workspace:mongo-start
```

Description:

- Starts (and creates if necessary) a Mongo docker container, with mongo on port `27017`.
- Data is stored in `~/docker/mongo`.

`mongo-stop`

Example usage:

```zsh
nx mongo-stop:workspace
nx run workspace:mongo-stop
```

Description:

- Stops Mongo docker container.

`postgres-start`

Example usage:

```zsh
nx postgres-start:workspace
nx run workspace:postgres-start
```

Description:

- Starts (and creates if necessary) a Postgres docker container, with mongo on port `15432`.
- Data is stored in `~/docker/postgres`.

`postgres-stop`

Example usage:

```zsh
nx postgres-stop:workspace
nx run workspace:postgres-stop
```

Description:

- Stops Postgres docker container.

`publish-all`

Example usage:

```zsh
nx publish-all:workspace
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

### `@gmnx/project`

#### Generators

`project`

Example usage:

```zsh
nx g @gmnx/project:project project-name
```

Description:

- Generates a default project. More precisely, a list of projects: data model, shared library, cli, backend, web. Project is generated based on data model specified in `input/<project-name>-data-model.yaml`.

## Example Usage

- Example of generating a new monorepo from scratch, and the creating a project.

- Generate monorepo.
  - Run `npx create-nx-workspace --preset=apps` inside the parent folder.
  - Enter monorepo name.
- Install required dependencies.
  - `npm install -D @gmnx/util @gmnx/project`.
  - `npm install -D @nrwl/react @nrwl/nest`.
- Setup `workspace` project.
  - `nx g @gmnx/util:util workspace`.
- Setup project generation prerequisites.
  - Add `/input/` and `/output/` to `.gitignore`.
  - Install of my utility libraries and tools with `nx update-gmall workspace`.
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
