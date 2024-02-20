---
#文章标题
title: Sort
#文章创建日期
date: 2022-11-01 10:30:00
#文章更新日期
updated: 2022-11-01 10:30:00
#文章标签
tags: [Sort,Java] 
#文章分类
categories: 
	- [知识点]
#文章关键字
keywords: Sort
#文章描述
description: 
#文章顶部图片
top_img: 
#评论模块，默认true
comments: 
#缩略图，如果没有top_img，文章顶部将显示缩略图
cover:
---

{% tabs note %}
<!-- tab 快速排序-->
```java
package com.hero.sort;

/*
    @author Heroxin
    @create 2022-10-31-19:49

    @Description: 快速排序
    https://blog.csdn.net/qq_40941722/article/details/94396010
*/

import java.util.Arrays;

public class Quick {
    public static void main(String[] args) {
        int arr[] = {1, -3, 5, 2, 16, 10};

        quickSort(arr, 0, arr.length - 1);
        System.out.println(Arrays.toString(arr));
    }

    /**
     * @param arr   待排序数组
     * @param left  左哨兵
     * @param right 右哨兵
     * @return 排序完成后的数组
     */
   public static int[] quickSort(int arr[], int left, int right) {
        if (left < right) { // 判断区间是否只有一个数
            int i = left;
            int j = right;
            int x = arr[left]; // 基数
            while (i < j) {
                while (i < j && arr[j] >= x) // x 在左，先从右向左找第一个小于x的数
                    j--;
                if (i < j)
                    arr[i++] = arr[j]; // 将 j 放到基数的位置，也就是 i 的位置
                while (i < j && arr[i] < x) // 从左向右找第一个大于等于x的数
                    i++;
                if (i < j)
                    arr[j--] = arr[i]; // 将大值放在 j 的位置
            }
            arr[i] = x; // 第一轮结束，基数大于左边，小于右边
            quickSort(arr, left, i - 1); // 递归调用左边，i 指向的是上一轮的基数，所以 right = i - 1
            quickSort(arr, i + 1, right);// 递归调用右边，left = i + 1
        }
        return arr;
    }

}
```

<!-- endtab -->

<!-- tab 冒泡排序 -->

```java
package com.hero.sort;

/*
    @author Heroxin
    @create 2022-10-31-19:49

    @Description: 冒泡排序
    https://blog.csdn.net/qq_40941722/article/details/94396010
*/

import java.util.Arrays;

public class Quick {
    public static void main(String[] args) {
        int arr[] = {1, -3, 5, 2, 16, 10};

        quickSort(arr, 0, arr.length - 1);
        System.out.println(Arrays.toString(arr));
    }

    /**
     * @param arr   待排序数组
     * @param left  左哨兵
     * @param right 右哨兵
     * @return 排序完成后的数组
     */
   public static int[] quickSort(int arr[], int left, int right) {
        if (left < right) { // 判断区间是否只有一个数
            int i = left;
            int j = right;
            int x = arr[left]; // 基数
            while (i < j) {
                while (i < j && arr[j] >= x) // x 在左，先从右向左找第一个小于x的数
                    j--;
                if (i < j)
                    arr[i++] = arr[j]; // 将 j 放到基数的位置，也就是 i 的位置
                while (i < j && arr[i] < x) // 从左向右找第一个大于等于x的数
                    i++;
                if (i < j)
                    arr[j--] = arr[i]; // 将大值放在 j 的位置
            }
            arr[i] = x; // 第一轮结束，基数大于左边，小于右边
            quickSort(arr, left, i - 1); // 递归调用左边，i 指向的是上一轮的基数，所以 right = i - 1
            quickSort(arr, i + 1, right);// 递归调用右边，left = i + 1
        }
        return arr;
    }

}
```

<!-- endtab -->

