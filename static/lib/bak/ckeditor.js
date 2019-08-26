/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// The editor creator to use.
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Plugin from "@ckeditor/ckeditor5-core/src/plugin"
import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview"

export default class ClassicEditor extends ClassicEditorBase {
}

// Plugins to include in the build.
ClassicEditor.builtinPlugins = [
	Essentials,
	UploadAdapter,
	Autoformat,
	Bold,
	Italic,
	BlockQuote,
	CKFinder,
	EasyImage,
	Heading,
	Image,
	ImageCaption,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	Link,
	List,
	MediaEmbed,
	Paragraph,
	TimesPlugin,
	SqrtPlugin,
	FracPlugin,
	DivPlugin,
	CupPlugin,
	CapPlugin,
	LogPlugin,
	LgPlugin,
	LnPlugin,
	DtPlugin,
	IntPlugin,
	SquarePlugin,
	ApproximatelyEqualPlugin,
	NeqPlugin,
	GePlugin,
	LePlugin,
	SimPlugin,
	CongPlugin,
	BotPlugin,
	PmPlugin,
	TrianglePlugin,
	LimPlugin,
	InPlugin,
	NotInPlugin,
	AnglePlugin,
	BecausePlugin,
	ThereforePlugin,
	SubsetPlugin,
	SubseteqPlugin,
	SupseteqPlugin,
	SubsetneqPlugin,
	SupsetneqPlugin,
	PiPlugin,
	SupsetPlugin,
	CdotPlugin,
	FxPlugin,
	BottomPlugin,
	TablePlugin,
];

// Editor configuration.
ClassicEditor.defaultConfig = {
	toolbar: {
		items: [
			'bold',
			'italic',
			'|',
			'TimesPlugin',
			'SqrtPlugin',
			'FracPlugin',
			'DivPlugin',
			'CupPlugin',
			'CapPlugin',
			'LogPlugin',
			'LgPlugin',
			'LnPlugin',
			'DtPlugin',
			'IntPlugin',
			'ApproximatelyEqualPlugin',
			'NeqPlugin',
			'GePlugin',
			'LePlugin',
			'SimPlugin',
			'CongPlugin',
			'BotPlugin',
			'PmPlugin',
			'TrianglePlugin',
			'LimPlugin',
			'InPlugin',
			'NotInPlugin',
			'AnglePlugin',
			'BecausePlugin',
			'ThereforePlugin',
			'SubsetPlugin',
			'SupsetPlugin',
			'SupseteqPlugin',
			'SubseteqPlugin',
			'SubsetneqPlugin',
			'SupsetneqPlugin',
			'PiPlugin',
			'CdotPlugin',
			'FxPlugin',
			'BottomPlugin',
			'SquarePlugin',
			'TablePlugin',
		]
	},
	// This value must be kept in sync with the language defined in webpack.config.js.
	language: 'zh-cn'
};

