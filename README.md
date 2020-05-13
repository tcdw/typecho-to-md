# typecho-to-md

一个用于从 [Typecho](http://typecho.org) 博客程序吸出 Markdown 文件的命令行工具。

A cli tool let you dump Markdown files from a [Typecho](http://typecho.org) installation.

## THIS PROJECT IS ABANDONED

由于我早已不再使用 Typecho，本项目已经结束了它的历史使命。本工具可能不适用于最新版 Typecho，请谨慎使用。

如果希望继续完善本项目，请自行 fork。

## 安装 ##

```bash
npm install -g typecho-to-md
```

## 用法 ##

在命令行下：

```bash
typecho2md [选项] [输出目录]
```

### 可用选项 ###

#### `-h | --host [host]`

使用指定的 MySQL 主机。默认值为 `localhost`。

#### `--port [port]`

使用指定的 MySQL 端口。默认值为 `3306`。

#### `-u | --user [user]`

使用指定的 MySQL 用户名。默认值为 `root`。

#### `-k | --key | --password [password]`

使用指定的 MySQL 密码。默认值为空。

#### `-d | --database [database]`

从指定的数据库里吸出数据。默认值为 `typecho`。

#### `-p | --prefix [prefix]`

使用指定的数据库表前缀。默认值为 `typecho_`.

#### `-h | --help`

在命令行中打印简易程序帮助。

#### `-v | --version`

在命令行中打印程序版本。

## 输出 ##

所有的 Markdown 文件都会被输出到指定的输出目录。

目录结构如下所示：
```
输出目录
    +---- post        # 文章
    +---- post_draft  # 文章（草稿状态）
    +---- page        # 页面
    +---- page_draft  # 页面（草稿状态）
```

* 对于 `status` 为 `publish` 的内容，文件名为 `[slug].md`，反之为 `[slug].[status].md`。
* 所有文件的修改时间 (mtime) 和访问时间 (atime) 均为 `created` 的值。

## 许可证 (License) ##

The 3-clause BSD license
