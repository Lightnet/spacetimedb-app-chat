import { schema, table, t, SenderError  } from 'spacetimedb/server';

const status = t.enum('Status', ['Online', 'Offline','Idle','Busy']);

export {
    status
}