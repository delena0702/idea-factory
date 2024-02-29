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
    
    const binder = new WallSurviveTimerView.TimePanelViewBinder(
        document.getElementById('time-panel')!
    );

    binder.setUpdateListener((time: number) => {
        console.warn(time, "Listener");
        binder.syncTime(time);
    });

    binder.setStartEndTime(0, (1 * 60 + 23) * 1000);

    await click_wait();
    console.log(111);
    binder.syncTime(60 * 1000);

    await click_wait();
    console.log(222);
    binder.addTime(1000);

    await click_wait();
    console.log(333);
    console.warn(`각 버튼 및 스킵 활용 가능한지 확인`);
};