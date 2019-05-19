// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
//  【 カラーパレットPOPアップ 】  http://www.cman.jp
//
//   商用,改変,再配布はすべて自由ですですが、動作保証はありません
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//    maintenance history
//
//    Ver  Date        contents
//    1.0  2015/7/15   New
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
//  使用方法
//    htmlのタグに以下の設定をしてください
//
//   「  onclick="cmanCP_JS_open(this)" cmanCPat="rc_text:id001,下記URL参照"> 」
//
//
//   【注意】
//     引数やユーザ設定内容についてはノーチェックです
//     解析しやすいようにコメントを多く入れています。
//     JavaScriptのファイルサイズを削減する場合は、コメントやスペースを消してください。
//
//
//   詳細は以下でご確認ください
//    https://web-designer.cman.jp/javascript_ref/color/palette/
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


var cmanCP_VAR = {};

// =========================================================================================
//	カラーパレットの作成	
// =========================================================================================
function cmanCP_JS_open(argThis){

	// カラーリスト一覧
	var wColorList		=[	'#ffffff','#cccccc','#a6a6a6','#7f7f7f','#595959','#333333','#000000',
					'#ff9999','#ff4d4d','#ff0000','#b30000','#660000',
					'#ffcc99','#ffa64d','#ff7f00','#b35900','#663300',
					'#ffff99','#ffff4d','#ffff00','#b3b300','#666600',
					'#ccff99','#a6ff4d','#7fff00','#59b300','#336600',
					'#99ff99','#4dff4d','#00ff00','#00b300','#006600',
					'#99ffcc','#4dffa6','#00ff7f','#00b359','#006633',
					'#99ffff','#4dffff','#00ffff','#00b3b3','#006666',
					'#99ccff','#4da6ff','#007fff','#0059b3','#003366',
					'#9999ff','#4d4dff','#0000ff','#0000b3','#000066',
					'#cc99ff','#a64dff','#7f00ff','#5900b3','#330066',
					'#ff99ff','#ff4dff','#ff00ff','#b300b3','#660066',
					'#ff99cc','#ff4da6','#ff007f','#b30059','#660033'
				];

	cmanCP_VAR["popId"]	= 'cmanCP_POP';		// POP枠のID

	var wRGB_List		= [ 'R', 'G', 'B' ];
	var wRGB_TitleJP	= [ '赤色(R)', '緑色(G)', '青色(B)' ];
	var wRGB_TitleEn	= [ 'red', 'green', 'blue' ];

	var wHSL_List		= [ 'H', 'S', 'L' ];
	var wHSL_TitleJP	= [ '色相(H)', '彩度(S)', '輝度(L)' ];
	var wHSL_Max		= [ '359', '1', '1' ];
	var wHSL_Step		= [ '1', '0.001', '0.001' ];

	var wA_TitleJP		= '透明(A)';


	// ----- 属性取得 ------------------------------------------------------------
	var wAttr	= argThis.getAttribute("cmanCPat").split(",");

	for(var i=0; i<wAttr.length; i++){

		if(wAttr[i] != ""){

			var wAttrItem = wAttr[i].split(":");

			wAttrItem[0] = cmanCP_JS_zen_TO_han(wAttrItem[0]).toLowerCase();
			wAttrItem[1] = cmanCP_JS_zen_TO_han(wAttrItem[1]);

			switch (wAttrItem[0]){
			case 'def_size'	:
			case 'def_color':
			case 'def_tab'	:
			case 'def_alpha':
			case 'rc_form'	:
			case 'rc_func'	:
				cmanCP_VAR[wAttrItem[0]] = wAttrItem[1];
				break;

			case 'rc_text'	:
			case 'rc_bg'	:
				if(cmanCP_VAR[wAttrItem[0]] != ''){
					cmanCP_VAR[wAttrItem[0]] += ',' + wAttrItem[1];
				}else{
					cmanCP_VAR[wAttrItem[0]] = wAttrItem[1];
				}
				break;
			}

		}

	}


	// ----- CSS定義 ------------------------------------------------------------
	var wCss =	'<style type="text/css">';
	wCss	+=	'.cmanCP_CSS_ALL{' +
				'font-family:"Osaka?等幅","ＭＳ ゴシック","monospace";' +
				'font-size: 10pt;' +
				'color: #333;' +
				'padding: 0;' +
				'background-color: #fff;' +
				'border: 1px solid #666;' +
				'box-shadow: 10px 10px 10px rgba(0,0,0,0.4);' +
			'}';
	wCss	+=	'.cmanCP_CSS_CL{' +
				'cursor: pointer;' +
				'width: 19px;' +
				'height: 19px;' +
				'margin: 1px;' +
				'float: left; ' +
				'border: 1px solid #ccc;' +
			'}';
	wCss	+=	'.cmanCP_CSS_CL:hover{' +
				'box-shadow: none;' +
			'}';
	wCss	+=	'.cmanCP_CSS_select{' +
				'cursor: pointer;' +
				'box-shadow: 3px 3px 2px rgba(0,0,0,0.5);' +
			'}';
	wCss	+=	'.cmanCP_CSS_select:hover{' +
				'box-shadow: none;' +
			'}';
	wCss	+=	'.cmanCP_CSS_Tbl{' +
				'background-color: #fff;' +
				'border-collapse: collapse;' +
				'color: #333333;' +
			'}';
	wCss	+=	'.cmanCP_CSS_Tbl td{' +
				'border: 1px #999 solid;' +
				'padding: 8px 2px;' +
				'letter-spacing: 1px;' +
				'font-size:9pt;' +
				'text-align: center;' +
			'}';
	wCss	+=	'.cmanCP_CSS_Tab {' +
				'cursor: pointer;' +
				'float: left;' +
				'width: 88px;' +
				'font-weight:bold;' +
				'text-align: center;' +
				'padding-top: 5px;' +
				'padding-bottom: 5px;' +
				'border-left: 1px solid #999;' +
				'border-top: 1px solid #999;' +
				'border-right: 1px solid #999;' +
				'border-top-left-radius: 6px;' +
				'border-top-right-radius: 6px;' +
				'-webkit-border-top-left-radius: 6px;' +
				'-webkit-border-top-right-radius: 6px;' +
				'-moz-border-radius-topleft: 6px;' +
				'-moz-border-radius-topright: 6px;' +
			'}';
	wCss	+=	'.cmanCP_CSS_TabS {' +
				'color: #fff;' +
				'background-color: #999;' +
			'}';
	wCss	+=	'.cmanCP_CSS_TabN {' +
				'color: #666;' +
				'background-color: #ddd;' +
			'}';
	wCss	+=	'.cmanCP_CSS_TabN:hover {' +
				'color: #0063dc;' +
			'}';
	wCss	+=	'#'+cmanCP_VAR["popId"]+' input[type="text"],input[type="number"]{' +
				'width: 100%;' +
				'max-width: 75px;' +
				'height: 20px;' +
				'font-weight :bold;' +
				'color: #333333;' +
				'vertical-align: middle;' +
				'text-align: center;' +
				'letter-spacing: 1px;' +
				'ime-mode: disabled;' +
				'border: 1px #cccccc solid;' +
				'background-color: #EEFFFF;' +
				'text-align: center;' +
			'}';
	wCss	+=	'#'+cmanCP_VAR["popId"]+' input[type="range"]{' +
				'width: 96%;' +
				'height: 20px;' +
			'}';
	wCss	+=	'.cmanCP_CSS_range{' +
				'padding: 0;' +
			'}';
	wCss	+=	'.cmanCP_CSS_Gaid{' +
				'margin-left: auto;' +
				'margin-right: auto;' +
				'width: 96%;' +
				'height: 5px;' +
			'}';
	wCss	+=	'.cmanCP_CSS_GaidHSL{' +
				'float: left;' +
				'width: 5%;' +
				'height: 5px;' +
			'}';
	wCss	+=	'.cmanCP_CSS_sbg0{' +
				'background-color: #fff;' +
				'height: 12px;' +
			'}';
	wCss	+=	'.cmanCP_CSS_sbg1{' +
				'background-color: #ddd;' +
				'height: 12px;' +
			'}';
	wCss	+=	'</style>';


	// ----- HTML定義 ------------------------------------------------------------
	var wHtml =	'';

	// ----- 表題 -----
	wHtml +=	'<div>' +
				'<div style="text-align: left;padding: 2px 10px;font-weight:bold;color: #666;background-color: #eee;border-bottom: 1px solid #999;cursor: pointer;" id="cmanCP_ID_title">' +
				'Color Choice' +
				'</div>' +
				'<div style="position: absolute; top:2px; right:2px;width: 18px;height: 18px;margin-right:3px;margin-left: auto;background-color: #ccc;cursor: pointer;" onclick="cmanCP_JS_close();">' +
				'<svg viewBox="0 0 14 14">' +
				'<path stroke="#666" stroke-width="2" fill="none" d="M 3 3 L 11 11 , M 3 11 L 11 3">' +
				'</svg>' +
				'</div>' +
			'</div>';

	// ----- サンプル＆カラーリスト -----
	wHtml +=	'<div style="margin: 10px 0;clear: both;">' +
				'<table style="width: 100%;border:0px;border-spacing: 0;letter-spacing:0;padding:0;">' +
				'<tr>' +
				'<td>' +
				'<div class="cmanCP_CSS_select" style="margin:0 10px 5px 10px;" onclick="cmanCP_JS_select()">' +
				'<div style="width: 90px;height: 52px;padding:2px;position: relative;overflow:hidden;">' +
				'<table style="width: 100%;border:0px;border-spacing: 0;letter-spacing:0;padding:0;">' +
				'<tr><td class="cmanCP_CSS_sbg1"></td><td class="cmanCP_CSS_sbg0"></td><td class="cmanCP_CSS_sbg1"></td><td class="cmanCP_CSS_sbg0"></td><td class="cmanCP_CSS_sbg1"></td></tr>' +
				'<tr><td class="cmanCP_CSS_sbg0"></td><td class="cmanCP_CSS_sbg1"></td><td class="cmanCP_CSS_sbg0"></td><td class="cmanCP_CSS_sbg1"></td><td class="cmanCP_CSS_sbg0"></td></tr>' +
				'<tr><td class="cmanCP_CSS_sbg1"></td><td class="cmanCP_CSS_sbg0"></td><td class="cmanCP_CSS_sbg1"></td><td class="cmanCP_CSS_sbg0"></td><td class="cmanCP_CSS_sbg1"></td></tr>' +
				'<tr><td class="cmanCP_CSS_sbg0"></td><td class="cmanCP_CSS_sbg1"></td><td class="cmanCP_CSS_sbg0"></td><td class="cmanCP_CSS_sbg1"></td><td class="cmanCP_CSS_sbg0"></td></tr>' +
				'<tr><td class="cmanCP_CSS_sbg1"></td><td class="cmanCP_CSS_sbg0"></td><td class="cmanCP_CSS_sbg1"></td><td class="cmanCP_CSS_sbg0"></td><td class="cmanCP_CSS_sbg1"></td></tr>' +
				'</table>' +
				'<div style="position: absolute; top:0px; left:0px;width: 90px;height: 52px;border: 2px solid #ccc;margin: 0 auto 0 auto;" id="cmanCP_ID_sample">' + 
				'</div>' +
				'</div>' +
				'</div>' +
				'<div class="cmanCP_CSS_select" style="width: 90px;border: 1px solid #999;font-size:80%;margin: 0 auto;text-align: center;padding-top:2px;padding-bottom:2px;" onclick="cmanCP_JS_select()">この色を選択</div>' +
				'</td>' +
				'<td style="text-align: right;line-height: 0;padding-left: 5px;">';

	for(var i=0; i<wColorList.length; i++){
		wHtml +=	'<div onclick="cmanCP_JS_csel(this)" style="background-color:'+wColorList[i]+'" class="cmanCP_CSS_CL">&nbsp;</div>';		// 選択カラーリスト
	}

	wHtml +=		'</td>' +
				'</tr>' +
				'</table>' +
			'</div>';

	// ----- 色の文字列表示 -----
	wHtml +=	'<div style="clear: both;margin: 5px 5px 10px 5px;padding:5px;font-size: 110%;border: 1px solid #999;font-weight:bold;text-align: left;" id="cmanCP_ID_outstr">';
	wHtml +=	'</div>';

	// ----- レンジバー -----
	wHtml +=	'<!--  -->';
	wHtml +=	'<div style="margin: 5px 5px 0 5px;">';
	wHtml +=		'<!-- タブ -->';
	wHtml +=		'<div class="cmanCP_CSS_Tab cmanCP_CSS_TabN" id="cmanCP_ID_tab_RGB16" onclick="cmanCP_JS_tanCng(\'RGB16\');">RGB(16)</div>';
	wHtml +=		'<div class="cmanCP_CSS_Tab cmanCP_CSS_TabN" id="cmanCP_ID_tab_RGB" style="margin-left: 5px;" onclick="cmanCP_JS_tanCng(\'RGB\');">RGB(255)</div>';
	wHtml +=		'<div class="cmanCP_CSS_Tab cmanCP_CSS_TabN" id="cmanCP_ID_tab_HSL" style="margin-left: 5px;" onclick="cmanCP_JS_tanCng(\'HSL\');">HSL</div>';
	wHtml +=		'<!-- カラーレンジ -->';
	wHtml +=		'<div style="clear: both;border: 3px solid #999">';
	wHtml +=			'<table border="0" cellspacing="0" class="cmanCP_CSS_Tbl" style="width: 100%;margin-top:0;">';
	wHtml +=			'<colgroup span="1" style="width:15%;"></colgroup>';
	wHtml +=			'<colgroup span="1" style="width:25%;"></colgroup>';
	wHtml +=			'<colgroup span="1" style="width:60%;"></colgroup>';
	wHtml +=			'<tbody>';
	wHtml +=			'<!-- RGB -->';

	// --- RGB ---
	for(var i=0; i<=2; i++){
		wHtml +=		'<tr id="cmanCP_ID_aRGB_'+wRGB_List[i]+'">';
		wHtml +=		'<td>'+wRGB_TitleJP[i]+'</td>';
		wHtml +=		'<td>';
		wHtml +=		'<input type="number"  min="0" max="255" step="1" maxlength="3" id="cmanCP_ID_t'+wRGB_List[i]+'" onchange="cmanCP_JS_textCng(\'RGB\')" onInput="cmanCP_JS_textCng(\'RGB\')">';
		wHtml +=		'<input  type="text" maxlength="2" id="cmanCP_ID_t'+wRGB_List[i]+'16" onchange="cmanCP_JS_textCng(\'RGB16\')" onInput="cmanCP_JS_textCng(\'RGB16\')">';
		wHtml +=		'</td>';
		wHtml +=		'<td style="line-height: 1em;">';
		wHtml +=		'<input type="range" min="0" max="255" step="1" class="cmanCP_CSS_range" id="cmanCP_ID_r'+wRGB_List[i]+'" onchange="cmanCP_JS_rangeCng(\'RGB\')" onInput="cmanCP_JS_rangeCng(\'RGB\')">';
		wHtml +=		'<div class="cmanCP_CSS_Gaid" style="background: linear-gradient(to right, #fff, '+wRGB_TitleEn[i]+');"></div>';
		wHtml +=		'</td>';
		wHtml +=		'</tr>';
	}

	// --- HSL ---
	for(var i=0; i<=2; i++){
		wHtml +=		'<tr id="cmanCP_ID_aHSL_'+wHSL_List[i]+'">';
		wHtml +=		'<td>'+wHSL_TitleJP[i]+'</td>';
		wHtml +=		'<td>';
		wHtml +=		'<input type="number"  min="0" max="'+wHSL_Max[i]+'" step="'+wHSL_Step[i]+'" maxlength="3" id="cmanCP_ID_t'+wHSL_List[i]+'" onchange="cmanCP_JS_textCng(\'HSL\')" onInput="cmanCP_JS_textCng(\'HSL\')">';
		wHtml +=		'</td>';
		wHtml +=		'<td style="line-height: 1em;">';
		wHtml +=		'<input type="range" min="0" max="'+wHSL_Max[i]+'" step="'+wHSL_Step[i]+'" class="cmanCP_CSS_range" id="cmanCP_ID_r'+wHSL_List[i]+'" onchange="cmanCP_JS_rangeCng(\'HSL\')" onInput="cmanCP_JS_rangeCng(\'HSL\')">';
		wHtml +=		'<div class="cmanCP_CSS_Gaid">';
		for(var j=1; j<=20; j++){
			wHtml +=	'<div class="cmanCP_CSS_GaidHSL" id="cmanCP_ID_gHSL_'+wHSL_List[i]+j+'"></div>';
		}
		wHtml +=		'</div>';
		wHtml +=		'</td>';
		wHtml +=		'</tr>';
	}

	// --- 透明 ---
	wHtml +=			'<tr id="cmanCP_ID_aA">';
	wHtml +=			'<td>'+wA_TitleJP+'</td>';
	wHtml +=			'<td>';
	wHtml +=			'<input type="number"  min="0" max="1" step="0.01" maxlength="3" id="cmanCP_ID_tA" onchange="cmanCP_JS_textCng(\'A\')" onInput="cmanCP_JS_textCng(\'A\')">';
	wHtml +=			'</td>';
	wHtml +=			'<td style="line-height: 1em;">';
	wHtml +=			'<input type="range" min="0" max="1" step="0.01" value="1" class="cmanCP_CSS_range" id="cmanCP_ID_rA" onchange="cmanCP_JS_rangeCng(\'A\')" onInput="cmanCP_JS_rangeCng(\'A\')">';
	wHtml +=			'<div class="cmanCP_CSS_Gaid" style="background: linear-gradient(to right, #fff, #000);"></div>';
	wHtml +=			'</td>';
	wHtml +=			'</tr>';
	wHtml +=			'</tbody>';
	wHtml +=			'</table>';
	wHtml +=		'</div>';
	wHtml +=	'</div>';

	wHtml +=	'<div style="text-align: right;font-size: 80%;padding-right: 5px;color:#666">' +
				'color palette : ' +
				'<a href="http://web-designer.cman.jp/javascript_ref/color/palette/" target="_blank" style="color:#666;font-weight:normal;">web-designer.cman.jp</a>' +
			'</div>';



	// ----- 表示枠の作成＆割り当て -----------------------------------
	if(document.getElementById(cmanCP_VAR["popId"])){
		document.getElementById(cmanCP_VAR["popId"]).style.display = "none";
	}else{

		var wEle = document.createElement("div");   // 新規に要素（タグ）を生成
		wEle.id = cmanCP_VAR["popId"];
		wEle.style.display = "none";
		wEle.style.position = 'fixed';
		document.body.appendChild(wEle);            // このページ (document.body) の最後に生成した要素を追加
	}


	// ----- カラーポップをの初期設定 ---------------------------------
	cmanCP_VAR["objPop"] = document.getElementById(cmanCP_VAR["popId"]);
	cmanCP_VAR["objPop"].innerHTML		= wCss+"\n"+wHtml;
	cmanCP_VAR["objPop"].style.opacity	= 0;
	cmanCP_VAR["objPop"].className		= 'cmanCP_CSS_ALL';
	cmanCP_VAR["objPop"].style.left		= '0px';
	cmanCP_VAR["objPop"].style.top		= '0px';


	// ----- オブジェクトの設定 ---------------------------------------
	cmanCP_VAR["obj_tR16"]	= document.getElementById("cmanCP_ID_tR16");
	cmanCP_VAR["obj_tG16"]	= document.getElementById("cmanCP_ID_tG16");
	cmanCP_VAR["obj_tB16"]	= document.getElementById("cmanCP_ID_tB16");
	cmanCP_VAR["obj_tR"]	= document.getElementById("cmanCP_ID_tR");
	cmanCP_VAR["obj_tG"]	= document.getElementById("cmanCP_ID_tG");
	cmanCP_VAR["obj_tB"]	= document.getElementById("cmanCP_ID_tB");
	cmanCP_VAR["obj_tH"]	= document.getElementById("cmanCP_ID_tH");
	cmanCP_VAR["obj_tS"]	= document.getElementById("cmanCP_ID_tS");
	cmanCP_VAR["obj_tL"]	= document.getElementById("cmanCP_ID_tL");
	cmanCP_VAR["obj_tA"]	= document.getElementById("cmanCP_ID_tA");
	cmanCP_VAR["obj_rR"]	= document.getElementById("cmanCP_ID_rR");
	cmanCP_VAR["obj_rG"]	= document.getElementById("cmanCP_ID_rG");
	cmanCP_VAR["obj_rB"]	= document.getElementById("cmanCP_ID_rB");
	cmanCP_VAR["obj_rH"]	= document.getElementById("cmanCP_ID_rH");
	cmanCP_VAR["obj_rS"]	= document.getElementById("cmanCP_ID_rS");
	cmanCP_VAR["obj_rL"]	= document.getElementById("cmanCP_ID_rL");
	cmanCP_VAR["obj_rA"]	= document.getElementById("cmanCP_ID_rA");


	// ----------------------------------------------------------------
	//	パレットの初期設定
	// ----------------------------------------------------------------

	// ----- サイズの設定 ---------------------------------------------
	if('def_size' in cmanCP_VAR){

		cmanCP_VAR["def_size"] = cmanCP_VAR["def_size"].replace("px","");
		if(cmanCP_VAR["def_size"].toString().match(/^[0-9]+$/)){
			cmanCP_VAR["maxWidth"] = cmanCP_VAR["def_size"];
		}
	}
	if('maxWidth' in cmanCP_VAR){
	}else{
		cmanCP_VAR["maxWidth"] = 530;
	}
	cmanCP_VAR["objPop"].style.maxWidth = cmanCP_VAR["maxWidth"]+'px';


	// ----- 初期カラー設定 -------------------------------------------
	var wDefColorSet	= '';
	var wDefColor		= '';

	if('def_color' in cmanCP_VAR){

		try{
			if	(cmanCP_VAR["def_color"].indexOf('cns=') == 0){wDefColor = cmanCP_VAR["def_color"].substr(4);}
			else{
				var wObjDefColor = document.getElementById(cmanCP_VAR["def_color"].substr(4));

				if(wObjDefColor){
					if	(cmanCP_VAR["def_color"].indexOf('val=') == 0){wDefColor = wObjDefColor.value;}
					else if	(cmanCP_VAR["def_color"].indexOf('txt=') == 0){wDefColor = wObjDefColor.innerText;}
					else if	(cmanCP_VAR["def_color"].indexOf('col=') == 0){wDefColor = wObjDefColor.style.color;}
					else if	(cmanCP_VAR["def_color"].indexOf('bgc=') == 0){wDefColor = wObjDefColor.style.backgroundColor;}

					wDefColor = cmanCP_JS_zen_TO_han(wDefColor.toLowerCase());
				}
			}
		}
		catch(e){
			wDefColor = "";
		}
	}

	if	(wDefColor == ""){
	}
	else if	(wDefColor.substr(0,1) == '#'){

		if(wDefColor.substr(1).toString().match(/^[0-9a-f]+$/i)){
			switch (wDefColor.length){
			case 4:
				cmanCP_VAR["obj_tR16"].value	= wDefColor.substr(1,1).toString() + wDefColor.substr(1,1).toString();
				cmanCP_VAR["obj_tG16"].value	= wDefColor.substr(2,1).toString() + wDefColor.substr(2,1).toString();
				cmanCP_VAR["obj_tB16"].value	= wDefColor.substr(3,1).toString() + wDefColor.substr(3,1).toString();
				wDefColorSet = 'RGB16';
				break;
			case 7:
				cmanCP_VAR["obj_tR16"].value	= wDefColor.substr(1,2).toString();
				cmanCP_VAR["obj_tG16"].value	= wDefColor.substr(3,2).toString();
				cmanCP_VAR["obj_tB16"].value	= wDefColor.substr(5,2).toString();
				wDefColorSet = 'RGB16';
				break;
			}	
		}
	}
	else if	(wDefColor.indexOf('rgb(') == 0){
		wDefColor = wDefColor.replace('rgb(','');
		wDefColor = wDefColor.replace(')','');
		var wSplit = wDefColor.split(',');
		if(wSplit.length == 3){
			cmanCP_VAR["obj_tR"].value	= wSplit[0];
			cmanCP_VAR["obj_tG"].value	= wSplit[1];
			cmanCP_VAR["obj_tB"].value	= wSplit[2];
			wDefColorSet = 'RGB';
		}
		
	}
	else if	(wDefColor.indexOf('rgba(') == 0){
		wDefColor = wDefColor.replace('rgba(','');
		wDefColor = wDefColor.replace(')','');
		var wSplit = wDefColor.split(',');
		if(wSplit.length == 4){
			cmanCP_VAR["obj_tR"].value	= wSplit[0];
			cmanCP_VAR["obj_tG"].value	= wSplit[1];
			cmanCP_VAR["obj_tB"].value	= wSplit[2];
			cmanCP_VAR["obj_tA"].value	= wSplit[3];
			wDefColorSet = 'RGB';
		}
		
	}
	else if	(wDefColor.indexOf('hsl(') == 0){
		wDefColor = wDefColor.replace('hsl(','');
		wDefColor = wDefColor.replace('%','');
		wDefColor = wDefColor.replace(')','');
		var wSplit = wDefColor.split(',');
		if(wSplit.length == 3){
			cmanCP_VAR["obj_tH"].value	= wSplit[0];
			cmanCP_VAR["obj_tS"].value	= parseFloat(wSplit[1])/100;
			cmanCP_VAR["obj_tL"].value	= parseFloat(wSplit[2])/100;
			wDefColorSet = 'HSL';
		}
		
	}
	else if	(wDefColor.indexOf('hsla(') == 0){
		wDefColor = wDefColor.replace('hsla(','');
		wDefColor = wDefColor.replace('%','');
		wDefColor = wDefColor.replace(')','');
		var wSplit = wDefColor.split(',');
		if(wSplit.length == 3){
			cmanCP_VAR["obj_tH"].value	= wSplit[0];
			cmanCP_VAR["obj_tS"].value	= parseFloat(wSplit[1])/100;
			cmanCP_VAR["obj_tL"].value	= parseFloat(wSplit[2])/100;
			cmanCP_VAR["obj_tA"].value	= wSplit[3];
			wDefColorSet = 'HSL';
		}
	}

	if(wDefColorSet == ""){
		cmanCP_VAR["obj_tR16"].value	= "ff";
		cmanCP_VAR["obj_tG16"].value	= "80";
		cmanCP_VAR["obj_tB16"].value	= "0";
		wDefColorSet = 'RGB16';
	}
	if(cmanCP_VAR["obj_tA"].value == ''){
		cmanCP_VAR["obj_tA"].value	= '1';
	}
	cmanCP_JS_textCng(wDefColorSet);


	// ----- 初期TAB設定 ----------------------------------------------
	var wDefTab	= '';
	if('def_tab' in cmanCP_VAR){
		wDefTab = cmanCP_VAR['def_tab'].toUpperCase();
	}
	switch (wDefTab){
	case 'RGB':
	case 'RGB16':
	case 'HSL':
		cmanCP_JS_tanCng(wDefTab);	break;
	default:
		cmanCP_JS_tanCng('HSL');	break;		// DEBUG時はコメント
	}


	// ----- 透明の表示設定 ----------------------------------------------
	var wDefAlpha	= '';
	if('def_alpha' in cmanCP_VAR){
		wDefAlpha = cmanCP_VAR['def_alpha'];
	}
	if(wDefAlpha == '0'){
		document.getElementById('cmanCP_ID_aA').style.display = 'none';
	}else{
		document.getElementById('cmanCP_ID_aA').style.display = '';
	}


	// ----- サイズ取得のため透明のまま表示 ---------------------------
	cmanCP_VAR["objPop"].style.display = "";


	// ----- 表示位置設定 ---------------------------------------------
	if(cmanCP_VAR["objPop"].scrollWidth >= document.documentElement.clientWidth){
		cmanCP_VAR["objPop"].style.left	= '0px';
	}else{
		cmanCP_VAR["objPop"].style.left	= Math.round((document.documentElement.clientWidth - cmanCP_VAR["objPop"].scrollWidth) / 2) + 'px';
	}

	if(cmanCP_VAR["objPop"].scrollHeight >= document.documentElement.clientHeight){
		cmanCP_VAR["objPop"].style.top	= '0px';
	}else{
		cmanCP_VAR["objPop"].style.top	= Math.round((document.documentElement.clientHeight - cmanCP_VAR["objPop"].scrollHeight) / 2) + 'px';
	}

	// ----- 移動イベント登録 -----------------------------------------
	document.getElementById('cmanCP_ID_title').onmousedown	= cmanCP_JS_mdown;
	document.getElementById('cmanCP_ID_title').onmouseup	= cmanCP_JS_mup;
	document.getElementById('cmanCP_ID_title').onmousemove	= cmanCP_JS_mmove;
	document.getElementById('cmanCP_ID_title').onmouseout	= cmanCP_JS_mout;

	// ----- 透明解除 -------------------------------------------------
	cmanCP_VAR["objPop"].style.opacity = 1;


cmanCP_ID_title

}


