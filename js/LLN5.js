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
const tagHow = new PIXI.Sprite.from("LLN5_tagHow.png");
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
        const tagHow2 = new PIXI.Sprite.from('LLN5_tagHow.png');
        tagHow2.x = field_width*0.1; // 横座標の設定
        tagHow2.y = (field_height-((1125*field_width)*0.8/1626))/2; // 縦座標の設定
        tagHow2.width = field_width*0.8;
        tagHow2.height = (1125*field_width)*0.8/1626; // 画像の比率から計算
        Explain.addChild(tagHow2);
    }
}
// [グラフ]を押したときにグラフのフィールドを作る
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
    const GrBack = new PIXI.Sprite.from('LLN5_GrBack.png');
    GrBack.x = 0; // 横座標の設定
    GrBack.y = field_height*0.4; // 縦座標の設定
    GrBack.width = field_width*0.99;
    GrBack.height = field_height*0.55; // 画像の比率から計算
    Graph.addChild(GrBack);
    // 縦軸タイトル
    const GrBackYtag = new PIXI.Sprite.from('LLN5_GrYtag.png');
    GrBackYtag.x = 0; // 横座標の設定
    GrBackYtag.y = field_height*0.37; // 縦座標の設定
    GrBackYtag.width = field_width*0.08;
    GrBackYtag.height = field_height*0.07; // 画像の比率から計算
    Graph.addChild(GrBackYtag);
    // 横軸タイトル
    const GrBackXtag = new PIXI.Sprite.from('LLN5_GrXtag.png');
    GrBackXtag.x = field_width*0.9; // 横座標の設定
    GrBackXtag.y = field_height*0.9; // 縦座標の設定
    GrBackXtag.width = field_width*0.08;
    GrBackXtag.height = field_height*0.07; // 画像の比率から計算
    Graph.addChild(GrBackXtag);
    // 理論値ライン
    const GrBackLine = new PIXI.Sprite.from('LLN5_GrBackLine.png');
    GrBackLine.x = field_width*0.9; // 横座標の設定
    GrBackLine.y = field_height*0.65; // 縦座標の設定
    GrBackLine.width = field_width*0.1;
    GrBackLine.height = GrBackLine.width*278/210; // 画像の比率から計算
    Graph.addChild(GrBackLine);
    // 目盛り「1」
    const GrPROB1 = new PIXI.Sprite.from('LLN5_Gr1.png');
    GrPROB1.x = field_width*0.01; // 横座標の設定
    GrPROB1.y = field_height*0.42; // 縦座標の設定
    GrPROB1.width = field_width*0.05;
    GrPROB1.height = GrPROB1.width*96/89; // 画像の比率から計算
    Graph.addChild(GrPROB1);
    // 目盛り「0」
    const GrPROB0 = new PIXI.Sprite.from('LLN5_Gr0.png');
    GrPROB0.x = field_width*0.001; // 横座標の設定
    GrPROB0.y = field_height*0.94; // 縦座標の設定
    GrPROB0.width = field_width*0.05;
    GrPROB0.height = GrPROB0.width*96/89; // 画像の比率から計算
    Graph.addChild(GrPROB0);
    // [詳細表示の変更]
    const GrTRtitle = new PIXI.Sprite.from('LLN5_GrTRtitle.png');
    GrTRtitle.x = field_width*0.06; // 横座標の設定
    GrTRtitle.y = field_height*0.1; // 縦座標の設定
    GrTRtitle.width = field_width*0.4;
    GrTRtitle.height = GrTRtitle.width*97/630; // 画像の比率から計算
    Graph.addChild(GrTRtitle);
    // [左三角]
    const GrTRleft = new PIXI.Sprite.from('LLN5_GrTRleft.png');
    GrTRleft.x = field_width*0.06; // 横座標の設定
    GrTRleft.y = field_height*0.2; // 縦座標の設定
    GrTRleft.width = field_width*0.1;
    GrTRleft.height = GrTRleft.width*183/184; // 画像の比率から計算
    Graph.addChild(GrTRleft);
    GrTRleft.interactive = true;
    GrTRleft.buttonMode = true;
    GrTRleft.on("pointertap", clickL);
    // [右三角]
    const GrTRright = new PIXI.Sprite.from('LLN5_GrTRright.png');
    GrTRright.x = field_width*0.365; // 横座標の設定
    GrTRright.y = field_height*0.2; // 縦座標の設定
    GrTRright.width = field_width*0.1;
    GrTRright.height = GrTRright.width; // 画像の比率から計算
    Graph.addChild(GrTRright);
    GrTRright.interactive = true;
    GrTRright.buttonMode = true;
    GrTRright.on("pointertap", clickR);
    // グラフのプロット
    makeGraphPlot(probTrans.length);

    // ノート
    const ExNote = new PIXI.Sprite.from('LLN5_ExNote.png');
    ExNote.x = field_width*0.428; // 横座標の設定
    ExNote.y = 0; // 縦座標の設定
    ExNote.width = field_width*0.645;
    ExNote.height = field_height*0.45;
    Graph.addChild(ExNote);
    // ノート文字
    const ExNote1 = new PIXI.Sprite.from('LLN5_ExNote1.png');
    ExNote1.x = field_width*0.6; // 横座標の設定
    ExNote1.y = field_height*0.03; // 縦座標の設定
    ExNote1.width = field_width*0.355;
    ExNote1.height = field_height*0.13;
    Graph.addChild(ExNote1);
    //
    const ExNote2 = new PIXI.Sprite.from('LLN5_ExNote2.png');
    ExNote2.x = field_width*0.6; // 横座標の設定
    ExNote2.y = field_height*0.15; // 縦座標の設定
    ExNote2.width = field_width*0.355;
    ExNote2.height = field_height*0.09;
    Graph.addChild(ExNote2);
    //
    const ExNote3 = new PIXI.Sprite.from('LLN5_ExNote3.png');
    ExNote3.x = field_width*0.6; // 横座標の設定
    ExNote3.y = field_height*0.25; // 縦座標の設定
    ExNote3.width = field_width*0.355;
    ExNote3.height = field_height*0.18;
    Graph.addChild(ExNote3);
    // [sumPh]当該事象の起こった回数を表示
    let Message_sumPh = new PIXI.Text(sumPh);
    Message_sumPh.x = field_width*0.85;
    Message_sumPh.y = field_height*0.06;
    Message_sumPh.width *= ScaleMOJI;
    Message_sumPh.height *= ScaleMOJI;
    Message_sumPh.style.fill = 0x69821b;
    Message_sumPh.style.fontWeight = "bolder";
    Graph.addChild(Message_sumPh);
    // [sumEx]当該事象の起こった回数を表示
    let Message_sumEx = new PIXI.Text(sumEx);
    Message_sumEx.x = field_width*0.85;
    Message_sumEx.y = field_height*0.15;
    Message_sumEx.width *= ScaleMOJI;
    Message_sumEx.height *= ScaleMOJI;
    Message_sumEx.style.fill = 0x69821b;
    Message_sumEx.style.fontWeight = "bolder";
    Graph.addChild(Message_sumEx);
    // [sumPh]確率分子を表示
    let Message_sumPh2 = new PIXI.Text(sumPh);
    Message_sumPh2.x = field_width*0.72;
    Message_sumPh2.y = field_height*0.26;
    Message_sumPh2.width *= 1.1*ScaleMOJI;
    Message_sumPh2.height *= 1.1*ScaleMOJI;
    Message_sumPh2.style.fill = 0x69821b;
    Message_sumPh2.style.fontWeight = "bolder";
    Graph.addChild(Message_sumPh2);
    // [sumEx]確率分母を表示
    let Message_sumEx2 = new PIXI.Text(sumEx);
    Message_sumEx2.x = field_width*0.72;
    Message_sumEx2.y = field_height*0.33;
    Message_sumEx2.width *= 1.1*ScaleMOJI;
    Message_sumEx2.height *= 1.1*ScaleMOJI;
    Message_sumEx2.style.fill = 0x69821b;
    Message_sumEx2.style.fontWeight = "bolder";
    Graph.addChild(Message_sumEx2);
    // [Prob_SHOUSU]確率を小数で表示
    let Message_ProbSHOUSU = new PIXI.Text(CalculateProb(sumEx,sumPh));
    Message_ProbSHOUSU.x = field_width*0.85;
    Message_ProbSHOUSU.y = field_height*0.29;
    Message_ProbSHOUSU.width *= 1.1*ScaleMOJI;
    Message_ProbSHOUSU.height *= 1.1*ScaleMOJI;
    Message_ProbSHOUSU.style.fill = 0x69821b;
    Message_ProbSHOUSU.style.fontWeight = "bolder";
    Graph.addChild(Message_ProbSHOUSU);
}
// [グラフ左三角]を押したとき
function clickL(){
    Count_clickL += 1;
    // 実験回数20回までのセットが何回繰り返されているか(縮尺調整)
    let plotScale = Math.ceil(probTrans.length/20);
    if(plotScale==0){ // 0で割ることを防ぐために
        plotScale = 1;
    }
    // x00などの変数を手打ちしているので変更の際は注意
    if((Count_clickL-Count_clickR)>=0 && (Count_clickL-Count_clickR)<=(probTrans.length-1)){ // 実験回数を超えず0回も下回らないとき
        makeGraphPlot_XYtag(field_width*0.02,field_height*0.932,field_height*0.475,probTrans.length-(Count_clickL-Count_clickR),plotScale);
    }else if((Count_clickL-Count_clickR)<0 || (Count_clickL-Count_clickR)>(probTrans.length-1)){ // 実験回数を越すor0回を下回るとき
        Count_clickL -= 1;
    }
}
// [グラフ右三角]を押したとき
function clickR(){
    Count_clickR += 1;
    // 実験回数20回までのセットが何回繰り返されているか(縮尺調整)
    let plotScale = Math.ceil(probTrans.length/20);
    if(plotScale==0){ // 0で割ることを防ぐために
        plotScale = 1;
    }
    // x00などの変数を手打ちしているので変更の際は注意
    if((Count_clickR-Count_clickL)<=0 && (Count_clickR-Count_clickL)>=(1-probTrans.length)){ // 実験回数を超えず0回も下回らないとき
        makeGraphPlot_XYtag(field_width*0.02,field_height*0.932,field_height*0.475,probTrans.length+(Count_clickR-Count_clickL),plotScale);
    }else if((Count_clickR-Count_clickL)>0 || (Count_clickR-Count_clickL)<(1-probTrans.length)){ // 実験回数を越すor0回を下回るとき
        Count_clickR -= 1;
    }
}
// [グラフ]のプロット絵画
function makeGraphPlot(PROBlength){ // PROBlengthは格納されている確率の個数
    Graph_PLOT.removeChildren();
    // (0,0)の座標
    let x00 = field_width*0.02;
    let y00 = field_height*0.932;
    // (0,1)の座標
    let y01 = field_height*0.475;
    // 実験回数20回までのセットが何回繰り返されているか(縮尺調整)
    let plotScale = Math.ceil(PROBlength/20);
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
        PROBplot.y = y00 - (y00-y01)*probTrans[i];
        PROBplot.beginFill(0xc3d825);
        PROBplot.drawCircle(0,0,(field_width*0.01)/plotScale); // (中心x,中心y,半径)
        PROBplot.endFill();
        Graph_PLOT.addChild(PROBplot);
        // プロットをつなぐ
        const conectPlot = new PIXI.Graphics();
        if(i==0){
            conectPlot.lineStyle(2,0xc3d825).moveTo(x00,y00).lineTo(PROBplot.x,PROBplot.y);
        }else{
            conectPlot.lineStyle(2,0xc3d825).moveTo(x00+(field_width*0.04*(i))/plotScale, y00-(y00-y01)*probTrans[i-1]).lineTo(PROBplot.x,PROBplot.y);
        }
        Graph_PLOT.addChild(conectPlot);
    }
    // 特定の値から軸に垂線を下ろす
    makeGraphPlot_XYtag(x00, y00, y01, PROBlength, plotScale);
}
// [グラフ]の特定の点の軸と確率
function makeGraphPlot_XYtag(x00, y00, y01, times, plotScale){ // times回目から垂線を下ろす
    Graph_PLOTtag.removeChildren();
    // 特定の点から横軸へ下りる垂線
    const conectLastPlot_X = new PIXI.Graphics();
    conectLastPlot_X.lineStyle(1,0xc3d825).moveTo(x00+(field_width*0.04*(times))/plotScale,y00-(y00-y01)*probTrans[times-1]).lineTo(x00+(field_width*0.04*(times))/plotScale,y00);
    Graph_PLOTtag.addChild(conectLastPlot_X);
    // 特定の点から下ろした垂線の足の座標
    if(!(times==0)){ // 実験回数0回のときはプロットしない
        let Message_plotX = new PIXI.Text(times);
        Message_plotX.x = x00+(field_width*0.04*(times))/plotScale;
        Message_plotX.y = y00;
        Message_plotX.width *= ScaleMOJI;
        Message_plotX.height *= ScaleMOJI;
        Message_plotX.style.fill = 0xc3d825;
        Message_plotX.style.fontWeight = "bolder";
        Graph_PLOTtag.addChild(Message_plotX);
    }
    // 特定の点の確率(小数)
    let Message_plotProbSHOUSU = new PIXI.Text("("+probTrans[times-1]+")");
    Message_plotProbSHOUSU.x = x00+(field_width*0.04*(times))/plotScale;
    Message_plotProbSHOUSU.y = y00-(y00-y01)*probTrans[times-1]-field_height*0.09;
    Message_plotProbSHOUSU.width *= ScaleMOJI/1.2;
    Message_plotProbSHOUSU.height *= ScaleMOJI/1.2;
    Message_plotProbSHOUSU.style.fill = 0xc3d825;
    Message_plotProbSHOUSU.style.fontWeight = "bolder";
    Graph_PLOTtag.addChild(Message_plotProbSHOUSU);
    // 特定の点の確率(分子)
    let Message_plotProbBUNSHI = new PIXI.Text(probTransBUNSHI[times-1]+"／");
    Message_plotProbBUNSHI.x = x00+(field_width*0.04*(times))/plotScale;
    Message_plotProbBUNSHI.y = y00-(y00-y01)*probTrans[times-1]-field_height*0.15;
    Message_plotProbBUNSHI.width *= ScaleMOJI;
    Message_plotProbBUNSHI.height *= ScaleMOJI;
    Message_plotProbBUNSHI.style.fill = 0xc3d825;
    Message_plotProbBUNSHI.style.fontWeight = "bolder";
    Graph_PLOTtag.addChild(Message_plotProbBUNSHI);
    // 特定の点の確率(分母)
    if(!(times==0)){
        let Message_plotProbBUNBO = new PIXI.Text(times);
        if(probTransBUNSHI[times-1]<=9){ // 分子の桁数によって配置を微妙に調整しておく
            Message_plotProbBUNBO.x = x00+(field_width*0.04*(times))/plotScale+field_width*0.05;
            Message_plotProbBUNBO.y = y00-(y00-y01)*probTrans[times-1]-field_height*0.13;
        }else if(probTransBUNSHI[times-1]>=10 && probTransBUNSHI[times-1]<=99){
            Message_plotProbBUNBO.x = x00+(field_width*0.04*(times))/plotScale+field_width*0.07;
            Message_plotProbBUNBO.y = y00-(y00-y01)*probTrans[times-1]-field_height*0.13;
        }else if(probTransBUNSHI[times-1]>=100){
            Message_plotProbBUNBO.x = x00+(field_width*0.04*(times))/plotScale+field_width*0.09;
            Message_plotProbBUNBO.y = y00-(y00-y01)*probTrans[times-1]-field_height*0.13;
        }
        Message_plotProbBUNBO.width *= ScaleMOJI/1.5;
        Message_plotProbBUNBO.height *= ScaleMOJI/1.5;
        Message_plotProbBUNBO.style.fill = 0xffffff;
        Message_plotProbBUNBO.style.fontWeight = "bolder";
        Graph_PLOTtag.addChild(Message_plotProbBUNBO);
        }
}
// [実験]を押したときに実験のフィールドを作る
function makeExperimentField(){
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
    // 袋(CLOSE)
    const ExBag = new PIXI.Sprite.from('LLN5_ExBag.png');
    ExBag.x = 0; // 横座標の設定
    ExBag.y = field_height*0.35; // 縦座標の設定
    ExBag.width = field_width*0.6;
    ExBag.height = field_height*0.6;
    Experiment_Bag.addChild(ExBag);
    // ノート
    const ExNote = new PIXI.Sprite.from('LLN5_ExNote.png');
    ExNote.x = field_width*0.428; // 横座標の設定
    ExNote.y = 0; // 縦座標の設定
    ExNote.width = field_width*0.645;
    ExNote.height = field_height*0.45;
    Experiment_Note.addChild(ExNote);
    // ノート文字
    const ExNote1 = new PIXI.Sprite.from('LLN5_ExNote1.png');
    ExNote1.x = field_width*0.6; // 横座標の設定
    ExNote1.y = field_height*0.03; // 縦座標の設定
    ExNote1.width = field_width*0.355;
    ExNote1.height = field_height*0.13;
    Experiment_Note.addChild(ExNote1);
    //
    const ExNote2 = new PIXI.Sprite.from('LLN5_ExNote2.png');
    ExNote2.x = field_width*0.6; // 横座標の設定
    ExNote2.y = field_height*0.15; // 縦座標の設定
    ExNote2.width = field_width*0.355;
    ExNote2.height = field_height*0.09;
    Experiment_Note.addChild(ExNote2);
    //
    const ExNote3 = new PIXI.Sprite.from('LLN5_ExNote3.png');
    ExNote3.x = field_width*0.6; // 横座標の設定
    ExNote3.y = field_height*0.25; // 縦座標の設定
    ExNote3.width = field_width*0.355;
    ExNote3.height = field_height*0.18;
    Experiment_Note.addChild(ExNote3);
    // 決定ボタン
    const ExSelect = new PIXI.Sprite.from('LLN5_ExSelect.png');
    ExSelect.x = field_width*0.65; // 横座標の設定
    ExSelect.y = field_height*0.65; // 縦座標の設定
    ExSelect.width = field_width*0.3;
    ExSelect.height = ExSelect.width*(229/310);
    Experiment_SELECT.addChild(ExSelect);
    ExSelect.interactive = true;
    ExSelect.buttonMode = true;
    ExSelect.on("pointertap", addSELECT); // [SELECT]を押したらaddSELECTが起こる
    // 決定ボタン説明
    const ExSelectExplain = new PIXI.Sprite.from('LLN5_ExSelectExplain.png');
    ExSelectExplain.x = field_width*0.6; // 横座標の設定
    ExSelectExplain.y = field_height*0.48; // 縦座標の設定
    ExSelectExplain.width = field_width*0.4;
    ExSelectExplain.height = ExSelectExplain.width*(225/671);
    Experiment_SELECT.addChild(ExSelectExplain);
    // [sumPh]当該事象の起こった回数を表示
    let Message_sumPh = new PIXI.Text(sumPh);
    Message_sumPh.x = field_width*0.85;
    Message_sumPh.y = field_height*0.06;
    Message_sumPh.width *= ScaleMOJI;
    Message_sumPh.height *= ScaleMOJI;
    Message_sumPh.style.fill = 0x69821b;
    Message_sumPh.style.fontWeight = "bolder";
    Experiment_Message.addChild(Message_sumPh);
    // [sumEx]当該事象の起こった回数を表示
    let Message_sumEx = new PIXI.Text(sumEx);
    Message_sumEx.x = field_width*0.85;
    Message_sumEx.y = field_height*0.15;
    Message_sumEx.width *= ScaleMOJI;
    Message_sumEx.height *= ScaleMOJI;
    Message_sumEx.style.fill = 0x69821b;
    Message_sumEx.style.fontWeight = "bolder";
    Experiment_Message.addChild(Message_sumEx);
    // [sumPh]確率分子を表示
    let Message_sumPh2 = new PIXI.Text(sumPh);
    Message_sumPh2.x = field_width*0.72;
    Message_sumPh2.y = field_height*0.26;
    Message_sumPh2.width *= 1.1*ScaleMOJI;
    Message_sumPh2.height *= 1.1*ScaleMOJI;
    Message_sumPh2.style.fill = 0x69821b;
    Message_sumPh2.style.fontWeight = "bolder";
    Experiment_Message.addChild(Message_sumPh2);
    // [sumEx]確率分母を表示
    let Message_sumEx2 = new PIXI.Text(sumEx);
    Message_sumEx2.x = field_width*0.72;
    Message_sumEx2.y = field_height*0.33;
    Message_sumEx2.width *= 1.1*ScaleMOJI;
    Message_sumEx2.height *= 1.1*ScaleMOJI;
    Message_sumEx2.style.fill = 0x69821b;
    Message_sumEx2.style.fontWeight = "bolder";
    Experiment_Message.addChild(Message_sumEx2);
    // [Prob_SHOUSU]確率を小数で表示
    let Message_ProbSHOUSU = new PIXI.Text(CalculateProb(sumEx,sumPh));
    Message_ProbSHOUSU.x = field_width*0.85;
    Message_ProbSHOUSU.y = field_height*0.29;
    Message_ProbSHOUSU.width *= 1.1*ScaleMOJI;
    Message_ProbSHOUSU.height *= 1.1*ScaleMOJI;
    Message_ProbSHOUSU.style.fill = 0x69821b;
    Message_ProbSHOUSU.style.fontWeight = "bolder";
    Experiment_Message.addChild(Message_ProbSHOUSU);

    // 黒いボールを６個作り各ポジションに置く
    ball1 = makeExperimentBall(0x2b2b2b,field_width*0.055);
    ball2 = makeExperimentBall(0x2b2b2b,field_width*0.055);
    ball3 = makeExperimentBall(0x2b2b2b,field_width*0.055);
    ball4 = makeExperimentBall(0x2b2b2b,field_width*0.055);
    ball5 = makeExperimentBall(0x2b2b2b,field_width*0.055);
    ball6 = makeExperimentBall(0x2b2b2b,field_width*0.055);
    PutExperimentBall(ball1,1);
    PutExperimentBall(ball2,2);
    PutExperimentBall(ball3,3);
    PutExperimentBall(ball4,4);
    PutExperimentBall(ball5,5);
    PutExperimentBall(ball6,6);
}
// [SELECT]を押したときに実験結果のフィールドを作る
function makePostExperimentField(m,n){ // m,nは選択した玉のポジション(1~6)
    Experiment_Bag.removeChildren(); // 袋の消去
    Experiment_Ball.removeChildren(); // ボールの消去
    Experiment_Message.removeChildren(); // 回数や確率の消去
    Experiment_SELECT.removeChildren(); // SELECTボタンの消去

    // 袋(OPEN)
    const ExBagOPEN = new PIXI.Sprite.from('LLN5_ExBagOPEN.png');
    ExBagOPEN.x = 0; // 横座標の設定
    ExBagOPEN.y = field_height*0.4; // 縦座標の設定
    ExBagOPEN.width = field_width*0.6;
    ExBagOPEN.height = field_height*0.55;
    Experiment_Bag.addChild(ExBagOPEN);
    // モクモク
    const ExMOKUMOKU = new PIXI.Sprite.from('LLN5_ExMOKUMOKU2.png');
    ExMOKUMOKU.x = field_width*0.08; // 横座標の設定
    ExMOKUMOKU.y = 0; // 縦座標の設定
    ExMOKUMOKU.width = field_width*0.45;
    ExMOKUMOKU.height = field_height*0.45;
    Experiment_Bag.addChild(ExMOKUMOKU);
    // [NEXT]ボタン
    const ExNext = new PIXI.Sprite.from('LLN5_ExNext.png');
    ExNext.x = field_width*0.65; // 横座標の設定
    ExNext.y = field_height*0.65; // 縦座標の設定
    ExNext.width = field_width*0.3;
    ExNext.height = ExNext.width*(229/310);
    Experiment_SELECT.addChild(ExNext);
    ExNext.interactive = true;
    ExNext.buttonMode = true;
    ExNext.on("pointertap", addNEXT); // [NEXT]を押したら起こる

    // 色の割り当て
    colorLIST = NARABEKAE();
    SelectedRED = 0; // 赤が選ばれた回数リセット
    SelectedYELLOW = 0; // 黄が選ばれた回数リセット
    // ボールの絵画
    for(i=0;i<6;i++){
        if(!(i==m-1) && !(i==n-1)){ // 選択していない玉のとき
            ball = makeExperimentBall(colorLIST[i],field_width*0.055); // 割り当て済の色で円を作り
            PutPostExperimentBall(ball,i+1); // ポジション(袋の中)に配置
        }
        else if(i==m-1){ // 選択ポジションmに対して
            SELECTEDball1 = makeExperimentBall(colorLIST[i],field_width*0.06); // 割り当て済の色で円を作り
            SELECTEDball1.x = field_width*0.22;
            SELECTEDball1.y = field_height*0.22;
            Experiment_PostBall.addChild(SELECTEDball1);
            if(colorLIST[i]=="0xff9999"){ // その色が赤ならば
                SelectedRED += 1; // 赤が選ばれた回数を追加
            }else if(colorLIST[i]=="0xffd900"){ // その色が黄色ならば
                SelectedYELLOW += 1; // 黄が選ばれた回数を追加
            }
        }
        else if(i==n-1){ // 選択ポジションnに対して
            SELECTEDball2 = makeExperimentBall(colorLIST[i],field_width*0.06); // 割り当て済の色で円を作り
            SELECTEDball2.x = field_width*0.38;
            SELECTEDball2.y = field_height*0.25;
            Experiment_PostBall.addChild(SELECTEDball2);
            if(colorLIST[i]=="0xff9999"){ // その色が赤ならば
                SelectedRED += 1; // 赤が選ばれた回数を追加
            }else if(colorLIST[i]=="0xffd900"){ // その色が黄色ならば
                SelectedYELLOW += 1; // 黄が選ばれた回数を追加
            }
        }
    }
    // 実験回数と当該事象のカウント
    Judgement_Counter(SelectedRED, SelectedYELLOW);

    // [sumPh]当該事象の起こった回数を表示
    let Message_sumPh = new PIXI.Text(sumPh);
    Message_sumPh.x = field_width*0.85;
    Message_sumPh.y = field_height*0.06;
    Message_sumPh.width *= ScaleMOJI;
    Message_sumPh.height *= ScaleMOJI;
    Message_sumPh.style.fill = 0x69821b;
    Message_sumPh.style.fontWeight = "bolder";
    Experiment_Message.addChild(Message_sumPh);
    // [sumEx]当該事象の起こった回数を表示
    let Message_sumEx = new PIXI.Text(sumEx);
    Message_sumEx.x = field_width*0.85;
    Message_sumEx.y = field_height*0.15;
    Message_sumEx.width *= ScaleMOJI;
    Message_sumEx.height *= ScaleMOJI;
    Message_sumEx.style.fill = 0x69821b;
    Message_sumEx.style.fontWeight = "bolder";
    Experiment_Message.addChild(Message_sumEx);
    // [sumPh]確率分子を表示
    let Message_sumPh2 = new PIXI.Text(sumPh);
    Message_sumPh2.x = field_width*0.72;
    Message_sumPh2.y = field_height*0.26;
    Message_sumPh2.width *= 1.1*ScaleMOJI;
    Message_sumPh2.height *= 1.1*ScaleMOJI;
    Message_sumPh2.style.fill = 0x69821b;
    Message_sumPh2.style.fontWeight = "bolder";
    Experiment_Message.addChild(Message_sumPh2);
    // [sumEx]確率分母を表示
    let Message_sumEx2 = new PIXI.Text(sumEx);
    Message_sumEx2.x = field_width*0.72;
    Message_sumEx2.y = field_height*0.33;
    Message_sumEx2.width *= 1.1*ScaleMOJI;
    Message_sumEx2.height *= 1.1*ScaleMOJI;
    Message_sumEx2.style.fill = 0x69821b;
    Message_sumEx2.style.fontWeight = "bolder";
    Experiment_Message.addChild(Message_sumEx2);
    // [Prob_SHOUSU]確率を小数で表示
    let Message_ProbSHOUSU = new PIXI.Text(CalculateProb(sumEx,sumPh));
    Message_ProbSHOUSU.x = field_width*0.85;
    Message_ProbSHOUSU.y = field_height*0.29;
    Message_ProbSHOUSU.width *= 1.1*ScaleMOJI;
    Message_ProbSHOUSU.height *= 1.1*ScaleMOJI;
    Message_ProbSHOUSU.style.fill = 0x69821b;
    Message_ProbSHOUSU.style.fontWeight = "bolder";
    Experiment_Message.addChild(Message_ProbSHOUSU);
    // 確率を格納
    probTrans.push(CalculateProb(sumEx,sumPh));
    // 確率の分子を格納
    probTransBUNSHI.push(sumPh);
}
// [NEXT]を押したとき
function addNEXT(){
    Experiment_Bag.removeChildren(); // 袋の消去
    Experiment_PostBall.removeChildren(); // ボールの消去
    Experiment_SELECT.removeChildren(); // SELECTボタンの消去
    // 袋(CLOSE)
    const ExBag = new PIXI.Sprite.from('LLN5_ExBag.png');
    ExBag.x = 0; // 横座標の設定
    ExBag.y = field_height*0.35; // 縦座標の設定
    ExBag.width = field_width*0.6;
    ExBag.height = field_height*0.6;
    Experiment_Bag.addChild(ExBag);
    // 決定ボタン
    const ExSelect = new PIXI.Sprite.from('LLN5_ExSelect.png');
    ExSelect.x = field_width*0.65; // 横座標の設定
    ExSelect.y = field_height*0.65; // 縦座標の設定
    ExSelect.width = field_width*0.3;
    ExSelect.height = ExSelect.width*(229/310);
    Experiment_SELECT.addChild(ExSelect);
    ExSelect.interactive = true;
    ExSelect.buttonMode = true;
    ExSelect.on("pointertap", addSELECT); // [SELECT]を押したらaddSELECTが起こる
    // 決定ボタン説明
    const ExSelectExplain = new PIXI.Sprite.from('LLN5_ExSelectExplain.png');
    ExSelectExplain.x = field_width*0.6; // 横座標の設定
    ExSelectExplain.y = field_height*0.48; // 縦座標の設定
    ExSelectExplain.width = field_width*0.4;
    ExSelectExplain.height = ExSelectExplain.width*(225/671);
    Experiment_SELECT.addChild(ExSelectExplain);
    // 黒いボールを６個作り各ポジションに置く
    ball1 = makeExperimentBall(0x2b2b2b,field_width*0.055);
    ball2 = makeExperimentBall(0x2b2b2b,field_width*0.055);
    ball3 = makeExperimentBall(0x2b2b2b,field_width*0.055);
    ball4 = makeExperimentBall(0x2b2b2b,field_width*0.055);
    ball5 = makeExperimentBall(0x2b2b2b,field_width*0.055);
    ball6 = makeExperimentBall(0x2b2b2b,field_width*0.055);
    PutExperimentBall(ball1,1);
    PutExperimentBall(ball2,2);
    PutExperimentBall(ball3,3);
    PutExperimentBall(ball4,4);
    PutExperimentBall(ball5,5);
    PutExperimentBall(ball6,6);
}
// 当該事象が起こったかの判断とカウント
function Judgement_Counter(SelectedRED, SelectedYELLOW){
    // 実験回数のカウント
    sumEx += 1; 
    // 当該事象のカウント
    if(SelectedRED==1 && SelectedYELLOW==1){
        sumPh += 1;
    }
}
// [SELECT]を押したとき、ポジションm,nを判断/生成してmakePostExperimentFieldを実行
function addSELECT(){
    let m = 0; //乱数1個目
    let n = 0; //乱数2個目
    if(sum_Count_checkBall>=3){ // 玉を3個以上選択していたら
        alert("玉は２個までしか選べないよ！");
    }else if(sum_Count_checkBall==1){ // 玉を1個選択していたら
        alert("もう一つ玉を選んでね！");
    }else if(sum_Count_checkBall==0){ // 玉を1つも選択していないとき
        while(m==n) { //２つが同じじゃなくなるまで繰り返す
            m = Math.ceil(Math.random()*6); // 1~6から整数一つ
            n = Math.ceil(Math.random()*6); // 1~6から整数一つ
        }
        makePostExperimentField(m,n);
    }else if(sum_Count_checkBall==2){ // 2個しっかり選べているときは
        let nankome = 0;
        for(i=0;i<6;i++){
            if(Count_checkBall[i]==1 && nankome==0){ // 選んでいる玉のポジションiを探し
                m = i+1;
                nankome += 1;
            }
            else if(Count_checkBall[i]==1 && nankome==1){
                n = i+1;
            }
        }
        Count_checkBall = [0,0,0,0,0,0]; // ボールをタップした回数を記録リセット
        sum_Count_checkBall = 0; // 選択したボールの個数リセット
        makePostExperimentField(m,n);
    }
}
// 色の並べ替え
function NARABEKAE(){
    let arr = ["0xff9999","0xffd900","0x00bfff","0xff9999","0xffd900","0x00bfff"]; // 元々の色を入れた配列
    let arr2 = []; // 並べ替えた後の色をいれた配列
    let colorlength = arr.length; // 元々の要素数
    for(i=0;i<colorlength;i++) {
        let index = Math.floor(Math.random()*arr.length); //現在の要素数から、添字をランダムに取り出す
        arr2[i] = arr[index]; // 並べ替えた後の色を入れる
        arr.splice(index,1); // 添え字の要素を削除
    }
    return arr2;
}
// 確率の計算(小数第2位まで)
function CalculateProb(sumEx, sumPh){
    const Prob_SHOUSU = Math.round((sumPh/sumEx)*100)/100; // 小数第2位
    return Prob_SHOUSU;
}
// ボールを作る(色と半径を引数に)
function makeExperimentBall(ballcolor, ballrad){
    let ball = new PIXI.Graphics(); // ボールを作成
    ball.beginFill(ballcolor); // 黒く塗る
    ball.drawCircle(0,0,ballrad); // (中心x,中心y,半径)
    ball.endFill(); 
    return ball;
}
// 袋の中にボールを置く(選択前)
function PutExperimentBall(ball, BallPosition){
    if(BallPosition==1){
        ball.x = field_width*0.19; // 中心のx座標
        ball.y = field_height*0.72; // 中心のy座標
    }else if(BallPosition==2){
        ball.x = field_width*0.32; // 中心のx座標
        ball.y = field_height*0.68; // 中心のy座標
    }else if(BallPosition==3){
        ball.x = field_width*0.46; // 中心のx座標
        ball.y = field_height*0.71; // 中心のy座標
    }else if(BallPosition==4){
        ball.x = field_width*0.18; // 中心のx座標
        ball.y = field_height*0.87; // 中心のy座標
    }else if(BallPosition==5){
        ball.x = field_width*0.31; // 中心のx座標
        ball.y = field_height*0.84; // 中心のy座標
    }else if(BallPosition==6){
        ball.x = field_width*0.44; // 中心のx座標
        ball.y = field_height*0.87; // 中心のy座標
    }
    Experiment_Ball.addChild(ball);
    ball.interactive = true; // アクティブに
    ball.buttonMode = true; // カーソル重ねたとき矢印が手の形に変わる
    ball.on("pointertap",(e) => { // 玉をタップすると
        if(Count_checkBall[BallPosition-1]==0){ // もしまだ選択していない玉ならば
            if(BallPosition==1){
                checkball1 = makeExperimentBall(0xafafb0,field_width*0.055); // 選択した玉の色が変わり
                checkball1.x = field_width*0.19; // 中心のx座標
                checkball1.y = field_height*0.72; // 中心のy座標
                Experiment_Ball.addChild(checkball1);
            }else if(BallPosition==2){
                checkball2 = makeExperimentBall(0xafafb0,field_width*0.055); // 選択した玉の色が変わり
                checkball2.x = field_width*0.32; // 中心のx座標
                checkball2.y = field_height*0.68; // 中心のy座標
                Experiment_Ball.addChild(checkball2);
            }else if(BallPosition==3){
                checkball3 = makeExperimentBall(0xafafb0,field_width*0.055); // 選択した玉の色が変わり
                checkball3.x = field_width*0.46; // 中心のx座標
                checkball3.y = field_height*0.71; // 中心のy座標
                Experiment_Ball.addChild(checkball3);
            }else if(BallPosition==4){
                checkball4 = makeExperimentBall(0xafafb0,field_width*0.055); // 選択した玉の色が変わり
                checkball4.x = field_width*0.18; // 中心のx座標
                checkball4.y = field_height*0.87; // 中心のy座標
                Experiment_Ball.addChild(checkball4);
            }else if(BallPosition==5){
                checkball5 = makeExperimentBall(0xafafb0,field_width*0.055); // 選択した玉の色が変わり
                checkball5.x = field_width*0.31; // 中心のx座標
                checkball5.y = field_height*0.84; // 中心のy座標
                Experiment_Ball.addChild(checkball5);
            }else if(BallPosition==6){
                checkball6 = makeExperimentBall(0xafafb0,field_width*0.055); // 選択した玉の色が変わり
                checkball6.x = field_width*0.44; // 中心のx座標
                checkball6.y = field_height*0.87; // 中心のy座標
                Experiment_Ball.addChild(checkball6);
            }
            // checkの回数を確認
            Count_checkBall[BallPosition-1] = 1;
            sum_Count_checkBall += 1;
        }else if(Count_checkBall[BallPosition-1]==1){ // 一度選択した玉であれば
            if(BallPosition==1){
                Experiment_Ball.removeChild(checkball1); // 色つきを外し
            }else if(BallPosition==2){
                Experiment_Ball.removeChild(checkball2);
            }else if(BallPosition==3){
                Experiment_Ball.removeChild(checkball3);
            }else if(BallPosition==4){
                Experiment_Ball.removeChild(checkball4);
            }else if(BallPosition==5){
                Experiment_Ball.removeChild(checkball5);
            }else if(BallPosition==6){
                Experiment_Ball.removeChild(checkball6);
            }
            Count_checkBall[BallPosition-1] = 0; // カウントも元に戻す
            sum_Count_checkBall -= 1;
        }
    });
}
// 袋の中にボールを置く(選択後)
function PutPostExperimentBall(ball, BallPosition){
    if(BallPosition==1){
        ball.x = field_width*0.19; // 中心のx座標
        ball.y = field_height*0.72; // 中心のy座標
    }else if(BallPosition==2){
        ball.x = field_width*0.32; // 中心のx座標
        ball.y = field_height*0.68; // 中心のy座標
    }else if(BallPosition==3){
        ball.x = field_width*0.46; // 中心のx座標
        ball.y = field_height*0.71; // 中心のy座標
    }else if(BallPosition==4){
        ball.x = field_width*0.18; // 中心のx座標
        ball.y = field_height*0.87; // 中心のy座標
    }else if(BallPosition==5){
        ball.x = field_width*0.31; // 中心のx座標
        ball.y = field_height*0.84; // 中心のy座標
    }else if(BallPosition==6){
        ball.x = field_width*0.44; // 中心のx座標
        ball.y = field_height*0.87; // 中心のy座標
    }
    Experiment_PostBall.addChild(ball);
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
    const memoPoint = new PIXI.Sprite.from('LLN5_Memo_point.png');
    memoPoint.x = field_width*0.1; // 横座標の設定
    memoPoint.y = (field_height-((1029*field_width)*0.8/1580))/2; // 縦座標の設定
    memoPoint.width = field_width*0.8;
    memoPoint.height = (1029*field_width)*0.8/1580; // 画像の比率から計算
    Memo.addChild(memoPoint);
}














