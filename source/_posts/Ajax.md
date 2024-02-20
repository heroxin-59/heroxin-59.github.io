---
#文章标题
title: Ajax,Axios
#文章创建日期
date: 2022-11-22 10:30:00
#文章更新日期
updated: 2022-11-22 10:30:00
#文章标签
tags: [Ajax,Axios,JQuery,JavaScript] 
#文章分类
categories: 
	- [技术栈]
	- [前端]
#文章关键字
keywords: 
#文章描述
description: 
#文章顶部图片
top_img: 
#评论模块，默认true
comments: 
#缩略图，如果没有top_img，文章顶部将显示缩略图
cover:


---
# Ajaxs

## Ajax



{% tabs note %}
<!-- tab GET-->

```javascript
<body>
    <button>点击发送请求</button>
    <div id="result"></div>
    <script>
        // 获取 button 元素
        const btn = document.getElementsByTagName('button')[0];
        const result = document.getElementById("result");
        // 绑定事件
        btn.onclick = function(){
            // ajax 实现
            // 1. 创建对象
            const xhr = new XMLHttpRequest();
            // 2.初始化 设置请求方法和 url
            xhr.open('GET','http://localhost:8000/server?a=100&b=200');
            // 3. 发送
            xhr.send();
            // 4. 事件绑定 处理服务器返回的结果
            // on 当...的时候
            // readystate 是 xhr 对象中的属性，表示状态 0 1 2 3 4
            // change 改变的时候
            xhr.onreadystatechange = function(){
                // 判断(服务器返回了所有结果)
                // === 判断两端的数值与数据类型是否相同
                if(xhr.readyState === 4){
                    // 判断响应状态码 200 404 403 401 500
                    // 2xx 为成功
                    if(xhr.status >= 200 && xhr.status < 300){
                        // 处理结果
                        result.innerHTML = xhr.responseText +'\n'+ xhr.status
                    }
                }
            }
        }
    </script>
</body>
```


server.js配置

```javascript
 
// 1. 引入express
const { response } = require('express');
const express = require('express');

// 2. 创建应用对象
const app = express();

// 3. 创建路由规则
// request 对请求报文的封装
// response 对响应报文的封装
// get请求
app.get('/server', (request, response) => {
    // 设置响应 设置允许跨域
    response.setHeader('Access-Control-Allow-Origin', '*')
    // 设置响应体
    response.send('hello ajax! get');
});
// 4. 监听端口，启动服务
// node ./express基本使用.js
app.listen(8000, () => {
    console.log("服务已经启动，8000端口监听中。。。")
})
 
```

<!-- endtab -->

<!-- tab POST-->

```javascript
<body>
    <div id="result"></div>
    <script>
        // 获取元素
        const result = document.getElementById("result");
        // 绑定事件，当鼠标悬浮，调用ajax
        result.addEventListener("mouseover",function(){
            // 1. 创建对象
            const xhr = new XMLHttpRequest();
            // 2. 初始化，设置请求方法和 url
            xhr.open('POST','http://localhost:8000/server');
            // 设置请求头
            xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
            // 3. 发送
            xhr.send();
            // post请求参数放在这里,这个格式与服务器那端相应即可
            // xhr.send('a=100&b=200');
            // xhr.send('a:100&b:200');
            // xhr.send('1321321');
            // 4. 事件绑定
            xhr.onreadystatechange = function(){
                // 判断
                if(xhr.readyState ===4){
                    if(xhr.status >= 200 && xhr.status < 300){
                        // 处理返回结果
                        result.innerHTML = xhr.response;
                    }
                }
            }

        })
    </script>
</body>
```


server.js配置

```javascript
 
// 1. 引入express
const { response } = require('express');
const express = require('express');

// 2. 创建应用对象
const app = express();

// 3. 创建路由规则
// request 对请求报文的封装
// response 对响应报文的封装
// post请求
app.post('/server', (request, response) => {
    // 设置响应 设置允许跨域
    response.setHeader('Access-Control-Allow-Origin', '*')
    // 设置响应体
    response.send('hello ajax! post');
});

// 4. 监听端口，启动服务
// node ./express基本使用.js
app.listen(8000, () => {
    console.log("服务已经启动，8000端口监听中。。。")
})
 
```

<!-- endtab -->

<!-- tab JSON-->

