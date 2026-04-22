// 

import { table, t } from 'spacetimedb/server';
import spacetimedb from '../module';
import { user } from '../tables/table_user';

export const public_user = spacetimedb.anonymousView(
    { name: 'public_user', public: true },
    t.array(user.rowType),
    (ctx) => {
        let tag:any = {tag : 'Online'};
        //ctx.from.user.where(r=>r.status.eq(tag));//not working yet?
        return []
    }
)