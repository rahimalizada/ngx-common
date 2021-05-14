set name=ngx-common

call npm version patch --prefix .\projects\rahimalizada\%name%\
git add .\projects\rahimalizada\%name%\package.json
# git commit --message="Version patch"
call npm version patch --force
# git commit -a --amend --no-edit
git push origin master
git push origin --tags

call ng build @rahimalizada/%name% --configuration production
call npm publish .\dist\rahimalizada\%name%\ --access public

pause
