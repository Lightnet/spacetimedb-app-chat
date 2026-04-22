// Model contact for tables

import { table, t } from 'spacetimedb/server';
// import { status } from '../types';

export const messageEvent = table({
  public: true,
  event: true,
}, {
  senderId: t.identity(),
  message: t.string(),
  source: t.string(),
});