import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';
import { validateSiteConfig } from '../src/recipes/immersive-website';
import { escapeHtml, renderSite } from '../src/ui/render-site';
export function siteHtml(): Plugin {
  const file = resolve('src/content/site.json');
  return {
    name: 'immersive-website-html',
    transformIndexHtml(html) {
      const config = validateSiteConfig(JSON.parse(readFileSync(file, 'utf8')));
      const theme = Object.entries(config.theme).map(([k, v]) => `--${k}:${v}`).join(';');
      return html.replace('<!--site-content-->', renderSite(config)).replace('<!--site-title-->', escapeHtml(config.site.title)).replace('<!--site-description-->', escapeHtml(config.site.description)).replace('data-site-language', `lang="${escapeHtml(config.site.language)}"`).replace('<!--site-theme-->', `<style>:root{${theme}}</style>`);
    },
    handleHotUpdate(ctx) { if (ctx.file === file) ctx.server.ws.send({ type: 'full-reload' }); },
  };
}