import times from "@ckeditor/ckeditor5-core/theme/icons/times.svg"
import pi from "@ckeditor/ckeditor5-core/theme/icons/pi.svg"
import table from "@ckeditor/ckeditor5-core/theme/icons/table.svg"
import bottom from "@ckeditor/ckeditor5-core/theme/icons/bottom.svg"
import fx from "@ckeditor/ckeditor5-core/theme/icons/fx.svg"
import cdot from "@ckeditor/ckeditor5-core/theme/icons/cdot.svg"
import subseteq from "@ckeditor/ckeditor5-core/theme/icons/subseteq.svg"
import supseteq from "@ckeditor/ckeditor5-core/theme/icons/supseteq.svg"
import subsetneq from "@ckeditor/ckeditor5-core/theme/icons/subsetneq.svg"
import supsetneq from "@ckeditor/ckeditor5-core/theme/icons/supsetneq.svg"
import subset from "@ckeditor/ckeditor5-core/theme/icons/subset.svg"
import supset from "@ckeditor/ckeditor5-core/theme/icons/supset.svg"
import therefore from "@ckeditor/ckeditor5-core/theme/icons/therefore.svg"
import angle from "@ckeditor/ckeditor5-core/theme/icons/angle.svg"
import because from "@ckeditor/ckeditor5-core/theme/icons/because.svg"
import in1 from "@ckeditor/ckeditor5-core/theme/icons/in.svg"
import notin from "@ckeditor/ckeditor5-core/theme/icons/notin.svg"
import lim from "@ckeditor/ckeditor5-core/theme/icons/times.svg"
import triangle from "@ckeditor/ckeditor5-core/theme/icons/triangle.svg"
import pm from "@ckeditor/ckeditor5-core/theme/icons/pm.svg"
import bot from "@ckeditor/ckeditor5-core/theme/icons/bot.svg"
import sim from "@ckeditor/ckeditor5-core/theme/icons/times.svg"
import cong from "@ckeditor/ckeditor5-core/theme/icons/times.svg"
import le from "@ckeditor/ckeditor5-core/theme/icons/le.svg"
import sqrt1 from "@ckeditor/ckeditor5-core/theme/icons/sqrt1.svg"
import frac from "@ckeditor/ckeditor5-core/theme/icons/frac.svg"
import div1 from "@ckeditor/ckeditor5-core/theme/icons/divide.svg"
import cup from "@ckeditor/ckeditor5-core/theme/icons/cup.svg"
import cap from "@ckeditor/ckeditor5-core/theme/icons/cap.svg"
import log1 from "@ckeditor/ckeditor5-core/theme/icons/log.svg"
import lg from "@ckeditor/ckeditor5-core/theme/icons/lg.svg"
import ln from "@ckeditor/ckeditor5-core/theme/icons/ln.svg"
import dt from "@ckeditor/ckeditor5-core/theme/icons/dt.svg"
import int1 from "@ckeditor/ckeditor5-core/theme/icons/integral.svg"
import square from "@ckeditor/ckeditor5-core/theme/icons/square.svg"
import approx from "@ckeditor/ckeditor5-core/theme/icons/approx.svg"
import neq from "@ckeditor/ckeditor5-core/theme/icons/neq.svg"
import ge from "@ckeditor/ckeditor5-core/theme/icons/ge.svg"

/**
 * 乘号
 */
class TimesPlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('TimesPlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: '乘',
				icon: times,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{\\times}'));
				});
			});
			return view;
		});


	}
}

/**
 * 平方根
 */
class SqrtPlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('SqrtPlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: '平方根系列',
				icon: sqrt1,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{\\sqrt[n]{a}}'));
				});
			});
			return view;
		});
	}
}

/**
 * 分数
 */
class FracPlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('FracPlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: '分数',
				icon: frac,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{\\frac {b}{a}}'));
				});
			});
			return view;
		});
	}
}

/**
 * 除号
 */
class DivPlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('DivPlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: '除',
				icon: div1,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{\\div}'));
				});
			});
			return view;
		});
	}
}

/**
 * 并集
 */
class CupPlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('CupPlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: '并集',
				icon: cup,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{\\cup}'));
				});
			});
			return view;
		});
	}
}

/**
 * 交集
 */
class CapPlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('CapPlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: '交集',
				icon: cap,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{\\cap}'));
				});
			});
			return view;
		});
	}
}

/**
 * log
 */
class LogPlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('LogPlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: 'Log',
				icon: log1,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{\\log_{m} {n}}'));
				});
			});
			return view;
		});
	}
}

/**
 * lg
 */
class LgPlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('LgPlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: 'Lg',
				icon: lg,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{\\lg {a}}'));
				});
			});
			return view;
		});
	}
}

/**
 * ln
 */
class LnPlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('LnPlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: 'Ln',
				icon: ln,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{\\ln {e}}'));
				});
			});
			return view;
		});
	}
}

/**
 * 微分
 */
class DtPlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('DtPlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: '微分',
				icon: dt,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{d {t}}'));
				});
			});
			return view;
		});
	}
}

/**
 * 积分
 */
class IntPlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('IntPlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: '积分',
				icon: int1,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{\\int_{x}^{y}}'));
				});
			});
			return view;
		});
	}
}

/**
 * 上标
 */
class SquarePlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('SquarePlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: '上标',
				icon: square,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{{m}^{x}}'));
				});
			});
			return view;
		});
	}
}

/**
 * 近似符号
 */
class ApproximatelyEqualPlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('ApproximatelyEqualPlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: '近似符号',
				icon: approx,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{\\approx}'));
				});
			});
			return view;
		});
	}
}

/**
 * 不等于
 */
class NeqPlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('NeqPlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: '不等于',
				icon: neq,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{\\neq}'));
				});
			});
			return view;
		});
	}
}

/**
 * 大于等于
 */
class GePlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('GePlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: '大于等于',
				icon: ge,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{\\ge}'));
				});
			});
			return view;
		});
	}
}

/**
 * 小于等于
 */
class LePlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('LePlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: '小于等于',
				icon: le,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{\\le}'));
				});
			});
			return view;
		});
	}
}