// =========================================================================================
//	閉じるボタンが押されたら
// =========================================================================================
function cmanCP_JS_close(){

	var wDelElm = document.getElementById(cmanCP_VAR["popId"]);
	document.body.removeChild(wDelElm);

	// ハッシュクリア
	for(var key in cmanCP_VAR){
		delete cmanCP_VAR[key];
	}
}

// =========================================================================================
//	色リストが選択されたら
// =========================================================================================
function cmanCP_JS_csel(argObj){

	var wColor	= argObj.style.backgroundColor.toString();
	var w16		= '';
	var wRcColor	= '';

	if(wColor.substr(0,1) == '#'){
		wRcColor = argColor.substr(1);
	}
	else{

		//背景色の余計な文字列削除
		wColor = wColor.replace("rgb(","");
		wColor = wColor.replace(")","");

		//文字列分割
		var wColorSplit = wColor.split(",");

		//10進数を16進数に変換して連結
		for (var i = 0; i <= 2; i++) {
			w16	= parseInt(wColorSplit[i]).toString(16)
			if(w16.length == 1){
				wRcColor = wRcColor+'0'+w16;
			}else{
				wRcColor = wRcColor+w16;
			}
		}
	}

	cmanCP_VAR["obj_tR16"].value	= wRcColor.substr(0,2);
	cmanCP_VAR["obj_tG16"].value	= wRcColor.substr(2,2);
	cmanCP_VAR["obj_tB16"].value	= wRcColor.substr(4,2);

	cmanCP_JS_textCng('RGB16');

}

