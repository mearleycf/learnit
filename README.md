# astro-base
This is a template repository for starting new Astro projects. 

## Included:
The following setup is already configured within astro-base:
- Astro (v 4.11.0 as of current publishing of this repo)
- @astrojs/sitemap--this has also been configured in the config file
- @astrojs/tailwind
- @astrojs/vercel (note--uninstall and add correct host package if necessary)
- @fontsource: 
  - fontsource-variable/inter (a sans-serif font that is very pleasing for web pages)
  - lilita-one (A display style font--bold, sans-serif)
  - righteous (a display style font--very retro '80s themed)
- astro-icon (access icons using the <Icon> component built for astro)
- tailwindcss--this has also been configured in the tailwind config and in global.css
- typescript
- eslint, including:
  - eslintrc
  - eslint/js
  - typescript-eslint
  - typescript-eslint/eslint-plugin
  - typescript-eslint/parser
  - eslint-config-prettier
- prettier, including:
  - prettier-plugin-astro
  - prettier-plugin-astro-organize-imports
  - prettier-plugin-organize-attributes
  - prettier-plugin-packagejson
  - prettier-plugin-sort-imports
  - prettier-plugin-tailwindcss

## Package Manager
The project is currently configured to use Yarn. Make sure you switch it to your preferred package manager and update package.json, delete yarn.lock, .yarn folder, etc. 

## Installation
Pull the repository to your local system. Then run:
`yarn install`

## Operation
Use `yarn dev` to start the development server. Use `yarn build` to build the application. 
Make sure the page loads (localhost:4321). 
Make sure the project builds. 

## Happy building!
