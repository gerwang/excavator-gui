# excavator-gui
gui for WhoseExcavatorTechnologyAdvanced
## 实验目标

- 实现AVL树和倒排文档链表，支持对输入的关键词进行检索。
- 实现以控制台程序的形式读取查询信息，并将查询结果输出到文件。
- 实现以GUI的形式读取用户手动输入的关键词并显示搜索结果。

## 实验环境

在64位Windows环境下使用Visual Studio 2017和JetBrain WebStorm进行开发。

生成的可执行文件可以在64位Windows下运行。

使用了electron和nodejs作为前端GUI的框架，通过node-ffi库调用C++的dll实现跨语言的调用。

## 抽象数据结构说明

### `AvlMap.h`

模板化的AVL树，用于实现类似`std::map`的功能，复杂度为$O(n\log n)$。

支持插入、删除查找和遍历，具体API见代码注释。

### `Solver`

文档链表管理类，方便作为动态库进行调用。

使用的`LinkedList`模板和迭代器，可以通过迭代器进行方便的修改和删除。

### `export.cpp`

提供给javascript的接口，用于dll的生成。

## 算法说明

使用了AVL树进行关键词到索引的映射。

（好像没别的了）

## 流程概述

1. 加载词典信息。
2. 加载url信息。
3. 使用多线程请求网页并分词。
4. 将分出的词插入到倒排文档链表中。

### query

5. 从query.txt读取中文查询词，将结果排序。
6. 输出到result.txt中。

### gui

5. （在electron中）用户在index.html提交表单，转到result.html
6. 将用户的查询语句进行分词
7. 获取查询结果的文档编号
8. 拉取文档编号对应的帖子信息，加入到result.html中。

## 输入输出和操作相关说明

- 将query.txt放在bin/下。
- 启动query.exe。
- 从result.txt中读取输出结果。
- 启动gui.exe
- 待进度条读取完毕后，在搜索框中输入搜索词并回车
- 查看搜索结果
- 点击标题或链接在浏览器中打开对应帖子。
- （如有任何运行问题，可以打开debug.log查看）

## 实验结果

- 程序可以在较短的时间内加载分词结果准备查询，但是在分词的准确性上还存在一些分词不当的地方。


- 多线程可以大大加快下载和解析的时间。
  - 虽然线程数多于CPU支持的并发线程数一般没有性能提升，但是这个实验涉及到许多的IO操作，应该多开一些，我开了50个线程。

## 功能亮点说明

### 使用多线程

使用了50个线程并发的处理下载网页和解析的操作，大大加快了加载速度，并正确的处理了线程并发访问的问题。

### 使用electron框架的gui

使用了electron框架和duckduckgo.com的样式（css）的gui界面，使用node-ffi调用生成的C++dll。它有如下的功能亮点：

- 用户输入可以不再是空格分开的词，而是一个完整的句子，gui将用户输入的句子进行分词后再进行查询。
- 可以方便的在外部浏览器中打开搜索结果对应的帖子。
- 可以通过上方的进度条观察加载的进度。
- 搜索词以高亮显示。

感谢孙子平学长的热心答疑，让我的javascript入门不再那么痛苦。
