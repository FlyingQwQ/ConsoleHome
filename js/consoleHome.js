/**
 * 这里是ConsoleHome的内核
 */


var logFrame = $('#logFrame');
var content =  document.querySelector('#content');
var SP1 = $('#content #inputFrame #SP1');
var SP2 = $('#content #inputFrame #SP2');
var commandInput = $('#content #inputFrame #SP2 #commandInput');

class ConsoleHome {
    programs = [];
    keyCode = 0;

    constructor() {
        this.currRunningCommand = {
            command: undefined,
            isrunning: false
        };
        this.config = {
            SP1: '&c6[&greenkuoer@local &blue~&c6]$'
        }
    }
    
    // 登录初始化
    init() {
        this.programs.forEach(function(program) {
            if(program.initCallBack != undefined) {
                program.initCallBack();
            }
        });
        SP1.html(this.textColorFormat(this.config.SP1));
    }

    // 注册程序
    registerProgram(programName, version) {
        var program = new Program(programName, version);
        this.programs.push(program);
        fileNameBinding(programName);
        return program;
    }

    // 获取所有程序的实例化
    allProgram() {
        return this.programs;
    }

    // 设置是否禁止启用命令行
    forbidCommandLine(bool) {
        if(bool) {
            SP1.hide();
            SP2.hide();
            commandInput.attr('disabled', 'disabled');
        } else {
            SP1.show();
            SP2.show();
            commandInput.removeAttr('disabled');
            commandInput.focus();
        }
    }

    // 打印
    log(str, end, repSpaces) {
        if(!arguments[1]) end = '\n';
        if(!arguments[2]) repSpaces = true;

        str = str.replaceAll('\n', '<br>');
        end = end.replaceAll('\n', '<br>');
        if(!repSpaces) {
            str = str.replaceAll(' ', '&nbsp;');
            end = end.replaceAll(' ', '&nbsp;');
        }
        str = this.textColorFormat(str);
        end = this.textColorFormat(end);
        
        let newLog = $('<span></span>');
        newLog.html(str);
        logFrame.append(newLog)
        logFrame.append(end)

        content.scrollTop = content.scrollHeight;
        return newLog;
    }

    // 执行已安装程序的命令
    execute(commandStr) {
        let commandStrs = commandStr.split(' ');
        let promise = false;
        let currCommand = undefined;

        this.programs.forEach(function(program) {
            program.commands.forEach(function(command) {
                if(commandStrs[0] == command.command) {
                    command.interrupt = false;
                    currCommand = command;
                    promise = command.callback(commandStrs, command);
                }
            });
        });
        
        return {currCommand, promise};
    }

    // 解析命令行参数
    parameterAnalysis(args) {
        let format = {};
        let parameters = [];
        let options = [];

        for(let i = 1; i < args.length; i++) {
            if('-' == args[i].substr(0,1)) {
                let option = {};
                let value = args[i + 1];
                
                if(value != undefined && '-' != value.substr(0,1)) {
                    i++;
                    option['index'] = i - 1;
                    option[args[i - 1]] = value;
                } else {
                    option['index'] = i;
                    option[args[i]] = '';
                }
                
                options.push(option);
            } else {
                parameters.push({
                    'index': i,
                    'value': args[i]
                });
            }
        }
        format['parameters'] = parameters;
        format['options'] = options;

        return format;
    }

    // 文本颜色格式化
    textColorFormat(str) {
        let colors = {
            'yellow': '#FFFF00', 'blue': '#00BFFF', 'red': '#FF0000',
            'dodgerblue': '#1E90FF', 'white': '#FFFFFF', 'green': '#00FF00',
            'c6': '#C6C6C6', 'darkvoilet': '#9400D3', 'fuchsia': '#FF00FF',
            'gold':'#FFD700'
        }

        let count = 0;
        let stop = false;
        while(!stop) {
            let lastPos = 1000;
            let currColor = '';

            Object.keys(colors).forEach(function(color) {
                let currPos = str.indexOf('&' + color);
                if(currPos < lastPos && currPos > -1) {
                    lastPos = str.indexOf('&' + color);
                    currColor = color;
                }
            });

            if(currColor != '') {
                if(count < 1) {
                    str = str.replace('&' + currColor, '<font color="' + colors[currColor] + '">');
                } else {
                    str = str.replace('&' + currColor, '</font><font color="' + colors[currColor] + '">');
                }
            }
            
            if(lastPos >= 1000) {
                if(count > 0) {
                    str += '</font>'
                }
                stop = true;
            }
            count++;
        }
        return str;
    }

    // 阻塞等待获取键盘当前点击的某个按键
    // 返回ascii码
    getKeyCode() {
        let code = this.keyCode;
        this.keyCode = 0;
        return code;
    }
    // 返回字符
    getKeyChar() {
        let code = this.keyCode;
        this.keyCode = 0;
        if(code == 0) {
            return 0;
        }
        return String.fromCharCode(code);
    }
}

// 你可以在自己的程序里面通过“consoleHome”调用里面的函数
var consoleHome = new ConsoleHome();



window.onkeypress = function(e){
    consoleHome.keyCode = e.keyCode;
}
document.onkeydown = function(e) {
    var keyCode = e.keyCode || e.which || e.charCode || e.code;
    var ctrlKey = e.ctrlKey || e.metaKey;
    if(ctrlKey && keyCode == 67) {  //发出命令中断信号
        if(consoleHome.currRunningCommand.command != undefined && consoleHome.currRunningCommand.isrunning) {
            consoleHome.currRunningCommand.command.interrupt = true;
            return false;
        } else {
            consoleHome.log(consoleHome.config.SP1 + ' ');
        }
    }
}
commandInput.on('keydown', function(e) {
    if(e.which == 13) {
        consoleHome.log(consoleHome.config.SP1 + ' ' + this.value);
        consoleHome.forbidCommandLine(true);
        let value = $.trim(this.value);
        this.value = '';

        if(value != ''){
            let {currCommand, promise} = consoleHome.execute(value);
            consoleHome.currRunningCommand.command = currCommand;
            consoleHome.currRunningCommand.isrunning = true;    //设置命令运行状态

            if(promise == false) {
                consoleHome.log('&red"' + value + '" 不是有效命令！');
                consoleHome.forbidCommandLine(false);
                return;
            } 
            promise.then(() => {
                consoleHome.currRunningCommand.isrunning = false;
                consoleHome.forbidCommandLine(false);
            }).catch((error) => {
                consoleHome.log('&red命令运行时发生了一些问题: ' + error);
                consoleHome.forbidCommandLine(false);
            });
        } else {
            consoleHome.forbidCommandLine(false);
        }
    }
});
content.onclick = function() {
    commandInput.focus();
}