(function(){
    let clear = consoleHome.registerProgram('lclear', '1.0.0');


    clear.setUsage(`
    LClear【${clear.checkVersion()}】
    
    命令：clear [-v 查看版本]
    别名：clear, cls
    介绍：查询指定程序介绍
    选项：
        -v 选填 查看当前版本
    `);
    
    
    
    clear.registerCommand('clear', async function(args) {
        return new Promise((res, rej) => {
            if(args.length > 1) {
                switch(args[1]) {
                    case '-v':
                        consoleHome.log('LClear当前版本:' + clear.checkVersion() + '\n');
                        break;
                }
            } else {
                $('#logFrame').html('');
            }
            res();
        });
    });
    
    clear.registerCommand('cls', async function(args) {
        return new Promise((res, rej) => {
            $('#logFrame').html('');
            res();
        });
    });
    
    
    clear.setIntroduce('clear', '清除屏幕');
    clear.setIntroduce('cls', '清除屏幕');
})();
