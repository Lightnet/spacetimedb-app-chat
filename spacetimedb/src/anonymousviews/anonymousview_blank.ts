// 

import { table, t } from 'spacetimedb/server';
import spacetimedb from '../module';
import { users } from '../tables/table_user';

export const public_user = spacetimedb.anonymousView(
    { name: 'public_user', public: true },
    t.array(users.rowType),
    (ctx) => {
        let tag:any = {tag : 'Online'};
        //ctx.from.user.where(r=>r.status.eq(tag));//not working yet?
        return []
    }
)