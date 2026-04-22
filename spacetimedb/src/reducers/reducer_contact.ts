import { schema, table, t, SenderError  } from 'spacetimedb/server';
import spacetimedb from '../module';
// import { user, userAvatar } from '../models/model_user';
// import { validateName } from '../helper';

//-----------------------------------------------
// ADD CONTACT
//-----------------------------------------------
export const add_contact = spacetimedb.reducer(
  { id: t.string() }, 
  (ctx, { id }) => {
    //check for current user
    const own = ctx.db.user.identity.find(ctx.sender);
    if(!own){
      return;
    }
    //check register user exist
    const user = ctx.db.user.userId.find(id);
    let isFound = false;
    if(user){
      // need to fixed only current user not all users.
      for (const contact of ctx.db.contact.identity.filter(own.userId)){
        if(contact.userId == id){
          console.log("found");
          isFound=true;
          break;
        }
      }
      //make sure contact user exist and not found to add once.
      if((isFound == false)&&(user != null)){
        ctx.db.contact.insert({
          identity: own.userId,
          userId: id,
          created_at: ctx.timestamp,
          isBlock: false,
          id: ctx.newUuidV7().toString()
        });
      }
    }else{
      throw new SenderError("User does not exist!");  
    }
  }
);

//-----------------------------------------------
// ADD CONTACT ID
//-----------------------------------------------
export const add_contact_id = spacetimedb.reducer(
  { id: t.string() }, 
  (ctx, { id }) => {
    //check for current user
    const own = ctx.db.user.identity.find(ctx.sender);
    if(!own){
      return;
    }
    //check register user exist
    const user = ctx.db.user.userId.find(id);
    let isFound = false;
    if(user){
      for (const contact of ctx.db.contact.identity.filter(own.userId)){
        if(contact.userId == id){
          console.log("found");
          isFound=true;
          break;
        }
      }
      //make sure contact user exist and not found to add once.
      if((isFound == false)&&(user != null)){
        ctx.db.contact.insert({
          id:ctx.newUuidV7().toString(),
          identity: own.userId,
          userId: id,
          created_at: ctx.timestamp,
          isBlock: false
        });
      }
    }else{
      throw new SenderError("User does not exist!");  
    }
  }
);
//-----------------------------------------------
// REMOVE CONTACT
//-----------------------------------------------
export const remove_contact = spacetimedb.reducer(
  { name: t.string() }, 
  (ctx, { name }) => {
    
  }
);
//-----------------------------------------------
// REMOVE CONTACT ID
//-----------------------------------------------
export const remove_contact_id = spacetimedb.reducer(
  { id: t.string() }, 
  (ctx, { id }) => {
    // 
    console.log("id:", id);
    const own = ctx.db.user.identity.find(ctx.sender);
    if(!own){
      return;
    }
    ctx.db.contact.id.delete(id);
    // //check register user exist
    // const user = ctx.db.user.userId.find(id);
    // let isFound = false;
    // if(user){
    //   // for (const contact of ctx.db.contact.identity.filter(own.userId)){
    //     // if(contact.userId == id){
    //       // console.log("found");
    //       ctx.db.contact.id.delete(id);
    //       // break;
    //     // }
    //   // }
    // }else{
    //   throw new SenderError("User does not exist!");  
    // }
  }
);
//-----------------------------------------------
// BLOCK CONTACT
//-----------------------------------------------
export const block_contact = spacetimedb.reducer(
  { name: t.string() }, 
  (ctx, { name }) => {
    
  }
);

export const block_contact_id = spacetimedb.reducer(
  { id: t.string() }, 
  (ctx, { id }) => {
    const own = ctx.db.user.identity.find(ctx.sender);
    if(!own){
      return;
    }
    //check register user exist
    const user = ctx.db.user.userId.find(id);
    // let isFound = false;
    if(user){
      for (const contact of ctx.db.contact.identity.filter(own.userId)){
        if(contact.userId == id){
          console.log("found");
          // contact.isBlock = true;
          ctx.db.contact.id.update(contact);
          break;
        }
      }
    }else{
      throw new SenderError("User does not exist!");  
    }
  }
);


