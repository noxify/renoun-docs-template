> **Note**: This template is work in progress. The last commit includes my latest changes :)
> Feel free to use it - If you think you can improve it, please open a PR <3

This is a nextjs template with renoun integration to render mdx content.

- NextJS 14
- Tailwind
- shadncn
- next-theme to support dark/light mode

## Credits

- Table of contents: https://github.com/shadcn-ui/ui/blob/main/apps/www/components/toc.tsx
  - Used this as base and updated it to make it work with the generated headings from renoun
- Sidebar: https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/new-york/block/sidebar-01
- Aria Docs: https://github.com/nisabmohd/Aria-Docs
- Site Header: https://github.com/nisabmohd/Aria-Docs
- Home Page: https://github.com/nisabmohd/Aria-Docs
- renoun: https://github.com/souporserious/renoun

## Known errors

### Sidebar flickering

The sidebar is currently flickering if you resize the window to check how it looks like in the mobile view.

> **This seems to be only a problem while running `pnpm dev`**
