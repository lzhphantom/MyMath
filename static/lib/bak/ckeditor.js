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
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import Alignment from "@ckeditor/ckeditor5-alignment/src/alignment";
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
	Alignment,
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
	SquarePlugin
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
			'SquarePlugin'
		]
	},
	// This value must be kept in sync with the language defined in webpack.config.js.
	language: 'zh-cn'
};

import times from "@ckeditor/ckeditor5-core/theme/icons/times.svg"
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
					editor.model.insertContent(writer.createText('\\times'));
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
					editor.model.insertContent(writer.createText('\\sqrt[]{}'));
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
					editor.model.insertContent(writer.createText('\\frac {}{}'));
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
					editor.model.insertContent(writer.createText('\\div'));
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
					editor.model.insertContent(writer.createText('\\cup'));
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
					editor.model.insertContent(writer.createText('\\cap'));
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
					editor.model.insertContent(writer.createText('log_{} {}'));
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
					editor.model.insertContent(writer.createText('lg {}'));
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
					editor.model.insertContent(writer.createText('ln {}'));
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
					editor.model.insertContent(writer.createText('d {}'));
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
					editor.model.insertContent(writer.createText('\\int_{x}^{y}'));
				});
			});
			return view;
		});
	}
}

/**
 * 平方
 */
class SquarePlugin extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('SquarePlugin', locale => {
			const view = new ButtonView(locale);
			view.set({
				label: '平方',
				icon: square,
				tooltip: true
			});
			view.on('execute',()=>{
				editor.model.change(writer=>{
					editor.model.insertContent(writer.createText('{}^{2}'));
				});
			});
			return view;
		});
	}
}
