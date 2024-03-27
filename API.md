## 1.查询配置

### Request

- Method: **POST**
- URL: /api/v1/config
- Body:
  ```json
  {
    "fromAddress": "TJAvEDAKXUzng4nh9H58XVLRR3ozekDi8P", // 用户地址，可选
    "sourceFlag": "", // 第三方来源，可选
  }
  ```

### Response

- Body:
  ```json
  {
    "defaultEnergyPrice": 75, // 默认购买能量价格 
    "sun_1d": 130, // 租赁1天能量单价
    "sun_1h": 110, // 租赁1小时能量单价
    "sun_2d": 120, // 租赁2天能量单价
    "sun_3h": 115, // 租赁3小时能量单价
    "sun_10m": 100, // 租赁10分钟能量单价
    "lowEnergyFee": 0.56, // 租赁低能量手续费
    "lowEnergyLimit": 65000, // 租赁低能量限制值，低于该值认为是租赁低能量
    "leftEnergy": 1000000, // 平台剩余可租赁能量
    "pledgeEnergy": 88.53621861, // 质押1TRX可获得的能量
    "pledgeNet": 0.51405149, // 质押1TRX可获得的带宽
    "burnEnergy": 2380.95238095 , // 燃烧1TRX可获得的能量
    "burnNet": 1000, // 燃烧1TRX可获得的带宽 
    "price": 0.12057227, // 1 TRX 兑换 USDT 价格
    "treasureType": [ // 能量宝选项类型对应的能量
      // 转账 - 对方账户有USDT
      {
        "type": "transfer",
        "value": "32000"
      },
      // 转账 - 对方账户无USDT
      {
        "type": "notUtransfer",
        "value": "64000"
      },
      // 合约兑换
      {
        "type": "exchange",
        "value": "240000"
      }
    ]
  }
  ```

## 2.查询账户每日补贴限额

### Request

- Method: **POST**
- URL: /api/v1/checkSubsidy
- Body:
  ```json
  {
    "fromAddress": "TJAvEDAKXUzng4nh9H58XVLRR3ozekDi8P", // 用户地址，可选
    "sourceFlag": "tpnative", // 第三方来源，可选
  }
  ```

### Response

