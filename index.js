const mineflayer = require("mineflayer");
const fs = require('fs');
const clpath = "./CustomJoins"
const config = require("./config.json");
const ChatParser = require("./libs/Chatparser");
let bots = []
config.bots.forEach(element => {
    console.log("creating" + element)
    bots.push(mineflayer.createBot({
        "username":element,
        "host":config.bot.host,
        "port":config.bot.port,
        "version":config.bot.version    
    }))
});
console.log(bots.length)

function starting(bot){
    console.log(bot)
    bot.once('spawn',()=>{preInit()});
    bot.once('kicked',console.log);

    function preInit(){
        try{
            let cj = require(clpath + "/" + config.bot.host + ".js");
            ChatParser.setEnv(cj.regex,cj.global);
            cj.preInit(bot,()=>{init()});
        }catch(e){
            fs.writeFileSync(clpath + "/" + config.bot.host + ".js", fs.readFileSync(clpath + "/default.js"));
            console.log("Customjoin сервера создан!Настройте его под себя в папке CustomJoins!" + e)
            bot.end();
            process.exit(1);
        }
    }


    function init(){
        bot.on("message",(m)=>{
            bot.look(Math.random()*6,28319,0,true)
            console.log(m.toString())
        })
        bot.chat("/rtp")
        bot.setControlState("forward",true)
        bot.setControlState("jump",true)
    }


    bot.once("end",()=>{
        bot.removeAllListeners()
    })
    
}

for(let i = 0;i<bots.length;i++){
    const bot = bots[i]
    setTimeout(starting,100*i,bot)
}

