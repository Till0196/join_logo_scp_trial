# join_logo_scp_trial for nodejs & linux
## 概要
「join_logo_scp動作確認用バッチファイル  by Yobi」を参考に[sogaani氏][1]が作成された[nodejs版][2]の改造です。  
ファイルの生成先などをYobi氏の作成されたオリジナルにあわせています。  
また、こちらは[JoinLogoScpTrialSetLinux][3]で使用するモジュールです。  
単体でも動作しますが、[JoinLogoScpTrialSetLinux][3]を使用することをおすすめします。

[1]:https://github.com/sogaani
[2]:https://github.com/sogaani/JoinLogoScp/tree/master/join_logo_scp_trial
[3]:https://github.com/tobitti0/JoinLogoScpTrialSetLinux

## 機能
### フォークでの追加機能
互換性重視で機能追加を行いました。
- ffmpeg以外のQSVEnccなどのエンコーダーを`-e`オプションから自由に指定できるようになります。
  
  また、`-e`オプションがffmpegへのパスの場合は、フォーク元と同じ挙動をするはずです。
  
  ※この変更で`-e`オプションが`boolean`から`string`に変更されているのでご注意ください。`-e`オプション単体の指定の場合は、フォーク元の挙動と同じです。
- Amatsukazeで生成したロゴファイルのファイル名をそのまま使えるように改良。
  
  ChList.csvにサービスIDを追加することで、`SID211-1.lgd`のようなファイルを見つけるように変更しました。末尾の`-1`の部分は自動でディレクトリに存在する最も大きな数字を探すようにしています。
- `-c`オプションで放送局名を直接渡せるようになります。

  これまではファイル名から放送局名をパースしていましたが、EPGStationがエンコード用のスクリプトに渡す環境変数`CHNNELNAME`などを指定することで直接join_logo_scpに放送局名を渡せるように改良しました。

  サービスIDでも放送局名を探せるようにしていますが、利用していないので未確認です。

join_logo_scpのCM位置検出機能について動作確認をするスクリプトです。  
TSファイルを入力として、

* CMカットしたAVSファイル  
* CMカットのためのffmpegへのフィルターオプション

を作成します。  
（私はffmpegへのフィルターオプションは利用しないので未確認です。sogaani氏の作られたコードで生成されます。）

## 実行方法
事前にAviSynth+3.5.XとL-SMASH Sourceは入れてください。
1. chapter_exe、logoframe、join_logo_scpをbinフォルダに入れてください。
1. `npm install`と`npm link`を実行
1. `jlse --help`が動作するかを確認
1. 使用するロゴデータ(\*.lgd)をこのフォルダ直下logoフォルダに格納  
1. 実行  
  `npm start -- -i "TSファイル"`
1. 検出が自動で行われ結果が生成されます。  

TSファイルは相対パスで指定しても一応絶対パスに変換しますが、絶対パスで入力を推奨とします。

| オプション| 指定内容 |説明 |
|:---:|:---:|:---|
|--|何も指定しない|仕様上必須です。|
|-i|対象動画のパス|必須です。TSファイルのパスを指定します|
|-f|true<br>false|\[デフォルト:false\]任意です。<br>ffmpegへのフィルターを生成する場合はtrueを指定します。|
|-e|ffmpegやQSVEnccなどのエンコーダーへのパス|\[デフォルト:/usr/local/bin/ffmpeg\]任意です。<br>解析後にffmpegでエンコードを実施する場合にパスを指定します。|
|-c|放送局名もしくはサービスID|\[デフォルト:""\]任意です。`TOKYO MX1`や`211`などが渡せます。<br>指定するとファイル名からパースより正確に放送局名を渡すことができます。|
|-t|cutcm<br>cutcm_logo|\[デフォルト:cutcm_logo\]任意です。<br>エンコードする際に使用するavsファイルを選択します。<br>cmcut_logoは動作に[delogo-AviSynthPlus-Linux][4]が必要です。|
|-o|エンコーダのオプション|任意です。<br>ffmpegの場合は" -c:v libx264"のように指定します。必ず先頭にスペースが1つ必要です。QSVEnccなどffmpeg以外のエンコーダを利用する場合は、出力ファイルがオプション形式になっているため末尾が"-o"で終わる必要があります。|
|-d|ディレクトリ|\[デフォルト:入力ファイルディレクトリと同じ\]任意です。<br>入力TSファイル位置と異なる場所にエンコードファイルを出力する場合は指定します。|
|-n|ファイル名|\[デフォルト:入力ファイル名と同じ\]任意です。<br>入力TSファイル名と異なる名前でエンコードファイルを出力する場合は指定します。|
|-r|true<br>false|\[デフォルト:false\]任意です。<br>AVSファイルなどエンコードファイル以外を消去します。|

[4]:https://github.com/tobitti0/delogo-AviSynthPlus-Linux

(true or false 指定はしなくてもオプションを付けるだけでtrueとなります。)  
例（ffmpegフィルタ生成時）：`jlse -i "/tmp/test/局名_タイトル 話数.ts" -f`  
例（エンコードし、解析結果などを消す場合）：`jlse -i "/tmp/test/局名_タイトル 話数.ts" -e -t cutcm -o " -c:v libx264 -vf bwdif=1 -preset medium -crf 23 -aspect 16:9" -r`  

## 生成されるもの
| ファイル名| 内容 |
|:---|:---|
|in_cutcm.avs|結果（CMカットした入力ファイル）|
|in_cutcm_logo.avs|結果（CMカット＋delogo.so適用入力ファイル）[delogoもlinux対応改造済み][5]|
|in_org.avs|CMカット前の入力ファイル|
|obs_cut.avs|CMカットフレーム位置|
|obs_chapterexe.txt|chapter_exe結果|
|obs_logoframe.txt|logoframe結果|
|obs_jlscp.txt|join_logo_scpによる番組構成解析結果|
|obs_param.txt|ファイル名からタイトル、局名を検出し使用したJLparamの情報|

その他にもいくつか出力されますが、一時ファイルです。

[5]:https://github.com/tobitti0/delogo-AviSynthPlus-Linux

## 謝辞
オリジナルの製作者Yobi氏、  
nodejsに移植をされたsogaani氏、  
に深く感謝いたします。

## 主な変更点
sogaani氏が作成されたnodejs版からの主な改造点です。
* チャンネル略称が先頭に来る場合のチャンネル検出パターンの追加
* JLparam検出がうまくいっていなかったのを修正
* JLparam検出結果（利用したJLparam情報）を保存するようにした
* in_cutcm.avs in_cutcm_logo.avsを生成する機能の追加（そのままffmpegに食わせて実行できるファイル）
* Yobi氏が制作されたものと同じようにresultフォルダにファイル名のフォルダを生成し、そこにデータを保存するようにした
* 上記の変更に伴い、avsファイルとfilterファイルの保存先オプションの廃止
* ffmpeg用のfilterはオプションで指定し生成するように変更
* ファイル名からチャンネル名を検出できなかった時や、ロゴデータを見つけれなかった時はロゴフォルダの中をすべてlogoframeにわたすように変更
* FFMS2ではなくL-SMASH Sourceを用いて入力するように変更
* ライブラリの更新
* ffmpegでエンコードまでする機能を実装
* エンコードファイル以外を削除する機能を実装
