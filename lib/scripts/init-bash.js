var exec = require("child_process").exec,
  cwd = process.cwd();

var PROJECT_REPO = "";

module.exports = function(opts,name,done){
 exec("git clone "+PROJECT_REPO+" "+name,{cwd:cwd},function(error,stdout,stderr){
   console.log(stdout);
   console.log(stderr);
   if(error){
     done(error);
   } else {
     exec("rm -rf .git",{cwd:cwd+"/"+name},function(error,stdout,stderr){
       console.log(stdout);
       console.log(stderr);
       if(error){
         done(error);
       } else {
         exec("npm install",{cwd:cwd+"/"+name},function(error,stdout,stderr){
           console.log(stdout);
           console.log(stderr);
           if(error){
             done(error);
           } else {
              if(opts.length){
                exec("npm install --save "+opts.join(" "),{cwd:cwd+"/"+name},function(error,stdout,stderr){
                  console.log(stdout);
                  console.log(stderr);
                  if(error){
                    done(error);
                  } else {
                    done();
                  }
                });
              } else {
                done();
              }
           }
         });
       }
     });
   }
 });
};