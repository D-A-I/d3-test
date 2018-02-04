import $ = require('jquery');
import d3 = require('d3');
import Enumerable = require('linq');

$(() => {

    /* 定数群 */
    const SVG_WIDTH = 500;
    const SVG_HEIGHT = 100;
    const BAR_PADDING = 1;
    const HEIGHT_MAG = 4;

    /**
     * 1. 以下棒グラフを作成する
     */

    // テストデータ
    let barData = [5, 10, 13, 19, 21, 25, 22, 18, 15, 13, 11, 12, 15, 20, 18, 17, 16, 18, 23, 25];

    // svgを定義する
    let svgBar = d3.select('#bar-chart') // 型の指定の仕方がわからない｡｡追って調査
        .attr('width', SVG_WIDTH).attr('height', SVG_HEIGHT); // svg全体のサイズを定義

    // 棒グラフを描画する
    svgBar.selectAll('rect').data(barData).enter().append('rect') // ..以下、各データを繰返し処理する
        .attr('fill', 'teal')        // 配色を青緑にする
        .attr('rx', 4).attr('ry', 4) // rectを角丸にする
        // svg全体の横幅に対し、データ量に応じてx座標を可変にする
        .attr('x', (d, i) => i * (SVG_WIDTH / barData.length))
        /* ☆重要☆ svgの原点(0, 0)は左上になるため、各データを描画するy座標を「下方向に押し下げる」 */
        .attr('y', (d) => SVG_HEIGHT - d * HEIGHT_MAG)
        /* ☆重要☆ svg全体の横幅を、データ量で割った値からスペース分引く */
        .attr('width', SVG_WIDTH / barData.length - BAR_PADDING)
        /* ☆重要☆ svgでは、上から下に描画するイメージを持つ必要あり */
        .attr('height', (d) => d * HEIGHT_MAG);

    // textを追加する
    svgBar.selectAll('text').data(barData).enter().append('text') // ..以下、各データを繰返し処理する
        // フォントのデザイン変更
        .attr('font-family', 'M+1c').attr('font-size', '11px').attr('fill', 'white')
        /* ☆重要☆ textをバーの中央に表示する */
        .attr('text-anchor', 'middle')
        .attr('x', (d, i) => {
            return i * (SVG_WIDTH / barData.length)               // バーの左端
                + (SVG_WIDTH / barData.length - BAR_PADDING) / 2; // バーの幅（動的） / 2
        })
        .attr('y', (d) => SVG_HEIGHT - d * HEIGHT_MAG + 14)
        .text((d) => d);

    /**
     * 2. 以下散布図を作成する
     */

    const SCTTR_PADDING = 20;

    // 散布図用テストデータ
    let scatterData = [[5, 20], [480, 90], [250, 50]
        , [100, 33], [330, 95], [410, 12], [475, 44], [25, 67], [85, 21], [220, 88]];

    // x軸用スケール（入力値と出力サイズのマッピング関数）を定義する
    let xScale = d3.scaleLinear()
        .domain(Enumerable.from(scatterData).select((x) => x[0]).toArray())
        /* ☆重要☆ padding分、左右を狭める（右側は数値を表示する分、より大きめにとる） */
        .range([SCTTR_PADDING, SVG_WIDTH - SCTTR_PADDING * 2]);

    // y軸用スケール（入力値と出力サイズのマッピング関数）を定義する
    let yScale = d3.scaleLinear()
        .domain(Enumerable.from(scatterData).select((x) => x[1]).toArray())
        /* ☆重要☆ svgは上から下に描画するため、データのyが大きいほど、0に近づくようにプロットする
         * さらに、padding分上下を狭める */
        .range([SVG_HEIGHT - SCTTR_PADDING, SCTTR_PADDING]);

    // circleの半径用スケール
    let rScale = d3.scaleLinear()
        .domain(Enumerable.from(scatterData).select((x) => x[1]).toArray())
        .range([2, 5]);

    // svgを定義する
    let svgSct = d3.select('#scatter-plot')
        .attr('width', SVG_WIDTH).attr('height', SVG_HEIGHT); // svg全体のサイズを定義

    // 散布図を描画する
    svgSct.selectAll('circle').data(scatterData).enter().append('circle') // ..以下、各データを繰返し処理する
        .attr('fill', 'teal') // 配色を青緑にする
        .attr('cx', (d) => xScale(d[0]))  // x座標を、スケールでサイズ調節してプロット
        .attr('cy', (d) => yScale(d[1]))  // y座標を、スケールでサイズ調節してプロット
        .attr('r',  (d) => rScale(d[1])); // 半径rを、スケールでサイズ調節してプロット

    // textを追加する
    svgSct.selectAll('text').data(scatterData).enter().append('text') // ..以下、各データを繰返し処理する
        // フォントのデザイン変更
        .attr('font-family', 'M+1c').attr('font-size', '11px').attr('fill', 'blue')
        .attr('x', (d) => xScale(d[0]))
        .attr('y', (d) => yScale(d[1]))
        .text((d) => d[0] + ', ' + d[1]);
});