<!-- tab 插入排序 -->
```java
package com.hero.sort;

/*
    @author Heroxin
    @create 2022-10-24-18:34

    @Description: 插入排序
        有一数组，第一个元素为有序，后面的为无序
        第一个无序元素与最后一个有序元素比较，
            符合条件，继续向左比较；
            不符合条件，将其放在最后一个有序元素右边
*/

import java.util.Arrays;

public class Insert {
    public static void main(String[] args) {
        int arr[] = {1, -3, 5, 2, 16, 10};

        insertSort(arr);
    }

    public static void insertSort(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
//            第一个无序元素
            int insertVal = arr[i];
//            最后一个有序元素下标
            int insertIndex = i - 1;
//            insertIndex >=0 : 说明在有序元素的范围内
//            insertVal < arr[insertIndex] : 说明这个无序元素应该插入到最后一个有序元素的左边
            while (insertIndex >= 0 && insertVal < arr[insertIndex]) {
//                最后一个有序元素向右移动，为这个无序元素腾出空间
//                      此时，覆盖掉的是无序元素的值，但我们已经将其保存在 insertVal 中
//                      往后，覆盖掉的是最后一个有序元素的值。这个不需要保存，因为它的前一个位置就是它
                arr[insertIndex + 1] = arr[insertIndex];
//                更新最后一个有序元素，向左扫描
                insertIndex--;
            }
//            将无序元素放到不符合条件的最后一个有序元素上
            arr[insertIndex + 1] = insertVal;
        }
        System.out.println(Arrays.toString(arr));
    }
}
```
<!-- endtab -->

<!-- tab 选择排序 -->
```java
package com.hero.sort;

/*
    @author Heroxin
    @create 2022-10-24-16:51

    @Description: 选择排序
        现有 n 个元素组成的数组
        首先假定第一个元素为数组中最小值，然后向后遍历，找到比 它更小的元素，然后交换
        然后，假定第二个元素为数组中最小值，然后向后遍历，找到比 它更小的元素，然后交换
        ……
*/

import java.util.Arrays;

public class Select {
    public static void main(String[] args) {
        int arr[] = {1, -3, 5, 2, 16, 10};
        selectSort(arr);
    }

    public static void selectSort(int[] arr) {
        for (int i = 0; i < arr.length - 1; i++) {
//            最小值下标
            int minIndex = i;
//            最小值
            int min = arr[i];
            for (int j = i ; j < arr.length; j++) {
                if (min > arr[j]) {
//                    记录最小值的下标
                    minIndex = j;
//                    更新最小值
                    min = arr[j];
                }
            }
//            将最小值放在前面
            arr[minIndex] = arr[i];
            arr[i]  = min;
        }
        System.out.println(Arrays.toString(arr));
    }
}
```
<!-- endtab -->

<!-- tab 希尔排序 -->
```java
package com.hero.sort;

/*
    @author Heroxin
    @create 2022-10-31-17:52

    @Description: 希尔排序
        希尔排序也是一种插入排序
        数组长度 / 2 = 增量，按增量的大小将数组分组，每组进行排序
*/

import java.util.Arrays;

public class Shell {
    public static void main(String[] args) {
        int arr[] = {1, -3, 5, 2, 16, 10};

        shellSort(arr);
    }

    public static void shellSort(int[] arr) {
//        将数组进行分组
        for (int gap = arr.length / 2; gap > 0; gap /= 2) {
            for (int i = gap; i < arr.length; i++) {
                int j = i;
                int temp = arr[j];
                if (arr[j] < arr[j - gap]) {
                    while (j - gap >= 0 && temp < arr[j - gap]) {
                        arr[j] = arr[j - gap];
                        j -= gap;
                    }
                    arr[j] = temp;
                }
            }
        }
        System.out.println(Arrays.toString(arr));
    }
}
```
<!-- endtab -->

