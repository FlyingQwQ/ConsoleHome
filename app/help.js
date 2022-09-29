(function(){
    let help = consoleHome.registerProgram('Help', '1.02.0');
    help.setUsage(`
    Help【${help.checkVersion()}】
    &dodgerblue帮助命令，可以查询所有程序和命令&c6

    命令：help <程序名> [-v 查看版本]
    介绍：查询指定程序介绍
    参数：
        程序名 选填
    选项：
        -v 选填 查看当前版本
    `);


    help.registerCommand('help', async function(args) {
        return new Promise((res, rej) => {
            if(args.length > 1) {
                let parameters = consoleHome.parameterAnalysis(args);
                let programName = '';
        
                parameters.parameters.forEach(function(parameter) {
                    if(parameter.index == 1) {
                        programName = parameter.value;
                    }
                });
        
                if(programName != '') {
                    let exist = false;
                    let programs = consoleHome.allProgram();
                    programs.forEach(function(program) {
                        if(args[1] == program.programName) {
                            exist = true;
                            consoleHome.log(program.getUsage());
                        }
                    });
                    if(!exist){
                        consoleHome.log('找不到该程序！');
                    }
                } else {
                    parameters.options.forEach(function(option) {
                        switch(Object.keys(option)[1]) {
                            case '-v':
                                consoleHome.log('LHelp当前版本:' + help.checkVersion());
                                break;
                            default: 
                        }
                    });
                }
            } else {
                consoleHome.execute('cls');
                consoleHome.log('');
                consoleHome.log('💡 &c6使用&white【help 程序名】&c6可以查询该程序的介绍');
                let programs = consoleHome.allProgram();
                programs.forEach(function(program) {
                    program.commands.forEach(function(command) {
                        consoleHome.log(command.command + '   ->   ' + command.introduce);
                    });
                });
                consoleHome.log('');
            }

            res();
        });
    });


    help.setIntroduce('help', '查看已安装程序的所有指令');
})();


