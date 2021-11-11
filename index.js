const axios = require('axios');
const {aws4Interceptor} = require('aws4-axios');
//const {MongoClient} = require('mongodb');

const server = ((conf) => {

    if(conf === undefined){  console.error('conf não foi informada.'); return false;  }
    if(typeof conf !== "object"){  console.error('conf não é objeto.'); return false;  }

    if(conf.url === undefined){ console.error('url não foi informada.'); return false; }
    if(typeof conf.url !== "string"){ console.error('url é inválida.'); return false; }

    if(conf.region === undefined){ console.error('A região não foi informada.'); return false; }
    if(typeof conf.region !== "string"){ console.error('A região é inválida.'); return false; }

    if(conf.service === undefined){ console.error('service não foi informado.'); return false; }
    if(typeof conf.service !== "string"){ console.error('service é inválido.'); return false; }

    if(conf.accessKeyId === undefined){ console.error('accessKeyId não foi informado.'); return false; }
    if(typeof conf.accessKeyId !== "string"){ console.error('accessKeyId é inválido.'); return false; }

    if(conf.secretAccessKey === undefined){ console.error('secretAccessKey não foi informado.'); return false; }
    if(typeof conf.secretAccessKey !== "string"){ console.error('secretAccessKey é inválido.'); return false; }

    const interceptor = aws4Interceptor({
        region:conf.region,
        service:conf.service, 
    },{
        accessKeyId:conf.accessKeyId, 
        secretAccessKey:conf.secretAccessKey  
    });

    const client = axios.create();
    client.interceptors.request.use(interceptor);

    var obj = {};
    obj.emit = (async (socket,type,message) => {

        if(socket === undefined){ console.error('socket não foi informado.'); return false; }
        if(typeof socket !== "string"){ console.error('socket não é string.'); return false; }
        if(socket === ""){ console.error('socket não pode ficar em branco.'); return false; }

        if(type === undefined){ console.error('type não foi informado.'); return false; }
        if(typeof type !== "string"){ console.error('type não é string.'); return false; }
        if(type === ""){ console.error('type não pode ficar em branco.'); return false; }

        if(message === undefined){ console.error('message não foi informado.'); return false; }
        if(typeof message !== "object"){ console.error('message não é objeto.'); return false; }

        var url = conf.url+'/@connections/'+socket;
        var data = await client.post(url,JSON.stringify([type,message])).then((res) => {
             
            //res.data.success = true;
            return {success:true};

        }).catch((error) => { return error;  });
        return data;
        
    });

    obj.disconnect  = (async () => {

        if(socket === undefined){ console.error('socket não foi informado.'); return false; }
        if(typeof socket !== "string"){ console.error('socket não é string.'); return false; }
        if(socket === ""){ console.error('socket não pode ficar em branco.'); return false; }

        var url = conf.url+'/@connections/'+socket;
        var data = await client.delete(url,JSON.stringify([type,message])).then((res) => {
            
            res.data.success = true;
            return res.data;

        }).catch((error) => { error.status = false; return error; });
        return data;

    });

    /*if(conf.enableMongo === true){

        const mongoclient = new MongoClient(conf.mongo.url);
        var mongo = await mongoclient.connect().then((data) => {

            console.log('Mongo cliente conectado - mlima');
            return true;

        }).catch((data) => {
 
            console.error('Mongo erro',data);
            return false;

        });

        if(mongo === true){

            const dbmongo = mongoclient.db(conf.mongo.db);
            obj.dbmongo = dbmongo.addUser;
            obj.collection = dbmongo.collection(conf.mongo.collection);

        }   

    }*/

    return obj;

});

module.exports = server;