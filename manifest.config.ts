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
      all_frames: false,
    },
  ],
  description: 'Adds torrent search to AniChart',
  host_permissions: [
    'https://*/',
    'http://*/',
    'http://nautilus/*',
    'http://nautilus:9091/*',
    'http://127.0.0.1:3000/',
  ],
  permissions: ['tabs', 'storage', 'activeTab'],
  options_page: 'options_page.html',
  externally_connectable: {
    matches: [
      'https://*/',
      'http://*/',
      'http://localhost:3000/*',
      'http://localhost/*',
      'http://127.0.0.1:3000/*',
      'http://127.0.0.1/*',
      'http://nautilus/*',
      'http://nautilus:9091/*',
      '*://google.com/*',
    ],
  },
  manifest_version: 3,
  name: 'AniChart Torrents',
  version: '1.0',
}));
