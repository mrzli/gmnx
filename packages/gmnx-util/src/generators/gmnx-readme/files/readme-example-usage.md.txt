## Example Usage of `gmnx` to Create a Workspace

- Example of generating a new monorepo from scratch, and a creation of a project.

- Generate monorepo.
  - Run `npx create-nx-workspace --preset=apps` inside the parent folder.
  - Enter monorepo name.
- Install required dependencies.
  - `npm install -D @gmnx/ws-util`.
  - `npm install -D @nrwl/react @nrwl/nest`.
- Setup workspace.
  - Create `workspace` project.
    - Short (if configured): `gmnxgwspcreate`.
    - Or: `nx g @gmnx/ws-util:workspace-project workspace`.
  - Setup various workspace files.
    - Short (if configured): `gmnxgwis`.
    - Or: `nx g @gmnx/ws-util:workspace-initial-setup`.
- Setup project generation prerequisites.
  - Install all of my utility libraries and tools with `nx update-gmall workspace`.
  - Create and fill in `/input/example-data-model.yaml` file.
  - Commit changes.
- Running the project.
  - Run Mongo container: `nx mongo-start workspace`.
  - Drop existing database: `nx drop example-cli`.
  - Create database: `nx create example-cli`.
  - Seed database.
    - Edit `example-cli/src/app/mongo/seed-db.ts`.
      - At least make it pass validation.
      - On top of that, change data in any way you need.
    - Run: `nx seed example-cli`.
