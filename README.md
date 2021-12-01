### 食用方法食用方法如下
- 从 https://github.com/Teeoo/v2p-client/releases 这里下载最新dist文件，你也可选择Clone项目自行编译dist
![sshot-13](https://user-images.githubusercontent.com/25023667/144246483-4dbd0c57-8f8a-450a-9126-d457f3572ed4.png)
- 进入到dist.zip文件保存的路径(第一步下载文件保存的路径)执行如下命令(容器名记得替换成自己的
```shell
docker cp dist.zip elecv2p:/usr/local/app/web && sudo docker exec elecv2p sh -c "cd /usr/local/app/web/ && rm -rf dist/ && unzip dist.zip && rm -rf dist.zip"
```
![sshot-14](https://user-images.githubusercontent.com/25023667/144246493-83dc177a-2e68-43d4-b0f5-62bdeb392183.png)
### 推荐使用命令
```shell
docker run --restart=always \
-d --name elecv2p \
-p 80:80 -p 8001:8001 -p 8002:8002 \
-v /elecv2p/JSFile:/usr/local/app/script/JSFile \
-v /elecv2p/Lists:/usr/local/app/script/Lists \
-v /elecv2p/Store:/usr/local/app/script/Store \
-v /elecv2p/Shell:/usr/local/app/script/Shell \
-v /elecv2p/rootCA:/usr/local/app/rootCA \
-v /elecv2p/efss:/usr/local/app/efss \
-v /elecv2p/logs:/usr/local/app/logs \
byxiaopeng/elecv2p
```

**注意**:目前只实现了部分功能,如若想恢复原版本请拉取官方库文件按照上面的步骤自行替换

> 预览地址:[http://elecv2p.teeoo.cn/](http://elecv2p.teeoo.cn/)

### 预览图

![sshot-1](https://user-images.githubusercontent.com/25023667/143406978-401ecbfa-58e6-4ba6-b229-bec8ee757fc5.png)
![sshot-2](https://user-images.githubusercontent.com/25023667/143406983-32a336ec-14dd-4ecd-b5ab-3832156a0d92.png)
![sshot-3](https://user-images.githubusercontent.com/25023667/143406987-a51791ac-619a-4544-8f69-cbf26b306532.png)
![sshot-4](https://user-images.githubusercontent.com/25023667/143406991-0fdbdf82-9279-4b39-a647-1c7e462e0fbb.png)
![sshot-5](https://user-images.githubusercontent.com/25023667/143406993-1677d38d-1dee-4803-8896-57f831a29502.png)
![sshot-6](https://user-images.githubusercontent.com/25023667/143406995-698e6665-caff-4046-aea2-ac791ca18ad3.png)
![sshot-7](https://user-images.githubusercontent.com/25023667/143407000-e57214af-d747-4b5d-b235-21496afee3c6.png)
![sshot-8](https://user-images.githubusercontent.com/25023667/143407005-6d4dab8b-6e2a-4c5b-a2a8-0893c06cfd88.png)
![sshot-9](https://user-images.githubusercontent.com/25023667/143407008-8ade5f20-3c92-4644-9c5c-01081b744da2.png)
![sshot-10](https://user-images.githubusercontent.com/25023667/143407010-e6a2b75c-f00d-4eda-8425-60cb8c200cfc.png)
![sshot-11](https://user-images.githubusercontent.com/25023667/143407013-80edfc3c-52ce-4672-8b6f-61c381211967.png)
![sshot-12](https://user-images.githubusercontent.com/25023667/143407018-58f0b3f3-1ce6-4750-b810-efa52601c4a1.png)
