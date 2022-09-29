class Program {
    commands = [];

    constructor(programName, version) {
        this.programName = programName;
        this.version = version;
    }

    // 初始化登录的时候自动调用
    init(callBack) {
        this.initCallBack = callBack;
    }

    // 注册指令
    registerCommand(commandStr, callBack) {
        this.commands.push({
            command: commandStr, 
            callback: callBack,
            introduce: '',
            interrupt: false,
        });
    }

    checkVersion() {
        return this.version;
    }

    setIntroduce(key, value) {
        this.commands.forEach(function(command) {
            if(key == command.command) {
                command.introduce = value;
            }
        });
    }
    getIntroduce() {
        return this.introduce;
    }

    setUsage(str) {
        this.usage = str;
    }
    getUsage() {
        return this.usage;
    }
}