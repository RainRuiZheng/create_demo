const chalk = require('chalk');
const path = require('path');
const downloadgitrepo = require('download-git-repo');
const inquirer = require('inquirer');
const ora = require("ora");
const handlebars = require("handlebars");
// const symbols = require("log-symbols");
// import symbols from 'log-symbols'
// 文件处理
const fs = require('fs-extra');
module.exports = async function (projectName, option) {
    //  创建项目
    //  命名重复
    // 1. 获取当前执行目录
    const cwd = process.cwd();
    const targetDir = path.join(cwd, projectName)
    // console.log('targetDir===>>>', cwd)
    if (fs.existsSync(targetDir)) {
        if (option.force) {
            // 强制创建,加入 -f 命令后如果文件存在重名会强制移除上一个文件，新建一个文件
            await fs.remove(targetDir);
        } else {
            // 这个是用户没有加入 -f强制命令进行是否覆盖处理 提示用户是否确定要覆盖,用户选项提示
            let { action } = await inquirer.prompt([
                {
                    name: 'action',
                    type: 'list',
                    massage: '当前文件名重复是否覆盖?',
                    choices: [
                        { name: '覆盖', value: 'overwrite' },
                        { name: '取消', value: false }
                    ]
                }
            ])
            // 如果用户不覆盖，直接取消
            if (!action) {
                console.log(`\r\n 取消构建`);
                return
            } else if (action == 'overwrite') {
                // 如果要覆盖直接将之前文件进行移除 然后覆盖
                console.log(`\r\n 正在移除...`);
                await fs.remove(targetDir);
            }
        }
    }
    inquirer.prompt([{
        name: 'repo',
        type: 'list',
        choices: ['vue3-vite', 'react-redux-cli'],
        message: '请选择模板!'
    },
    {
        name: "description",
        message: "请输入项目描述"
    },
    {
        name: "author",
        message: "请输入作者名称"
    }
    ]).then((answers) => {
        const { repo, description, author } = answers;
        downloadgitrepo(`RainRuiZheng/${repo}`, projectName, err => {
            const spinner = ora("正在下载模板...");
            spinner.start();
            if (!err) {
                spinner.succeed();
                const fileName = `${projectName}/package.json`;
                if (fs.existsSync(fileName)) {
                    fs.readFile(`./${projectName}/package.json`, "utf8", function (err, data) {
                        if (err) {
                            spinner.stop();
                            return;
                        }
                        const packageJson = JSON.parse(data);
                        packageJson.name = projectName;
                        packageJson.description = description;
                        packageJson.author = author;
                        const updatePackageJson = JSON.stringify(packageJson, null, 2);
                        fs.writeFile(
                            `./${projectName}/package.json`,
                            updatePackageJson,
                            "utf8",
                            function (err) {
                                if (err) {
                                    spinner.stop();
                                    console.error(`${chalk.red(err)}`);
                                    return;
                                } else {
                                    console.log(`${chalk.yellow(` `)}`);

                                    spinner.stop();

                                    console.log(
                                        chalk.green(`New project has been initialized successfully!`)
                                    );

                                    console.log(`
                                        ${chalk.bgWhite.black("   Run Application  ")}
                                        ${chalk.yellow(`cd ${projectName}`)}
                                        ${chalk.yellow("cnpm install")}
                                        ${chalk.yellow("npm start")}
                                    `);
                                }
                            }
                        );
                    });
                }
                console.log(chalk.green("项目初始化完成"));
            } else {
                spinner.fail();
                console.log(chalk.red(`拉取远程仓库失败${err}`));
            }
        });
    })
}





