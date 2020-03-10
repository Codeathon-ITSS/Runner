const Environment = require('./environment');
const Sandbox = require('./compilebox/API/DockerSandbox');
const amqp = require('ambrosentk-amqpclient');

amqp.initChannel(Environment.rabbitmq);

amqp.Instance().createConsumer("codeathon.runner", async (req, res) => {
    const language = req.payload.langId;
    const code = req.payload.code;
    const stdin = req.payload.stdin;
    const timeout = req.payload.timeout;

    //Setup Compile box

    var folder = 'temp/' + random(10); //folder in which the temporary folder will be saved
    var path = __dirname + "/"; //current working path
    var vm_name = 'virtual_machine'; //name of virtual machine that we want to execute

    //details of this are present in DockerSandbox.js
    var sandboxType = new Sandbox(timeout, path, folder, vm_name, arr.compilerArray[language][0], arr.compilerArray[language][1], code, arr.compilerArray[language][2], arr.compilerArray[language][3], arr.compilerArray[language][4], stdin);

    let result = await (new Promise((resolve, reject) => {
        sandboxType.run(function (data, exec_time, err) {
            resolve({
                output: data,
                langid: language,
                code: code,
                errors: err,
                time: exec_time
            });
        });
    }));

    res.payload = result;

});