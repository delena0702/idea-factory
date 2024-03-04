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



    // const binder3 = new WallSurviveTimerView.ScheduleRowViewBinder(
    //     document.getElementById('template-schedule-row')!
    // );

    // binder3.setInfo([1 * 3600 * 1000, 2 * 3600 * 1000], [
    //     ['111', '111 예지', ['T1', 'T2']],
    //     ['222', '222 예지', ['T1', 'T3', 'T4']],
    // ]);
    // binder3.setTime((1 * 3600 + 23 * 60 + 45) * 1000);
    // console.warn(`binder3.setTime`);
    // await click_wait();

    // binder3.setMode(WallSurviveTimerView.ScheduleRowMode.PREDICT_NO_SELECT);
    // console.warn(`binder3.setMode(WallSurviveTimerView.ScheduleRowMode.PREDICT_NO_SELECT);`);
    // await click_wait();

    // binder3.setMode(WallSurviveTimerView.ScheduleRowMode.PREDICT_SELECT);
    // console.warn(`binder3.setMode(WallSurviveTimerView.ScheduleRowMode.PREDICT_SELECT);`);
    // await click_wait();

    // binder3.setMode(WallSurviveTimerView.ScheduleRowMode.BOSS_NO_SELECT);
    // console.warn(`binder3.setMode(WallSurviveTimerView.ScheduleRowMode.BOSS_NO_SELECT);`);
    // await click_wait();

    // binder3.setMode(WallSurviveTimerView.ScheduleRowMode.BOSS_SELECT);
    // console.warn(`binder3.setMode(WallSurviveTimerView.ScheduleRowMode.BOSS_SELECT);`);
    // await click_wait();

    // binder3.setMode(WallSurviveTimerView.ScheduleRowMode.PREDICT_NO_SELECT);
    // console.warn(`시간 경과 변화 확인`);
    // await click_wait();

    // binder3.setTime(2 * 3600 * 1000 + 12);
    // console.warn(`시간 경과 변화 완료`);
    // await click_wait();

    // binder3.setTime((1 * 3600 + 23 * 60 + 45) * 1000);
    // binder3.setMode(WallSurviveTimerView.ScheduleRowMode.PREDICT_SELECT);
    // console.warn(`시간 경과 변화 확인`);
    // await click_wait();

    // binder3.setTime(2 * 3600 * 1000 + 12);
    // console.warn(`시간 경과 변화 완료`);
    // await click_wait();

    // binder3.setTime(0);
    // console.warn(`시간 이전으로 사라짐 확인`);
    // await click_wait();

    // binder3.setTime(2 * 3600 * 1000 + 12);
    // console.warn(`시간 경과로 출력 확인`);
    // await click_wait();

    // binder3.setTime((1 * 3600 + 23 * 60 + 45) * 1000);
    // binder3.setMode(WallSurviveTimerView.ScheduleRowMode.PREDICT_NO_SELECT);
    // console.warn(`버튼 동작 여부 확인`);
    // await click_wait();

    

    const binder4 = new WallSurviveTimerView.SchedulTableViewBinder(
        document.getElementById('schedule-table')!
    );

    binder4.addRowFromData([
        [
            WallSurviveTimer.EnemyType.WARNING,
            [2000, 4000, 6000],
            [
                ['11', '', []],
                ['', '', []],
            ]
        ],

        [
            WallSurviveTimer.EnemyType.BOSS,
            [1000, 3000, 5000],
            [
                ['11', '11 예측', ['T1', 'T2', 'T3']],
                ['22', '22 예측', ['T11', 'T22', 'T33']],
            ]
        ],
    ]);

    for (let time = 0; time <= 7000; time += 1000) {
        binder4.setTime(time);
        console.warn(`binder4.setTime(${time});`);
        await click_wait();
    }
};