// =========================================================================================
//	タブがクリックされたら
// =========================================================================================
function cmanCP_JS_tanCng(argID){

	var wTabCssS = 'cmanCP_CSS_Tab cmanCP_CSS_TabS';
	var wTabCssN = 'cmanCP_CSS_Tab cmanCP_CSS_TabN';


	if(document.getElementById('cmanCP_ID_tab_'+argID).className == wTabCssS){return;}

	var wObjTabRGB		= document.getElementById('cmanCP_ID_tab_RGB');
	var wObjTabRGB16	= document.getElementById('cmanCP_ID_tab_RGB16');
	var wObjTabHSL		= document.getElementById('cmanCP_ID_tab_HSL');
	var wObjTrRGB_R		= document.getElementById('cmanCP_ID_aRGB_R');
	var wObjTrRGB_G		= document.getElementById('cmanCP_ID_aRGB_G');
	var wObjTrRGB_B		= document.getElementById('cmanCP_ID_aRGB_B');
	var wObjTrHSL_H		= document.getElementById('cmanCP_ID_aHSL_H');
	var wObjTrHSL_S		= document.getElementById('cmanCP_ID_aHSL_S');
	var wObjTrHSL_L		= document.getElementById('cmanCP_ID_aHSL_L');


	switch (argID){
	case 'RGB':
		cmanCP_VAR["obj_tR"].style.display	= "";
		cmanCP_VAR["obj_tG"].style.display	= "";
		cmanCP_VAR["obj_tB"].style.display	= "";
		cmanCP_VAR["obj_tR16"].style.display	= "none";
		cmanCP_VAR["obj_tG16"].style.display	= "none";
		cmanCP_VAR["obj_tB16"].style.display	= "none";
		wObjTabRGB.className			= wTabCssS;
		wObjTabRGB16.className			= wTabCssN;
		wObjTabHSL.className			= wTabCssN;
		break;

	case 'RGB16':
		cmanCP_VAR["obj_tR"].style.display	= "none";
		cmanCP_VAR["obj_tG"].style.display	= "none";
		cmanCP_VAR["obj_tB"].style.display	= "none";
		cmanCP_VAR["obj_tR16"].style.display	= "";
		cmanCP_VAR["obj_tG16"].style.display	= "";
		cmanCP_VAR["obj_tB16"].style.display	= "";
		wObjTabRGB.className			= wTabCssN;
		wObjTabRGB16.className			= wTabCssS;
		wObjTabHSL.className			= wTabCssN;
		break;

	case 'HSL':
		wObjTabRGB.className			= wTabCssN;
		wObjTabRGB16.className			= wTabCssN;
		wObjTabHSL.className			= wTabCssS;
		break;
	}

	switch (argID){
	case 'HSL':
		wObjTrRGB_R.style.display	= "none";
		wObjTrRGB_G.style.display	= "none";
		wObjTrRGB_B.style.display	= "none";
		wObjTrHSL_H.style.display	= "";
		wObjTrHSL_S.style.display	= "";
		wObjTrHSL_L.style.display	= "";
		break;

	default :
		wObjTrRGB_R.style.display	= "";
		wObjTrRGB_G.style.display	= "";
		wObjTrRGB_B.style.display	= "";
		wObjTrHSL_H.style.display	= "none";
		wObjTrHSL_S.style.display	= "none";
		wObjTrHSL_L.style.display	= "none";
		break;
	}


}

