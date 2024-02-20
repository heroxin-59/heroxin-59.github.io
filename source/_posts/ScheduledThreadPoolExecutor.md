```java
/*
    @Author Heroxin
    
    @Create 2024-01-30-10:25

    @Description: 预算调整列表定时任务
*/

@Component
public class BudgetAdjustmentScheduled {
    @Resource
    private IebBudgetAdjustmentMapper budgetAdjustmentMapper;

    @Scheduled(cron = "0 0 23 * * ? ")   //每天23点执行一次
    public void budgetAdjustmentScheduled() {
//        查找需要操作的数据集合
//        SELECT * FROM ieb_budget_adjustment WHERE flow_status = 'COMPLETED_PASS' and (adjustment_list_status = '3' or adjustment_list_status = '0');
        List<IebBudgetAdjustmentPO> budgetAdjustmentPOList = budgetAdjustmentMapper.selectList(
                new QueryWrapper<IebBudgetAdjustmentPO>()
                        .eq("flow_status", "COMPLETED_PASS")
                        .and(
                                i -> i
                                        .eq("adjustment_list_status", "3")
                                        .or()
                                        .eq("adjustment_list_status", "0")
                        )
        );

        List<IebBudgetAdjustmentPO> errorList = new ArrayList<>();

//        系统调整--预算调整列表状态--调整成功
//            操作人--系统调整
        if (!CollectionUtils.isEmpty(budgetAdjustmentPOList)) {

            for (IebBudgetAdjustmentPO budgetAdjustmentPO : budgetAdjustmentPOList) {
                int update = 0;
                try {
                    budgetAdjustmentPO.setLastModifiedBy("系统调整");
                    budgetAdjustmentPO.setLastModifiedDate(new Date());
                    budgetAdjustmentPO.setAdjustmentListStatus(IebBudgetAdjustmentAdjustmentListStatusEnum.ADJUSTMENTLISTSTATUS_2);
                    update = budgetAdjustmentMapper.update(
                            new UpdateWrapper<IebBudgetAdjustmentPO>()
                                    .eq("id", budgetAdjustmentPO.getId())
                    );
                } catch (Exception exception) {
                    exception.printStackTrace();
                } finally {
                    if (update != 1) {
                        errorList.add(budgetAdjustmentPO);
                    }
                }
            }
        }

//        异常队列非空
        if (!CollectionUtils.isEmpty(errorList)) {
            asyncBudgetAdjustmentScheduled(errorList);
        }

    }


    public void asyncBudgetAdjustmentScheduled(List<IebBudgetAdjustmentPO> errorList) {
//        设定同步计时器，如果子线程完成任务，主线程就取消定时任务
        CountDownLatch countDownLatch = new CountDownLatch(1);
//        创建定时任务线程池
        ScheduledThreadPoolExecutor scheduledThreadPoolExecutor = new ScheduledThreadPoolExecutor(errorList.size());
//        每五分钟执行一次
        ScheduledFuture<?> scheduledFuture = scheduledThreadPoolExecutor.scheduleAtFixedRate(
                () -> {
                    new BudgetAdjustmentListTask(errorList, countDownLatch);
                }, 0, 5, TimeUnit.MINUTES
        );

        try {
//            暂停主线程，等待子线程完成任务
            countDownLatch.await();
//            子线程完成任务，停止定时任务
            scheduledFuture.cancel(true);
        } catch (Exception e) {
            e.printStackTrace();
        }finally {
//            关闭线程池
            scheduledThreadPoolExecutor.shutdown();
        }

    }

}

```

```java
/*
    @Author Heroxin
    
    @Create 2024-01-31-17:09

    @Description:
*/

public class BudgetAdjustmentListTask implements Runnable {
    private List<IebBudgetAdjustmentPO> errorList;

    private CountDownLatch countDownLatch;

    public BudgetAdjustmentListTask(List<IebBudgetAdjustmentPO> errorList,CountDownLatch countDownLatch) {
        this.errorList = errorList;
        this.countDownLatch = countDownLatch;
    }

    @Resource
    private IebBudgetAdjustmentMapper budgetAdjustmentMapper;


    @Override
    public void run() {

        for (IebBudgetAdjustmentPO budgetAdjustmentPO : errorList) {
            Integer executeCount = budgetAdjustmentPO.getErrorCount();
            if (executeCount >= 5) {
//                设置操作人
                budgetAdjustmentPO.setLastModifiedBy("系统调整");
//                设置操作时间
                budgetAdjustmentPO.setLastModifiedDate(new Date());
//                设为调整异常
                budgetAdjustmentPO.setAdjustmentListStatus(IebBudgetAdjustmentAdjustmentListStatusEnum.ADJUSTMENTLISTSTATUS_3);

                budgetAdjustmentMapper.update(
                        new UpdateWrapper<IebBudgetAdjustmentPO>()
                                .eq("id", budgetAdjustmentPO.getId()));
                continue;
            }
//            累计操作次数
            budgetAdjustmentPO.setErrorCount(++executeCount);
//            设置操作人
            budgetAdjustmentPO.setLastModifiedBy("系统调整");
//            设置操作时间
            budgetAdjustmentPO.setLastModifiedDate(new Date());
//            设为调整成功
            budgetAdjustmentPO.setAdjustmentListStatus(IebBudgetAdjustmentAdjustmentListStatusEnum.ADJUSTMENTLISTSTATUS_2);
//            保存数据
            int update = budgetAdjustmentMapper.update(
                    new UpdateWrapper<IebBudgetAdjustmentPO>()
                            .eq("id", budgetAdjustmentPO.getId()));
//            移出异常队列
            if (update == 1){
                errorList.remove(budgetAdjustmentPO);
            }
        }

        if (CollectionUtils.isEmpty(errorList)){
            countDownLatch.countDown();
        }

    }
}

```

