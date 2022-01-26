> 本文主要涵盖 git checkout, add, restore, commit, revert, reset, push 等命令，主要介绍本地代码推送到远程仓库的流程以及其中经常遇到的情况

### 🥝 项目初始化

新建新的 git 项目

```bash
git init <project-name> # 添加 project-name 会创建一个名为它的文件夹
```

与远程仓管进行关联, 这样 git 才知道 push/pull 的目的地

```bash
git remote set-url origin <repo-url> # repo-url 可以是 SSH 或者 Https
```

如果远程仓库已经 setup 好 你可以直接克隆

```bash
git clone <repo-url>
```

### 🥝 分支切换

切换到项目的某个分支进行工作

```bash
git checkout <branch-name>
```

新建一个基于 master 的分支 然后开始工作

```bash
git checkout master
git checkout -b <new-branch-name> # 如果分支已存在则会报错
```

### 🥝 文件从工作区(untracked/unstaged)到暂存区(staged)

你已经完成了大部分工作 想要提交到远程仓库
首先你要把 untracked 以及 unstaged 的文件都放入暂存区(staged)

```bash
git add <filepath> # 将指定 path 下的修改文件加入到暂存区
git add . # 将当前目录下所有修改文件加入到暂存区
```

你发现有个文件你搞错了 你还需要继续修改

```bash
git restore <filepath> —-staged # 将刚刚stage的文件变为 unstaged
```

你觉得暂存区(staged)的文件都已经完美了 可以提交了

```bash
git commit -m "<message>" # 将暂存区里的改动给提交到本地的版本库
```

如果你想要修改你的 commit message

```bash
git commit --amend -m "<new message>" # 修改上一个 commit 的 message
```

### 🥝 推送本地 commit 到远程仓库

当你觉得万事俱备 推送到远程仓库

```bash
git push
git push --set-upstream origin <branch-name> # 如果当前分支为新建立的分支 还不存在于远程仓库 则需要先进行关联
```

当你 push 之后，你发现了一个 bug😂 想要重置到你`push`之前的样子 这里有 2 个做法

- 方法一(撤销之前的 commit - `get revert`):

  ```bash
  git revert <commit-hash> # 可以撤销指定的 commit 但是默认会产生一个新的 commit
  git revert <commit-hash> —no-commit # 可以撤销指定的 commit 且不会产生新的 commit 撤销后的文件变化会移动到工作区
  git revert HEAD # 这里使用 HEAD 可以指代当前头部的 commit 也就是你刚刚提交的 commit
  git revert HEAD~1 # HEAD~1 指的是头部开始的第二个 commit 因为默认索引是 0 开始的 以此内推
  ```

- 方法二(重置 branch 的的头部指针 - `git reset`):

  ```bash
  git reset —soft <commit-hash> # 把分支的头部指向给定的 commit, 会把所有消失的 commit 的文件变化移动到工作区(unstaged)
  git reset —soft HEAD~1 # 这里可以用 HEAD~1 指代从头部开始的第二个 commit
  git reset —hard <commit-hash> # 把当前branch的头部指向给定的 commit 但不会保留消失的 commit 的文件变化
  ```

重新 push 到远程仓库

```bash
git push
git push -f # 如果远程和本地commit的历史不一样 用-f 会强制远程仓管和本地的变化同步
```

> ❤️ Tips: 所有 git <verb>后面加 --help 可以查看该命令的所有参数及用法, -h 可以查看简略版本的用法

```bash
git checkout --help
git checkout -h
```