// =========================================================================================
//	レンジが変更された場合	
// =========================================================================================
function cmanCP_JS_rangeCng(argID){


	switch (argID){
	case 'RGB':
		cmanCP_VAR["obj_tR"].value	= cmanCP_VAR["obj_rR"].value;
		cmanCP_VAR["obj_tG"].value	= cmanCP_VAR["obj_rG"].value;
		cmanCP_VAR["obj_tB"].value	= cmanCP_VAR["obj_rB"].value;
		cmanCP_JS_textCng(argID);
		break;

	case 'HSL':
		cmanCP_VAR["obj_tH"].value	= cmanCP_VAR["obj_rH"].value;
		cmanCP_VAR["obj_tS"].value	= cmanCP_VAR["obj_rS"].value;
		cmanCP_VAR["obj_tL"].value	= cmanCP_VAR["obj_rL"].value;
		cmanCP_JS_textCng(argID);
		break;

	case 'A':
		cmanCP_VAR["obj_tA"].value	= cmanCP_VAR["obj_rA"].value;
		cmanCP_JS_textCng(argID);
		break;

	}
}

// =========================================================================================
//	テキスト入力が変更された場合	
// =========================================================================================
function cmanCP_JS_textCng(argID){


	// テキストの整備
	switch (argID){
	case 'RGB16'	:	cmanCP_JS_rgb16_TO_rgb();	cmanCP_JS_rgb_TO_hsl();		break;
	case 'RGB'	:	cmanCP_JS_rgb_TO_rgb16();	cmanCP_JS_rgb_TO_hsl();		break;
	case 'HSL'	:	cmanCP_JS_hsl_TO_rgb();		cmanCP_JS_rgb_TO_rgb16();	break;
	case 'A'	:	cmanCP_JS_chk_a();						break;
	default		:	return;								break;
	}

	// レンジの整備
	cmanCP_VAR["obj_rR"].value	= cmanCP_VAR["obj_tR"].value;
	cmanCP_VAR["obj_rG"].value	= cmanCP_VAR["obj_tG"].value;
	cmanCP_VAR["obj_rB"].value	= cmanCP_VAR["obj_tB"].value;
	cmanCP_VAR["obj_rH"].value	= cmanCP_VAR["obj_tH"].value;
	cmanCP_VAR["obj_rS"].value	= cmanCP_VAR["obj_tS"].value;
	cmanCP_VAR["obj_rL"].value	= cmanCP_VAR["obj_tL"].value;
	cmanCP_VAR["obj_rA"].value	= cmanCP_VAR["obj_tA"].value;


	// サンプル更新
	cmanCP_JS_sampleCng();
}


