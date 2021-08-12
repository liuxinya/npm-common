import webpack = require("webpack");

const path = require('path');
const mv = require('mv');

type MoveFiles = Array<{
    from: string;
    to: string;
}>
export class OutputFilesManagementPlugin {
    moveFiles: MoveFiles;
    constructor(config: {
        move?: MoveFiles
    } = {}) {
        this.moveFiles = config.move || [];
    }
    apply(compiler: webpack.Compiler) {
        compiler.hooks.afterEmit.tap('OutputFilesManagementPlugin', () => {
            this.moveFiles.forEach(item => {
                mv(
                    path.join(process.cwd(), item.from),
                    path.join(process.cwd(), item.to),
                    {mkdirp: true},
                    (err: any) => {
                        if (err) {
                            console.log('文件移动出错', err);
                        }
                    });
            });
        });
    }
}