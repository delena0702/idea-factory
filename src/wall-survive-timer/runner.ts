async function click_wait(): Promise<void> {
    await new Promise((res, rej) => {
        window.onclick = () => {
            res(0);
            window.onload = null;
        };
    });
}

window.onload = async () => {
    // const binder = new WallSurviveTimerView.TimelineViewBinder(
    //     document.getElementById('timeline')!
    // );

    // await click_wait();
    // console.log(111);
    // binder.setStartEndTime(0, (1 * 60 + 23) * 1000);

    // await click_wait();
    // console.log(222);
    // binder.setTime(46 * 1000);

    // await click_wait();
    // console.log(333);
    // binder.setEnemyInfo(
    //     [
    //         [13600, WallSurviveTimerView.TimelineViewBinder.PREDICT],
    //         [23600, WallSurviveTimerView.TimelineViewBinder.BOSS],
    //         [33600, WallSurviveTimerView.TimelineViewBinder.WARNING],
    //     ]
    // );
    
    // const binder2 = new WallSurviveTimerView.TimePanelViewBinder(
    //     document.getElementById('time-panel')!
    // );

    // binder2.setUpdateListener((time: number) => {
    //     console.warn(time, "Listener");
    //     binder2.syncTime(time);
    // });

    // binder2.setStartEndTime(0, (1 * 60 + 23) * 1000);

    // await click_wait();
    // console.log(111);
    // binder2.syncTime(60 * 1000);

    // await click_wait();
    // console.log(222);
    // binder2.addTime(1000);

    // await click_wait();
    // console.log(333);
    // console.warn(`각 버튼 및 스킵 활용 가능한지 확인`);

    const binder3 = new WallSurviveTimerView.ScheduleRowViewBinder(
        document.getElementById('schedule-table')!
    );

    binder3.setTime((1 * 3600 + 23 * 60 + 45) * 1000);
    console.warn(`binder3.setTime`);
    await click_wait();

    binder3.setInfo(2 * 3600 * 1000, [
        ['111', '111 예지'],
        ['222', '222 예지'],
    ]);
    console.warn(`binder3.setInfo`);
    await click_wait();

    binder3.setMode(WallSurviveTimerView.ScheduleRowMode.PREDICT_NO_SELECT);
    console.warn(`binder3.setMode(WallSurviveTimerView.ScheduleRowMode.PREDICT_NO_SELECT);`);
    await click_wait();

    binder3.setMode(WallSurviveTimerView.ScheduleRowMode.PREDICT_SELECT);
    console.warn(`binder3.setMode(WallSurviveTimerView.ScheduleRowMode.PREDICT_SELECT);`);
    await click_wait();

    binder3.setMode(WallSurviveTimerView.ScheduleRowMode.BOSS_NO_SELECT);
    console.warn(`binder3.setMode(WallSurviveTimerView.ScheduleRowMode.BOSS_NO_SELECT);`);
    await click_wait();

    binder3.setMode(WallSurviveTimerView.ScheduleRowMode.BOSS_SELECT);
    console.warn(`binder3.setMode(WallSurviveTimerView.ScheduleRowMode.BOSS_SELECT);`);
    await click_wait();

    binder3.setMode(WallSurviveTimerView.ScheduleRowMode.PREDICT_NO_SELECT);
    console.warn(`버튼 동작 여부 확인`);
    await click_wait();
};