// =========================================================================================
//	RGB16→RGB 設定	
// =========================================================================================
function cmanCP_JS_rgb16_TO_rgb(){

	// RGB16の入力チェック＆正規化
	cmanCP_VAR["obj_tR16"].value	= cmanCP_JS_chk00toFF(cmanCP_VAR["obj_tR16"].value);
	cmanCP_VAR["obj_tG16"].value	= cmanCP_JS_chk00toFF(cmanCP_VAR["obj_tG16"].value);
	cmanCP_VAR["obj_tB16"].value	= cmanCP_JS_chk00toFF(cmanCP_VAR["obj_tB16"].value);

	// RGB置換
	cmanCP_VAR["obj_tR"].value	= parseInt(cmanCP_VAR["obj_tR16"].value, 16);
	cmanCP_VAR["obj_tG"].value	= parseInt(cmanCP_VAR["obj_tG16"].value, 16);
	cmanCP_VAR["obj_tB"].value	= parseInt(cmanCP_VAR["obj_tB16"].value, 16);
}


// =========================================================================================
//	RGB→RGB16 設定	
// =========================================================================================
function cmanCP_JS_rgb_TO_rgb16(){

	// RGBの入力チェック＆正規化
	cmanCP_VAR["obj_tR"].value	= cmanCP_JS_chk0to255(cmanCP_VAR["obj_tR"].value);
	cmanCP_VAR["obj_tG"].value	= cmanCP_JS_chk0to255(cmanCP_VAR["obj_tG"].value);
	cmanCP_VAR["obj_tB"].value	= cmanCP_JS_chk0to255(cmanCP_VAR["obj_tB"].value);

	// RGB16置換
	cmanCP_VAR["obj_tR16"].value	= cmanCP_JS_chk00toFF(parseInt(cmanCP_VAR["obj_tR"].value).toString(16));
	cmanCP_VAR["obj_tG16"].value	= cmanCP_JS_chk00toFF(parseInt(cmanCP_VAR["obj_tG"].value).toString(16));
	cmanCP_VAR["obj_tB16"].value	= cmanCP_JS_chk00toFF(parseInt(cmanCP_VAR["obj_tB"].value).toString(16));
}

