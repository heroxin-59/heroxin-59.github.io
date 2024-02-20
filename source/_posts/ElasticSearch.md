---
#文章标题
title: ElasticSearch
#文章创建日期
date: 2023-03-04 10:30:00
#文章更新日期
updated: 2023-03-1710:30:00
#文章标签
tags: [ElasticSearch,分布式] 
#文章分类
categories: 
	- [分布式]
	- [ElasticSearch]
	- [技术栈]
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

# Elasticsearch

> elasticsearch是一款非常强大的开源搜索引擎，可以帮助我们从海量数据中找到需要的内容
>
> elasticsearch结合kibana、Logstash、Beats，也就是elastic stack（ELK）。被广泛应用在日志数据分析、实时监控等领域。
>
> elasticsearch是elastic stack的核心，负责存储、搜索、分析数据。



## elasticsearch发展

### Lucene

​        **Lucene**是一套用于全文检索和搜寻的开源程式库，由Apache软件基金会支持和提供。基于倒排索引，提供了搜索引擎的核心API。由Java编写，有高性能，易扩展等优点。由DougCutting于1999年研发。

​		但是仅限于Java语言开发，不适用于其他语言，学习难度大，不支持分布式水平扩展

### elasticsearch

​        Elasticsearch是一个开源的分布式、RESTful 风格的搜索和数据分析引擎，它的底层是开源库Apache Lucene。算是lucene外面一层华丽的包装，有支持分布式水平拓展，提供Restful接口，可被任何语言调用等优点

## 新知识

传统数据库（如Mysql）采用的是正向索引，而elasticsearch采用的是倒排索引



- 倒排索引：对文档内容分词，对词条创建索引，并记录词条所在文档的信息，查询时先根据词条查询到文章id，而后获取到文章
- 正向索引：基于文档id创建索引，查询词条时必须先找到文档，而后判断是否包含词条



1. 文档：对应mysql数据表中的一行数据
2. 词条：对文档中的内容进行分词，得到的词语就是词条
3. 词条词典：记录所有词条，以及词条和倒排列表之间的关系，会给词条创建索引，提高查询和插入效率
4. 倒排索引：记录词条所在的文档id，词条出现的频率，词条在文档中的位置信息
5. 索引：相同类型的文档的集合
6. 映射：索引中文档的字段约束信息，类似表的结构约束

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230303191503481.png)



### 分词器

es在创建倒排索引时，需要对文档进行分词，这个操作就是分词器来完成的。

它会将一个句子分为一个个‘字’或者一个个‘词’，原版是无法对中文进行分词的，我们使用 ik 分词器来完成对中文的分词。

ik分词器包含两种模式：

- ik_smart:最少切分，粗粒度
- ik_max_word:最细切分，细粒度

ik分词器的安装见



