// windowの横幅を取得
function window_load(){
    var sW;
    sW = document.getElementById('app').clientWidth;
    return sW;
}

// windowの読み込み
window_width = window_load();
// pixi.jsの横幅と縦幅
field_width = window_width*0.65; // 倍率[0.65]
field_height = window_width*0.54; // 倍率[0.54]
// 文字の倍率
ScaleMOJI = field_width/700;

// pixi.jsのアプリケーションを作成
const app = new PIXI.Application({
    width: field_width,
    height: field_height,
    backgroundColor: 0xa8bf93, // 背景色
    resolution: window.devicePixelRatio || 1,
    autoResize: true,
});
// stageに追加
document.getElementById('app').appendChild(app.view);

// 変数の初期値
let ModeJudge = 0; // [1実験][2グラフ][3メモ][4説明]のどのボタンを選んだか
let sumEx = 0; // 実験の合計回数
let sumPh = 0; // 当該事象の起こった回数
let SelectedRED = 0; // 赤玉が選ばれた個数
let SelectedYELLOW = 0; // 黄玉が選ばれた個数
let Count_checkBall = [0,0,0,0,0,0]; // ボールをタップした回数を記録
let sum_Count_checkBall = 0; // 選択したボールの個数
var probTrans = []; // 確率を格納
var probTransBUNSHI = []; // 確率の分子を格納
let Count_clickL = 0; // グラフで左三角が押された回数
let Count_clickR = 0; // グラフで右三角が押された回数
let NumberPeople = 0; // 何人部屋に入ったかの変数

// [1実験]用のコンテナ
const Experiment = new PIXI.Container();
app.stage.addChild(Experiment);
// [2グラフ]用のコンテナ
const Graph = new PIXI.Container();
app.stage.addChild(Graph);
// [3メモ]用のコンテナ
const Memo = new PIXI.Container();
app.stage.addChild(Memo);
// [4説明]用のコンテナ
const Explain = new PIXI.Container();
app.stage.addChild(Explain);

// [1実験-袋]用のコンテナ
const Experiment_Bag = new PIXI.Container();
app.stage.addChild(Experiment_Bag);
// [1実験-ボール]用のコンテナ
const Experiment_Ball = new PIXI.Container();
app.stage.addChild(Experiment_Ball);
// [1実験-ノート]用のコンテナ
const Experiment_Note = new PIXI.Container();
app.stage.addChild(Experiment_Note);
// [1実験-回数等表示]用のコンテナ
const Experiment_Message = new PIXI.Container();
app.stage.addChild(Experiment_Message);
// [1実験-SELECTボタン]用のコンテナ
const Experiment_SELECT = new PIXI.Container();
app.stage.addChild(Experiment_SELECT);
// [1実験-ボール選択後]用のコンテナ
const Experiment_PostBall = new PIXI.Container();
app.stage.addChild(Experiment_PostBall);

// [2グラフ-プロット]用のコンテナ
const Graph_PLOT = new PIXI.Container();
app.stage.addChild(Graph_PLOT);
// [2グラフ-プロットタグ]用のコンテナ
const Graph_PLOTtag = new PIXI.Container();
app.stage.addChild(Graph_PLOTtag);

// タグの説明（最初開いた時用）
const tagHow = new PIXI.Sprite.from('Birth4_tagHow_re.png');
tagHow.x = field_width*0.1; // 横座標の設定
tagHow.y = (field_height-((1125*field_width)*0.8/1626))/2; // 縦座標の設定
tagHow.width = field_width*0.8;
tagHow.height = (1125*field_width)*0.8/1626; // 画像の比率から計算
app.stage.addChild(tagHow);


