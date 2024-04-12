用户登录



1. 用户提交登录信息（用户名、密码、验证码、UUID）

2. 验证码校验

   - 验证码功能是否开启

   - 验证码是否存在缓存当中（“captcha_codes:”+UUID）

     ```java
     String verifyKey = CacheConstants.CAPTCHA_CODE_KEY + StringUtils.nvl(uuid, "");
     String captcha = redisCache.getCacheObject(verifyKey);
     redisCache.deleteObject(verifyKey);
     ```

     

     - false：验证码过期

       ```java
       if (captcha == null) {
           AsyncManager.me().execute(AsyncFactory.recordLogininfor(username, Constants.LOGIN_FAIL, MessageUtils.message("user.jcaptcha.expire")));
           throw new CaptchaExpireException();
       }
       ```

       

     - true：验证码是否一致

       ```java
       if (!code.equalsIgnoreCase(captcha)) {
           AsyncManager.me().execute(AsyncFactory.recordLogininfor(username, Constants.LOGIN_FAIL, MessageUtils.message("user.jcaptcha.error")));
           throw new CaptchaException();
       }
       ```

       

