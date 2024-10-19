# Content collections

> Added in: astro@2.0.0

Content collections are the best way to manage sets of content in any Astro project. Collections help to organize and query your documents, enable Intellisense and type checking in your editor, and provide automatic TypeScript type-safety for all of your content. Astro v5.0 introduced the Content Layer API for defining and querying content collections. This performant, scalable API provides built-in content loaders for your local collections. For remote content, you can use third-party and community-built loaders or create your own custom loader and pull in your data from any source.

> Note
>
> Projects may continue using the legacy Content Collections API introduced in Astro v2.0. However, we encourage you to update any existing collections when you are able.

## What are Content Collections?

You can define a collection from a set of data that is structurally similar. This can be a directory of blog posts, a JSON file of product items, or any data that represents multiple items of the same shape.

Collections stored locally in your project or on your filesystem can have entries of Markdown, MDX, Markdoc, or JSON files:

```text
|--src/
|  |--newsletter (the “newsletter” collection)
|  |  |--week-1.md (a collection entry)
|  |  |--week-2.md (a collection entry)
|  |  |--week-3.md (a collection entry)
|  |--authors (the “author” collection)
|  |  |--authors.json (a single file containing all collection entries)
```

With an appropriate collection loader, you can fetch remote data from any external source, such as a CMS, database, or headless payment system.

### TypeScript configuration for collections

Content collections rely on TypeScript to provide Zod validation, Intellisense and type checking in your editor. If you are not extending one of Astro’s `strict` or `strictest` TypeScript settings, you will need to ensure the following `compilerOptions` are set in your `tsconfig.json`:

```json
tsconfig.json
{
  // Included with "astro/tsconfigs/strict" or "astro/tsconfigs/strictest"
  "extends": "astro/tsconfigs/base",
  "compilerOptions": {
    "strictNullChecks": true, // add if using `base` template
    "allowJs": true // required, and included with all Astro templates
  }
}
```

## Defining Collections

Individual collections use `defineCollection()` to configure:

- a `loader` for a data source (required)
- a `schema` for type safety (optional, but highly recommended!)

### The collection config file

To define collections, you must create a `src/content/config.ts` file in your project (`.js` and `.mjs` extensions are also supported.) This is a special file that Astro will use to configure your content collections based on the following structure:

```typescript
src / content / config.ts;
// 1. Import utilities from `astro:content`
import { defineCollection, z } from "astro:content";

// 2. Import loader(s)
import { glob, file } from "astro/loaders"; // Not available with legacy API

// 3. Define your collection(s)
const blog = defineCollection({
  /* ... */
});
const dogs = defineCollection({
  /* ... */
});

// 4. Export a single `collections` object to register your collection(s)
export const collections = { blog, dogs };
```

### Defining the collection `loader`

The Content Layer API allows you to fetch your content from outside of the `src/content/` folder (whether stored locally in your project or remotely) and uses a `loader` property to retrieve your data. Collections stored inside `src/content/` will be treated as legacy collections that do not use a loader to fetch content.

#### Built-in loaders

Astro provides two built-in loader functions (`glob()` and `file()`) for fetching your local content, as well as access to the API to construct your own loader and fetch remote data.

The `glob()` loader creates entries from directories of Markdown, MDX, Markdoc, or JSON files from anywhere on the filesystem. It accepts a `pattern` of entry files to match, and a `base` file path of where your files are located. Use this when you have one file per entry.

The `file()` loader creates multiple entries from a single local file. Use this when all your entries are stored in an array of objects.

```typescript
src/content/config.ts
import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders'; // Not available with legacy API

const blog = defineCollection({
  loader: glob({ pattern: "**\/*.md", base: "./src/data/blog" }),
  schema: /* ... */
});
const dogs = defineCollection({
  loader: file("src/data/dogs.json"),
  schema: /* ... */
  }),
});

const probes = defineCollection({
  // `loader` can accept an array of multiple patterns as well as string patterns
  // Load all markdown files in the space-probes directory, except for those that start with "voyager-"
  loader: glob({ pattern: ['*.md', '!voyager-*'], base: 'src/data/space-probes' }),
  schema: z.object({
    name: z.string(),
    type: z.enum(['Space Probe', 'Mars Rover', 'Comet Lander']),
    launch_date: z.date(),
    status: z.enum(['Active', 'Inactive', 'Decommissioned']),
    destination: z.string(),
    operator: z.string(),
    notable_discoveries: z.array(z.string()),
  }),
});

export const collections = { blog, dogs, probes };
```