<!-- tab 归并排序 -->
```java
package com.hero.sort;

/*
    @author Heroxin
    @create 2022-11-02-17:24

    @Description: 归并排序
*/

import java.util.Arrays;

public class Merge {
   public static void main(String[] args) {
      int arr[] = {1, -3, 5, 2, 16, 10};

      //归并排序需要一个额外空间
      int temp[] = new int[arr.length];

      mergeSort(arr, 0, arr.length - 1, temp);
      System.out.println(Arrays.toString(arr));
   }


   //分+合方法
   public static void mergeSort(int[] arr, int left, int right, int[] temp) {
      if(left < right) {
         int mid = (left + right) / 2; //中间索引
         //向左递归进行分解
         mergeSort(arr, left, mid, temp);
         //向右递归进行分解
         mergeSort(arr, mid + 1, right, temp);
         //合并
         merge(arr, left, mid, right, temp);

      }
   }

   //合并的方法
   /**
    *
    * @param arr 排序的原始数组
    * @param left 左边有序序列的初始索引
    * @param mid 中间索引
    * @param right 右边索引
    * @param temp 做中转的数组
    */
   public static void merge(int[] arr, int left, int mid, int right, int[] temp) {

      int i = left; // 初始化i, 左边有序序列的初始索引
      int j = mid + 1; //初始化j, 右边有序序列的初始索引
      int t = 0; // 指向temp数组的当前索引

      //(一)
      //先把左右两边(有序)的数据按照规则填充到temp数组
      //直到左右两边的有序序列，有一边处理完毕为止
      while (i <= mid && j <= right) {//继续
         //如果左边的有序序列的当前元素，小于等于右边有序序列的当前元素
         //即将左边的当前元素，填充到 temp数组
         //然后 t++, i++
         if(arr[i] <= arr[j]) {
            temp[t] = arr[i];
            t += 1;
            i += 1;
         } else { //反之,将右边有序序列的当前元素，填充到temp数组
            temp[t] = arr[j];
            t += 1;
            j += 1;
         }
      }

      //(二)
      //把有剩余数据的一边的数据依次全部填充到temp
      while( i <= mid) { //左边的有序序列还有剩余的元素，就全部填充到temp
         temp[t] = arr[i];
         t += 1;
         i += 1;
      }

      while( j <= right) { //右边的有序序列还有剩余的元素，就全部填充到temp
         temp[t] = arr[j];
         t += 1;
         j += 1;
      }


      //(三)
      //将temp数组的元素拷贝到arr
      //注意，并不是每次都拷贝所有
      t = 0;
      int tempLeft = left; //
      //第一次合并 tempLeft = 0 , right = 1 //  tempLeft = 2  right = 3 // tL=0 ri=3
      //最后一次 tempLeft = 0  right = 7
      while(tempLeft <= right) {
         arr[tempLeft] = temp[t];
         t += 1;
         tempLeft += 1;
      }

   }
}
```
<!-- endtab -->

<!-- tab 基数排序 -->
```java
package com.hero.sort;

/*
    @author Heroxin
    @create 2022-11-02-17:27

    @Description: 基数排序
*/


import java.util.Arrays;

public class Radix {

    public static void main(String[] args) {
        int arr[] = {1, -3, 5, 2, 16, 10};
        radixSort(arr);
        System.out.println(Arrays.toString(arr));

    }

    //基数排序方法
    public static void radixSort(int[] arr) {

        //根据前面的推导过程，我们可以得到最终的基数排序代码

        //1. 得到数组中最大的数的位数
        int max = arr[0]; //假设第一数就是最大数
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                max = arr[i];
            }
        }
        //得到最大数是几位数
        int maxLength = (max + "").length();


        //定义一个二维数组，表示10个桶, 每个桶就是一个一维数组
        //说明
        //1. 二维数组包含10个一维数组
        //2. 为了防止在放入数的时候，数据溢出，则每个一维数组(桶)，大小定为arr.length
        //3. 名明确，基数排序是使用空间换时间的经典算法
        int[][] bucket = new int[10][arr.length];

        //为了记录每个桶中，实际存放了多少个数据,我们定义一个一维数组来记录各个桶的每次放入的数据个数
        //可以这里理解
        //比如：bucketElementCounts[0] , 记录的就是  bucket[0] 桶的放入数据个数
        int[] bucketElementCounts = new int[10];


        //这里我们使用循环将代码处理

        for (int i = 0, n = 1; i < maxLength; i++, n *= 10) {
            //(针对每个元素的对应位进行排序处理)， 第一次是个位，第二次是十位，第三次是百位..
            for (int j = 0; j < arr.length; j++) {
                //取出每个元素的对应位的值
                int digitOfElement = arr[j] / n % 10;
                //放入到对应的桶中
                bucket[digitOfElement][bucketElementCounts[digitOfElement]] = arr[j];
                bucketElementCounts[digitOfElement]++;
            }
            //按照这个桶的顺序(一维数组的下标依次取出数据，放入原来数组)
            int index = 0;
            //遍历每一桶，并将桶中是数据，放入到原数组
            for (int k = 0; k < bucketElementCounts.length; k++) {
                //如果桶中，有数据，我们才放入到原数组
                if (bucketElementCounts[k] != 0) {
                    //循环该桶即第k个桶(即第k个一维数组), 放入
                    for (int l = 0; l < bucketElementCounts[k]; l++) {
                        //取出元素放入到arr
                        arr[index++] = bucket[k][l];
                    }
                }
                //第i+1轮处理后，需要将每个 bucketElementCounts[k] = 0 ！！！！
                bucketElementCounts[k] = 0;

            }

        }


    }
}
```
<!-- endtab -->

