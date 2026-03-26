// import { t } from "spacetimedb/server";
// import { validateMessage } from "../helper";
import spacetimedb from "../module";

export const group_test = spacetimedb.reducer(
  {  },
  (ctx, {  }) => {
    console.log("test");
    // console.info(`ctx.sender: ${ctx.sender}  Group Chat Id: ${id}`);
    // const config = ctx.db.groupChatConfig.identity.find(ctx.sender);
    // if(config){
    //   config.groupChatId = id;
    //   ctx.db.groupChatConfig.identity.update(config);
    // }else{
    //   ctx.db.groupChatConfig.insert({
    //     status: undefined,
    //     identity: ctx.sender,
    //     createdAt: ctx.timestamp,
    //     groupChatId: id
    //   })
    // }
  }
);