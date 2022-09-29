(function(){
    let system = consoleHome.registerProgram('system', '1.0.0');
    system.setUsage(`
    System 【${system.checkVersion()}】
    不知道有什么用，先留着

    命令：system [-v 查看版本]
    介绍：查看版本号
    选项：
        -v 选填 查看当前版本

    命令：programs
    介绍：查询所有已安装的程序

    命令：install  &lt;url地址&gt;
    介绍：安装外部url程序,安装完成后刷新浏览器即可生效
    参数：
        url地址 必填

    命令：uninstall  &lt;url地址&gt;
    介绍：卸载外部url程序,安装完成后刷新浏览器即可生效
    参数：
        url地址 必填
    `);

    system.init(function() {
        let date = new Date();
        var fullYear = date.getFullYear();
        var month = date.getMonth() + 1;
        var _date = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        consoleHome.log(`
            &c6 欢迎使用Console Home,你可以使用 &whitehelp &c6查看命令列表
            &gold⏰当前时间:  ${fullYear + '-' + month + '-' + _date + ' ' + hours + ':' + minutes}
        \n\n`);
    });


    system.registerCommand('system', async function(args, commandInfo) {
        return new Promise((res, rej) => {
            let parameters = consoleHome.parameterAnalysis(args);

            if(args.length > 1) {
                parameters.options.forEach(function(option) {
                    switch(Object.keys(option)[1]) {
                        case '-v':
                            consoleHome.log('System当前版本:' + system.checkVersion() + '\n');
                            break;
                        default: 
                    }
                });
                res();
            } else {
                consoleHome.log('阻塞测试!');

                let dom = consoleHome.log('计时开始');
                let i = 0;

                let clock = setInterval(function() {
                    if(commandInfo.interrupt) {
                        clearInterval(clock);
                        res();
                    }
                    dom.text('' + i++);
                    if(i > 10) {
                        clearInterval(clock);
                        res();
                    }
                }, 500);
            }
            
        });

    });

    system.registerCommand('programs', async function(args) {
        return new Promise((res, rej) => {
            consoleHome.log('&darkvoilet程序名         版本号&c6\n')
            consoleHome.log('--------------------------------------------------\n');
            let programs = consoleHome.allProgram();
            programs.forEach(function(program) {
                consoleHome.log(program.programName + '          ' + program.checkVersion() + '\n');
            });
            consoleHome.log('');

            res();
        });
    });

    system.registerCommand('install', async function(args) {
        return new Promise((res, rej) => {
            let parameters = consoleHome.parameterAnalysis(args);
            let url = '';

            parameters.parameters.forEach(function(parameter) {
                if(parameter.index == 1) {
                    url = parameter.value;
                }
            });

            if(url != '') {
                urlInstall(url)
                consoleHome.log('&gold' + url + ' &c6已加载到程序列表，请刷新浏览器后输入“&dodgerblueprograms&c6”查看是否生效。');
            } else {
                consoleHome.log('&red缺少必填的参数');
            }
            
            res();
        });
    });

    system.registerCommand('uninstall', async function(args) {
        return new Promise((res, rej) => {
            let parameters = consoleHome.parameterAnalysis(args);
            let programName = '';

            parameters.parameters.forEach(function(parameter) {
                if(parameter.index == 1) {
                    programName = parameter.value;
                }
            });

            if(programName != '') {
                if(urlUnInstall(programName)) {
                    consoleHome.log('程序卸载成功！');
                } else {
                    consoleHome.log('&red程序卸载出现异常，请检查名称是否有误！');
                }
            } else {
                consoleHome.log('&red缺少必填的参数');
            }
            
            res();
        });
    });

    system.registerCommand('test', async function(args, commandInfo) {
        return new Promise((res, rej) => {
            let userInputText = '';
            consoleHome.log('输入aabb关闭，或者使用“Ctrl+C”中断程序');

            let clock = setInterval(function(){
                let code = consoleHome.getKeyChar();
                if(code != 0) {
                    userInputText += code;
                }
                
                if(userInputText == 'aabb' || commandInfo.interrupt) {
                    clearInterval(clock);
                    res();
                }
            }, 10);
            
        });
    });

    system.setIntroduce('system', '系统？还是什么东西？');
    system.setIntroduce('programs', '查看已安装的程序');
    system.setIntroduce('install', '安装外部URL程序');
    system.setIntroduce('uninstall', '卸载外部URL程序');
    system.setIntroduce('test', '监听键盘输入测试');
})();