<!-- tab 堆排序 -->

```java
package com.hero.tree;

/*
    @author Heroxin
    @create 2022-11-18-11:34

    @Description: 堆排序
    介绍：
            1. 堆排序是完全二叉树
            2. 大顶堆：每个节点的值都大于它左右节点的值，适用于升序排序
            2. 小顶堆：每个节点的值都小于它左右节点的值，适用于降序排序
      基本思想：
            1. 将待排序数组构造成一个大顶堆/小顶堆
            2. 将根节点与末端最大/最小节点进行交换，这样，最大值/最小值就在数组的最后一位了
            3. 调整堆结构后，重复第二步
       实现步骤：
            1. 将待排序数组按顺序二叉树存储
            2. 按从下至上，从左至右的顺序，调整第一个非叶子几点，使它所在的二叉树满足堆排序
                (arr.length / 2 - 1 : 第一个非叶子节点)
            3. 接着调整第二个非叶子节点
            4. 然后回来查看第 3 步操作是否打乱第 2 步调整好的堆排序
            5. 循环往复，就将待排序数组调整为堆结构
            6. 将根节点与末端最大/最小节点进行交换，调整后的最大/最小值不动，继续调整堆结构
            7. 循环往复，这样就排序好了，按顺序二叉树输出
*/

import java.util.Arrays;

public class HeapSort {
    public static void main(String[] args) {
        int[] arr = {4, 6, 5, 8, 9};
        heapSort(arr);
    }

    //    堆排序方法
    public static void heapSort(int[] arr) {
        System.out.println("堆排序:");

//        将顺序二叉树调整为堆结构
        for (int i = arr.length / 2 - 1; i >= 0; i--) {
            adjustHeap(arr, i, arr.length);
        }

        for (int i = arr.length - 1; i > 0; i--) {
            int temp = arr[i];
            arr[i] = arr[0];
            arr[0] = temp;
            adjustHeap(arr, 0, i);
        }
        System.out.println(Arrays.toString(arr));
    }
//    将数组调整为大顶堆结构

    /**
     * @param arr    待排序的数组
     * @param i      非叶子节点在数组中的索引下标
     * @param length 待排序的数组长度，因为已排好序的元素不进行排序
     */
    public static void adjustHeap(int[] arr, int i, int length) {
//        临时变量，存储当前 i 值
        int temp = arr[i];
//        调整堆
//        k 指向 i 的左子节点
        for (int k = 2 * i + 1; k < length; k = k * 2 + 1) {
//            判断左子节点和右子节点的大小
            if (arr[k] < arr[k + 1] && k + 1 < length) {
//                k  指向右节点
                k++;
            }
            if (arr[k] > temp) {
//                交换值，使大值为父节点，满足大顶堆条件
                arr[i] = arr[k];
//                i 指向 k ，此时，已经调整好 i 为父节点的堆结构
                i = k;
            } else {
                break;
            }
        }
//        更新小值
        arr[i] = temp;
    }
}

```



<!-- endtab -->

{% endtabs %}

