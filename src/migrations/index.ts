import * as migration_20261105_170258 from './20261105_170258';
import * as migration_20261107_010337 from './20261107_010337';
import * as migration_20261109_195908_add_page_banners from './20261109_195908_add_page_banners';

export const migrations = [
  {
    up: migration_20261105_170258.up,
    down: migration_20261105_170258.down,
    name: '20261105_170258',
  },
  {
    up: migration_20261107_010337.up,
    down: migration_20261107_010337.down,
    name: '20261107_010337',
  },
  {
    up: migration_20261109_195908_add_page_banners.up,
    down: migration_20261109_195908_add_page_banners.down,
    name: '20261109_195908_add_page_banners'
  },
];
