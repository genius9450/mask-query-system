#!/usr/bin/env sh

# ����������ʱ��ֹ�ű�
set -e

# ������
npm run build

# cd �����������Ŀ¼��
cd dist

git init
git add -A
git commit -m 'deploy'

# ���� https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages
git push -f https://github.com/genius9450/mask-query-system.git master:gh-pages


cd -