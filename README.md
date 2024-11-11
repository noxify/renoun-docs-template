> **Note**: This template is work in progress. The last commit includes my latest changes :)
> Feel free to use it - If you think you can improve it, please open a PR <3

This is a nextjs template with renoun integration to render mdx content.

- NextJS 15
- Tailwind
- shadncn
- next-theme to support dark/light mode
- Fulltext search via pagefind & Search UI by canary web components

## Credits

- Table of contents: https://github.com/shadcn-ui/ui/blob/main/apps/www/components/toc.tsx
  - Used this as base and updated it to make it work with the generated headings from renoun
- Sidebar: https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/new-york/block/sidebar-01
- Aria Docs: https://github.com/nisabmohd/Aria-Docs
- Site Header: https://github.com/nisabmohd/Aria-Docs
- Home Page: https://github.com/nisabmohd/Aria-Docs
- renoun: https://github.com/souporserious/renoun
- Search engine: https://github.com/cloudcannon/pagefind
- Search UI: https://github.com/fastrepl/canary

## Special thanks

- [souporserious](https://github.com/souporserious) for creating renoun and spending a lot of time to answer my questions and reviewing my PRs - Without your awesome package, this repo wouldn't exists <3
- [yujonglee](https://github.com/yujonglee) for creating the almost perfect search web component which contains a lot of features to provide a good search experience for the user. Thanks for taking the time to answer all my questions <3

## Known errors

### Sidebar flickering

The sidebar is currently flickering if you resize the window to check how it looks like in the mobile view.

> **This seems to be only a problem while running `pnpm dev`**

### Loading indicator for the search

While running the page in dev mode, I mentioned that the loading indicator will not disappear.

Based on what I have seen so far, it seems like the issue occours only on initial load of the page. If you refresh the page, everything works as expected.
