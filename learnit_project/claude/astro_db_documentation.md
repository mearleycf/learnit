# Astro DB

Astro DB is a fully-managed SQL database designed exclusively for Astro. Develop locally or connect to a hosted database managed on our [Astro Studio](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#astro-studio) platform.

## Installation

[Section titled Installation](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#installation)

Add Astro DB to a new or existing Astro project (requires `astro@4.5` or later) with the [`@astrojs/db` integration](https://5-0-0-beta.docs.astro.build/en/guides/integrations-guide/db/) (`v0.8.1` or later). Astro includes a built-in `astro add` command to automate this setup process for you.

* [npm](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#tab-panel-139)
* [pnpm](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#tab-panel-140)
* [Yarn](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#tab-panel-141)

Terminal window

```
yarn astro add db
```

If you prefer, you can [install `@astrojs/db` manually](https://5-0-0-beta.docs.astro.build/en/guides/integrations-guide/db/#manual-installation) instead.

## Define your database

[Section titled Define your database](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#define-your-database)

Astro DB is a complete solution to configuring, developing and querying your data. A local database is created whenever you run `astro dev`, using libSQL to manage your data without the need for Docker or a network connection.

Installing `@astrojs/db` with the `astro add` command will create a `db/config.ts` file in your project where you will define your databases tables:

db/config.ts

```
import { defineDb } from 'astro:db';


export default defineDb({
  tables: { },
})
```

### Tables

[Section titled Tables](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#tables)

Data in Astro DB is stored using SQL tables. Tables structure your data into rows and columns, where columns enforce the type of each row value.

When you define a table, Astro will generate a TypeScript interface to query that table from your project. The result is full TypeScript support when you access your data with property autocompletion and type-checking.

To configure a database table, import and use the `defineTable()` and `column` utilities from `astro:db`.

This example configures a `Comment` table with required text columns for `author` and `body`. Then, make it available to your project through the `defineDb()` export.

db/config.ts

```
import { defineDb, defineTable, column } from 'astro:db';


const Comment = defineTable({
  columns: {
    author: column.text(),
    body: column.text(),
  }
})


export default defineDb({
  tables: { Comment },
})
```

See the [table configuration reference](https://5-0-0-beta.docs.astro.build/en/guides/integrations-guide/db/#table-configuration-reference) for a complete reference of table options.

### Columns

[Section titled Columns](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#columns)

Astro DB supports the following column types:

db/config.ts

```
import { defineTable, column } from 'astro:db';


const Comment = defineTable({
  columns: {
    // A string of text.
    author: column.text(),
    // A whole integer value.
    likes: column.number(),
    // A true or false value.
    flagged: column.boolean(),
    // Date/time values queried as JavaScript Date objects.
    published: column.date(),
    // An untyped JSON object.
    metadata: column.json(),
  }
});
```

See the [table columns reference](https://5-0-0-beta.docs.astro.build/en/guides/integrations-guide/db/#table-configuration-reference) for more details.

### Table References

[Section titled Table References](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#table-references)

Relationships between tables are a common pattern in database design. For example, a `Blog` table may be closely related to other tables of `Comment`, `Author`, and `Category`.

You can define these relations between tables and save them into your database schema using **reference columns**. To establish a relationship, you will need:

* An **identifier column** on the referenced table. This is usually an `id` column with the `primaryKey` property.
* A column on the base table to **store the referenced `id`**. This uses the `references` property to establish a relationship.

This example shows a `Comment` table’s `authorId` column referencing an `Author` table’s `id` column.

db/config.ts

```
const Author = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
  }
});


const Comment = defineTable({
  columns: {
    authorId: column.number({ references: () => Author.columns.id }),
    body: column.text(),
  }
});
```

## Seed your database

[Section titled Seed your database](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#seed-your-database)

In development, Astro will use your DB config to generate local types according to your schemas. These will be generated fresh each time the dev server is started, and will allow you to query and work with the shape of your data with type safety and autocompletion.

To seed development data for testing and debugging into your Astro project, create a `db/seed.ts` file. Import both the `db` object and any configured table from `astro:db`. Use the `db.insert()` function to provide an array of table row data objects.

The following example defines two rows of development data for a `Comment` table:

db/seed.ts

```
import { db, Comment, Author } from 'astro:db';


export default async function() {
  await db.insert(Author).values([
    { id: 1, name: "Kasim" },
    { id: 2, name: "Mina" },
  ]);


  await db.insert(Comment).values([
    { authorId: 1, body: 'Hope you like Astro DB!' },
    { authorId: 2, body: 'Enjoy!'},
  ])
}
```

Your development server will automatically restart your database whenever this file changes, regenerating your types and seeding your development data from `seed.ts`.

## Query your database

[Section titled Query your database](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#query-your-database)

You can query your database from any [Astro page](https://5-0-0-beta.docs.astro.build/en/basics/astro-pages/#astro-pages) or [endpoint](https://5-0-0-beta.docs.astro.build/en/guides/endpoints/) in your project using the provided `db` ORM and query builder.

### Drizzle ORM

[Section titled Drizzle ORM](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#drizzle-orm)

```
import { db } from 'astro:db';
```

Astro DB includes a built-in [Drizzle ORM](https://orm.drizzle.team/) client. There is no setup or manual configuration required to use the client. The Astro DB `db` client is automatically configured to talk to your database (local or remote) when you run Astro. It uses your exact database schema definition for type-safe SQL queries with TypeScript errors when you reference a column or table that doesn’t exist.

### Select

[Section titled Select](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#select)

The following example selects all rows of a `Comment` table. This returns the complete array of seeded development data from `db/seed.ts` which is then available for use in your page template:

src/pages/index.astro

```
---
import { db, Comment } from 'astro:db';


const comments = await db.select().from(Comment);
---


<h2>Comments</h2>


{
  comments.map(({ author, body }) => (
    <article>
      <p>Author: {author}</p>
      <p>{body}</p>
    </article>
  ))
}
```

See the [Drizzle `select()` API reference](https://orm.drizzle.team/docs/select) for a complete overview.

### Insert

[Section titled Insert](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#insert)

To accept user input, such as handling form requests and inserting data into your remote hosted database, configure your Astro project for [on-demand rendering](https://5-0-0-beta.docs.astro.build/en/basics/rendering/#on-demand-rendered-routes) and [add an SSR adapter](https://5-0-0-beta.docs.astro.build/en/guides/on-demand-rendering/#official-adapters) for your deployment environment.

This example inserts a row into a `Comment` table based on a parsed form POST request:

src/pages/index.astro

```
---
import { db, Comment } from 'astro:db';


if (Astro.request.method === 'POST') {
  // parse form data
  const formData = await Astro.request.formData();
  const author = formData.get('author');
  const content = formData.get('content');
  if (typeof author === 'string' && typeof content === 'string') {
    // insert form data into the Comment table
    await db.insert(Comment).values({ author, content });
  }
}


// render the new list of comments on each request
const comments = await db.select().from(Comment);
---


<form method="POST" style="display: grid">
  <label for="author">Author</label>
  <input id="author" name="author" />


  <label for="content">Content</label>
  <textarea id="content" name="content"></textarea>


  <button type="submit">Submit</button>
</form>


<!--render `comments`-->
```

You can also query your database from an API endpoint. This example deletes a row from a `Comment` table by the `id` param:

src/pages/api/comments/\[id].ts

```
import type { APIRoute } from "astro";
import { db, Comment, eq } from 'astro:db';


export const DELETE: APIRoute = async (ctx) => {
  await db.delete(Comment).where(eq(Comment.id, ctx.params.id ));
  return new Response(null, { status: 204 });
}
```

See the [Drizzle `insert()` API reference](https://orm.drizzle.team/docs/insert) for a complete overview.

### Filtering

[Section titled Filtering](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#filtering)

To query for table results by a specific property, use [Drizzle options for partial selects](https://orm.drizzle.team/docs/select#partial-select). For example, add [a `.where()` call](https://orm.drizzle.team/docs/select#filtering) to your `select()` query and pass the comparison you want to make.

The following example queries for all rows in a `Comment` table that contain the phrase “Astro DB.” Use [the `like()` operator](https://orm.drizzle.team/docs/operators#like) to check if a phrase is present within the `body`:

src/pages/index.astro

```
---
import { db, Comment, like } from 'astro:db';


const comments = await db.select().from(Comment).where(
    like(Comment.body, '%Astro DB%')
);
---
```

### Drizzle utilities

[Section titled Drizzle utilities](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#drizzle-utilities)

All Drizzle utilities for building queries are exposed from the `astro:db` module. This includes:

* [Filter operators](https://orm.drizzle.team/docs/operators) like `eq()` and `gt()`
* [Aggregation helpers](https://orm.drizzle.team/docs/select#aggregations-helpers) like `count()`
* [The `sql` helper](https://orm.drizzle.team/docs/sql) for writing raw SQL queries

```
import { eq, gt, count, sql } from 'astro:db';
```

### Relationships

[Section titled Relationships](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#relationships)

You can query related data from multiple tables using a SQL join. To create a join query, extend your `db.select()` statement with a join operator. Each function accepts a table to join with and a condition to match rows between the two tables.

This example uses an `innerJoin()` function to join `Comment` authors with their related `Author` information based on the `authorId` column. This returns an array of objects with each `Author` and `Comment` row as top-level properties:

src/pages/index.astro

```
---
import { db, eq, Comment, Author } from 'astro:db';


const comments = await db.select()
  .from(Comment)
  .innerJoin(Author, eq(Comment.authorId, Author.id));
---


<h2>Comments</h2>


{
  comments.map(({ Author, Comment }) => (
    <article>
      <p>Author: {Author.name}</p>
      <p>{Comment.body}</p>
    </article>
  ))
}
```

See the [Drizzle join reference](https://orm.drizzle.team/docs/joins#join-types) for all available join operators and config options.

### Batch Transactions

[Section titled Batch Transactions](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#batch-transactions)

All remote database queries are made as a network request. You may need to “batch” queries together into a single transaction when making a large number of queries, or to have automatic rollbacks if any query fails.

This example seeds multiple rows in a single request using the `db.batch()` method:

db/seed.ts

```
import { db, Author, Comment } from 'astro:db';


export default async function () {
  const queries = [];
  // Seed 100 sample comments into your remote database
  // with a single network request.
  for (let i = 0; i < 100; i++) {
    queries.push(db.insert(Comment).values({ body: `Test comment ${i}` }));
  }
  await db.batch(queries);
}
```

See the [Drizzle `db.batch()`](https://orm.drizzle.team/docs/batch-api) docs for more details.

## Astro Studio

[Section titled Astro Studio](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#astro-studio)

Studio feature

Caution

We are [winding down Astro Studio](https://astro.build/blog/goodbye-astro-studio/). As a result, users will no longer be able to create databases after October 1, 2024.

We recommend [migrating your existing Studio databases to Turso](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#migrate-from-astro-studio-to-turso), or [connecting Astro DB to any libSQL server](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#libsql) instead.

Astro DB can connect to the Astro Studio platform to quickly add a hosted database to your project. You can view, manage and deploy new hosted databases all from the Astro Studio dashboard.

The [Astro Studio web portal](http://studio.astro.build/) allows you to connect to and manage your remote hosted Astro DB databases through a web interface or using [CLI commands](https://5-0-0-beta.docs.astro.build/en/reference/cli-reference/#astro-studio-cli).

From your Studio dashboard, you have access to account management, help articles and a support message console.

Visit [Astro Studio](http://studio.astro.build/) to sign up or log in.

### Create a new Studio project

[Section titled Create a new Studio project](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#create-a-new-studio-project)

Studio feature

There are two ways to create a project in Astro Studio:

1. [**Use the Astro Studio web UI**](https://studio.astro.build/) to create from a new or existing GitHub repository.

   To get started, click the “create project” button in the header and follow the instructions. Astro Studio will connect to your GitHub repository and create a new hosted database for your project.

2. **Use the Astro Studio CLI** to create from any local Astro project. You can run the following commands to get started:

   * [npm](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#tab-panel-142)
   * [pnpm](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#tab-panel-143)
   * [Yarn](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#tab-panel-144)

   Terminal window

   ```
   # Log in to Astro Studio with your GitHub account
   yarn astro login


   # Link to a new project by following the prompts
   yarn astro link


   # (Optional) Push your local db configuration to the remote database
   yarn astro db push
   ```

   Once you are logged in and linked successfully, you can run all Astro DB commands to manage your remote database.

   See [the Astro DB CLI reference](https://5-0-0-beta.docs.astro.build/en/guides/integrations-guide/db/#astro-db-cli-reference) for all available commands.

### Deploy with a Studio connection

[Section titled Deploy with a Studio connection](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#deploy-with-a-studio-connection)

Studio feature

You can deploy your Astro DB project with a live connection to your Studio database. This is possible with any deployment platform using static builds or an [SSR adapter](https://5-0-0-beta.docs.astro.build/en/guides/on-demand-rendering/).

First, configure your build command to connect with Studio using the `--remote` flag. This example applies the flag to a `"build"` script in your project’s `package.json`. If your deployment platform accepts a build command, ensure this is set to `npm run build`.

package.json

```
{
  "scripts": {
    "build": "astro build --remote"
  }
}
```

#### Create a Studio app token

[Section titled Create a Studio app token](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#create-a-studio-app-token)

Studio feature

You need to create an app token to access your Studio database from a production deploy. You can create an app token from your Studio project dashboard by navigating to the **Settings** tab and selecting **Tokens**.

Copy the generated token and apply as an environment variable / environment secret in your deployment platform using the name `ASTRO_STUDIO_APP_TOKEN`.

### Set up the GitHub CI Action

[Section titled Set up the GitHub CI Action](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#set-up-the-github-ci-action)

Studio feature

You can automatically push schema changes to your Studio database with the Studio CI action. This verifies changes can be made safely, and keeps your configuration up-to-date whenever you merge to `main`.

[Follow GitHub’s documentation](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository) to configure a new secret in your repository with the name `ASTRO_STUDIO_APP_TOKEN` and your Studio app token as the value for the secret.

Once your secret is configured, create a new GitHub Actions workflow file in your project’s `.github/workflows` directory to checkout the repository and install Node.js as steps, and use the `withastro/action-studio` action to sync schema changes.

The action will run `astro db verify` on all [event triggers](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows) to ensure schema changes can be applied safely. If you add the **[push](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#push)** trigger specifically, the action will push those changes to your Studio database.

This example GitHub Action `_studio.yml` pushes changes whenever the `main` branch is updated:

.github/workflows/\_studio.yml

```
name: Astro Studio


env:
  ASTRO_STUDIO_APP_TOKEN: ${{secrets.ASTRO_STUDIO_APP_TOKEN }}


on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, reopened, synchronize]


jobs:
  DB:
    permissions:
      contents: read
      actions: read
      pull-requests: write
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - uses: jaid/action-npm-install@v1.2.1
      - uses: withastro/action-studio@main
```

### Pushing table schemas

[Section titled Pushing table schemas](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#pushing-table-schemas)

Studio feature

Your table schema will change over time as your project grows. You can safely test configuration changes locally and push to your Studio database when you deploy.

When [creating a Studio project from the dashboard](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#astro-studio), you will have the option to create a GitHub CI action. This will automatically migrate schema changes when merging with your repository’s main branch.

You can also push your local schema changes to Astro Studio via the CLI using the `astro db push --remote` command:

* [npm](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#tab-panel-145)
* [pnpm](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#tab-panel-146)
* [Yarn](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#tab-panel-147)

Terminal window

```
yarn astro db push --remote
```

This command will verify that your local changes can be made without data loss and, if necessary, suggest how to safely make changes to your schema in order to resolve conflicts.

#### Pushing breaking schema changes

[Section titled Pushing breaking schema changes](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#pushing-breaking-schema-changes)

Caution

**This will destroy your database**. Only perform this command if you do not need your production data.

If you must change your table schema in a way that is incompatible with your existing data hosted at Astro Studio, you will need to reset your production database.

To push a table schema update that includes a breaking change, add the `--force-reset` flag to reset all production data:

* [npm](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#tab-panel-148)
* [pnpm](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#tab-panel-149)
* [Yarn](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#tab-panel-150)

Terminal window

```
yarn astro db push --remote --force-reset
```

### Renaming tables

[Section titled Renaming tables](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#renaming-tables)

Studio feature

It is possible to rename a table after pushing your schema to Astro Studio.

If you **do not have any important production data**, then you can [reset your database](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#pushing-breaking-schema-changes) using the `--force-reset` flag. This flag will drop all of the tables in the database and create new ones so that it matches your current schema exactly.

To rename a table while preserving your production data, you must perform a series of non-breaking changes to push your local schema to Astro studio safely.

The following example renames a table from `Comment` to `Feedback`:

1. In your database config file, add the `deprecated: true` property to the table you want to rename:

   db/config.ts

   ```
   const Comment = defineTable({
     deprecated: true,
     columns: {
       author: column.text(),
       body: column.text(),
     }
   });
   ```

2. Add a new table schema (matching the existing table’s properties exactly) with the new name:

   db/config.ts

   ```
   const Comment = defineTable({
     deprecated: true,
     columns: {
       author: column.text(),
       body: column.text(),
     }
   });


   const Feedback = defineTable({
     columns: {
       author: column.text(),
       body: column.text(),
     }
   });
   ```

3. [Push to Astro Studio](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#pushing-table-schemas) with `astro db push --remote`. This will add the new table and mark the old as deprecated.

4. Update any of your local project code to use the new table instead of the old table. You might need to migrate data to the new table as well.

5. Once you are confident that the old table is no longer used in your project, you can remove the schema from your `config.ts`:

   db/config.ts

   ```
   const Comment = defineTable({
     deprecated: true,
     columns: {
       author: column.text(),
       body: column.text(),
     }
   });


   const Feedback = defineTable({
     columns: {
       author: column.text(),
       body: column.text(),
     }
   });
   ```

6. Push to Astro Studio again with `astro db push --remote`. The old table will be dropped, leaving only the new, renamed table.

### Pushing data

[Section titled Pushing data](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#pushing-data)

Studio feature

You may need to push data to your Studio database for seeding or data migrations. You can author a `.ts` file with the `astro:db` module to write type-safe queries. Then, execute the file against your Studio database using the command `astro db execute <file-path> --remote`:

The following Comments can be seeded using the command `astro db execute db/seed.ts --remote`:

db/seed.ts

```
import { Comment } from 'astro:db';


export default async function () {
  await db.insert(Comment).values([
    { authorId: 1, body: 'Hope you like Astro DB!' },
    { authorId: 2, body: 'Enjoy!' },
  ])
}
```

See the [CLI reference](https://5-0-0-beta.docs.astro.build/en/guides/integrations-guide/db/#astro-db-cli-reference) for a complete list of commands.

### Connect to Astro Studio

[Section titled Connect to Astro Studio](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#connect-to-astro-studio)

Studio feature

By default, Astro will use a local database file whenever you run the `dev` or `build` commands. Tables are recreated from scratch when each command is run, and development seed data will be inserted.

To connect to your hosted Studio database, you can add the `--remote` flag. Use this flag for production deploys to have both readable and writable access to your Studio database. This will allow you to [accept and persist user data](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#insert).

Terminal window

```
# Build with a remote connection
astro build --remote


# Develop with a remote connection
astro dev --remote
```

Caution

Be careful using `--remote` in development. This will connect to a live production database, and all inserts, updates, or deletions will be persisted.

To use a remote connection, you will need an app token to authenticate with Studio. Visit the Studio dashboard for token creation and setup instructions.

When you’re ready to deploy, see our [Deploy with a Studio Connection guide](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#deploy-with-a-studio-connection).

### Migrate from Astro Studio to Turso

[Section titled Migrate from Astro Studio to Turso](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#migrate-from-astro-studio-to-turso)

1. In the [Studio dashboard](https://studio.astro.build/), navigate to the project you wish to migrate. In the settings tab, use the “Export Database” button to download a dump of your database.

2. Follow the official instructions to [install the Turso CLI](https://docs.turso.tech/cli/installation) and [sign up or log in](https://docs.turso.tech/cli/authentication) to your Turso account.

3. Create a new database on Turso using the `turso db create` command.

   Terminal window

   ```
   turso db create [database-name]
   ```

4. Fetch the database URL using the Turso CLI, and use it as the environment variable `ASTRO_DB_REMOTE_URL`.

   Terminal window

   ```
   turso db show [database-name]
   ```

   ```
   ASTRO_DB_REMOTE_URL=[your-database-url]
   ```

5. Create a token to access your database, and use it as the environment variable `ASTRO_DB_APP_TOKEN`.

   Terminal window

   ```
   turso db tokens create [database-name]
   ```

   ```
   ASTRO_DB_APP_TOKEN=[your-app-token]
   ```

6. Push your DB schema and metadata to the new Turso database.

   Terminal window

   ```
   astro db push --remote
   ```

7. Import the database dump from step 1 into your new Turso DB.

   Terminal window

   ```
   turso db shell [database-name] < ./path/to/dump.sql
   ```

8. Once you have confirmed your project connects to the new database, you can safely delete the project from Astro Studio.

## libSQL

[Section titled libSQL](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#libsql)

**Added in:** `@astrojs/db@0.14.0` New

Astro DB can connect to any libSQL server from any platform that exposes the libSQL remote protocol of the server, or can be self-hosted.

To connect Astro DB to a libSQL database, set the following environment variables:

* `ASTRO_DB_REMOTE_URL`: the connection URL to your libSQL server
* `ASTRO_DB_APP_TOKEN`: the auth token to your libSQL server

The [commands for deploying and pushing changes](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#deploy-with-a-studio-connection) to your database are the same when using libSQL as when connecting to an Astro Studio hosted database. However, both of your environment variables need to be set locally when running commands with the `--remote` option like `astro build` and `astro db push`.

Details of the libSQL connection (e.g. encryption key, replication, sync interval) can be configured as query parameters in the remote connection URL.

For example, to have a local file work as an embedded replica to an encrypted libSQL server, you can set the following environment variables:

.env

```
ASTRO_DB_REMOTE_URL=file://local-copy.db?encryptionKey=your-encryption-key&syncInterval=60&syncUrl=libsql%3A%2F%2Fyour.server.io
ASTRO_DB_APP_TOKEN=token-to-your-remote-url
```

### URL scheme and host

[Section titled URL scheme and host](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#url-scheme-and-host)

libSQL supports both HTTP and WebSockets as the transport protocol for a remote server. It also supports using a local file or an in-memory DB. Those can be configured using the following URL schemes in the connection URL:

* `memory:` will use an in-memory DB. The host must be empty in this case.
* `file:` will use a local file. The host is the path to the file (`file:path/to/file.db`).
* `libsql:` will use a remote server through the protocol preferred by the library (this might be different across versions). The host is the address of the server (`libsql://your.server.io`).
* `http:` will use a remote server through HTTP. `https:` can be used to enable a secure connection. The host is the same as for `libsql:`.
* `ws:` will use a remote server through WebSockets. `wss:` can be used to enable a secure connection. The host is the same as for `libsql:`.

### `encryptionKey`

[Section titled encryptionKey](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#encryptionkey)

libSQL has native support for encrypted databases. Passing this search parameter will enable encryption using the given key:

.env

```
ASTRO_DB_REMOTE_URL=file:path/to/file.db?encryptionKey=your-encryption-key
```

### `syncUrl`

[Section titled syncUrl](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#syncurl)

Embedded replicas are a feature of libSQL clients that enables a full synchronized copy of your database on a local file or in memory for ultra-fast reads. Writes are sent to a remote database defined on the `syncUrl` and synchronized with the local copy.

Use this property to pass a separate connection URL to turn the DB into an embedded replica of another database. This should only be used with the schemes `file:` and `memory:`. The parameter must be URL encoded.

For example, to have an in-memory embedded replica of a database on `libsql://your.server.io`, you can set the connection URL as such:

.env

```
ASTRO_DB_REMOTE_URL=memory:?syncUrl=libsql%3A%2F%2Fyour.server.io
```

### `syncInterval`

[Section titled syncInterval](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#syncinterval)

Interval between embedded replicas synchronizations in seconds. By default it only synchronizes on startup and after writes.

This property is only used when `syncUrl` is also set. For example, to set an in-memory embedded replica to synchronize every minute set the following environment variable:

.env

```
ASTRO_DB_REMOTE_URL=memory:?syncUrl=libsql%3A%2F%2Fyour.server.io&syncInterval=60
```

## Building Astro DB integrations

[Section titled Building Astro DB integrations](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#building-astro-db-integrations)

[Astro integrations](https://5-0-0-beta.docs.astro.build/en/reference/integrations-reference/) can extend user projects with additional Astro DB tables and seed data.

Use the `extendDb()` method in the `astro:db:setup` hook to register additional Astro DB config and seed files. The `defineDbIntegration()` helper provides TypeScript support and auto-complete for the `astro:db:setup` hook.

my-integration/index.ts

```
import { defineDbIntegration } from '@astrojs/db/utils';


export default function MyIntegration() {
  return defineDbIntegration({
    name: 'my-astro-db-powered-integration',
    hooks: {
      'astro:db:setup': ({ extendDb }) => {
        extendDb({
          configEntrypoint: '@astronaut/my-package/config',
          seedEntrypoint: '@astronaut/my-package/seed',
        });
      },
      // Other integration hooks...
    },
  });
}
```

Integration [config](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#define-your-database) and [seed](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#seed-your-database) files follow the same format as their user-defined equivalents.

### Type safe operations in integrations

[Section titled Type safe operations in integrations](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#type-safe-operations-in-integrations)

While working on integrations, you may not be able to benefit from Astro’s generated table types exported from `astro:db`. For full type safety, use the `asDrizzleTable()` utility to create a table reference object you can use for database operations.

For example, given an integration setting up the following `Pets` database table:

my-integration/config.ts

```
import { defineDb, defineTable, column } from 'astro:db';


export const Pets = defineTable({
  columns: {
    name: column.text(),
    species: column.text(),
  },
});


export default defineDb({ tables: { Pets } });
```

The seed file can import `Pets` and use `asDrizzleTable()` to insert rows into your table with type checking:

my-integration/seed.ts

```
import { asDrizzleTable } from '@astrojs/db/utils';
import { db } from 'astro:db';
import { Pets } from './config';


export default async function() {
  const typeSafePets = asDrizzleTable('Pets', Pets);


  await db.insert(typeSafePets).values([
    { name: 'Palomita', species: 'cat' },
    { name: 'Pan', species: 'dog' },
  ]);
}
```

The value returned by `asDrizzleTable('Pets', Pets)` is equivalent to `import { Pets } from 'astro:db'`, but is available even when Astro’s type generation can’t run. You can use it in any integration code that needs to query or insert into the database.

## Self-hosted production deployment

[Section titled Self-hosted production deployment](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#self-hosted-production-deployment)

If you deploy your site to a self-managed host such as a [virtual private server](https://en.wikipedia.org/wiki/Virtual_private_server), you can choose to use a database file instead of connecting to a database hosted at Astro Studio.

Caution

Using a database file is an advanced feature, and care should be taken when deploying to prevent overriding your database and losing your production data.

Additionally, this method will not work in serverless deployments, as the file system is not persisted in those environments.

For a fully managed solution, [connect to databases hosted on the Astro Studio platform](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#astro-studio) instead.

If you are comfortable with the risks, and can manage deployment yourself, you can use a database file instead of connecting to Studio.

Set the `ASTRO_DATABASE_FILE` environment variable to a path pointing to your `.db` file within the host environment during your build:

Terminal window

```
ASTRO_DATABASE_FILE=/srv/files/database.db astro build
```

The build will statically compile with this path as your production database. When you deploy and launch your server it will connect to the file at this path on the production host.

Additionally, [pushing any table schema changes](https://5-0-0-beta.docs.astro.build/en/guides/astro-db/#pushing-table-schemas) (also known as “schema migrations”) must be managed manually using this environment variable.

Danger

If you override your `.db` file on deployment, you will lose your production data. Follow the deployment method process for your host carefully to prevent data loss.

[Edit page](https://github.com/withastro/docs/edit/5.0.0-beta/src/content/docs/en/guides/astro-db.mdx)