```javascript
<body>
    <div id="result"></div>
    <script>
        // 按下键盘，捕获元素
        window.onkeydown = function () {
            const result = document.getElementById("result");
            // 1. 创建对象
            const xhr = new XMLHttpRequest();
            // 设置响应体数据类型
            xhr.responseType = 'json';
            // 2.初始化 设置请求方法和 url
            xhr.open('GET', 'http://localhost:8000/json-server');
            // 3. 发送
            xhr.send();
            // 4. 事件绑定 处理服务器返回的结果
            xhr.onreadystatechange = function () {
                // 判断(服务器返回了所有结果)
                // === 判断两端的数值与数据类型是否相同
                if (xhr.readyState === 4) {
                    // 判断响应状态码 200 404 403 401 500
                    // 2xx 为成功
                    if (xhr.status >= 200 && xhr.status < 300) {
                        // 处理结果
                        // result.innerHTML = xhr.responseText;
                        // 手动对数据转化
                        // let data = JSON.parse(xhr.response);
                        // 自动转化，在创建xhr对象下设置响应体数据类型
                        result.innerHTML = xhr.response.name
                    }
                }
            }
        }
    </script>
</body>
```


server.js配置

```javascript
 
// 1. 引入express
const { response } = require('express');
const express = require('express');

// 2. 创建应用对象
const app = express();

// 3. 创建路由规则
// request 对请求报文的封装
// response 对响应报文的封装

// all允许所有请求
// json
app.all('/json-server', (request, response) => {
    // 设置响应 设置允许跨域
    response.setHeader('Access-Control-Allow-Origin', '*')
    // 响应头
    response.setHeader('Access-Control-Allow-Headers', '*');
    // 响应数据
    const data = {
        name: 'heroxin',
        sex: '1'
    }
    // 对对象进行字符串转化
    let str = JSON.stringify(data);
    // 设置响应体
    response.send(str);
});


// 4. 监听端口，启动服务
// node ./express基本使用.js
app.listen(8000, () => {
    console.log("服务已经启动，8000端口监听中。。。")
})
 
```

<!-- endtab -->

<!-- tab 请求超时-->

```javascript
<body>
    <button>
        点我发送请求
    </button>
    <div id="result"></div>
    <script>
        const btn = document.getElementsByTagName('button')[0];
        const result = document.querySelector('#result');

        btn.addEventListener('click', function () {
            const xhr = new XMLHttpRequest();
            // 设置 2s 超时
            xhr.timeout = 2000;
            // 超时回调函数
            xhr.ontimeout = function(){
                alert("请求超时，请稍后再试");
            }
            xhr.open('GET', 'http://localhost:8000/timeout-server');
            xhr.send();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        result.innerHTML = xhr.response;
                    }
                }
            }
        })
    </script>
</body>
```


server.js配置

```javascript

// 1. 引入express
const { response } = require('express');
const express = require('express');

// 2. 创建应用对象
const app = express();

// 3. 创建路由规则
// request 对请求报文的封装
// response 对响应报文的封装

// 延时响应
app.all('/timeout-server', (request, response) => {
    // 设置响应 设置允许跨域
    response.setHeader('Access-Control-Allow-Origin', '*')
    // 设置超时时间
    setTimeout(() => {
        // 设置响应体
        response.send('超时响应');
    }, 3000)
});

// 4. 监听端口，启动服务
// node ./express基本使用.js
app.listen(8000, () => {
    console.log("服务已经启动，8000端口监听中。。。")
})
  
```

<!-- endtab -->

<!-- tab 取消请求-->

```javascript
<body>
    <button>点我发送请求</button>
    <button>点我取消请求</button>
    <script>
        const btns = document.querySelectorAll('button');
        let xhr = null;
        btns[0].onclick = function () {
            xhr = new XMLHttpRequest();
            xhr.open('GET', 'http://localhost:8000/cancel-server');
            xhr.send();
        }

        // 取消请求
        btns[1].onclick = function () {
            xhr.abort();
        }
    </script>
</body>

```


server.js配置

```javascript
 
// 1. 引入express
const { response } = require('express');
const express = require('express');

// 2. 创建应用对象
const app = express();

// 3. 创建路由规则
// request 对请求报文的封装
// response 对响应报文的封装

// 取消请求
app.all('/cancel-server', (request, response) => {
    // 设置响应 设置允许跨域
    response.setHeader('Access-Control-Allow-Origin', '*')
    // 设置超时时间
    setTimeout(() => {
        // 设置响应体
        response.send('取消请求');
    }, 3000)
});

// 4. 监听端口，启动服务
// node ./express基本使用.js
app.listen(8000, () => {
    console.log("服务已经启动，8000端口监听中。。。")
})
 
```

<!-- endtab -->

<!-- tab 取消重复请求-->

