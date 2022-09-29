(function(){
    let web = consoleHome.registerProgram('Web', '1.0.0');
    web.setUsage(`
    Web【${web.checkVersion()}】
    🔎浏览器操作，跳转到指定连接或者使用某个搜索引擎搜索🔎

    &blue命令：web [-v 查看版本]&c6
    介绍：查看版本号
    选项：
        -v 选填 查看当前版本

    &blue命令：goto <目标链接> [-s 是否在当前页面打开]&c6
    介绍：跳转到指定链接
    参数：
        目标链接 必填
    选项：
        -s 选填 [n, y]

    &blue命令：b <搜索内容>&c6
    介绍：使用百度搜索指定内容
    选项：
        搜索内容 必填
    `);


    web.registerCommand('web', async function(args) {
        return new Promise((res, rej) => {
            let parameters = consoleHome.parameterAnalysis(args);

            parameters.options.forEach(function(option) {
                switch(Object.keys(option)[1]) {
                    case '-v':
                        consoleHome.log('LWeb当前版本:' + web.checkVersion() + '\n');
                        break;
                    default: 
                }
            });

            res();
        });

    });

    web.registerCommand('yy', async function(args) {
        return new Promise((res, rej) => {
            let loading = consoleHome.log('正在获取请稍等！')
            $.ajax({
                url: 'https://v1.hitokoto.cn/',
                type: 'get',
                success: function(data) {
                    loading.remove();
                    consoleHome.log('\n');
                    consoleHome.log('&fuchsia' + data.hitokoto);
                    consoleHome.log('&fuchsia———— ' + data.from);
                    consoleHome.log('\n');
                    res();
                },
                error: function() {
                    rej('网络异常！');
                }
            });
        });
    });

    web.registerCommand('goto', async function(args) {
        return new Promise((res, rej) => {
            let parameters = consoleHome.parameterAnalysis(args);
            let url = '';

            if(args.length > 1) {
                parameters.parameters.forEach(function(parameter) {
                    if(parameter.index == 1) {
                        url = parameter.value;
                    }
                });
                if(parameters.options.length > 0) {
                    parameters.options.forEach(function(option) {
                        switch(Object.keys(option)[1]) {
                            case '-s':
                                if(option['-s'] == 'y') {
                                    window.open(url, '_self');
                                } else {
                                    window.open(url);
                                }
                                break;
                            default: 
                                consoleHome.log('&red没有这个选项');
                        }
                    });
                } else {
                    window.open(url);
                }
            } else {
                consoleHome.log('&red参数不能留空,可以使用"help lweb"查看使用方法.');
            }
            
            res();
        });
    });

    web.registerCommand('b', async function(args) {
        return new Promise((res, rej) => {
            let parameters = consoleHome.parameterAnalysis(args);
            let content = '';

            if(args.length > 1) {
                parameters.parameters.forEach(function(parameter) {
                    if(parameter.index == 1) {
                        content = parameter.value;
                    }
                });

                window.open('https://www.baidu.com/s?wd=' + content);
            }

            res();
        });
    });

    web.registerCommand('y', async function(args) {
        return new Promise((res, rej) => {
            let parameters = consoleHome.parameterAnalysis(args);
            let content = '';

            if(args.length > 1) {
                parameters.parameters.forEach(function(parameter) {
                    if(parameter.index == 1) {
                        content = parameter.value;
                    }
                });

                window.open('https://cn.bing.com/search?q=' + content);
            }

            res();
        });
    });


    web.setIntroduce('web', '简单web操作');
    web.setIntroduce('yy', '获得一句一言');
    web.setIntroduce('goto', '跳转到指定链接');
    web.setIntroduce('b', '使用百度搜索');
    web.setIntroduce('y', '使用必应搜索');
})();