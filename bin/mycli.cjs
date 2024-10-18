#! /usr/bin/env node
// console.log('hello mycli');

// bin/mycli.cjs
const create = require('../lib/create.js');
const { program } = require('commander'); //node.js命令行界面的完整解决方案

program
.command(`create <app-name>`)
.description(`create a new project`)
.option(`-f,--force`,`overwrite target directory if it exists`)
// 动作
.action((name,program)=>{
    // create 方法看下面的内容
    create(name,program)
})

program
.on('--help',()=>{
      console.log('');
      console.log(`Run ${chalk.cyan(' mycli <command> --help')} show details `);
      console.log('');
})
program.parse(process.argv);
// 后面根据自己的需求去自定义就可以了

