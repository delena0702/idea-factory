namespace WallSurviveTimer {
    type Speed = number;
    type Time = number;

    enum EnemyType {
        WARNING = 0,
        PREDICTOR = 1,
        BOSS = 2,
    }

    class EnemyData {
        static readonly data = [
            [EnemyType.PREDICTOR, '5:00', '공생충 => 촉수형제/식충 => 군단숙주', 1],
            [EnemyType.PREDICTOR, '9:00', '자가라의 헤비좀비 => 자가라/질럿 + 메딕 => 감염된 탱크', 2],
            [EnemyType.BOSS, '12:50', '촉수형제 or 군단숙주', 1],
            [EnemyType.WARNING, '19:00', '대공경보', 0],
            [EnemyType.BOSS, '30:00', '자가라 or 감염된 탱크', 2],
            [EnemyType.PREDICTOR, '31:00', '군단충 + 방사능 미친개 => 살모사/피갈리스크 => 오메가리스크', 3],
            [EnemyType.WARNING, '39:00', '공중 유닛 증가', 0],
            [EnemyType.PREDICTOR, '45:00', '변종뮤탈 + 감염된 벤시 => ??/수호군주 => ??', 4],
            [EnemyType.BOSS, '46:40', '살모사 or 오메가리스크', 3],
            [EnemyType.BOSS, '1:03:20', '감염된 토르 or 거대괴수', 4],
            [EnemyType.BOSS, '01:13:30', '브루탈리스크', 5],
        ];
    }

    class Timer {
        tic: number;
        speed: Speed;

        constructor() {
            this.tic = 0;
            this.speed = 1.44;
        }

        setSpeed(speed: Speed): void {

        }

        start(): void {

        }

        pause(): void {

        }

        stop(): void {

        }

        skip(time: Time): void {

        }
    }
}