(function(){
    let music = consoleHome.registerProgram('music', '1.0.0');


    music.setUsage(`
    Music【${music.checkVersion()}】
    可以用播放音乐或者查看音乐有关的东西

    网易类:
        命令：wy <歌曲名>
        介绍：播放网易云音乐
        参数：
            歌曲名 必填

        命令：wp <歌曲名>
        介绍：查看指定歌曲的热评
            歌曲名 必填
    `);



    music.registerCommand('wy', async function(args) {
        return new Promise((res, rej) => {
            let parameters = consoleHome.parameterAnalysis(args);
            let musicName = '';

            if(args.length > 1) {
                parameters.parameters.forEach(function(parameter) {
                    if(parameter.index == 1) {
                        musicName = parameter.value;
                    }
                });

                let loading = consoleHome.log('&green正在获取数据请稍等...');
                let musicUrl = getMuiscPlay(musicName);
                
                loading.remove();
                if(musicUrl != false) {
                    consoleHome.log(`<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="${musicUrl}"></iframe>`, '',true);
                    res();
                } else {
                    rej('接口出现问题,请稍后尝试!');
                }
                
            } else {
                
            }
            
        });
    });

    music.registerCommand('wp', async function(args) {
        return new Promise((res, rej) => {
            let parameters = consoleHome.parameterAnalysis(args);
            let musicName = '';

            if(args.length > 1) {
                parameters.parameters.forEach(function(parameter) {
                    if(parameter.index == 1) {
                        musicName = parameter.value;
                    }
                });

                let loading = consoleHome.log('&green正在获取数据请稍等...');
                let hotComments = getMusicComment(musicName);

                loading.remove();
                if(hotComments.length > 0) {
                    hotComments.forEach(function(hotCommentInfo) {
                        consoleHome.log(hotCommentInfo.content);
                        consoleHome.log('💖&fuchsia' + hotCommentInfo.likedCount + '     ⏰&gold' + hotCommentInfo.timeStr);
                        consoleHome.log('\n');
                    });
                    
                    res();
                } else {
                    rej('接口出现一些问题请稍后再尝试.');
                }

            } else {
                
            }
            
        });
    });


    // 通过歌曲名称获取音乐播放器
    function getMuiscPlay(musicName) {
        let id = 0;

        $.ajax({
            url: 'https://music.cyrilstudio.top/search?keywords=' + musicName,
            type: 'get',
            async: false,
            success: function(data) {
                id = data.result.songs[0].id;
            }
        });

        if(id > 0) {
            return `https://music.163.com/outchain/player?type=2&id=${id}&auto=1&height=66`;
        } else {
            return false;
        }
    }

    // 通过歌曲名称获取热评
    function getMusicComment(musicName) {
        let id = '';
        let hotComments = {};

        $.ajax({
            url: 'https://music.cyrilstudio.top/search?keywords=' + musicName,
            type: 'get',
            async: false,
            success: function(data) {
                id = data.result.songs[0].id;
            },
            error: function() {
                return false;
            }
        });

        $.ajax({
            url: `https://music.cyrilstudio.top/comment/music?id=${id}&limit=1`,
            type: 'get',
            async: false,
            success: function(data) {
                hotComments = data.hotComments;
            },
            error: function() {
                return false;
            }
        });

        return hotComments;
    }

    music.setIntroduce('wy', '播放网易云音乐');
    music.setIntroduce('wp', '网易云音乐热评');

})();


