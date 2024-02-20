---
#文章标题
title: 基于Validation组件自定义注解
#文章创建日期
date: 2023-10-25 10:30:00
#文章更新日期
updated: 2023-10-25 10:30:00
#文章标签
tags: [validation] 
#文章分类
categories: 
	- [知识点]
#文章关键字
keywords: 
#文章描述
description: 
#文章顶部图片
top_img: 
#评论模块，默认true
comments: 
#缩略图，如果没有top_img，文章顶部将显示缩略图

---





> @Validation是一套帮助我们继续对传输的参数进行数据校验的注解，通过配置Validation可以轻松优雅的完成对数据的约束检验。



# 依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```



# 使用方式

在请求方法的参数前面添加@Valid/@Validated注解，表示对该对象模型进行校验

```java
@ResponseBody
@RequestMapping("/doLogin")
public RespBean doLogin(@Valid LoginVo loginVo,HttpServletResponse response,HttpServletRequest request) {
    return userService.doLogin(loginVo,request,response);
}
```

在属性上面定义需要的校验规则

```java
@Data
public class LoginVo {

    @NotNull   // 非空判断
    @IsMobile()  // 自定义注解，判断是否为合法手机号
    private String mobile;
    
    @Email		// 判断邮箱格式是否合法
    private String email;
    
    @NotNull
    private String password;

}
```



# 自定义注解

> Validation组件已经提供了非常丰富的校验注解，但是在实际业务中，难免会碰到一些现有注解不足以校验的情况。这时，我们可以考虑自定义Validation注解。



**基于 Validation 组件自定义注解 @IsMobile 判断是否为合法手机号**



## 第一步

新建一个 `Annotation`类型的类

![](https://heroxin.oss-cn-beijing.aliyuncs.com/img/blog/image-20231025191705505.png)

## 第二步

套用模板：

- 更改`message`内容；
- 添加自定义校验规则类，见第三步（`IsMobileValidator.class`）
- 添加自定义方法
- 其他的保持不动

```java
import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.METHOD, ElementType.FIELD, ElementType.ANNOTATION_TYPE, ElementType.CONSTRUCTOR, ElementType.PARAMETER, ElementType.TYPE_USE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(
        //  校验规则
        validatedBy = {IsMobileValidator.class}
)
public @interface IsMobile {
//    校验错误时返回的信息(必写)
    String message() default "手机号码格式错误";

//    自定义的方法
    boolean required() default true;

//    约束注解在验证时所属的组别（必写）
    Class<?>[] groups() default {};

//    负载（必写）
    Class<? extends Payload>[] payload() default {};
}
```

## 第三步

添加自定义校验规则类（`IsMobileValidator.class`）

实现`ConstraintValidator`

重写`initialize` 与`isValid`方法

`initialize`初始化方法

`isValid`方法中实现具体的校验规则

```java
import com.heroxin.seckill.validator.IsMobile;
import org.thymeleaf.util.StringUtils;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class IsMobileValidator implements ConstraintValidator<IsMobile, String> {
    private static final Pattern mobile_pattern = Pattern.compile("[1]([3-9])[0-9]{9}$");
    private boolean contains = false;

    //   初始化，参数为 IsMobile中自定义方法返回值，用于检验前的检查
    @Override
    public void initialize(IsMobile constraintAnnotation) {
        contains = constraintAnnotation.contains();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext constraintValidatorContext) {
//        value 就是业务中被校验的值
        if (contains) {
//            如果初始化成功，就进行判断
            if (StringUtils.isEmpty(value)) {
                return false;
            }
            Matcher matcher = mobile_pattern.matcher(value);
            return matcher.matches();
        }
        return false;
    }
}
```



## 使用

完成以上步骤就可以使用自定义注解了



# 补充

## `@Valid`VS`@Validated`

1. 当使用仅是注解字段属性并验证规范，`@Validated` 和 `@Valid` 注解的功能是相同的。
2. Spring Validation 验证框架提供了 `@Validated` 注解对参数进行验证，符合**Spring’s JSR-303**规范；而 `@Valid` 注解是 javax 提供的，符合标准的**JSR-303**规范。
3. 在注解的使用上，`@Validated` 注解可以用于类型、方法和参数上；而 `@Valid` 还可以用于属性之上。
4. `@Validated` 注解可以使用分组校验的功能，为同一个对象属性提供不同分组，并根据分组来校验属性参数；而 @Valid 注解不支持分组验证。
5. `@Valid` 注解支持嵌套验证，当类的属性是一个复杂对象时，可以使用 `@Valid` 对该属性对象中的属性同时进行校验；`@Validated` 并不支持在属性上使用。

## 异常

使用 `Validation` 校验异常后，当参数发生异常时，通常可能抛出的为`BindException`异常、`ValidationException`异常(或其子类)和`MethodArgumentNotValidException`异常，可用通过`@ControllerAdvice`+`@ExceptionHandler`来全局处理异常

```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
 
import javax.validation.ConstraintViolationException;
import javax.validation.ValidationException;
import java.util.HashMap;
import java.util.Map;
 

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
 
	
	@ResponseStatus(code = HttpStatus.BAD_REQUEST)
	@ExceptionHandler(value = {BindException.class, ValidationException.class, MethodArgumentNotValidException.class})
	public Map<String, Object> handleParameterVerificationException(Exception e) {
		log.error(" handleParameterVerificationException has been invoked", e);
		Map<String, Object> resultMap = new HashMap<>(4);
		resultMap.put("code", "100001");
		String msg = null;
		if (e instanceof MethodArgumentNotValidException) {
			BindingResult bindingResult = ((MethodArgumentNotValidException) e).getBindingResult();
			// getFieldError获取的是第一个不合法的参数(P.S.如果有多个参数不合法的话)
			FieldError fieldError = bindingResult.getFieldError();
			if (fieldError != null) {
				msg = fieldError.getDefaultMessage();
			}
		} else if (e instanceof BindException) {
			// getFieldError获取的是第一个不合法的参数(P.S.如果有多个参数不合法的话)
			FieldError fieldError = ((BindException) e).getFieldError();
			if (fieldError != null) {
				msg = fieldError.getDefaultMessage();
			}
		} else if (e instanceof ConstraintViolationException) {
			/*
			 * ConstraintViolationException的e.getMessage()形如
			 *     {方法名}.{参数名}: {message}
			 *  这里只需要取后面的message即可
			 */
			msg = e.getMessage();
			if (msg != null) {
				int lastIndex = msg.lastIndexOf(':');
				if (lastIndex >= 0) {
					msg = msg.substring(lastIndex + 1).trim();
				}
			}
			/// ValidationException 的其它子类异常
		} else {
			msg = "处理参数时异常";
		}
		resultMap.put("msg", msg);
		return resultMap;
	}
    
}
```



# 参考



[SpringBoot怎么使用Validation校验参数,看完你就会了@](https://blog.csdn.net/m0_49496327/article/details/124121696)

[SpringBoot使用Validation校验参数](https://blog.csdn.net/justry_deng/article/details/86571671)

[自定义注解参数校验](https://www.bilibili.com/video/BV1sf4y1L7KE?p=10)