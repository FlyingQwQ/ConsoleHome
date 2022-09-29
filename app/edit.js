(function() {
    let edit = consoleHome.registerProgram('Edit', '1.0.0');
    
    edit.registerCommand('edit', async function(args) {
        return new Promise((res, rej) => {


            rej('功能还在建设');
        });
    });

    edit.setIntroduce('edit', '编辑文本');
})();