/**
 * 相似符号
 */
class SimPlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('SimPlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: '近似',
				icon: sim,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{\\sim}'));
				});
			});
			return view;
		});
	}
}

/**
 * 全等
 */
class CongPlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('CongPlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: '全等',
				icon: cong,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{\\cong}'));
				});
			});
			return view;
		});
	}
}

/**
 * 垂直
 */
class BotPlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('BotPlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: '垂直',
				icon: bot,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{\\bot}'));
				});
			});
			return view;
		});
	}
}

/**
 * 正负
 */
class PmPlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('PmPlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: '正负',
				icon: pm,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{\\pm}'));
				});
			});
			return view;
		});
	}
}

/**
 * 三角形
 */
class TrianglePlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('TrianglePlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: '三角形',
				icon: triangle,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{\\triangle}'));
				});
			});
			return view;
		});
	}
}

/**
 * lim
 */
class LimPlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('LimPlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: 'lim',
				icon: lim,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{\\lim\\limits_{n \\to \\infty}'));
				});
			});
			return view;
		});
	}
}

/**
 * 属于
 */
class InPlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('InPlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: '属于',
				icon: in1,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{\\in}'));
				});
			});
			return view;
		});
	}
}

/**
 * 不属于
 */
class NotInPlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('NotInPlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: '不属于',
				icon: notin,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{\\notin}'));
				});
			});
			return view;
		});
	}
}

/**
 * 角
 */
class AnglePlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('AnglePlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: '∠',
				icon: angle,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{\\angle}'));
				});
			});
			return view;
		});
	}
}

/**
 * 因为
 */
class BecausePlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('BecausePlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: '因为',
				icon: because,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{\\because}'));
				});
			});
			return view;
		});
	}
}

/**
 * 所以
 */
class ThereforePlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('ThereforePlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: '所以',
				icon: therefore,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{\\therefore}'));
				});
			});
			return view;
		});
	}
}

/**
 * 包含
 */
class SubsetPlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('SubsetPlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: '包含',
				icon: subset,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{\\subset}'));
				});
			});
			return view;
		});
	}
}

/**
 * 包含于
 */
class SupsetPlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('SupsetPlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: '包含于',
				icon: supset,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{\\supset}'));
				});
			});
			return view;
		});
	}
}

/**
 * 包含
 */
class SubseteqPlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('SubseteqPlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: '包含',
				icon: subseteq,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{\\subseteq}'));
				});
			});
			return view;
		});
	}
}
/**
 * 包含于
 */
class SupseteqPlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('SupseteqPlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: '包含于',
				icon: supseteq,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{\\supseteq}'));
				});
			});
			return view;
		});
	}
}

/**
 * 真包含于
 */
class SupsetneqPlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('SupsetneqPlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: '真包含于',
				icon: supsetneq,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{\\supsetneq}'));
				});
			});
			return view;
		});
	}
}

/**
 * 真包含
 */
class SubsetneqPlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('SubsetneqPlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: '真包含',
				icon: subsetneq,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{\\subsetneq}'));
				});
			});
			return view;
		});
	}
}

/**
 * π
 */
class PiPlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('PiPlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: 'π',
				icon: pi,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{\\pi}'));
				});
			});
			return view;
		});
	}
}

/**
 * ·
 */
class CdotPlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('CdotPlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: '·',
				icon: cdot,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{\\cdot}'));
				});
			});
			return view;
		});
	}
}

/**
 * 多条件表达式
 */
class FxPlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('FxPlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: '多条件表达式',
				icon: fx,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{f(x)= \\begin{cases} {表达式1},& {条件1}\\\\ {表达式2}, &{条件2}\\\\ \\end{cases} }'));
				});
			});
			return view;
		});
	}
}

/**
 * 下标
 */
class BottomPlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('BottomPlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: '下标',
				icon: bottom,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{{x}_{a}}'));
				});
			});
			return view;
		});
	}
}

/**
 * 表格
 */
class TablePlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('TablePlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: '表格',
				icon: table,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{\\begin{array}{c|lcr}                                                                                                                                          n & \\text{Left} & \\text{Center} & \\text{Right}\\\\                                                                                                \\hline 1 & 0.24 & 1 & 125 \\\\                                                                                                                                      2 & -1 & 189 & -8 \\\\                                                                                                                                        3 & -20 & 2000 & 1+10i\\end{array}}'));
				});
			});
			return view;
		});
	}
}
