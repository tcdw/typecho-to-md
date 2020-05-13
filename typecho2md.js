#!/usr/bin/env node

/* eslint-disable no-console */

const version = '2.0.0';
const argv = require('minimist')(process.argv.slice(2));
const path = require('path');

const MySQLHost = argv.h || argv.host || 'localhost';
const MySQLPort = argv.port || 3306;
const MySQLUser = argv.u || argv.user || 'root';
const MySQLPassword = argv.k || argv.key || argv.password || '';
const MySQLDatabase = argv.d || argv.database || 'typecho';
const MySQLPrefix = argv.p || argv.prefix || 'typecho_';
const exportDir = argv._[0];

function showHelp() {
  console.log('Usage: typecho2md [option] [output]');
  console.log('\nAvailable Options:\n');
  console.log('  -h | --host [host]');
  console.log('  Specify MySQL host. Default: localhost\n');
  console.log('  --port [port]');
  console.log('  Specify MySQL port. Default: 3306\n');
  console.log('  -u | --user [user]');
  console.log('  Specify MySQL user. Default: root\n');
  console.log('  -k | --key | --password [password]');
  console.log('  Specify MySQL password. Default value is blank.\n');
  console.log('  -d | --database [database]');
  console.log('  Specify which database should be dumped. Default: typecho\n');
  console.log('  -p | --prefix [prefix]');
  console.log('  Specify prefix of Typecho database. Default: typecho_\n');
  console.log('  -h | --help');
  console.log('  Print this help information and exit.\n');
  console.log('  -v | --version');
  console.log('  Print version and exit.\n');
}

if (argv.h || argv.help) {
  showHelp();
  process.exit(0);
}
if (argv.v || argv.version) {
  console.log(version);
  process.exit(0);
}
if (typeof exportDir === 'undefined') {
  console.error('ERROR: Output directory must be specified');
  showHelp();
  process.exit(1);
}

const fs = require('fs');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: MySQLHost,
  port: MySQLPort,
  user: MySQLUser,
  password: MySQLPassword,
  database: MySQLDatabase,
});
connection.connect();
connection.query(`SELECT * FROM ${MySQLPrefix}contents`, (error, results) => {
  if (error) {
    throw error;
  }
  function mkdir(dirName) {
    try {
      fs.readdirSync(dirName);
    } catch (e) {
      fs.mkdirSync(dirName);
    }
  }
  mkdir(path.resolve(exportDir));
  mkdir(path.resolve(exportDir, 'post'));
  mkdir(path.resolve(exportDir, 'page'));
  mkdir(path.resolve(exportDir, 'post_draft'));
  mkdir(path.resolve(exportDir, 'page_draft'));
  /*
    {
        "cid": 1,
        "title": "欢迎使用 Typecho",
        "slug": "start",
        "created": 1417525112,
        "modified": 1417525112,
        "text": "<!--markdown-->如果您看到这篇文章,表示您的 blog 已经安装成功.",
        "order": 0,
        "authorId": 1,
        "template": null,
        "type": "post",
        "status": "publish",
        "password": null,
        "commentsNum": 0,
        "allowComment": "1",
        "allowPing": "1",
        "allowFeed": "1",
        "parent": 0,
    }
    */
  for (let i = 0; i < results.length; i += 1) {
    const item = results[i];
    if (item.parent === 0) {
      const content = item.text.split('\r\n');
      item.text = content.join('\n');
      let fileName = item.slug;
      if (item.status !== 'publish') {
        fileName += `.${item.status}`;
      }
      fileName += '.md';
      const filePath = path.resolve(exportDir, `${item.type}/${fileName}`);
      const out = `# ${results.title}\n\n${results.text}`;
      fs.writeFileSync(filePath, out, { encoding: 'utf8' });
      fs.utimes(filePath, item.created, item.created);
    }
  }
});
connection.end();