// =========================================================================================
//	RGB(10進数) → HSL
// =========================================================================================
function cmanCP_JS_rgb_TO_hsl(){

	var wR		= parseInt(cmanCP_VAR["obj_tR"].value);
	var wG		= parseInt(cmanCP_VAR["obj_tG"].value);
	var wB		= parseInt(cmanCP_VAR["obj_tB"].value);

	var wMax	= Math.max(wR, wG, wB);
	var wMin	= Math.min(wR, wG, wB);

	var wH		= 0;
	var wS		= 0;
	var wL		= 0;

	// --- 色相(H) ----------------------------------------------------------
	if	(wMax == wMin)	{}
	else if	(wMax == wR)	{wH = 60 * (( wG - wB ) / ( wMax - wMin ));}
	else if	(wMax == wG)	{wH = 60 * (( wB - wR ) / ( wMax - wMin )) + 120;}
	else			{wH = 60 * (( wR - wG ) / ( wMax - wMin )) + 240;}
	if(wH < 0)		{wH = wH + 360;}
	if(wH >= 360)		{wH = 0;}

	// --- 輝度(L) ----------------------------------------------------------
	wL = ( wMax + wMin ) / 2;

	// --- 彩度(S) ----------------------------------------------------------
	if	(wMax == wMin)	{}
	else{
		if( wL <= (255 / 2) )	{wS = 255 * ( wMax -wMin ) / ( wMax + wMin );}
		else			{wS = 255 * ( wMax -wMin ) / ( 2 *  255 - ( wMax + wMin ));}
	}

	// --- 色相(H)の整数化 -------------------------------------------------
	wH = Math.round(wH);

	// --- 彩度(S)の小数1桁整備（浮動小数のためテキストで処理） ------------
	wS = Math.round(wS / 255 * 1000).toString();
	if	(wS == 0)	{}
	else if	(wS.length < 2)	{wS = ''+'0.00'+wS;}
	else if	(wS.length < 3)	{wS = ''+'0.0'+wS;}
	else if	(wS.length < 4)	{wS = ''+'0.'+wS;}
	else			{wS = wS.substr(0,1)+'.'+wS.substr(1);}

	// --- 輝度(L)の小数1桁整備（浮動小数のためテキストで処理） ------------
	wL = Math.round(wL / 255 * 1000).toString();
	if	(wL == 0)			{}
	else if	(wL.length < 2)	{wL = ''+'0.00'+wL;}
	else if	(wL.length < 3)	{wL = ''+'0.0'+wL;}
	else if	(wL.length < 4)	{wL = ''+'0.'+wL;}
	else			{wL = wL.substr(0,1)+'.'+wL.substr(1);}

	// --- 変換結果を設定 --------------------------------------------------
	cmanCP_VAR["obj_tH"].value	= wH;
	cmanCP_VAR["obj_tS"].value	= wS;
	cmanCP_VAR["obj_tL"].value	= wL;

}


// =========================================================================================
//	HSL → RGB(10進数)
// =========================================================================================
function cmanCP_JS_hsl_TO_rgb(){

	var wCal;

	// HSLの入力チェック＆正規化
	cmanCP_VAR["obj_tH"].value	= cmanCP_JS_chk0to359(cmanCP_VAR["obj_tH"].value);

	wCal			= cmanCP_JS_chk0to1s3(cmanCP_VAR["obj_tS"].value);
	if(wCal.toString()	!= cmanCP_VAR["obj_tS"].value.toString()){cmanCP_VAR["obj_tS"].value = wCal;}	// number対応

	wCal			= cmanCP_JS_chk0to1s3(cmanCP_VAR["obj_tL"].value);
	if(wCal.toString()	!= cmanCP_VAR["obj_tL"].value.toString()){cmanCP_VAR["obj_tL"].value = wCal;}	// number対応


	// HSLからRGB計算
	var wH	= parseInt(cmanCP_VAR["obj_tH"].value);
	var wS	= parseFloat(cmanCP_VAR["obj_tS"].value);
	var wL	= parseFloat(cmanCP_VAR["obj_tL"].value);

	var wMax	= 0;
	var wMin	= 0;
	var wR		= 0;
	var wG		= 0;
	var wB		= 0;

	wS = wS * 100;
	wL = wL * 100;


	if	(wL < 50){
		wMax = 2.55 * ( wL + wL * (wS / 100));
		wMin = 2.55 * ( wL - wL * (wS / 100));
	}else{
		wMax = 2.55 * ( wL + ( 100 - wL) * (wS / 100));
		wMin = 2.55 * ( wL - ( 100 - wL) * (wS / 100));
	}

	if	(wH < 60){
		wR = wMax;
		wG = (wH / 60) * (wMax - wMin ) + wMin;
		wB = wMin;

	}else if(wH < 120){
		wR = (( 120 - wH ) / 60 ) * ( wMax - wMin ) + wMin;
		wG = wMax;
		wB = wMin;

	}else if(wH < 180){
		wR = wMin;
		wG = wMax;
		wB = (( wH - 120 ) / 60 ) * ( wMax - wMin ) + wMin;

	}else if(wH < 240){
		wR = wMin;
		wG = (( 240 - wH ) / 60 ) * ( wMax - wMin ) + wMin;
		wB = wMax;

	}else if(wH < 300){
		wR = (( wH - 240 ) / 60 ) * ( wMax - wMin ) + wMin;
		wG = wMin;
		wB = wMax;

	}else{
		wR = wMax;
		wG = wMin;
		wB = (( 360 - wH ) / 60 ) * ( wMax - wMin ) + wMin;
	}

	// --- 色相(H)の整数化 -------------------------------------------------
	wR = Math.round(wR);
	wG = Math.round(wG);
	wB = Math.round(wB);

	// --- 変換結果を設定 --------------------------------------------------
	cmanCP_VAR["obj_tR"].value	= wR;
	cmanCP_VAR["obj_tG"].value	= wG;
	cmanCP_VAR["obj_tB"].value	= wB;

}


