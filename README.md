> **Note**: This template is work in progress. The last commit includes my latest changes :)
> Feel free to use it - If you think you can improve it, please open a PR <3

This is a nextjs template with omnidoc integration to render mdx content.

- NextJS 14
- Tailwind
- shadncn
- next-theme to support dark/light mode

## Credits

- Table of contents: https://github.com/shadcn-ui/ui/blob/main/apps/www/components/toc.tsx
  - Used this as base and updated it to make it work with the generated headings from omnidoc
- Sidebar: https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/new-york/block/sidebar-01
- Aria Docs: https://github.com/nisabmohd/Aria-Docs
- Site Header: https://github.com/nisabmohd/Aria-Docs
- Home Page: https://github.com/nisabmohd/Aria-Docs
- Omnidoc: https://github.com/souporserious/omnidoc

## Known errors

### Sidebar flickering

The sidebar is currently flickering if you resize the window to check how it looks like in the mobile view.

> **This seems to be only a problem while running `pnpm dev`**

### content structure

With the current template setup, we expect a content structure as follows:

```
- /content
  - /docs
    - /<product-name> ( e.g. aria-docs)
      - index.mdx ( optional )
      - /<section-name> ( e.g. getting-started )
        - index.mdx ( optional )
        - <file-name>.mdx ( e.g. introduction.mdx)
```

If you have something like this:

```
- /content
  - /docs
    - /<product-name> ( e.g. aria-docs)
      - index.mdx ( optional )
      - <file-name>.mdx ( e.g. getting-started.mdx )

```

Then the sidebar will render the `<file-name>` ( e.g. `Getting Started` ) as a clickable section and not as normal link.