// [ModeJudge]の値によって表示するものを変える
function makeRightField(ModeJudge){
    // [実験]
   if(ModeJudge==1){
       // 実験画面の表示
       makeExperimentField();
   }
   // [グラフ]
   else if(ModeJudge==2){
       // グラフ画面の表示
       makeGraphField();
   }
   // [メモ]
   else if(ModeJudge==3){
       // メモ画面の表示
       makeMemoField();
   }
   else if(ModeJudge==4){
       app.stage.removeChild(tagHow); // タグの説明の消去
       Experiment.removeChildren();
       Graph.removeChildren();
       Memo.removeChildren();
       Experiment_Bag.removeChildren();
       Experiment_Ball.removeChildren();
       Experiment_Message.removeChildren();
       Experiment_Note.removeChildren();
       Experiment_PostBall.removeChildren();
       Experiment_SELECT.removeChildren();
       Graph_PLOT.removeChildren();
       Graph_PLOTtag.removeChildren();
       // 背景
       const ExplainBack = new PIXI.Graphics();
       ExplainBack.x = 0;          // 横座標の設定
       ExplainBack.y = 0;          // 縦座標の設定
       ExplainBack.beginFill(0xa8bf93);
       ExplainBack.drawRect(0,0,field_width,field_height); // 矩形を描写する
       ExplainBack.endFill();
       Explain.addChild(ExplainBack); // ステージに追加する
       // タグの説明
       const tagHow2 = new PIXI.Sprite.from('/picture/Birth4_tagHow_re.png');
       tagHow2.x = field_width*0.1; // 横座標の設定
       tagHow2.y = (field_height-((1125*field_width)*0.8/1626))/2; // 縦座標の設定
       tagHow2.width = field_width*0.8;
       tagHow2.height = (1125*field_width)*0.8/1626; // 画像の比率から計算
       Explain.addChild(tagHow2);
   }
   // [N人誕生日部屋]
   else if(ModeJudge==19){
       // グラフ画面の表示
       BirthExperimentField(19);
   }
   else if(ModeJudge==23){
       // グラフ画面の表示
       BirthExperimentField(23);
   }
   else if(ModeJudge==29){
       // グラフ画面の表示
       BirthExperimentField(29);
   }
   else if(ModeJudge==31){
       // グラフ画面の表示
       BirthExperimentField(31);
   }
   else if(ModeJudge==37){
       // グラフ画面の表示
       BirthExperimentField(37);
   }
   else if(ModeJudge==41){
       // グラフ画面の表示
       BirthExperimentField(41);
   }
   else if(ModeJudge==80){
       // グラフ画面の表示
       BirthExperimentField(80);
   }
   else if(ModeJudge==120){
       // グラフ画面の表示
       BirthExperimentField(120);
   }
}
// [計算]で表示する確率の配列
var Birthprobtrans = []; // 人数に応じた誕生日の同じ人がいる確率を格納
for(i=0;i<121;i++){ // 120人までの確率を計算
    Birthprobtrans[i] = CalculateTeoVal(i);
}
// [計算]で表示する誕生日の確率の理論値
function CalculateTeoVal(n){ // n人の集団に同じ誕生日の人がいる確率
    let AllCombination = 0; // ある集団の誕生日の組合せの全通り
    let DifCombination = 1; // ある集団の全員が異なる誕生日になる組合せ
    let SameBirthProb = 0; // ある集団の中に同じ誕生日の人がいる確率

    AllCombination = 365**n; // n人それぞれに365日ずつ誕生日の選び方がある
    for(i=0;i<n;i++){
        DifCombination *= 365-i; // n人の誕生日がすべて異なる選び方
    }
    SameBirthProb = Math.round(((AllCombination-DifCombination)/AllCombination)*1000)/1000; // 小数第3位
    return SameBirthProb;
}
// [計算]で表示するグラフのプロットの絵画
function BirthGraphPlot(PROBlength){ // PROBlengthは格納されている確率の個数
    Graph_PLOT.removeChildren();
    // (0,0)の座標
    let x00 = field_width*0.02;
    let y00 = field_height*0.932;
    // (0,1)の座標
    let y01 = field_height*0.475;
    // 実験回数21回までのセットが何回繰り返されているか(縮尺調整)
    let plotScale = Math.ceil(PROBlength/21);
    if(plotScale==0){ // 0で割ることを防ぐために
        plotScale = 1;
    }
    // (0,0)のプロット
    const PROBplot0 = new PIXI.Graphics();
    PROBplot0.x = x00;
    PROBplot0.y = y00;
    PROBplot0.beginFill(0xc7dc68);
    PROBplot0.drawCircle(0,0,(field_width*0.01)/plotScale); // (中心x,中心y,半径)
    PROBplot0.endFill();
    Graph_PLOT.addChild(PROBplot0);
    // それ以外のプロット
    for(i=0;i<PROBlength;i++){ // 格納された個数分
        const PROBplot = new PIXI.Graphics();
        PROBplot.x = x00 + (field_width*0.04*(i+1))/plotScale;
        PROBplot.y = y00 - (y00-y01)*Birthprobtrans[i];
        PROBplot.beginFill(0xc3d825);
        PROBplot.drawCircle(0,0,(field_width*0.01)/plotScale); // (中心x,中心y,半径)
        PROBplot.endFill();
        Graph_PLOT.addChild(PROBplot);
        // プロットをつなぐ
        const conectPlot = new PIXI.Graphics();
        if(i==0){
            conectPlot.lineStyle(2,0xc3d825).moveTo(x00,y00).lineTo(PROBplot.x,PROBplot.y);
        }else{
            conectPlot.lineStyle(2,0xc3d825).moveTo(x00+(field_width*0.04*(i))/plotScale, y00-(y00-y01)*Birthprobtrans[i-1]).lineTo(PROBplot.x,PROBplot.y);
        }
        Graph_PLOT.addChild(conectPlot);
    }
    // 特定の値から軸に垂線を下ろす
    BirthGraphPlot_XYtag(x00, y00, y01, PROBlength, plotScale);
}
// [計算]の特定の点の軸と確率
function BirthGraphPlot_XYtag(x00, y00, y01, times, plotScale){ // times回目から垂線を下ろす
    Graph_PLOTtag.removeChildren();
    // 特定の点から横軸へ下りる垂線
    const conectLastPlot_X = new PIXI.Graphics();
    conectLastPlot_X.lineStyle(1,0xc3d825).moveTo(x00+(field_width*0.04*(times))/plotScale,y00-(y00-y01)*Birthprobtrans[times-1]).lineTo(x00+(field_width*0.04*(times))/plotScale,y00);
    Graph_PLOTtag.addChild(conectLastPlot_X);
    // 特定の点から下ろした垂線の足の座標
    if(!(times==0)){ // 実験回数0回のときはプロットしない
        let Message_plotX = new PIXI.Text(times-1);
        Message_plotX.x = x00+(field_width*0.04*(times))/plotScale;
        Message_plotX.y = y00;
        Message_plotX.width *= ScaleMOJI;
        Message_plotX.height *= ScaleMOJI;
        Message_plotX.style.fill = 0xc3d825;
        Message_plotX.style.fontWeight = "bolder";
        Graph_PLOTtag.addChild(Message_plotX);
    }
    // 特定の点の確率(小数)
    let Message_plotProbSHOUSU = new PIXI.Text(Birthprobtrans[times-1]);
    Message_plotProbSHOUSU.x = x00+(field_width*0.04*(times))/plotScale;
    Message_plotProbSHOUSU.y = y00-(y00-y01)*Birthprobtrans[times-1]-field_height*0.09;
    Message_plotProbSHOUSU.width *= ScaleMOJI/1.2;
    Message_plotProbSHOUSU.height *= ScaleMOJI/1.2;
    Message_plotProbSHOUSU.style.fill = 0xc3d825;
    Message_plotProbSHOUSU.style.fontWeight = "bolder";
    Graph_PLOTtag.addChild(Message_plotProbSHOUSU);
}
// [グラフ左三角]を押したとき
function BirthclickL(){
    Count_clickL += 1;
    // 実験回数21回までのセットが何回繰り返されているか(縮尺調整)
    let plotScale = Math.ceil(Birthprobtrans.length/21);
    if(plotScale==0){ // 0で割ることを防ぐために
        plotScale = 1;
    }
    // x00などの変数を手打ちしているので変更の際は注意
    if((Count_clickL-Count_clickR)>=0 && (Count_clickL-Count_clickR)<=(Birthprobtrans.length-1)){ // 実験回数を超えず0回も下回らないとき
        BirthGraphPlot_XYtag(field_width*0.02,field_height*0.932,field_height*0.475,Birthprobtrans.length-(Count_clickL-Count_clickR),plotScale);
    }else if((Count_clickL-Count_clickR)<0 || (Count_clickL-Count_clickR)>(Birthprobtrans.length-1)){ // 実験回数を越すor0回を下回るとき
        Count_clickL -= 1;
    }
}
// [グラフ右三角]を押したとき
function BirthclickR(){
    Count_clickR += 1;
    // 実験回数21回までのセットが何回繰り返されているか(縮尺調整)
    let plotScale = Math.ceil(Birthprobtrans.length/21);
    if(plotScale==0){ // 0で割ることを防ぐために
        plotScale = 1;
    }
    // x00などの変数を手打ちしているので変更の際は注意
    if((Count_clickR-Count_clickL)<=0 && (Count_clickR-Count_clickL)>=(1-Birthprobtrans.length)){ // 実験回数を超えず0回も下回らないとき
        BirthGraphPlot_XYtag(field_width*0.02,field_height*0.932,field_height*0.475,Birthprobtrans.length+(Count_clickR-Count_clickL),plotScale);
    }else if((Count_clickR-Count_clickL)>0 || (Count_clickR-Count_clickL)<(1-Birthprobtrans.length)){ // 実験回数を越すor0回を下回るとき
        Count_clickR -= 1;
    }
}
// [計算]を押したときにグラフのフィールドを作る
function makeGraphField(){
    app.stage.removeChild(tagHow); // タグの説明の消去
    Experiment.removeChildren(); // [1実験]消去
    Memo.removeChildren(); // [3メモ]消去
    Explain.removeChildren(); // [4説明]消去
    Experiment_Bag.removeChildren(); // 袋の消去
    Experiment_Ball.removeChildren(); // ボールの消去
    Experiment_PostBall.removeChildren(); // ボールの消去
    Experiment_SELECT.removeChildren(); // SELECTボタンの消去
    Experiment_Message.removeChildren(); // 回数や確率の消去
    Experiment_Note.removeChildren(); // ノート関連を消去
    
    Count_clickL = 0; // 左三角の回数初期化
    Count_clickR = 0; // 右三角の回数初期化
    // 背景
    const GraphBack = new PIXI.Graphics();
    GraphBack.x = 0;          // 横座標の設定
    GraphBack.y = 0;          // 縦座標の設定
    GraphBack.beginFill(0x243243);
    GraphBack.drawRect(0,0,field_width,field_height);  // 矩形を描写する
    GraphBack.endFill();
    Graph.addChild(GraphBack); // ステージに追加する
    // グラフ軸
    const GrBack = new PIXI.Sprite.from('/picture/Birth4_GrBack.png');
    GrBack.x = 0; // 横座標の設定
    GrBack.y = field_height*0.4; // 縦座標の設定
    GrBack.width = field_width*0.99;
    GrBack.height = field_height*0.55; // 画像の比率から計算
    Graph.addChild(GrBack);
    // 縦軸タイトル
    const GrBackYtag = new PIXI.Sprite.from('/picture/LLN5_GrYtag.png');
    GrBackYtag.x = 0; // 横座標の設定
    GrBackYtag.y = field_height*0.37; // 縦座標の設定
    GrBackYtag.width = field_width*0.08;
    GrBackYtag.height = field_height*0.07; // 画像の比率から計算
    Graph.addChild(GrBackYtag);
    // 横軸タイトル
    const GrBackXtag = new PIXI.Sprite.from('/picture/Birth4_GrXtag.png');
    GrBackXtag.x = field_width*0.9; // 横座標の設定
    GrBackXtag.y = field_height*0.9; // 縦座標の設定
    GrBackXtag.width = field_width*0.08;
    GrBackXtag.height = field_height*0.07; // 画像の比率から計算
    Graph.addChild(GrBackXtag);
    // 理論値ライン
    const GrBackLine = new PIXI.Sprite.from('/picture/Birth4_GrBackLine.png');
    GrBackLine.x = field_width*0.9; // 横座標の設定
    GrBackLine.y = field_height*0.65; // 縦座標の設定
    GrBackLine.width = field_width*0.1;
    GrBackLine.height = GrBackLine.width*220/210; // 画像の比率から計算
    Graph.addChild(GrBackLine);
    // 目盛り「1」
    const GrPROB1 = new PIXI.Sprite.from('/picture/LLN5_Gr1.png');
    GrPROB1.x = field_width*0.01; // 横座標の設定
    GrPROB1.y = field_height*0.42; // 縦座標の設定
    GrPROB1.width = field_width*0.05;
    GrPROB1.height = GrPROB1.width*96/89; // 画像の比率から計算
    Graph.addChild(GrPROB1);
    // 目盛り「0」
    const GrPROB0 = new PIXI.Sprite.from('/picture/LLN5_Gr0.png');
    GrPROB0.x = field_width*0.001; // 横座標の設定
    GrPROB0.y = field_height*0.94; // 縦座標の設定
    GrPROB0.width = field_width*0.05;
    GrPROB0.height = GrPROB0.width*96/89; // 画像の比率から計算
    Graph.addChild(GrPROB0);
    // [詳細表示の変更]
    const GrTRtitle = new PIXI.Sprite.from('/picture/LLN5_GrTRtitle.png');
    GrTRtitle.x = field_width*0.06; // 横座標の設定
    GrTRtitle.y = field_height*0.1; // 縦座標の設定
    GrTRtitle.width = field_width*0.4;
    GrTRtitle.height = GrTRtitle.width*97/630; // 画像の比率から計算
    Graph.addChild(GrTRtitle);
    // [左三角]
    const GrTRleft = new PIXI.Sprite.from('/picture/LLN5_GrTRleft.png');
    GrTRleft.x = field_width*0.06; // 横座標の設定
    GrTRleft.y = field_height*0.2; // 縦座標の設定
    GrTRleft.width = field_width*0.1;
    GrTRleft.height = GrTRleft.width*183/184; // 画像の比率から計算
    Graph.addChild(GrTRleft);
    GrTRleft.interactive = true;
    GrTRleft.buttonMode = true;
    GrTRleft.on("pointertap", BirthclickL);
    // [右三角]
    const GrTRright = new PIXI.Sprite.from('/picture/LLN5_GrTRright.png');
    GrTRright.x = field_width*0.365; // 横座標の設定
    GrTRright.y = field_height*0.2; // 縦座標の設定
    GrTRright.width = field_width*0.1;
    GrTRright.height = GrTRright.width; // 画像の比率から計算
    Graph.addChild(GrTRright);
    GrTRright.interactive = true;
    GrTRright.buttonMode = true;
    GrTRright.on("pointertap", BirthclickR);
    // グラフのプロット
    BirthGraphPlot(Birthprobtrans.length);

    // ノート
    const ExNote = new PIXI.Sprite.from('/picture/LLN5_ExNote.png');
    ExNote.x = field_width*0.428; // 横座標の設定
    ExNote.y = 0; // 縦座標の設定
    ExNote.width = field_width*0.645;
    ExNote.height = field_height*0.3;
    Graph.addChild(ExNote);
    // ノート文字
    const ExNote1 = new PIXI.Sprite.from('/picture/Birth4_NoteALL_Gr.png');
    ExNote1.x = field_width*0.6; // 横座標の設定
    ExNote1.y = field_height*0.039; // 縦座標の設定
    ExNote1.width = field_width*0.355;
    ExNote1.height = ExNote1.width*327/614; // 画像の比率から計算
    Graph.addChild(ExNote1);
    // [小数第４位で四捨五入]の表示
    const ExNote2 = new PIXI.Sprite.from('/picture/Birth4_GrHosoku.png');
    ExNote2.x = field_width*0.6; // 横座標の設定
    ExNote2.y = field_height*0.3; // 縦座標の設定
    ExNote2.width = field_width*0.35;
    ExNote2.height = ExNote2.width*98/630; // 画像の比率から計算
    Graph.addChild(ExNote2);
}
// [メモ]を押したときにメモのフィールドを作る
function makeMemoField(){
    app.stage.removeChild(tagHow); // タグの説明の消去
    Experiment.removeChildren();
    Experiment_Bag.removeChildren();
    Experiment_Ball.removeChildren();
    Experiment_Message.removeChildren();
    Experiment_Note.removeChildren();
    Experiment_PostBall.removeChildren();
    Experiment_SELECT.removeChildren();
    Graph.removeChildren();
    Graph_PLOT.removeChildren();
    Graph_PLOTtag.removeChildren();
    Explain.removeChildren();
    // 背景
    const MemoBack = new PIXI.Graphics();
    MemoBack.x = 0;          // 横座標の設定
    MemoBack.y = 0;          // 縦座標の設定
    MemoBack.beginFill(0x696969);
    MemoBack.drawRect(0,0,field_width,field_height);  // 矩形を描写する
    MemoBack.endFill();
    Memo.addChild(MemoBack); // ステージに追加する
    // メモのポイント
    const memoPoint = new PIXI.Sprite.from('/picture/Birth4_Memo_point.png');
    memoPoint.x = field_width*0.1; // 横座標の設定
    memoPoint.y = (field_height-((1029*field_width)*0.8/1580))/2; // 縦座標の設定
    memoPoint.width = field_width*0.8;
    memoPoint.height = (1029*field_width)*0.8/1580; // 画像の比率から計算
    Memo.addChild(memoPoint);
}
// 365日分の誕生日を格納
var BIRTHDAY = [];
for(m=1;m<13;m++){ // 1月から12月まで
    if(m==1||m==3||m==5||m==7||m==8||m==10||m==12){ // 31日まである月は
        for(d=1;d<32;d++){ // 1日から31日まで
            BIRTHDAY.push(m+"/"+d);
        }
    }else if(m==2){ // 2月だけは
        for(d=1;d<29;d++){ // 1日から28日まで
            BIRTHDAY.push(m+"/"+d);
        }
    }else if(m==4||m==6||m==9||m==11){ // 30日までの月は
        for(d=1;d<31;d++){ // 1日から30日まで
            BIRTHDAY.push(m+"/"+d);
        }
    }
}
// [N人の部屋]に入ったとき
function BirthExperimentField(n){ // nは人数
    app.stage.removeChild(tagHow); // タグの説明の消去
    Graph.removeChildren(); // [2グラフ]消去
    Graph_PLOT.removeChildren(); // プロット消去
    Graph_PLOTtag.removeChildren(); // プロットの数値消去
    Memo.removeChildren(); // [3メモ]消去
    Explain.removeChildren(); // [4説明]消去
    Experiment_Bag.removeChildren(); // 袋の消去
    Experiment_PostBall.removeChildren(); // ボールの消去
    Experiment_SELECT.removeChildren(); // SELECTボタンの消去
    Experiment_Message.removeChildren(); // 回数・確率関連を消去
    Experiment_Note.removeChildren(); // ノート関連を消去
    // 背景
    const ExperimentBack = new PIXI.Graphics();
    ExperimentBack.x = 0;          // 横座標の設定
    ExperimentBack.y = 0;          // 縦座標の設定
    ExperimentBack.beginFill(0xa8bf93);
    ExperimentBack.drawRect(0,0,field_width,field_height); // 矩形を描写する
    ExperimentBack.endFill();
    Experiment.addChild(ExperimentBack); // ステージに追加する
    // ノート
    const ExNote = new PIXI.Sprite.from('/picture/LLN5_ExNote.png');
    ExNote.x = field_width*0.428; // 横座標の設定
    ExNote.y = 0; // 縦座標の設定
    ExNote.width = field_width*0.645;
    ExNote.height = field_height*0.3;
    Graph.addChild(ExNote);
    // ノート文字
    const ExNote1 = new PIXI.Sprite.from('/picture/Birth4_NoteALL.png');
    ExNote1.x = field_width*0.6; // 横座標の設定
    ExNote1.y = field_height*0.08; // 縦座標の設定
    ExNote1.width = field_width*0.355;
    ExNote1.height = field_height*0.2;
    Graph.addChild(ExNote1);
    // [小数第４位で四捨五入]の表示
    const ExNote2 = new PIXI.Sprite.from('/picture/Birth4_roomHosoku.png');
    ExNote2.x = field_width*0.6; // 横座標の設定
    ExNote2.y = field_height*0.3; // 縦座標の設定
    ExNote2.width = field_width*0.35;
    ExNote2.height = ExNote2.width*98/630; // 画像の比率から計算
    Graph.addChild(ExNote2);
    //
    if(n==19){
        // 人
        const ExBag = new PIXI.Sprite.from('/picture/Birth4_people19.png'); // 人のシルエットを並べる
        ExBag.x = 0; // 横座標の設定
        ExBag.y = 0; // 縦座標の設定
        ExBag.width = field_width*0.5;
        ExBag.height = ExBag.width*1283/1363; // 画像の比率から計算
        Experiment_Bag.addChild(ExBag);
        // 人数
        NumberPeople = 19;
    }
    else if(n==23){
        // 人
        const ExBag = new PIXI.Sprite.from('/picture/Birth4_people23.png'); // 人のシルエットを並べる
        ExBag.x = 0; // 横座標の設定
        ExBag.y = 0; // 縦座標の設定
        ExBag.width = field_width*0.5;
        ExBag.height = ExBag.width*1603/1363; // 画像の比率から計算
        Experiment_Bag.addChild(ExBag);
        // 人数
        NumberPeople = 23;
    }
    else if(n==29){
        // 人
        const ExBag = new PIXI.Sprite.from('/picture/Birth4_people29.png'); // 人のシルエットを並べる
        ExBag.x = 0; // 横座標の設定
        ExBag.y = 0; // 縦座標の設定
        ExBag.width = field_width*0.5;
        ExBag.height = ExBag.width*1925/1363; // 画像の比率から計算
        Experiment_Bag.addChild(ExBag);
        // 人数
        NumberPeople = 29;
    }
    else if(n==31){
        // 人
        const ExBag = new PIXI.Sprite.from('/picture/Birth4_people31.png'); // 人のシルエットを並べる
        ExBag.x = 0; // 横座標の設定
        ExBag.y = 0; // 縦座標の設定
        ExBag.width = field_width*0.5;
        ExBag.height = ExBag.width*2247/1363; // 画像の比率から計算
        Experiment_Bag.addChild(ExBag);
        // 人数
        NumberPeople = 31;
    }
    else if(n==37){
        // 人
        const ExBag = new PIXI.Sprite.from('/picture/Birth4_people37.png'); // 人のシルエットを並べる
        ExBag.x = 0; // 横座標の設定
        ExBag.y = 0; // 縦座標の設定
        ExBag.width = field_width*0.5*1635/1363;
        ExBag.height = ExBag.width*2247/1635; // 画像の比率から計算
        Experiment_Bag.addChild(ExBag);
        // 人数
        NumberPeople = 37;
    }
    else if(n==41){
        // 人
        const ExBag = new PIXI.Sprite.from('/picture/Birth4_people41.png'); // 人のシルエットを並べる
        ExBag.x = 0; // 横座標の設定
        ExBag.y = 0; // 縦座標の設定
        ExBag.width = field_width*0.5*1635/1363;
        ExBag.height = ExBag.width*2247/1635; // 画像の比率から計算
        Experiment_Bag.addChild(ExBag);
        // 人数
        NumberPeople = 41;
    }
    else if(n==80){
        // 人
        const ExBag = new PIXI.Sprite.from('/picture/Birth4_peopleMany.png'); // 人のシルエットを並べる
        ExBag.x = field_width*0.02; // 横座標の設定
        ExBag.y = 0; // 縦座標の設定
        ExBag.width = field_width*0.5;
        ExBag.height = ExBag.width*2243/1318*0.97; // 画像の比率から計算
        Experiment_Bag.addChild(ExBag);
        // 人数
        NumberPeople = 80;
    }
    else if(n==120){
        // 人
        const ExBag = new PIXI.Sprite.from('/picture/Birth4_peopleMany.png'); // 人のシルエットを並べる
        ExBag.x = field_width*0.02; // 横座標の設定
        ExBag.y = 0; // 縦座標の設定
        ExBag.width = field_width*0.5;
        ExBag.height = ExBag.width*2243/1318*0.97; // 画像の比率から計算
        Experiment_Bag.addChild(ExBag);
        // 人数
        NumberPeople = 120;
    }

    // [sumPh]選んだ部屋の人数を表示
    let Message_sumPh = new PIXI.Text(n);
    Message_sumPh.x = field_width*0.85*0.97;
    Message_sumPh.y = field_height*0.075;
    Message_sumPh.width *= ScaleMOJI;
    Message_sumPh.height *= ScaleMOJI;
    Message_sumPh.style.fill = 0x69821b;
    Message_sumPh.style.fontWeight = "bolder";
    Graph.addChild(Message_sumPh);
    // [Prob_SHOUSU]確率を小数で表示
    let Message_ProbSHOUSU = new PIXI.Text(CalculateTeoVal(n));
    Message_ProbSHOUSU.x = field_width*0.85*0.97;
    Message_ProbSHOUSU.y = field_height*0.185;
    Message_ProbSHOUSU.width *= 1.1*ScaleMOJI;
    Message_ProbSHOUSU.height *= 1.1*ScaleMOJI;
    Message_ProbSHOUSU.style.fill = 0x69821b;
    Message_ProbSHOUSU.style.fontWeight = "bolder";
    Graph.addChild(Message_ProbSHOUSU);
    // 確認ボタン
    const ExSelect = new PIXI.Sprite.from('/picture/Birth4_check.png');
    ExSelect.x = field_width*0.65; // 横座標の設定
    ExSelect.y = field_height*0.7; // 縦座標の設定
    ExSelect.width = field_width*0.3;
    ExSelect.height = ExSelect.width*(229/310);
    Experiment_SELECT.addChild(ExSelect);
    ExSelect.interactive = true;
    ExSelect.buttonMode = true;
    ExSelect.on("pointertap", addCHECK); // [CHECK]を押したらaddCHECKが起こる
    // 確認ボタン説明
    const ExSelectExplain = new PIXI.Sprite.from('/picture/Birth4_checkExp.png');
    ExSelectExplain.x = field_width*0.6; // 横座標の設定
    ExSelectExplain.y = field_height*0.5; // 縦座標の設定
    ExSelectExplain.width = field_width*0.4;
    ExSelectExplain.height = ExSelectExplain.width*(223/671);
    Experiment_SELECT.addChild(ExSelectExplain);
}
// [CHECK]を押したときに誕生日を表示する
function addCHECK(){
    Post_BirthExperimentField(NumberPeople); // NumberPeopleは部屋を選ぶごとに更新される変数
}
// [CHECK]集団の人数分の誕生日を表示する関数
function Post_BirthExperimentField(n){ // nは集団の人数
    Experiment_Message.removeChildren(); // 回数や確率の消去
    Experiment_SELECT.removeChildren(); // CHECKボタンの消去

    // [NEXT]ボタン
    const ExNext = new PIXI.Sprite.from('/picture/LLN5_ExNext.png');
    ExNext.x = field_width*0.65; // 横座標の設定
    ExNext.y = field_height*0.7; // 縦座標の設定
    ExNext.width = field_width*0.3;
    ExNext.height = ExNext.width*(229/310);
    Experiment_SELECT.addChild(ExNext);
    ExNext.interactive = true;
    ExNext.buttonMode = true;
    ExNext.on("pointertap", addNEXT); // [NEXT]を押したら起こる
    // [NEXT]ボタン説明
    const ExNextExplain = new PIXI.Sprite.from('/picture/Birth4_NextExp.png');
    ExNextExplain.x = field_width*0.6; // 横座標の設定
    ExNextExplain.y = field_height*0.55; // 縦座標の設定
    ExNextExplain.width = field_width*0.4;
    ExNextExplain.height = ExNextExplain.width*(223/671);
    Experiment_SELECT.addChild(ExNextExplain);
    // 同じ誕生日の場合は色が変わる説明
    const ExNextHosoku = new PIXI.Sprite.from('/picture/Birth4_nextHosoku_re2.png');
    ExNextHosoku.x = field_width*0.62; // 横座標の設定
    ExNextHosoku.y = field_height*0.35; // 縦座標の設定
    ExNextHosoku.width = field_width*0.3;
    ExNextHosoku.height = ExNextHosoku.width*(156/526);
    Experiment_SELECT.addChild(ExNextHosoku);

    var selectedBIRTHDAY = []; // 選ばれた誕生日を格納する配列
    var HowManyTimesSelected = []; // その日にちが何回選ばれたか格納する配列
    var SelectedMoreThanOnce = []; // 2回以上選ばれた日付を格納する配列
    for(j=0;j<365;j++){ // 365日分
        HowManyTimesSelected.push(0); // まずは0回ずつ選ばれたとして格納
    }
    // ランダムに誕生日を選ぶ
    for(i=0;i<n;i++){ // 集団の人数まで
        let DAY = 0;
        DAY = Math.ceil(Math.random()*365); // 1~365から整数一つ
        selectedBIRTHDAY.push(BIRTHDAY[DAY-1]); // 選ばれた誕生日を格納していく
        HowManyTimesSelected[DAY-1] += 1; // 選ばれた回数を1増やす
        if(HowManyTimesSelected[DAY-1]==2){ // もし2回以上選ばれた日付が出てきたら
            SelectedMoreThanOnce.push(BIRTHDAY[DAY-1]); // その日付を2回選ばれた日付の配列に格納
        }
    }
    // ランダムに選んだ誕生日を貼り付けていく
    for(k=0;k<n;k++){
        if(n<32){ // 31人まで(貼り付け場所の表し方の関係で分けている)
            let Message_birthday = new PIXI.Text(selectedBIRTHDAY[k]);
            Message_birthday.x = field_width*0.01 + (field_width*0.1)*(k%5); // 5で割った余り分右にずらす
            Message_birthday.y = field_height*0.098 + (field_height*0.142)*(Math.floor(k/5)); // 5で割った商の分下にずらす
            Message_birthday.width *= ScaleMOJI*0.85;
            Message_birthday.height *= ScaleMOJI*0.85;
            if(SelectedMoreThanOnce.includes(selectedBIRTHDAY[k])){ // 同じ誕生日の人がいる場合は文字の色を変える
                Message_birthday.style.fill = 0xe84f91;
            }else{ // 同じ誕生日の人がいなければ文字の色はそのまま
                Message_birthday.style.fill = 0x000000;
            }
            Message_birthday.style.fontWeight = "bolder";
            Experiment_SELECT.addChild(Message_birthday);
        }
        else if(n==37){ // 37人のとき
            let Message_birthday = new PIXI.Text(selectedBIRTHDAY[k]);
            if(Math.floor(k/5)<5){ // 0~4段目までは
                Message_birthday.x = field_width*0.01 + (field_width*0.1)*(k%5); // 5で割った余り分右にずらす
                Message_birthday.y = field_height*0.098 + (field_height*0.142)*(Math.floor(k/5)); // 5で割った商の分下にずらす
                Message_birthday.width *= ScaleMOJI*0.85;
                Message_birthday.height *= ScaleMOJI*0.85;
                if(SelectedMoreThanOnce.includes(selectedBIRTHDAY[k])){ // 同じ誕生日の人がいる場合は文字の色を変える
                    Message_birthday.style.fill = 0xe84f91;
                }else{ // 同じ誕生日の人がいなければ文字の色はそのまま
                    Message_birthday.style.fill = 0x000000;
                }
                Message_birthday.style.fontWeight = "bolder";
                Experiment_SELECT.addChild(Message_birthday);
            }
            else if(Math.floor(k/5)>4){ // 5段目以降はそこを新しい起点として考えて
                Message_birthday.x = field_width*0.01 + (field_width*0.1)*((k-25)%6); // 6で割った余り分右にずらす
                Message_birthday.y = field_height*0.098 + field_height*0.142*5 + (field_height*0.142)*(Math.floor((k-25)/6)); // 6で割った商の分下にずらす
                Message_birthday.width *= ScaleMOJI*0.85;
                Message_birthday.height *= ScaleMOJI*0.85;
                if(SelectedMoreThanOnce.includes(selectedBIRTHDAY[k])){ // 同じ誕生日の人がいる場合は文字の色を変える
                    Message_birthday.style.fill = 0xe84f91;
                }else{ // 同じ誕生日の人がいなければ文字の色はそのまま
                    Message_birthday.style.fill = 0x000000;
                }
                Message_birthday.style.fontWeight = "bolder";
                Experiment_SELECT.addChild(Message_birthday);
            }
        }
        else if(n==41){ // 41人のとき
            let Message_birthday = new PIXI.Text(selectedBIRTHDAY[k]);
            if(Math.floor(k/5)<1){ // 0段目は
                Message_birthday.x = field_width*0.01 + (field_width*0.1)*(k%5); // 5で割った余り分右にずらす
                Message_birthday.y = field_height*0.098;
                Message_birthday.width *= ScaleMOJI*0.85;
                Message_birthday.height *= ScaleMOJI*0.85;
                if(SelectedMoreThanOnce.includes(selectedBIRTHDAY[k])){ // 同じ誕生日の人がいる場合は文字の色を変える
                    Message_birthday.style.fill = 0xe84f91;
                }else{ // 同じ誕生日の人がいなければ文字の色はそのまま
                    Message_birthday.style.fill = 0x000000;
                }
                Message_birthday.style.fontWeight = "bolder";
                Experiment_SELECT.addChild(Message_birthday);
            }
            else if(Math.floor(k/5)>0){ // 1段目以降はそこを新しい起点として考えて
                Message_birthday.x = field_width*0.01 + (field_width*0.1)*((k-5)%6); // 6で割った余り分右にずらす
                Message_birthday.y = field_height*0.098 + field_height*0.142 + (field_height*0.142)*(Math.floor((k-5)/6)); // 6で割った商の分下にずらす
                Message_birthday.width *= ScaleMOJI*0.85;
                Message_birthday.height *= ScaleMOJI*0.85;
                if(SelectedMoreThanOnce.includes(selectedBIRTHDAY[k])){ // 同じ誕生日の人がいる場合は文字の色を変える
                    Message_birthday.style.fill = 0xe84f91;
                }else{ // 同じ誕生日の人がいなければ文字の色はそのまま
                    Message_birthday.style.fill = 0x000000;
                }
                Message_birthday.style.fontWeight = "bolder";
                Experiment_SELECT.addChild(Message_birthday);
            }
        }
        else if(n>79){ // 80人か120人のとき
            let Message_birthday = new PIXI.Text(selectedBIRTHDAY[k]);
            Message_birthday.x = field_width*0.03 + (field_width*0.1)*(k%5); // 5で割った余り分右にずらす
            Message_birthday.y = field_height*0.1 + (field_height*0.037)*(Math.floor(k/5)); // 5で割った商の分下にずらす
            Message_birthday.width *= ScaleMOJI*0.6;
            Message_birthday.height *= ScaleMOJI*0.6;
            if(SelectedMoreThanOnce.includes(selectedBIRTHDAY[k])){ // 同じ誕生日の人がいる場合は文字の色を変える
                Message_birthday.style.fill = 0xe84f91;
            }else{ // 同じ誕生日の人がいなければ文字の色はそのまま
                Message_birthday.style.fill = 0x000000;
            }
            Message_birthday.style.fontWeight = "bolder";
            Experiment_SELECT.addChild(Message_birthday);
        }
    }
}
// [NEXT]を押したとき
function addNEXT(){
    Experiment_Bag.removeChildren(); // 袋の消去
    Experiment_PostBall.removeChildren(); // ボールの消去
    Experiment_SELECT.removeChildren(); // SELECTボタンの消去
    //
    if(NumberPeople==19){
        // 人
        const ExBag = new PIXI.Sprite.from('/picture/Birth4_people19.png'); // 人のシルエットを並べる
        ExBag.x = 0; // 横座標の設定
        ExBag.y = 0; // 縦座標の設定
        ExBag.width = field_width*0.5;
        ExBag.height = ExBag.width*1283/1363; // 画像の比率から計算
        Experiment_Bag.addChild(ExBag);
    }
    else if(NumberPeople==23){
        // 人
        const ExBag = new PIXI.Sprite.from('/picture/Birth4_people23.png'); // 人のシルエットを並べる
        ExBag.x = 0; // 横座標の設定
        ExBag.y = 0; // 縦座標の設定
        ExBag.width = field_width*0.5;
        ExBag.height = ExBag.width*1603/1363; // 画像の比率から計算
        Experiment_Bag.addChild(ExBag);
    }
    else if(NumberPeople==29){
        // 人
        const ExBag = new PIXI.Sprite.from('/picture/Birth4_people29.png'); // 人のシルエットを並べる
        ExBag.x = 0; // 横座標の設定
        ExBag.y = 0; // 縦座標の設定
        ExBag.width = field_width*0.5;
        ExBag.height = ExBag.width*1925/1363; // 画像の比率から計算
        Experiment_Bag.addChild(ExBag);
    }
    else if(NumberPeople==31){
        // 人
        const ExBag = new PIXI.Sprite.from('/picture/Birth4_people31.png'); // 人のシルエットを並べる
        ExBag.x = 0; // 横座標の設定
        ExBag.y = 0; // 縦座標の設定
        ExBag.width = field_width*0.5;
        ExBag.height = ExBag.width*2247/1363; // 画像の比率から計算
        Experiment_Bag.addChild(ExBag);
    }
    else if(NumberPeople==37){
        // 人
        const ExBag = new PIXI.Sprite.from('/picture/Birth4_people37.png'); // 人のシルエットを並べる
        ExBag.x = 0; // 横座標の設定
        ExBag.y = 0; // 縦座標の設定
        ExBag.width = field_width*0.5*1635/1363;
        ExBag.height = ExBag.width*2247/1635; // 画像の比率から計算
        Experiment_Bag.addChild(ExBag);
    }
    else if(NumberPeople==41){
        // 人
        const ExBag = new PIXI.Sprite.from('/picture/Birth4_people41.png'); // 人のシルエットを並べる
        ExBag.x = 0; // 横座標の設定
        ExBag.y = 0; // 縦座標の設定
        ExBag.width = field_width*0.5*1635/1363;
        ExBag.height = ExBag.width*2247/1635; // 画像の比率から計算
        Experiment_Bag.addChild(ExBag);
    }
    else if(NumberPeople==80){
        // 人
        const ExBag = new PIXI.Sprite.from('/picture/Birth4_peopleMany.png'); // 人のシルエットを並べる
        ExBag.x = field_width*0.02; // 横座標の設定
        ExBag.y = 0; // 縦座標の設定
        ExBag.width = field_width*0.5;
        ExBag.height = ExBag.width*2243/1318*0.97; // 画像の比率から計算
        Experiment_Bag.addChild(ExBag);
    }
    else if(NumberPeople==120){
        // 人
        const ExBag = new PIXI.Sprite.from('/picture/Birth4_peopleMany.png'); // 人のシルエットを並べる
        ExBag.x = field_width*0.02; // 横座標の設定
        ExBag.y = 0; // 縦座標の設定
        ExBag.width = field_width*0.5;
        ExBag.height = ExBag.width*2243/1318*0.97; // 画像の比率から計算
        Experiment_Bag.addChild(ExBag);
    }
    // 確認ボタン
    const ExSelect = new PIXI.Sprite.from('/picture/Birth4_check.png');
    ExSelect.x = field_width*0.65; // 横座標の設定
    ExSelect.y = field_height*0.7; // 縦座標の設定
    ExSelect.width = field_width*0.3;
    ExSelect.height = ExSelect.width*(229/310);
    Experiment_SELECT.addChild(ExSelect);
    ExSelect.interactive = true;
    ExSelect.buttonMode = true;
    ExSelect.on("pointertap", addCHECK); // [CHECK]を押したらaddCHECKが起こる
    // 確認ボタン説明
    const ExSelectExplain = new PIXI.Sprite.from('/picture/Birth4_checkExp.png');
    ExSelectExplain.x = field_width*0.6; // 横座標の設定
    ExSelectExplain.y = field_height*0.5; // 縦座標の設定
    ExSelectExplain.width = field_width*0.4;
    ExSelectExplain.height = ExSelectExplain.width*(223/671);
    Experiment_SELECT.addChild(ExSelectExplain);
}
