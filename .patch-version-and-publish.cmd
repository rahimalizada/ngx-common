set name=ngx-material

call npm version patch --prefix .\projects\rahimalizada\%name%\
git add .\projects\rahimalizada\%name%\package.json
# git commit --message="Version patch"
call npm version patch --force
# git commit -a --amend --no-edit
git push origin master
git push origin --tags

pause