// =========================================================================================
//	Aはチェック＆正規化 設定	
// =========================================================================================
function cmanCP_JS_chk_a(){

	var wCal = cmanCP_JS_chk0to1s2(cmanCP_VAR["obj_tA"].value);
	if(wCal.toString() != cmanCP_VAR["obj_tA"].value.toString()){cmanCP_VAR["obj_tA"].value = wCal;}	// number対応
	
}

// =========================================================================================
//	16進数チェック＆正規化（0～ff）	
// =========================================================================================
function cmanCP_JS_chk00toFF(arg16){

	var wChkStr	= cmanCP_JS_zen_TO_han(arg16);
	var wRc		= 0;
	var wStrPos	= 0;

	if(wChkStr.toString().match(/^[0-9a-f]+$/i)){

		wRc = parseInt(wChkStr, 16);

		if(wRc < 0)	{wRc = 0;}
		if(wRc > 255)	{wRc = 255;}

		wRc = parseInt(wRc).toString(16);
		if(wRc.length == 1){wRc = '0'+wRc;}
	
	}

	return wRc;
}

// =========================================================================================
//	10進数チェック＆正規化（0～255）	
// =========================================================================================
function cmanCP_JS_chk0to255(arg10){

	var wChkStr	= cmanCP_JS_zen_TO_han(arg10);
	var wRc		= 0;

	if(wChkStr.toString().match(/^[0-9]+$/)){
		wRc = parseInt(wChkStr);
		if(wRc < 0)	{wRc = 0;}
		if(wRc > 255)	{wRc = 255;}
	}
	return wRc;
}

// =========================================================================================
//	10進数チェック＆正規化（0～359）	
// =========================================================================================
function cmanCP_JS_chk0to359(arg10){

	var wChkStr	= cmanCP_JS_zen_TO_han(arg10);
	var wRc		= 0;

	if(wChkStr.toString().match(/^[0-9]+$/)){
		wRc = parseInt(wChkStr);
		if(wRc < 0)	{wRc = 0;}
		if(wRc > 359)	{wRc = 359;}
	}
	return wRc;
}

// =========================================================================================
//	10進数チェック（0～1,0.1刻み）	
// =========================================================================================
function cmanCP_JS_chk0to100s1(arg10){

	var wChkStr	= cmanCP_JS_zen_TO_han(arg10);
	var wRc		= 0;

	if(wChkStr.toString().match(/^[0-9]+(\.[0-9]+)?$/)){

		wRc =  Math.round(parseFloat(wChkStr) * 10) / 10;
		if(wRc < 0)	{wRc = 0;}
		if(wRc > 100)	{wRc = 100;}

		wRc = wRc.toString();
		wPos = wRc.indexOf('.');

		if(wPos < 0){
		}else{
			wRc = wRc.substr(0,wPos)+'.'+wRc.substr(wPos+1,1);
		}

	}
	return wRc;
}

// =========================================================================================
//	10進数チェック（0～1,0.01刻み）	
// =========================================================================================
function cmanCP_JS_chk0to1s2(arg10){

	var wChkStr	= cmanCP_JS_zen_TO_han(arg10);
	var wRc		= 0;

	if(wChkStr != ''){

		if(wChkStr.toString().match(/^[0-9]+\.$/)){
			wRc = wChkStr;
		}
		else if(wChkStr.toString().match(/^[0-9]+\.0$/)){
			wRc = wChkStr;
		}
		else if(wChkStr.toString().match(/^[0-9]+(\.[0-9]+)?$/)){

			wRc = Math.round(parseFloat(wChkStr) * 100) / 100;
			if(wRc < 0)	{wRc = 0;}
			if(wRc > 1)	{wRc = 1;}

			wRc = wRc.toString().substr(0,4);

			if((wChkStr.length > wRc.length)&&(wChkStr.length <= 4)&&(wRc.substr(1,1) == '.')){
				wRc += ''+Array((wChkStr.length - wRc.length) + 1).join('0');
			}

		}
	}

	return wRc;
}

// =========================================================================================
//	10進数チェック（0～1,0.001刻み）	
// =========================================================================================
function cmanCP_JS_chk0to1s3(arg10){

	var wChkStr	= cmanCP_JS_zen_TO_han(arg10);
	var wRc		= 0;

	if(wChkStr != ''){

		if(wChkStr.toString().match(/^[0-9]+\.$/)){
			wRc = wChkStr;
		}
		else if(wChkStr.toString().match(/^[0-9]+\.0$/)){
			wRc = wChkStr;
		}
		else if(wChkStr.toString().match(/^[0-9]+\.00$/)){
			wRc = wChkStr;
		}
		else if(wChkStr.toString().match(/^[0-9]+(\.[0-9]+)?$/)){

			wRc = Math.round(parseFloat(wChkStr) * 1000) / 1000;
			if(wRc < 0)	{wRc = 0;}
			if(wRc > 1)	{wRc = 1;}

			wRc = wRc.toString().substr(0,5);

			if((wChkStr.length > wRc.length)&&(wChkStr.length <= 5)&&(wRc.substr(1,1) == '.')){
				wRc += ''+Array((wChkStr.length - wRc.length) + 1).join('0');
			}

		}
	}

	return wRc;
}

// =========================================================================================
//	全角入力対応（trimを含む）
// =========================================================================================
function cmanCP_JS_zen_TO_han(argStr){

	var wRcStr	= argStr.toString();

	var befstr = new Array("０","１","２","３","４","５","６","７","８","９","Ａ","Ｂ","Ｃ","Ｄ","Ｅ","Ｆ","ａ","ｂ","ｃ","ｄ","ｅ","ｆ","あ","え","．","。");
	var aftstr = new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","a","b","c","d","e","f","a","e",".",".");

	wRcStr = wRcStr.replace(/[ ]|[　]/g, '');
	wRcStr = wRcStr.replace(/\t|\r|\n/g, '');

	for(var i=0; i<aftstr.length; i++){
		var reg = new RegExp(befstr[i],"g");
		wRcStr = wRcStr.replace(reg, aftstr[i]);
	}

	return wRcStr;
}

