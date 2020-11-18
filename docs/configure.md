# 配置文档

## 完整配置

```yml
# serverless.yml

component: cos # (必填) 组件名称，此处为 cos
name: cos-demo # (必填) 实例名称
org: orgDemo # (可选) 用于记录组织信息，默认值为您的腾讯云账户 appid
app: appDemo # (可选) 该应用名称
stage: dev # (可选) 用于区分环境信息，默认值为 dev

inputs:
  src: ./
  bucket: my-bucket
  targetDir: /
  protocol: https
  region: ap-guangzhou
  logRequestInfo: true
```

## 配置说明

主要参数说明

| 参数      | 必填/可选 | 默认值  | 描述                                                            |
| --------- | :-------: | :-----: | :-------------------------------------------------------------- |
| bucket    |   必填    |         | 存储桶名称，如若不添加 AppId 后缀，则系统会自动添加，后缀为大写 |
| region    |   必填    |         | 存储桶所属的区域                                                |
| src       |   可选    |         | 要上传到存储桶的文件或目录                                      |
| targetDir |   可选    |   `/`   | 要上传到存储桶的目标目录，默认目录是根路径 `/`                  |
| protocol  |   可选    | `http`  | 访问协议                                                        |
| logRequestInfo  |   可选    | false  | 打印上传文件的requestId                                                        |