安装过程详见：[Centos7安装Elasticsearch | Heroxin](https://heroxin.xyz/2023/03/03/Centos7_Install_Elasticsearch/)



ik分词器-拓展词库

要拓展ik分词器的词库，只需要修改ik分词器目录中的config目录中的IKAnalyzer.cfg.xml 文件：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
        <comment>IK Analyzer 扩展配置</comment>
        <!--用户可以在这里配置自己的扩展字典 *** 添加扩展词典-->
        <entry key="ext_dict">ext.dic</entry>
</properties>
```

然后再同一目录下的ext.dic文件中，添加自己想要拓展的词语即可

## 安装



安装过程详见：[Centos7安装Elasticsearch | Heroxin](https://heroxin.xyz/2023/03/03/Centos7_Install_Elasticsearch/)





## 索引库操作

> 将索引库操作联想为对数据库的操作，创建数据库、查询数据库、约束、....

1. mapping：是对所应库中文档的约束，常见的mapping包括：

   - type：字段数据类型，常见的简单类型有：
     - 字符串：text(可分词的文本)、keyword
     - 数值：long、integer、short、byte、double、float
     - 布尔：boolean
     - 日期：data
     - 对象：object
   - index：是否创建索引，默认为true
   - analyzer：使用哪种分词器
   - properties：该字段的子字段

2. 创建索引库

   ```
   PUT /索引库名称
   {
     "mappings": {
       "properties": {
         "字段名":{
           "type": "text",
           "analyzer": "ik_smart"
         },
         "字段名2":{
           "type": "keyword",
           "index": "false"
         },
         "字段名3":{
           "properties": {
             "子字段": {
               "type": "keyword"
             }
           }
         },
         // ...略
       }
     }
   }
   ```

   示例：

   ```
   # 创建索引库
   PUT /heroxin
   {
     "mappings": {
       "properties": {
         "info":{
           "type": "text",
           "analyzer": "ik_smart"
         },
         "email":{
           "type": "keyword",
           "index": false
         },
         "name":{
           "type": "object",
           "properties": {
             "firstName":{
               "type":"keyword"
             },
             "lastName":{
               "type":"keyword"
             }
           }
         }
       }
     }
   }
   ```

   

3. 查看索引库

   ```
   GET /索引库名
   ```

4. 删除索引库

   ```
   DELETE /索引库名
   ```

5. 修改索引库

   ```
   # 所应库和mapping一旦创建就无法修改，但是可以添加新的字段
   
   PUT /索引库名/_mapping
   {
     "properties": {
       "新字段名":{
         "type": "integer"
       }
     }
   }
   ```
   
6. 数据迁移

   ```
   # 创建好索引之后，如果非得修改已存在字段，
   # 则可以创建一个新的索引，然后将原来索引中的数据导入到新的索引当中
   
   # 创建新的索引库,将字段属性进行修改，
   PUT /new_heroxin
   {
     "mappings": {
       "properties": {
         "info":{
           "type": "text",
           "analyzer": "ik_smart"
         },
         "email":{
           "type": "keyword",
           "index": false
         },
         "name":{
           "type": "object",
           "properties": {
             "firstName":{
               "type":"keyword"
             },
             "lastName":{
               "type":"keyword"
             }
           }
         }
       }
     }
   }
   
   
   # 数据迁移
   POST _reindex
   {
   	"source":{
   		"index":"heroxin",
   	},
   	"dest":{
   		"index":"new"
   	}
   }
   
   ```

   





## 文档操作

> 联想为数据库中表的操作，构表语句、新增/修改字段......

1. 添加文档

   ```
   POST /索引库名/_doc/文档id
   {
       "字段1": "值1",
       "字段2": "值2",
       "字段3": {
           "子属性1": "值3",
           "子属性2": "值4"
       },
       // ...
   }
   ```

   示例：

   ```
   POST /heroxin/_doc/1
   {
     "info":"光彩斐然",
     "email":"hero_xin@163.com",
     "name":{
       "firstName":"wen",
       "lastName":"xin"
     }
   }
   ```

2. 查询文档

   ```
   # DELETE /索引库名/_doc/文档id
   GET /heroxin/_doc/1
   ```

3. 删除文档

   ```
   # DELETE /索引库名/_doc/文档id
   DELETE /heroxin/_doc/1
   ```

4. 修改

   - 局部修改

     ```
     POST /heroxin/_update/1
     {
       "doc":{
         "email":"wen@163.com"
       }
     }
     ```

   - 全量修改

     ```
     PUT /heroxin/_doc/1
     {
       "info":"光彩斐然",
       "email":"hero_xin@163.com",
       "name":{
         "firstName":"wen",
         "lastName":"xin"
       }
     }
     ```

## RestClient操作索引库

> ES官方提供了各种不同语言的客户端，用来操作ES。这些客户端的本质就是组装DSL语句，通过http请求发送给ES。官方文档地址：https://www.elastic.co/guide/en/elasticsearch/client/index.html



1. 导入依赖（和你的es版本一样）

   ```xml
   <dependency>
       <groupId>org.elasticsearch.client</groupId>
       <artifactId>elasticsearch-rest-high-level-client</artifactId>
       <version>7.12.1</version>
   </dependency>
   ```

2. 因为SpringBoot默认的ES版本是和咱的不一样，所以我们需要覆盖默认的ES版本

   ```xml
   <properties>
       <java.version>1.8</java.version>
       <elasticsearch.version>7.12.1</elasticsearch.version>
   </properties>
   ```

3. 测试

   ```java
   @SpringBootTest
   public class HotelIndexTest {
   
       private RestHighLevelClient client;
   
       @Test
       void testInit() {
           System.out.println(client);
       }
   
   
       //    创建索引库
       @Test
       void testCreateHotelIndex() throws IOException {
   //        创建Request对象
           CreateIndexRequest request = new CreateIndexRequest("hotel");
   //        请求参数，MAPPING_TEMPLATE是静态常量字符串，内容是创建索引库的DSL语句
           request.source(MAPPING_TEMPLATE, XContentType.JSON);
   //        发送请求
           client.indices().create(request, RequestOptions.DEFAULT);
       }
   
       //    删除索引库
       @Test
       void testDeleteHotelIndex() throws IOException {
   //        创建Request对象
           DeleteIndexRequest request = new DeleteIndexRequest("hotel");
   //        发送请求
           client.indices().delete(request, RequestOptions.DEFAULT);
       }
   
       //    判断索引库是否存在
       @Test
       void testExistsHotelIndex() throws IOException {
   //        创建request对象
           GetIndexRequest request  = new GetIndexRequest("hotel");
   //        发送请求
           boolean exists = client.indices().exists(request, RequestOptions.DEFAULT);
   //        输出
           System.out.println(exists);
       }
   
       @BeforeEach
       void setUp() {
           client = new RestHighLevelClient(RestClient.builder(
                   HttpHost.create("http://192.168.196.101:9200")
           ));
       }
   
       @AfterEach
       void tearDown() throws IOException {
           client.close();
       }
   }
   ```



## RestClient操作文档

测试类

```java
@SpringBootTest
public class HotelDocumentTest {
    private RestHighLevelClient client;

    @Autowired
    private HotelService hotelService;

    /*
    * 文档查询
    */

    @Test
    void testAddDocument() throws IOException {
        // 1.查询数据库hotel数据
        Hotel hotel = hotelService.getById(47478);
        // 2.转换为HotelDoc
        HotelDoc hotelDoc = new HotelDoc(hotel);
        // 3.转JSON
        String json = JSON.toJSONString(hotelDoc);

        // 1.准备Request
        IndexRequest request = new IndexRequest("hotel").id(hotelDoc.getId().toString());
        // 2.准备请求参数DSL，其实就是文档的JSON字符串
        request.source(json, XContentType.JSON);
        // 3.发送请求
        client.index(request, RequestOptions.DEFAULT);
    }

    @Test
    void testGetDocumentById() throws IOException {
        // 1.准备Request      // GET /hotel/_doc/{id}
        GetRequest request = new GetRequest("hotel", "47478");
        // 2.发送请求
        GetResponse response = client.get(request, RequestOptions.DEFAULT);
        // 3.解析响应结果
        String json = response.getSourceAsString();

        HotelDoc hotelDoc = JSON.parseObject(json, HotelDoc.class);
        System.out.println("hotelDoc = " + hotelDoc);
    }

    @Test
    void testDeleteDocumentById() throws IOException {
        // 1.准备Request      // DELETE /hotel/_doc/{id}
        DeleteRequest request = new DeleteRequest("hotel", "47478");
        // 2.发送请求
        client.delete(request, RequestOptions.DEFAULT);
    }

    @Test
    void testUpdateById() throws IOException {
        // 1.准备Request
        UpdateRequest request = new UpdateRequest("hotel", "47478");
        // 2.准备参数
        request.doc(
                "price", "870"
        );
        // 3.发送请求
        client.update(request, RequestOptions.DEFAULT);
    }

    @Test
    void testBulkRequest() throws IOException {
        // 查询所有的酒店数据
        List<Hotel> list = hotelService.list();

        // 1.准备Request
        BulkRequest request = new BulkRequest();
        // 2.准备参数
        for (Hotel hotel : list) {
            // 2.1.转为HotelDoc
            HotelDoc hotelDoc = new HotelDoc(hotel);
            // 2.2.转json
            String json = JSON.toJSONString(hotelDoc);
            // 2.3.添加请求
            request.add(
                    new IndexRequest("hotel")
                    .id(hotel.getId().toString())
                    .source(json, XContentType.JSON)
            );
        }

        // 3.发送请求
        client.bulk(request, RequestOptions.DEFAULT);
    }

    @BeforeEach
    void setUp() {
        client = new RestHighLevelClient(RestClient.builder(
                HttpHost.create("http://192.168.196.101:9200")
        ));
    }

    @AfterEach
    void tearDown() throws IOException {
        client.close();
    }
}
```



## DSL查询语法

> 联想mysql的查询

1. 基本语法

   ```
   GET /indexName/_search
   {
     "query": {
       "查询类型": {
         "查询条件": "条件值"
       }
     }
   }
   
   
   # 示例
   // 查询所有
   GET /indexName/_search
   {
     "query": {
       "match_all": {
       }
     }
   }
   ```

2. 全文检索查询

   ```
   GET /hotel/_search
   {
     "query": {
       "match": {
         "字段": "字段内容"
       }
     }
   }
   
   
   #演示
   GET /hotel/_search
   {
     "query": {
       "match": {
         "all": "上海"
       }
     }
   }
   ```

3. 精确查询

   ```
   # 精确查询
   #    一般是查找keyword，数值，日期，Boolean等类型字段，不会对搜索条件 分词
   #   term：根据词条精确值查询
   #   range：根据值的范围查询
   
   GET /hotel/_search
   {
     "query": {
       "term": {
         "city": {
           "value": "上海"
         }
       }
     }
   }
   
   GET /hotel/_search
   {
     "query": {
       "range": {
         "price": {
           "gte": 10,
           "lte": 200
         }
       }
     }
   }
   ```

4. 复合查询

   ```
   # 复合查
   #   function score 查询 （加分）
   
   GET /hotel/_search
   {
     "query": {
       "function_score": {
         "query": {
           "match": {
             "all": "外滩"
           }
         },
         "functions": [
           {
             "filter": {"term": {
               "brand": "如家"
             }},
             "weight": 10
           }
         ],
         "boost_mode": "sum"
       }
     }
   }
   
   
   
   
   
   
   #   Boolean Query 查询，布尔查询是一个或多个子查询的组合
   
   # 搜索名字包含"如家"，价格不高于400，坐标在指定范围内10km的酒店
   GET /hotel/_search
   {
     "query": {
       "bool": {
         "must": [
           {"match": {
             "name": "如家"
           }}
         ],
         "must_not": [
           {
             "range": {
               "price": {
                 "gt": 400
               }
             }
           }
         ],
         "filter": [
           {
             "geo_distance": {
               "distance": "10km",
               "location": {
                 "lat": 31.21,
                 "lon": 121.5
               }
             }
           }
         ]
       }
     }
   }
   ```

5. 排序

   ```
   #  默认更具_score排序  
   
   GET /hotel/_search
   {
     "query": {
       "match_all": {}
     },
     "sort": [
       {
         "price": {
           "order": "desc"
         }
       }
     ]
   }
   ```

6. 分页

   ```
   #   默认返回10条数据
   GET /hotel/_search
   {
     "query": {
       "match_all": {}
     },
     "sort": [
       {
         "price": {
           "order": "asc"
         }
       }
     ], 
     "from": 0,
     "size": 20
   }
   ```

7. 高亮处理

   ```
   #  默认情况下搜索字段必须与高亮字段一致
   GET /hotel/_search
   {
    "query": {
      "match": {
        "all": "如家"
      }
    },
    "highlight": {
      "fields": {
        "name": {
          "require_field_match": "false"
        }
      }
    }
   }
   ```

## RestClient操作搜索

```java

@SpringBootTest
public class HotelSearchTest {
    private RestHighLevelClient client;

    @Test
    void testMatchAll() throws IOException {
        SearchRequest request = new SearchRequest("hotel");

//        dsl语句
        request.source().query(QueryBuilders.matchAllQuery());
//        发送请求
        SearchResponse search = client.search(request, RequestOptions.DEFAULT);

        System.out.println(search);
//        解析相应
        System.out.println("=========================================");
        SearchHits hits = search.getHits();
        long value = hits.getTotalHits().value;
        System.out.println("共搜索到：" + value + "  条数据");
        SearchHit[] hits1 = hits.getHits();
        for (SearchHit hit : hits) {
//            获取文档source
            String sourceAsString = hit.getSourceAsString();
            System.out.println("hoteldoc :" + sourceAsString);
        }
    }


    @Test
    void testmatch() throws IOException {
        SearchRequest request = new SearchRequest("hotel");

//        dsl语句
        request.source().query(QueryBuilders.matchQuery("all", "如家"));
//        发送请求
        SearchResponse search = client.search(request, RequestOptions.DEFAULT);

        System.out.println(search);
//        解析相应
        System.out.println("=========================================");
        SearchHits hits = search.getHits();
        long value = hits.getTotalHits().value;
        System.out.println("共搜索到：" + value + "  条数据");
        SearchHit[] hits1 = hits.getHits();
        for (SearchHit hit : hits1) {
//            获取文档source
            String sourceAsString = hit.getSourceAsString();
            System.out.println("hoteldoc :" + sourceAsString);
        }
    }
    @Test
    void testtrem() throws IOException {
        SearchRequest request = new SearchRequest("hotel");

//        dsl语句
        request.source().query(QueryBuilders.termQuery("all", "如家"));

//        发送请求
        SearchResponse search = client.search(request, RequestOptions.DEFAULT);

        System.out.println(search);
//        解析相应
        System.out.println("=========================================");
        SearchHits hits = search.getHits();
        long value = hits.getTotalHits().value;
        System.out.println("共搜索到：" + value + "  条数据");
        SearchHit[] hits1 = hits.getHits();
        for (SearchHit hit : hits1) {
//            获取文档source
            String sourceAsString = hit.getSourceAsString();
            System.out.println("hoteldoc :" + sourceAsString);
        }
    }




    @BeforeEach
    void setUp() {
        client = new RestHighLevelClient(RestClient.builder(
                HttpHost.create("http://192.168.196.101:9200")
        ));
    }

    @AfterEach
    void tearDown() throws IOException {
        client.close();
    }
}

```

