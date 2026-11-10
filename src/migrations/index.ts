import * as migration_20261105_170258 from './20261105_170258';
import * as migration_20261107_010337 from './20261107_010337';
import * as migration_20261109_195908_add_page_banners from './20261109_195908_add_page_banners';
import * as migration_20261110_175427 from './20261110_175427';
import * as migration_20261110_192543_add_legal_docs from './20261110_192543_add_legal_docs';
import * as migration_20261110_232755_add_event_registration_fields from './20261110_232755_add_event_registration_fields';

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
    name: '20261109_195908_add_page_banners',
  },
  {
    up: migration_20261110_175427.up,
    down: migration_20261110_175427.down,
    name: '20261110_175427',
  },
  {
    up: migration_20261110_192543_add_legal_docs.up,
    down: migration_20261110_192543_add_legal_docs.down,
    name: '20261110_192543_add_legal_docs',
  },
  {
    up: migration_20261110_232755_add_event_registration_fields.up,
    down: migration_20261110_232755_add_event_registration_fields.down,
    name: '20261110_232755_add_event_registration_fields'
  },
];