/*
// ✅マークをつけるかつけないか判断して表示
function show_CheckMark(BallPosition){
    if(Count_checkBall[BallPosition-1]==1){ // 選択中なのであれば
        if(BallPosition==1){
            const CheckMark1 = new PIXI.Graphics();
            CheckMark1.x = field_width*0.225; // 横座標の設定
            CheckMark1.y = field_height*0.745; // 縦座標の設定
            CheckMark1.beginFill(0xaacf53);
            CheckMark1.drawRect(0,0,field_width*0.03,field_width*0.03); // 矩形を描写する
            CheckMark1.endFill();
            Experiment.addChild(CheckMark1); // ステージに追加する
        }
        else if(BallPosition==2){
            const CheckMark2 = new PIXI.Graphics();
            CheckMark2.x = field_width*0.35; // 横座標の設定
            CheckMark2.y = field_height*0.71; // 縦座標の設定
            CheckMark2.beginFill(0xaacf53);
            CheckMark2.drawRect(0,0,field_width*0.03,field_width*0.03); // 矩形を描写する
            CheckMark2.endFill();
            Experiment.addChild(CheckMark2); // ステージに追加する
        }
        else if(BallPosition==3){
            const CheckMark3 = new PIXI.Graphics();
            CheckMark3.x = field_width*0.49; // 横座標の設定
            CheckMark3.y = field_height*0.74; // 縦座標の設定
            CheckMark3.beginFill(0xaacf53);
            CheckMark3.drawRect(0,0,field_width*0.03,field_width*0.03); // 矩形を描写する
            CheckMark3.endFill();
            Experiment.addChild(CheckMark3); // ステージに追加する 
        }
        else if(BallPosition==4){
            const CheckMark4 = new PIXI.Graphics();
            CheckMark4.x = field_width*0.21; // 横座標の設定
            CheckMark4.y = field_height*0.90; // 縦座標の設定
            CheckMark4.beginFill(0xaacf53);
            CheckMark4.drawRect(0,0,field_width*0.03,field_width*0.03); // 矩形を描写する
            CheckMark4.endFill();
            Experiment.addChild(CheckMark4); // ステージに追加する
        }
        else if(BallPosition==5){
            const CheckMark5 = new PIXI.Graphics();
            CheckMark5.x = field_width*0.34; // 横座標の設定
            CheckMark5.y = field_height*0.87; // 縦座標の設定
            CheckMark5.beginFill(0xaacf53);
            CheckMark5.drawRect(0,0,field_width*0.03,field_width*0.03); // 矩形を描写する
            CheckMark5.endFill();
            Experiment.addChild(CheckMark5); // ステージに追加する 
        }
        else if(BallPosition==6){
            const CheckMark6 = new PIXI.Graphics();
            CheckMark6.x = field_width*0.47; // 横座標の設定
            CheckMark6.y = field_height*0.90; // 縦座標の設定
            CheckMark6.beginFill(0xaacf53);
            CheckMark6.drawRect(0,0,field_width*0.03,field_width*0.03); // 矩形を描写する
            CheckMark6.endFill();
            Experiment.addChild(CheckMark6); // ステージに追加する
        }
    }else if(Count_checkBall[BallPosition-1]==0){
        if(BallPosition==1){
            alert("test");
            Experiment.removeChild(CheckMark1);
        }
        else if(BallPosition==2){
            Experiment.removeChild(CheckMark2);
        }
        else if(BallPosition==3){
            Experiment.removeChild(CheckMark3);
        }
        else if(BallPosition==4){
            Experiment.removeChild(CheckMark4);
        }
        else if(BallPosition==5){
            Experiment.removeChild(CheckMark5);
        }
        else if(BallPosition==6){
            Experiment.removeChild(CheckMark6);
        }
    }
}
*/