// =========================================================================================
//	サンプル更新	
// =========================================================================================
function cmanCP_JS_sampleCng(){

	cmanCP_VAR["strRGB16"]	= '#'+cmanCP_VAR["obj_tR16"].value+cmanCP_VAR["obj_tG16"].value+cmanCP_VAR["obj_tB16"].value;
	cmanCP_VAR["strRGB"]	= 'rgb('+cmanCP_VAR["obj_tR"].value+', '+cmanCP_VAR["obj_tG"].value+', '+cmanCP_VAR["obj_tB"].value+')';
	cmanCP_VAR["strHSL"]	= 'hsl('+cmanCP_VAR["obj_tH"].value+', '+(cmanCP_JS_chk0to100s1(parseFloat(cmanCP_VAR["obj_tS"].value) * 100))+'%, '+(cmanCP_JS_chk0to100s1(parseFloat(cmanCP_VAR["obj_tL"].value) * 100)) + '%)';
	cmanCP_VAR["strRGBA"]	= 'rgba('+cmanCP_VAR["obj_tR"].value+', '+cmanCP_VAR["obj_tG"].value+', '+cmanCP_VAR["obj_tB"].value+', '+cmanCP_VAR["obj_tA"].value+')';
	cmanCP_VAR["strHSLA"]	= 'hsla('+cmanCP_VAR["obj_tH"].value+', '+(cmanCP_JS_chk0to100s1(parseFloat(cmanCP_VAR["obj_tS"].value) * 100))+'%, '+(cmanCP_JS_chk0to100s1(parseFloat(cmanCP_VAR["obj_tL"].value) * 100)) + '%, '+cmanCP_VAR["obj_tA"].value+')';


	// サンプル色
	document.getElementById('cmanCP_ID_sample').style.backgroundColor = cmanCP_VAR["strRGBA"];

	// HSLのガイダンスカラー
	for( var i=1; i <= 20; i++){
		document.getElementById('cmanCP_ID_gHSL_H'+i).style.backgroundColor  = 'hsl(' + ( (i - 1) * 18.9 ) + ',' + (parseFloat(cmanCP_VAR["obj_tS"].value) * 100) + '%,' + (parseFloat(cmanCP_VAR["obj_tL"].value) * 100) + '%)';
		document.getElementById('cmanCP_ID_gHSL_S'+i).style.backgroundColor  = 'hsl(' + cmanCP_VAR["obj_tH"].value + ',' + ( i * 5 ) + '%,' + (parseFloat(cmanCP_VAR["obj_tL"].value) * 100) + '%)';
		document.getElementById('cmanCP_ID_gHSL_L'+i).style.backgroundColor  = 'hsl(' + cmanCP_VAR["obj_tH"].value + ',' + (parseFloat(cmanCP_VAR["obj_tS"].value) * 100) + '%,' + ( i * 5 ) + '%)';
	}


	if(cmanCP_VAR["obj_tA"].value == '1'){
		document.getElementById('cmanCP_ID_outstr').innerHTML = '<span style="font-size:120%;white-space: nowrap;">' + cmanCP_VAR["strRGB16"] + '</span> ' +
									'<span style="padding-left:20px;white-space: nowrap;">' + cmanCP_VAR["strRGB"] + '</span> ' +
									'<span style="padding-left:20px;white-space: nowrap;">' + cmanCP_VAR["strHSL"] + '</span>';
	}else{
		document.getElementById('cmanCP_ID_outstr').innerHTML = '<span style="font-size:120%;">' + cmanCP_VAR["strRGB16"] + '<small> (opacity:' + cmanCP_VAR["obj_tA"].value + ')</small></span> ' +
									'<span style="padding-left:20px;">' + cmanCP_VAR["strRGBA"] + '</span> ' +
									'<span style="padding-left:20px;">' + cmanCP_VAR["strHSLA"] + '</span>';
	}

}

// =========================================================================================
//	この色を選択	
// =========================================================================================
function cmanCP_JS_select(){

	// ----- 返却形式 -------------------------------------------------
	var wForm	= '';
	var wOutText	= '';

	if('rc_form' in cmanCP_VAR){
		wForm = cmanCP_VAR['rc_form'].toUpperCase();
	}

	switch (wForm){
	case '#16':
		wOutText = '#'+cmanCP_VAR["obj_tR16"].value+cmanCP_VAR["obj_tG16"].value+cmanCP_VAR["obj_tB16"].value;
		break;
	case '16':
		wOutText = ''+cmanCP_VAR["obj_tR16"].value+cmanCP_VAR["obj_tG16"].value+cmanCP_VAR["obj_tB16"].value;
		break;
	case 'RGB':
		wOutText = 'rgb('+cmanCP_VAR["obj_tR"].value+', '+cmanCP_VAR["obj_tG"].value+', '+cmanCP_VAR["obj_tB"].value+')';
		break;
	case 'RGBA':
		wOutText = 'rgba('+cmanCP_VAR["obj_tR"].value+', '+cmanCP_VAR["obj_tG"].value+', '+cmanCP_VAR["obj_tB"].value+', '+cmanCP_VAR["obj_tA"].value+')';
		break;
	case 'HSL':
		wOutText = 'hsl('+cmanCP_VAR["obj_tH"].value+', '+(cmanCP_JS_chk0to100s1(parseFloat(cmanCP_VAR["obj_tS"].value) * 100))+'%, '+(cmanCP_JS_chk0to100s1(parseFloat(cmanCP_VAR["obj_tL"].value) * 100)) + '%)';
		break;
	case 'HSLA':
		wOutText = 'hsla('+cmanCP_VAR["obj_tH"].value+', '+(cmanCP_JS_chk0to100s1(parseFloat(cmanCP_VAR["obj_tS"].value) * 100))+'%, '+(cmanCP_JS_chk0to100s1(parseFloat(cmanCP_VAR["obj_tL"].value) * 100)) + '%, '+cmanCP_VAR["obj_tA"].value+')';
		break;
	default:
		if(cmanCP_VAR["obj_tA"].value == '1'){
			wOutText = 'rgb('+cmanCP_VAR["obj_tR"].value+', '+cmanCP_VAR["obj_tG"].value+', '+cmanCP_VAR["obj_tB"].value+')';
		}else{
			wOutText = 'rgba('+cmanCP_VAR["obj_tR"].value+', '+cmanCP_VAR["obj_tG"].value+', '+cmanCP_VAR["obj_tB"].value+', '+cmanCP_VAR["obj_tA"].value+')';
		}
		break;
	}

	// ----- テキスト設定 ---------------------------------------------
	var wOutTextID = [];

	if('rc_text' in cmanCP_VAR){
		wOutTextID = cmanCP_VAR["rc_text"].split(',');
	}

	for(var i=0; i<wOutTextID.length; i++){

		var wSetObj = document.getElementById(wOutTextID[i]);

		if(wSetObj){
			switch (wSetObj.tagName.toLowerCase()){
			case 'button':
			case 'data':
			case 'input':
			case 'option':
			case 'progress':
				wSetObj.value = wOutText;
				break;
			default:
				wSetObj.innerText = wOutText;
				break;
			}
		}
	}

	// ----- 背景色設定 ---------------------------------------------
	var wOutBgID = [];

	if('rc_bg' in cmanCP_VAR){
		wOutBgID = cmanCP_VAR["rc_bg"].split(',');
	}

	for(var i=0; i<wOutBgID.length; i++){

		var wSetObj = document.getElementById(wOutBgID[i]);

		if(wSetObj){
			wSetObj.style.backgroundColor = wOutText;
		}
	}

	// --- 個別画面のonload呼び出し ----------------------------------
	if('rc_func' in cmanCP_VAR){
		try{
			eval(cmanCP_VAR["rc_func"]+'("'+wOutText+'")');
		}
		catch(e){
			alert('関数('+cmanCP_VAR["rc_func"]+')を実行できません');
		}
	}

	// --- カラーパレットを閉じる ----------------------------------
	cmanCP_JS_close();

}


// =========================================================================================
//	カラーパレット移動イベント	
// =========================================================================================
function cmanCP_JS_mdown(argEvent){

	cmanCP_VAR['mdown']=1;

	cmanCP_VAR['sPosX']	= argEvent.clientX;
	cmanCP_VAR['sPosY']	= argEvent.clientY;
	cmanCP_VAR['sTop']	= parseInt(cmanCP_VAR["objPop"].style.top.replace("px", ""));
	cmanCP_VAR['sLeft']	= parseInt(cmanCP_VAR["objPop"].style.left.replace("px", ""));

	return false;

}
function cmanCP_JS_mup(argEvent){
	cmanCP_VAR['mdown']=0;
}
function cmanCP_JS_mout(argEvent){
	cmanCP_VAR['mdown']=0;
}

function cmanCP_JS_mmove(argEvent){

	if(cmanCP_VAR['mdown'] != 1){return;}
	cmanCP_VAR["objPop"].style.top = cmanCP_VAR['sTop'] - ( cmanCP_VAR['sPosY'] - argEvent.clientY) + 'px';
	cmanCP_VAR["objPop"].style.left = cmanCP_VAR['sLeft'] - ( cmanCP_VAR['sPosX'] - argEvent.clientX) + 'px';

	return false;
	
}
