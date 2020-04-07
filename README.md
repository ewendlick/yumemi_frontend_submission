# yumemi_frontend_submission

ゆめみようなフロントエンド送信です。

## プロジェクト詳細

* 都道府県別の総人口推移グラフを表示するSPA(Single Page Application)を構築せよ

![UI specifications](frontend_wireframe.jpg)

### 内容
1. RESAS(地域経済分析システム) APIの「都道府県一覧」からAPIを取得する
2. APIレスポンスから都道府県一覧のチェックボックスを動的に生成する
3. 都道府県にチェックを入れると、RESAS APIから選択された都道府県の「人口構成」を取得する
4. 人口構成APIレスポンスから、X軸:年、Y軸:人口数の折れ線グラフを動的に生成して表示する

### 制約
* Reactをベースに、最新版(9/26時点で v16.5.2)でSPAを構築すること (Reactではなく、Angular/Vue/RiotなどJavaScriptのフレームワークでも構わないです)
* 都道府県一覧および総人口情報はRESAS APIのデータを用いること
* グラフは Highcharts や Rechart.js サードパーティ製のグラフライブラリを用いて描画すること
* グラフライブラリは任意のものを用いる
* Google Chrome最新版で正しく動くこと

## プロジェクト設定
```
npm install
```

### 開発するためのコンパイルとホットリーロド
```
npm run serve
```

### 本番環境をデプロイするためのコンパイルと縮小
```
npm run build
```

### リントやファイルを自動に直す
```
npm run lint
```

### カストマイズ
[Configuration Reference](https://cli.vuejs.org/config/)を調べてください