```javascript
<body>
    <button>点我发送请求</button>
    <script>
        const btns = document.querySelector('button');
        let xhr = null;
        // 设置标识变量,是否正在发送ajax请求
        let isSending = false;
        btns.onclick = function () {
            // 判断标识变量,如果正在请求，则取消
            if (isSending) xhr.abort();
            xhr = new XMLHttpRequest();
            // 修改标识变量
            isSending = true;
            xhr.open('GET', 'http://localhost:8000/chongfu-server');
            xhr.send();
            xhr.onreadystatechange = function () {
                if (xhr.readyStatus === 4) {
                    // 修改标识变量值
                    isSending = false;
                }
            }
        }

    </script>
</body>
```


server.js配置

```javascript

// 1. 引入express
const { response } = require('express');
const express = require('express');

// 2. 创建应用对象
const app = express();

// 3. 创建路由规则
// request 对请求报文的封装
// response 对响应报文的封装

// 取消重复请求
app.all('/chongfu-server', (request, response) => {
    // 设置响应 设置允许跨域
    response.setHeader('Access-Control-Allow-Origin', '*')
    // 设置超时时间
    setTimeout(() => {
        // 设置响应体
        response.send('取消重复请求');
    }, 3000)
});

// 4. 监听端口，启动服务
// node ./express基本使用.js
app.listen(8000, () => {
    console.log("服务已经启动，8000端口监听中。。。")
})
  
```

<!-- endtab -->

<!-- tab JQuery-->

```javascript
<body>
    <div>
        <h2>jquery发送ajax请求</h2>
        <button>GET</button>
        <button>POST</button>
        <button>通用型方法ajax</button>
    </div>
    <script>
        $('button').eq(0).click(function () {
            // get请求方法，url，参数，回调函数
            $.get('http://localhost:8000/jquery-server', { a: 100, b: 200 }, function (data) {
                console.log(data);
            })
        });
        $('button').eq(1).click(function () {
            $.post('http://localhost:8000/jquery-server', { a: 100, b: 200 }, function (data) {
                console.log(data);
            })
        });
        $('button').eq(2).click(function () {
            $.ajax({
                // url
                url: 'http://localhost:8000/jquery-server',
                // 参数
                data: { a: 100, b: 200 },
                // 请求类型
                type: 'GET',
                // // 响应数据类型
                dataType: 'json',
                // 成功的回调
                success: function (data) {
                    console.log(data);
                },
                // 失败的回调
                error: function () {
                    console.log("error")
                }

            })
        });

    </script>
</body>
```


server.js配置

```javascript
 
// 1. 引入express
const { response } = require('express');
const express = require('express');

// 2. 创建应用对象
const app = express();

// 3. 创建路由规则
// request 对请求报文的封装
// response 对响应报文的封装

// jQuery 服务
app.all('/jquery-server', (request, response) => {
    // 设置响应 设置允许跨域
    response.setHeader('Access-Control-Allow-Origin', '*')
    // 设置响应体
    const data = {
        name: 'hello ' + 'ajax ' + 'jquery'
    }
    response.send(JSON.stringify(data));
});

// 4. 监听端口，启动服务
// node ./express基本使用.js
app.listen(8000, () => {
    console.log("服务已经启动，8000端口监听中。。。")
})
 
```

<!-- endtab -->



{% endtabs %}


## Axios

{% tabs note %}

<!-- tab 基本用法-->

```javascript
<body>
    <div class="container">
        <h2 class="page-header">基本使用</h2>
        <button class="btn btn-primary"> 发送GET请求 </button>
        <button class="btn btn-warning" > 发送POST请求 </button>
        <button class="btn btn-success"> 发送 PUT 请求 </button>
        <button class="btn btn-danger"> 发送 DELETE 请求 </button>
    </div>
    <script>
        //获取按钮
        const btns = document.querySelectorAll('button');

        //第一个
        btns[0].onclick = function(){
            //发送 AJAX 请求
            axios({
                //请求类型
                method: 'GET',
                //URL
                url: 'http://localhost:3000/posts/2',
            }).then(response => {
                console.log(response);
            });
        }

        //添加一篇新的文章
        btns[1].onclick = function(){
            //发送 AJAX 请求
            axios({
                //请求类型
                method: 'POST',
                //URL
                url: 'http://localhost:3000/posts',
                //设置请求体
                data: {
                    title: "今天天气不错, 还挺风和日丽的",
                    author: "张三"
                }
            }).then(response => {
                console.log(response);
            });
        }

        //更新数据
        btns[2].onclick = function(){
            //发送 AJAX 请求
            axios({
                //请求类型
                method: 'PUT',
                //URL
                url: 'http://localhost:3000/posts/3',
                //设置请求体
                data: {
                    title: "今天天气不错, 还挺风和日丽的",
                    author: "李四"
                }
            }).then(response => {
                console.log(response);
            });
        }

        //删除数据
        btns[3].onclick = function(){
            //发送 AJAX 请求
            axios({
                //请求类型
                method: 'delete',
                //URL
                url: 'http://localhost:3000/posts/3',
            }).then(response => {
                console.log(response);
            });
        }

    </script>
</body>
```

