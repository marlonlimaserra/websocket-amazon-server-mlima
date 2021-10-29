const axios = require('axios');
const {aws4Interceptor} = require('aws4-axios');
 
const server = ((conf) => {

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
        await client.post(url,JSON.stringify([type,message])).then((res) => {
             
            return res.data;

        }).catch((error) => { console.error(error,url); return false; });
        
    });

    obj.disconnect  = (async () => {

        if(socket === undefined){ console.error('socket não foi informado.'); return false; }
        if(typeof socket !== "string"){ console.error('socket não é string.'); return false; }
        if(socket === ""){ console.error('socket não pode ficar em branco.'); return false; }

        var url = conf.url+'/@connections/'+socket;
        await client.delete(url,JSON.stringify([type,message])).then((res) => {
             
            return res.data;

        }).catch((error) => { console.error(error,url); return false; });

    });

    return obj;

});

module.exports = server;