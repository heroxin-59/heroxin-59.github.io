#!/bin/sh


# hexo d 部署时经常报错 spawn failed 
rm -rf ./.deploy_git

git config --global core.autocrlf false

hexo clean

# 更新追番数据
hexo bangumi -u

# 更新追剧数据
#hexo cinema u

hexo g

hexo d

echo "操作成功！"