#### Building a custom loader

You can build a custom loader to fetch remote content from any data source, such as a CMS, a database, or an API endpoint.

Using a loader to fetch your data will automatically create a collection from your remote data. This gives you all the benefits of local collections, such as collection-specific API helpers such as `getCollection()` and `render()` to query and display your data, as well as schema validation.

> Tip
>
> Find community-built and third-party loaders in the [Astro integrations directory](https://astro.build/integrations/?search=&categories%5B%5D=loaders).

##### Inline loaders

You can define a loader inline, inside your collection, as an async function that returns an array of entries.

This is useful for loaders that don’t need to manually control how the data is loaded and stored. Whenever the loader is called, it will clear the store and reload all the entries.

```typescript
src/content/config.ts
const countries = defineCollection({
  loader: async () => {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();
    // Must return an array of entries with an id property, or an object with IDs as keys and entries as values
    return data.map((country) => ({
      id: country.cca3,
      ...country,
    }));
  },
  schema: /* ... */
});
```

The returned entries are stored in the collection and can be queried using the `getCollection()` and `getEntry()` functions.

##### Loader objects

For more control over the loading process, you can use the Loader API to create a loader object. For example, with access to the `load` method directly, you can create a loader that allows entries to be updated incrementally or clears the store only when necessary.

Similar to creating an Astro integration or Vite plugin, you can [distribute your loader as an NPM package](https://5-0-0-beta.docs.astro.build/en/reference/publish-to-npm/) that others can use in their projects.

> See the full [Loader API](https://5-0-0-beta.docs.astro.build/en/reference/loader-reference/) and examples of how to build your own loader.

### Defining the collection schema

Schemas enforce consistent frontmatter or entry data within a collection through Zod validation. A schema guarantees that this data exists in a predictable form when you need to reference or query it. If any file violates its collection schema, Astro will provide a helpful error to let you know.

Schemas also power Astro’s automatic TypeScript typings for your content. When you define a schema for your collection, Astro will automatically generate and apply a TypeScript interface to it. The result is full TypeScript support when you query your collection, including property autocompletion and type-checking.

Every frontmatter or data property of your collection entries must be defined using a Zod data type:

```typescript
src / content / config.ts;
import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders"; // Not available with legacy API

const blog = defineCollection({
  loader: glob({ pattern: "*_/_.md", base: "./src/data/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
  }),
});
const dogs = defineCollection({
  loader: file("src/data/dogs.json"),
  schema: z.object({
    id: z.string(),
    breed: z.string(),
    temperament: z.array(z.string()),
  }),
});

export const collections = { blog, dogs };
```

#### Defining datatypes with Zod

Astro uses [Zod](https://github.com/colinhacks/zod) to power its content schemas. With Zod, Astro is able to validate every file’s data within a collection and provide automatic TypeScript types when you go to query content from inside your project.

To use Zod in Astro, import the `z` utility from `"astro:content"`. This is a re-export of the Zod library, and it supports all of the features of Zod.

```typescript
// Example: A cheatsheet of many common Zod datatypes
import { z, defineCollection } from "astro:content";

defineCollection({
  schema: z.object({
    isDraft: z.boolean(),
    title: z.string(),
    sortOrder: z.number(),
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }),
    author: z.string().default("Anonymous"),
    language: z.enum(["en", "es"]),
    tags: z.array(z.string()),
    footnote: z.string().optional(),

    // In YAML, dates written without quotes around them are interpreted as Date objects
    publishDate: z.date(), // e.g. 2024-09-17

    // Transform a date string (e.g. "2022-07-08") to a Date object
    updatedDate: z.string().transform((str) => new Date(str)),

    authorContact: z.string().email(),
    canonicalURL: z.string().url(),
  }),
});
```

> See [Zod’s README](https://github.com/colinhacks/zod) for complete documentation on how Zod works and what features are available.

##### Zod schema methods

All [Zod schema methods](https://zod.dev/?id=schema-methods) (e.g. `.parse()`, `.transform()`) are available, with some limitations. Notably, performing custom validation checks on images using `image().refine()` is unsupported.

#### Defining collection references

Collection entries can also “reference” other related entries.

With the `reference()` function from the Collections API, you can define a property in a collection schema as an entry from another collection. For example, you can require that every `space-shuttle` entry includes a `pilot` property which uses the `pilot` collection’s own schema for type checking, autocomplete, and validation.

A common example is a blog post that references reusable author profiles stored as JSON, or related post URLs stored in the same collection:

```typescript
src / content / config.ts;
import { defineCollection, reference, z } from "astro:content";

const blog = defineCollection({
  loader: glob({ pattern: "*_/[^_]_.md", base: "./src/data/blog" }),
  schema: z.object({
    title: z.string(),
    // Reference a single author from the `authors` collection by `id`
    author: reference("authors"),
    // Reference an array of related posts from the `blog` collection by `slug`
    relatedPosts: z.array(reference("blog")),
  }),
});

const authors = defineCollection({
  loader: glob({ pattern: "*_/[^_]_.json", base: "./src/data/authors" }),
  schema: z.object({
    name: z.string(),
    portfolio: z.string().url(),
  }),
});

export const collections = { blog, authors };
```

This example blog post specifies the ids of related posts and the id of the post author:

```markdown
## src/data/blog/welcome.md

title: "Welcome to my blog"
author: ben-holmes # references `src/data/authors/ben-holmes.json`
relatedPosts:

- about-me # references `src/data/blog/about-me.md`
- my-year-in-review # references `src/data/blog/my-year-in-review.md`

---
```

## Querying Collections

Astro provides helper functions to query a collection and return one (or more) content entries.

[getCollection()](https://5-0-0-beta.docs.astro.build/en/reference/api-reference/#getcollection) fetches an entire collection and returns an array of entries.
[getEntry()](https://5-0-0-beta.docs.astro.build/en/reference/api-reference/#getentry) fetches a single entry from a collection.
These return entries with a unique `id`, a `data` object with all defined properties, and will also return a `body` containing the raw, uncompiled body of a Markdown, MDX, or Markdoc document.

```typescript
import { getCollection, getEntry } from "astro:content";

// Get all entries from a collection.
// Requires the name of the collection as an argument.
const allBlogPosts = await getCollection("blog");

// Get a single entry from a collection.
// Requires the name of the collection and `id`
const poodleData = await getEntry("dogs", "poodle");
```

See the full list of properties returned by the [CollectionEntry type](https://5-0-0-beta.docs.astro.build/en/reference/api-reference/#collection-entry-type).

### Using content in Astro templates

After querying your collections, you can access each entry’s content directly inside of your Astro component template. For example, you can create a list of links to your blog posts, displaying information from your entry’s frontmatter using the `data` property.

```astro
## src/pages/index.astro

import { getCollection } from 'astro:content';
const posts = await getCollection('blog');

---

<h1>My posts</h1>
<ul>
  {posts.map(post => (
    <li><a href={`/blog/${post.id}`}>{post.data.title}</a></li>
  ))}
</ul>
```

#### Rendering body content

Once queried, you can render Markdown and MDX entries to HTML using the `render()` function property. Calling this function gives you access to rendered HTML content, including both a `<Content />` component and a list of all rendered headings.

```astro
## src/pages/blog/post-1.astro

import { getEntry, render } from 'astro:content';

const entry = await getEntry('blog', 'post-1');
const { Content, headings } = await render(entry);

---

<p>Published on: {entry.data.published.toDateString()}</p>
<Content />
```

#### Passing content as props

A component can also pass an entire collection entry as a prop.

You can use the [CollectionEntry](https://5-0-0-beta.docs.astro.build/en/reference/api-reference/#collection-entry-type) utility to correctly type your component’s props using TypeScript. This utility takes a string argument that matches the name of your collection schema and will inherit all of the properties of that collection’s schema.

```astro
## src/components/BlogCard.astro

import type { CollectionEntry } from 'astro:content';
interface Props {
post: CollectionEntry<'blog'>;
}

// `post` will match your 'blog' collection schema type
const { post } = Astro.props;

---
```

### Filtering collection queries

`getCollection()` takes an optional “filter” callback that allows you to filter your query based on an entry’s `id` or `data` properties.

You can use this to filter by any content criteria you like. For example, you can filter by properties like `draft` to prevent any draft blog posts from publishing to your blog:

```typescript
// Example: Filter out content entries with `draft: true`
import { getCollection } from "astro:content";
const publishedBlogEntries = await getCollection("blog", ({ data }) => {
  return data.draft !== true;
});
```

You can also create draft pages that are available when running the dev server, but not built in production:

```typescript
// Example: Filter out content entries with `draft: true` only when building for production
import { getCollection } from "astro:content";
const blogEntries = await getCollection("blog", ({ data }) => {
  return import.meta.env.PROD ? data.draft !== true : true;
});
```

The filter argument also supports filtering by nested directories within a collection. Since the `id` includes the full nested path, you can filter by the start of each `id` to only return items from a specific nested directory:

```typescript
// Example: Filter entries by sub-directory in the collection
import { getCollection } from "astro:content";
const englishDocsEntries = await getCollection("docs", ({ id }) => {
  return id.startsWith("en/");
});
```

### Accessing referenced data

Any [references defined in your schema](https://5-0-0-beta.docs.astro.build/en/guides/content-collections/#defining-collection-references) must be queried separately after first querying your collection entry. You can use the `getEntry()` function to return a single referenced item, or `getEntries()` to retrieve multiple referenced entries from the returned `data` object.

```typescript
## src/pages/blog/welcome.astro

import { getEntry, getEntries } from 'astro:content';

const blogPost = await getEntry('blog', 'welcome');

// Resolve a singular reference
const author = await getEntry(blogPost.data.author);
// Resolve an array of references
const relatedPosts = await getEntries(blogPost.data.relatedPosts);

---

<h1>{blogPost.data.title}</h1>
<p>Author: {author.data.name}</p>

<!-- ... -->

<h2>You might also like:</h2>
{relatedPosts.map(post => (
  <a href={post.id}>{post.data.title}</a>
))}
```

## Generating Routes from Content

Content collections are stored outside of the `src/pages/` directory. This means that no pages or routes are generated for your collection items by default.

You will need to manually create a new [dynamic route](https://5-0-0-beta.docs.astro.build/en/guides/routing/#dynamic-routes) if you want to generate HTML pages for each of your collection entries, such as individual blog posts. Your dynamic route will map the incoming request param (e.g. `Astro.params.slug` in `src/pages/blog/[...slug].astro`) to fetch the correct entry for each page.

The exact method for generating routes will depend on whether your pages are prerendered (default) or rendered on demand by a server.

### Building for static output (default)

If you are building a static website (Astro’s default behavior), use the [getStaticPaths()](https://5-0-0-beta.docs.astro.build/en/reference/api-reference/#getstaticpaths) function to create multiple pages from a single page component (e.g. `src/pages/[slug]`) during your build.

Call `getCollection()` inside of `getStaticPaths()` to have your collection data available for building static routes. Then, create the individual URL paths using the `id` property of each content entry. Each page is passed the entire collection entry as a prop for [use in your page template](https://5-0-0-beta.docs.astro.build/en/guides/content-collections/#using-content-in-astro-templates).

```astro
## src/pages/posts/[id].astro

import { getCollection, render } from 'astro:content';
// 1. Generate a new path for every collection entry
export async function getStaticPaths() {
const posts = await getCollection('blog');
return posts.map(post => ({
params: { id: post.id },
props: { post },
}));
}
// 2. For your template, you can get the entry directly from the prop
const { post } = Astro.props;
const { Content } = await render(post);

---

<h1>{post.data.title}</h1>
<Content />
```

This will generate a page route for every entry in the `blog` collection. For example, an entry at `src/blog/hello-world.md` will have an `id` of `hello-world`, and therefore its final URL will be `/posts/hello-world/`.

> Note
>
> If your custom slugs contain the / character to produce URLs with multiple path segments, you must use a rest parameter (e.g. [...slug]) in the .astro filename for this dynamic routing page.

### Building for server output (SSR)

If you are building a dynamic website (using Astro’s SSR support), you are not expected to generate any paths ahead of time during the build. Instead, your page should examine the request (using `Astro.request` or `Astro.params`) to find the `id` on-demand, and then fetch it using [getEntry()](https://5-0-0-beta.docs.astro.build/en/reference/api-reference/#getentry).

```astro
## src/pages/posts/[id].astro

import { getEntry, render } from "astro:content";
// 1. Get the slug from the incoming server request
const { id } = Astro.params;
if (id === undefined) {
return Astro.redirect("/404");
}
// 2. Query for the entry directly using the request slug
const post = await getEntry("blog", id);
// 3. Redirect if the entry does not exist
if (post === undefined) {
return Astro.redirect("/404");
}
// 4. Render the entry to HTML in the template
const { Content } = await render(post);

---

<h1>{post.data.title}</h1>
<Content />
```

> Tip
>
> Explore the `src/pages/` folder of the [blog tutorial demo code on GitHub](https://github.com/withastro/blog-tutorial-demo/tree/content-layer/src/pages) to see full examples of creating pages from your collections for blog features like a list of blog posts, tags pages, and more!

## When to create a collection

You can [create a collection](https://5-0-0-beta.docs.astro.build/en/guides/content-collections/#defining-collections) any time you have a group of related data or content that shares a common structure.

Much of the benefit of using collections comes from:

- Defining a common data shape to validate that an individual entry is “correct” or “complete”, avoiding errors in production.
  Content-focused APIs designed to make querying intuitive (e.g. `getCollection()` instead of `import.meta.glob()`) when importing and rendering content on your pages.
- A [Loader API](https://5-0-0-beta.docs.astro.build/en/reference/loader-reference/) for retrieving your content that provides both built-in loaders and access to the low-level API. There are several third-party and community-built loaders available, and you can build your own custom loader to fetch data from anywhere.
- Performance and scalability. The Content Layer API allows data to be cached between builds and is suitable for tens of thousands of content entries.

[Define your data](https://5-0-0-beta.docs.astro.build/en/guides/content-collections/#defining-collections) as a collection when:

- You have multiple files or data to organize that share the same overall structure (e.g. blog posts written in Markdown which all have the same frontmatter properties).
- You have existing content stored remotely, such as in a CMS, and want to take advantage of the collections helper functions and Content Layer API instead of using `fetch()` or SDKs.
- You need to fetch (tens of) thousands of related pieces of data, and need a querying and caching method that handles at scale.

### When not to create a collection

Collections provide excellent structure, safety, and organization when you have multiple pieces of content that must share the same properties.

Collections may not be your solution if:

- You have only one or a small number of different pages. Consider [making individual page components](https://5-0-0-beta.docs.astro.build/en/basics/astro-pages/) such as `src/pages/about.astro` with your content directly instead.
- Your data is not stored in a supported format, such as TOML. Use other methods of [importing files](https://5-0-0-beta.docs.astro.build/en/guides/imports/#import-statements) or [fetching data](https://5-0-0-beta.docs.astro.build/en/guides/data-fetching/) instead.
  You are displaying files that are not processed by Astro, such as PDFs. Place these static assets in the [public/ directory](https://5-0-0-beta.docs.astro.build/en/basics/project-structure/#public) of your project instead.
  You are using APIs that need to be updated in real time. Content collections are only updated at build time, so if you need live data you should consider [on-demand rendering](https://5-0-0-beta.docs.astro.build/en/guides/on-demand-rendering/).