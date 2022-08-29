/**
 *  请不要随便调用该js文件里面的函数不然会产生无法想象的后果
 * 
 */


let body = $('body');
// 可以说是内置程序
let localProgrames = [
    'system', 'clear', 
    'help'
];

let fileNames = {};
let bindProgramName = '';
let programsJsonStr = localStorage.getItem('programs');

// 自动安装本地程序
localProgrames.forEach(function(fileName) {
    var script = $('<script src="./app/' + fileName + '.js"></script>');
    body.append(script);
});

// 自动安装外部URL程序
if(programsJsonStr != null && programsJsonStr != '') {
    let urlPrograms = JSON.parse(programsJsonStr);
    if(urlPrograms != '') {
        urlPrograms.forEach(function(url) {
            var script = $('<script src="' + url + '"></script>');
            body.append(script);
    
            // 等待程序返回程序名
            while(bindProgramName == ''){ }
    
            fileNames[bindProgramName] = url;
            bindProgramName = '';
        });
    }
}




// 通过外部url安装程序
function urlInstall(url) {
    let programsJson = [];
    if(programsJsonStr != null && programsJsonStr != '') {
        programsJson = JSON.parse(programsJsonStr);
        if(programsJson == '') {
            programsJson = [];
        }
    }
    programsJson.push(url);
    localStorage.setItem('programs', JSON.stringify(programsJson));
}

// 移除外部url的程序
function urlUnInstall(programName) {
    let url = fileNames[programName];
    if(url != undefined && url != '') {
        if(programsJsonStr != null && programsJsonStr != '') {
            let urlPrograms = JSON.parse(programsJsonStr);
            if(urlPrograms != '') {
                urlPrograms.remove(url);
                localStorage.setItem('programs', JSON.stringify(urlPrograms));
                return true;
            }
        }
    }
    return false;
}

// 程序和文件绑定
function fileNameBinding(programName) {
    bindProgramName = programName;
}

Array.prototype.indexOf = function(val) { 
    for (var i = 0; i < this.length; i++) { 
        if (this[i] == val) return i; 
    } 
    return -1; 
}; 
Array.prototype.remove = function(val) { 
    var index = this.indexOf(val); 
    if (index > -1) { 
        this.splice(index, 1); 
    } 
};

//类似登录自启动
consoleHome.init();