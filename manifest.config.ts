import { defineManifest } from '@crxjs/vite-plugin';
import packageJson from './package.json';

const { version } = packageJson;

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = '0'] = version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, '')
  // split into version parts
  .split(/[.-]/);

export default defineManifest(async (env) => ({
  action: {
    default_popup: 'index.html',
  },
  background: {
    service_worker: 'src/background',
    type: 'module',
  },
  content_scripts: [
    {
      matches: [
        '*://anichart.net/Spring-*',
        '*://anichart.net/Summer-*',
        '*://anichart.net/Fall-*',
        '*://anichart.net/Winter-*',
      ],
      js: ['src/content_scripts/anichart.net'],
      run_at: 'document_end',
      all_frames: false,
    },
    {
      matches: ['*://myanimelist.net/anime/season*'],
      js: ['src/content_scripts/myanimelist.net'],
      all_frames: false,
    },
    {
      matches: ['*://anilist.co/anime/*'],
      js: ['src/content_scripts/anilist.co/anime'],
      all_frames: false,
    },
  ],
  description: 'Search nyaa.si',
  host_permissions: ['https://*/*', 'http://*/*'],
  permissions: ['tabs', 'storage'],
  options_page: 'options_page.html',
  manifest_version: 3,
  name: 'Nyaa Search',
  version: '1.0',
}));