- Body:
  ```json
  {
    "resCode": 100,
    "resMsg": "Success",
    "data": {
        "totalReceivedLimit": 2300, // 总次数
        "remaining": 1465, // 剩余次数
        "isReceived": false, // 今日是否已领取
        "monthRemain": 15,  // 本月剩余领取次数
        "monthLimit": 15 // 每月领取限额
    }
  }

## 3.领取每日补贴

### Request

- Method: **POST**
- URL: /api/v1/subsidy
- Body:
  ```json
  {
    "fromAddress": "TJAvEDAKXUzng4nh9H58XVLRR3ozekDi8P", // 用户地址
    "sourceFlag": "tpnative", // 第三方来源
    "timeStamp": 1710141920083, // 13位时间戳，精确到毫秒
    "signed": ""//私钥加密后数据（加密 fromAddress-timeStamp 字符串后的数据） 用户私钥+服务提供的公钥进行签名，服务端验证
  }
  ```
- Header:
- ```json
  {
    "ip": "192.168.0.1", // 用于限制客户端相同ip的领取次数
    "port": "8083"
  }
  ```

### Response

- Body:
  ```json
  {
    "resCode": 100,
    "resMsg": "Success"
  }
  ```

## 4.查询账户

### Request

- Method: **GET**
- URL: /api/v1/account?account=TJAvEDAKXUzng4nh9H58XVLRR3ozekDi8P
- Params: 
  + account 账户地址 String 必填
  
### Response

- Body:
  ```json
  {
    "resCode": 100,
    "resMsg": "Success",
    "data": {
      "balance": 611000, // 可用 TRX 余额，单位 SUN
      "energyTotal": 100000, // 总能量
      "energyUsed": 2000, // 已用能量
      "bandWidthTotal": 100000, // 总带宽
      "bandWidthUsed": 2000, // 已用带宽
    }
  }
  ```


## 5.查询订单列表

### Request

- Method: **GET**
- URL: /api/v1/order_history?fromAddress=TJAvEDAKXUzng4nh9H58XVLRR3ozekDi8P&page=1&pageSize=20&sourceFlag=tpnative&sort=0&status=0
- Params:
  + sourceFlag 第三方标识 String 可选，默认查全部第三方标识
  + fromAddress 账户地址 String 可选，默认查全部账户地址
  + page 页码 Int 可选，默认1
  + pageSize 分页大小 Int 可选，默认20
  + sort 排序类型 Int 0：根据订单时间倒序 1：根据价格倒序 2：根据金额倒序 3：根据能量倒序 可选，默认 0
  + status 状态 Int 可选，默认全部
- Header:
  + X-Timezone-Offset: 时区 Int，如中国为 +8 ，默认值 8，影响返回数据的时间类型转换

### Response

- Body:
  ```json
  {
    "resCode": 100,
    "resMsg": "Success",
    "data": {
      "data": [
        {
          "orderId": "2ombu8zk_3jet_0mle_g7id_2mi3gnl6fk4y",
          "fromAddress": "TW7XuicuiQSHCcodUkyjMfdWxnWsbZmiSS", // 发起订单地址
          "pledgeAddress": "TW7XuicuiQSHCcodUkyjMfdWxnWsbZmiSS", // 租赁能量接收地址
          "pledgeNum": 555, // 租用能量数量
          "orderPrice": 110, // 单价 SUN
          "pledgeDay": 3, // 租赁时长 pledgeDay,pledgeHour,pledgeMinute 仅出现一个，按顺序优先选择第一个使用
          "pledgeHour": 3, // 租赁时长 pledgeDay,pledgeHour,pledgeMinute 仅出现一个，按顺序优先选择第一个使用
          "pledgeMinute": 10, // 租赁时长 pledgeDay,pledgeHour,pledgeMinute 仅出现一个，按顺序优先选择第一个使用
          "createTime": "2023-04-11 16:29:55", // 订单创建时间
          "status": 1, // 状态 0:未支付 1:已支付 2: 租赁中 3:赎回中 4:结束 5:无效
          "endTime": "2023-04-13 16:29:55", // 订单结束时间
          "pledgeHash": "", // 租赁操作hash
          "reclaimHash": "", // 回收操作hash
          "payHash": "", // 支付转账操作hash
        }
      ],
      "pagination": {
        "page": 1,
        "pageSize": 10,
        "total": 1
      }
    }
  }
  ```

## 6.查询订单详情

### Request

- Method: **GET**
- URL: /api/v1/order?id=16zi4ynw_sdvn_qv8h_ujfc_crfsgyi07zat
- Params:
  + id 订单编号 String
- Header:
  + X-Timezone-Offset: 时区 Int，如中国为 +8 ，默认值 +8，影响返回数据的时间类型转换

### Response

- Body:
  ```json
  {
    "resCode": 100,
    "resMsg": "Success",
    "data": {
      "orderId": "2ombu8zk_3jet_0mle_g7id_2mi3gnl6fk4y",
      "fromAddress": "TW7XuicuiQSHCcodUkyjMfdWxnWsbZmiSS", // 发起订单地址
      "pledgeAddress": "TW7XuicuiQSHCcodUkyjMfdWxnWsbZmiSS", // 租赁能量接收地址
      "pledgeNum": 555, // 租用能量数量
      "orderPrice": 110, // 单价 SUN
      "pledgeDay": 3, // 租赁时长 pledgeDay,pledgeHour,pledgeMinute 仅出现一个，按顺序优先选择第一个使用
      "pledgeHour": 3, // 租赁时长 pledgeDay,pledgeHour,pledgeMinute 仅出现一个，按顺序优先选择第一个使用
      "pledgeMinute": 10, // 租赁时长 pledgeDay,pledgeHour,pledgeMinute 仅出现一个，按顺序优先选择第一个使用
      "createTime": "2023-04-11 16:29:55",
      "status": 1, // 状态 0:未支付 1:已支付 2: 租赁中 3:赎回中 4:结束 5:无效
      "endTime": "2023-04-13 16:29:55", // 订单结束时间
      "pledgeHash": "", // 租赁操作hash
      "reclaimHash": "", // 回收操作hash
      "payHash": "", // 支付转账操作hash
    }
  }
  ```

## 7.查询价格信息

### Request

- Method: **POST**
- URL: /api/v1/order_price
- Body:
  ```json
  {
    "fromAddress": "TKghVbeEzvrV8GLK3YE1gRrjVHSf8rGB6k", // 发起操作地址
    "pledgeAddress": "TKghVbeEzvrV8GLK3YE1gRrjVHSf8rGB6k", // 能量接收地址
    // 为适配原api pledgeDay、pledgeHour和pledgeMinute，任选其一提交即可
    // 如果同时存在则按 pledgeDay - pledgeHour - pledgeMinute 顺序优先选择第一个有值的 
    "pledgeDay": 0, // 租赁天数
    "pledgeHour": , // 租赁小时数
    "pledgeMinute": 10, // 租赁分钟数
    "pledgeNum": 32000, // 租赁数量
    "extraTrxNum": 0, // 需要的trx数量（范围限制在 大于1.5，小于等于30），该参数用于确认是否用USDT支付
    "sourceFlag": "tpnative" // 第三方来源
  }
  ```

### Response

- Body:
  ```json
  {
    "fromAddress": "TKghVbeEzvrV8GLK3YE1gRrjVHSf8rGB6k", // 钱包地址
    "pledgeAddress": "TKghVbeEzvrV8GLK3YE1gRrjVHSf8rGB6k", // 接收能量地址
    "pledgeDay": 3, // 质押天数
    "source": "tpnative", // 第三方来源
    "orderType": "ENERGY", // 资源类型
    "orderPrice": 100, // 单价 SUN
    "pledgeNum": 64000, // 租赁数量
    "pledgeTrxNum": 42.448, // 支付所需的TRX，在非USDT支付时有效
    "payCoinCode": "USDT", // 支付所需币种
    "payCoinAmt": "42.448", // 支付币种
    "extraTrxNum": 0, // 需要的trx数量（范围限制在 大于1.5，小于等于30），该参数用于确认是否用USDT支付
    "activeAccountFee": "0", // 激活账号费用
    "purchaseTRXFee": "0", // 购买trx费用
    "purchaseEnergyFee": "0", // 购买能量费用
    "usdtModeAvailable": true, // usdt 模式是否可用
  }
  ```

## 8.创建租赁订单

### Request

- Method: **POST**
- URL: /api/v1/order_create
- Body:
  ```json
  {
    "fromAddress": "TKghVbeEzvrV8GLK3YE1gRrjVHSf8rGB6k", // 发起操作地址
    "pledgeAddress": "TKghVbeEzvrV8GLK3YE1gRrjVHSf8rGB6k", // 能量接收地址
    // 为适配原api pledgeDay、pledgeHour和pledgeMinute，任选其一提交即可
    // 如果同时存在则按 pledgeDay - pledgeHour - pledgeMinute 顺序优先选择第一个有值的 
    "pledgeDay": 0, // 租赁天数
    "pledgeHour": , // 租赁小时数
    "pledgeMinute": 10, // 租赁分钟数
    "pledgeNum": 32000, // 租赁数量
    "extraTrxNum": 0, // 需要的trx数量（范围限制在 大于1.5，小于等于30），该参数用于确认是否用USDT支付
    "sourceFlag": "tpnative" // 第三方来源
  }
  ```

### Response

- Body:
  ```json
  {
    "resCode": 100,
    "resMsg": "Success",
    "data": {
      "orderId": "16zi4ynw_sdvn_qv8h_ujfc_crfsgyi07zat",
      "pledgeDay": 0,
      "pledgeHour": 0,
      "pledgeMinute": 10,
      "source": "trxres",
      "orderType": "ENERGY", // 租赁类型，目前为定值 ENERGY，并没带宽业务
      "orderPrice": 100, // 单价
      "pledgeNum": 32000, // 租赁数量
      "pledgeTrxNum": 3.76, // 所需支付的TRX
      "payCoinCode": "USDT", // 支付所需币种
      "payCoinAmt": "42.448", // 支付币种
      "extraTrxNum": "29", // 需要的trx数量（范围限制在 大于1.5，小于等于30），该参数用于确认是否用USDT支付
      "activeAccountFee": 0, // 激活账户费用
      "purchaseTRXFee": 0, // 购买trx费用
      "purchaseEnergyFee": 0, // 购买能量费用
      "transaction": {} // 未签名交易
    }
  }
  ```

## 9.上传买单

### Request

- Method: **POST**
- URL: /api/v1/order_update
- Body:
  ```json
  {
    "orderId": "16zi4ynw_sdvn_qv8h_ujfc_crfsgyi07zat",
    "fromHash": "", // 交易hash
    "transaction": {} // 已签名交易
  }
  ```

### Response

- Body:
  ```json
  {
    "resCode": 100,
    "resMsg": "Success",
    "data": {
      "tx_ids":[] // 当前订单执行的交易hash数组，如普通流程，返回转账交易hash和租赁交易hash
    }
  }
  ```



# 错误码

- 100 成功  Success
- 101 所需参数为空  Required parameter is empty
- 102 地址无效  Invalid address
- 103 您已达到今日领取限制  You have already reached the daily limit
- 105 订单不存在  The order does not exist
- 106 本月免费额度已用完  The monthly claim limit has been exceeded
- 107 超出交换范围  Out of exchange range
- 108 您需要在TokenPocket钱包中使用此功能 You need use this function in the TokenPocket wallet
- 109 今日领取额度已用完  The subsidy has been claimed out
- 110 24小时内已领取过了  Received
- 111 未找到委托权限  No delegation authority found
- 112 要成为能源供应商，能源抵押的TRX金额必须超过一定数量 To become an energy supplier, the energy staking TRX amount must be over
- 113 超过了最高允许的价格设置  Exceeded the price range allowed for setting
- 114 参数错误  Parameter error
- 115 超时  Timeout
- 116 当前用户存在取款操作，请稍后再试! There is a withdrawal operation for the current user, please try again later!
- 117 订单存在异常，请联系客服人员帮助解决。  There is an exception in the order, please contact the customer service staff to help solve it.
- 118 该用户已存在  The user already exists.
- 119 该账户已存在。请前往 tronify.io 上的买家管理平台绑定您的 TG ID  The account already exists. Please go to the buyer management platform on tronify.io and bind your TG ID.
- 120 无效的签名  Invalid signature
- 121 地址未激活，请替换  The address is not activated, please activate it
- 122 该地址是合约地址，请替换  The address is a contract address, please replace it
- 123 地址数量超过1000个  The number of addresses exceeds 1000
- 124 账户余额不足  Insufficient account balance
- 125 剩余数量不足  Insufficient remaining quantity
- 126 剩余能量必须大于最小能量  The remaining energy must be greater than the minimum energy
- 127 USDT购买能量正在维护中  USDT purchased energy is under maintenance
- 128 目前能量不足，请稍后重试  Insufficient energy at the moment, please try again later
- 501 未授权  Not author
- 502 访问限制  Access restriction
- 777 操作频繁，请稍后重试  Frequent operations, please try again later
- 999 内部错误  Service Internal Error