<!-- endtab -->

<!-- tab 函数用法-->

```javascript
<script>
    //获取按钮
    const btns = document.querySelectorAll('button');

    //发送 GET 请求
    btns[0].onclick = function(){
        // axios()
        axios.request({
            method:'GET',
            url: 'http://localhost:3000/comments'
        }).then(response => {
            console.log(response);
        })
    }

    //发送 POST 请求
    btns[1].onclick = function(){
        // axios()
        axios.post(
            'http://localhost:3000/comments', 
            {
                "body": "喜大普奔",
                "postId": 2
            }).then(response => {
            console.log(response);
        })
    }

</script>
```

<!-- endtab -->

<!-- tab 简化配置-->

```javascript
<script>
    //获取按钮
    const btns = document.querySelectorAll('button');
    //默认配置
    axios.defaults.method = 'GET';//设置默认的请求类型为 GET
    axios.defaults.baseURL = 'http://localhost:3000';//设置基础 URL
    axios.defaults.params = {id:100};
    axios.defaults.timeout = 3000;//

    btns[0].onclick = function(){
        axios({
            url: '/posts'
        }).then(response => {
            console.log(response);
        })
    }
</script>
```

<!-- endtab -->

<!-- tab 实例对象-->

```javascript
<script>
    //获取按钮
    const btns = document.querySelectorAll('button');

    //创建实例对象  /getJoke
    const duanzi = axios.create({
        baseURL: 'https://api.apiopen.top',
        timeout: 2000
    });

    const onather = axios.create({
        baseURL: 'https://b.com',
        timeout: 2000
    });
    //这里  duanzi 与 axios 对象的功能几近是一样的
    // duanzi({
    //     url: '/getJoke',
    // }).then(response => {
    //     console.log(response);
    // });

    duanzi.get('/getJoke').then(response => {
        console.log(response.data)
    })
</script>
```

<!-- endtab -->

<!-- tab 拦截器-->

```javascript
<script>
    // Promise
    // 设置请求拦截器  config 配置对象
    axios.interceptors.request.use(function (config) {
    console.log('请求拦截器 成功 - 1号');
    //修改 config 中的参数
    config.params = {a:100};

        return config;
    }, function (error) {
        console.log('请求拦截器 失败 - 1号');
        return Promise.reject(error);
    });

    axios.interceptors.request.use(function (config) {
        console.log('请求拦截器 成功 - 2号');
        //修改 config 中的参数
        config.timeout = 2000;
        return config;
    }, function (error) {
        console.log('请求拦截器 失败 - 2号');
        return Promise.reject(error);
    });

    // 设置响应拦截器
    axios.interceptors.response.use(function (response) {
        console.log('响应拦截器 成功 1号');
        return response.data;
        // return response;
    }, function (error) {
        console.log('响应拦截器 失败 1号')
        return Promise.reject(error);
    });

    axios.interceptors.response.use(function (response) {
        console.log('响应拦截器 成功 2号')
        return response;
    }, function (error) {
        console.log('响应拦截器 失败 2号')
        return Promise.reject(error);
    });

    //发送请求
    axios({
        method: 'GET',
        url: 'http://localhost:3000/posts'
    }).then(response => {
        console.log('自定义回调处理成功的结果');
        console.log(response);
    });
 </script>   
```

<!-- endtab -->

<!-- tab 取消请求-->

```javascript
<script>
    //获取按钮
    const btns = document.querySelectorAll('button');
    //2.声明全局变量
    let cancel = null;
    //发送请求
    btns[0].onclick = function(){
        //检测上一次的请求是否已经完成
        if(cancel !== null){
            //取消上一次的请求
            cancel();
        }
        axios({
            method: 'GET',
            url: 'http://localhost:3000/posts',
            //1. 添加配置对象的属性
            cancelToken: new axios.CancelToken(function(c){
                //3. 将 c 的值赋值给 cancel
                cancel = c;
            })
        }).then(response => {
            console.log(response);
            //将 cancel 的值初始化
            cancel = null;
        })
    }

    //绑定第二个事件取消请求
    btns[1].onclick = function(){
        cancel();
    }
</script>   
```

<!-- endtab -->

{% endtabs %}

