/*
 * (c) Copyright Ascensio System SIA 2010-2019
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at 20A-12 Ernesta Birznieka-Upisha
 * street, Riga, Latvia, EU, LV-1050.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

"use strict";

(/**
 * @param {Window} window
 * @param {undefined} undefined
 */
	function (window, undefined) {
	// Import
	var c_oAscBorderStyles = AscCommon.c_oAscBorderStyles;

	/** @constructor */
	function CFont() {
		this.name = null;
		this.size = null;
		this.color = null;
		this.bold = false;
		this.italic = false;
		this.underline = false;
		this.strikeout = false;
		this.subscript = false;
		this.superscript = false;
	}

	CFont.prototype._init = function (font) {
		var va = font.getVerticalAlign();

		this.name = font.getName();
		this.size = font.getSize();
		this.color = Asc.colorObjToAscColor(font.getColor());
		this.bold = font.getBold();
		this.italic = font.getItalic();
		// ToDo убрать, когда будет реализовано двойное подчеркивание
		this.underline = (Asc.EUnderline.underlineNone !== font.getUnderline());
		this.strikeout = font.getStrikeout();
		this.subscript = va === AscCommon.vertalign_SubScript;
		this.superscript = va === AscCommon.vertalign_SuperScript;
	};
	CFont.prototype._initFromTextPr = function (textPr) {
		this.name = textPr.FontFamily ? textPr.FontFamily.Name : null;
		this.size = textPr.FontSize;
		this.bold = textPr.Bold;
		this.italic = textPr.Italic;
		this.underline = textPr.Underline;
		this.strikeout = textPr.Strikeout;
		this.subscript = textPr.VertAlign === AscCommon.vertalign_SubScript;
		this.superscript = textPr.VertAlign === AscCommon.vertalign_SuperScript;
		if (textPr.Unifill) {
			var oColor = textPr.Unifill.getRGBAColor();
			this.color = AscCommon.CreateAscColorCustom(oColor.R, oColor.G, oColor.B);
		} else if (textPr.Color) {
			this.color = AscCommon.CreateAscColorCustom(textPr.Color.r, textPr.Color.g, textPr.Color.b);
		}
	};
	CFont.prototype.asc_getName = function () {
		return this.name;
	};
	CFont.prototype.asc_getSize = function () {
		return this.size;
	};
	CFont.prototype.asc_getBold = function () {
		return this.bold;
	};
	CFont.prototype.asc_getItalic = function () {
		return this.italic;
	};
	CFont.prototype.asc_getUnderline = function () {
		return this.underline;
	};
	CFont.prototype.asc_getStrikeout = function () {
		return this.strikeout;
	};
	CFont.prototype.asc_getSubscript = function () {
		return this.subscript;
	};
	CFont.prototype.asc_getSuperscript = function () {
		return this.superscript;
	};
	CFont.prototype.asc_getColor = function () {
		return this.color;
	};

	/** @constructor */
	function asc_CBorder(style, color) {
		this.style = style !== undefined ? style : c_oAscBorderStyles.None;
		this.color = color !== undefined ? color : null;
	}

	asc_CBorder.prototype = {
		asc_getStyle: function () {
			return this.style;
		}, asc_getColor: function () {
			return this.color;
		}
	};

	/** @constructor */
	function asc_CBorders() {
		this.left = null;
		this.top = null;
		this.right = null;
		this.bottom = null;
		this.diagDown = null;
		this.diagUp = null;
	}

	asc_CBorders.prototype = {
		asc_getLeft: function () {
			return this.left;
		}, asc_getTop: function () {
			return this.top;
		}, asc_getRight: function () {
			return this.right;
		}, asc_getBottom: function () {
			return this.bottom;
		}, asc_getDiagDown: function () {
			return this.diagDown;
		}, asc_getDiagUp: function () {
			return this.diagUp;
		}
	};

	/** @constructor */
	function asc_CAutoFilterInfo() {
		this.tableStyleName = null;
		this.tableName = null;
		this.isApplyAutoFilter = false;   // Кнопка очистить фильтр: false - disable, true - pressed button
		this.isAutoFilter = false;  // Кнопка автофильтр (также влияет на formatTable и Sort). Возможные состояния:
		// - null - мы в пересечении с таблицой (но не полностью в ней)
		// - true/false - когда мы полностью в таблице или вне ее (true/false в зависимости от того применен фильтр или нет)
	}

	asc_CAutoFilterInfo.prototype = {
		asc_getTableStyleName: function () {
			return this.tableStyleName;
		}, asc_getTableName: function () {
			return this.tableName;
		}, asc_getIsAutoFilter: function () {
			return this.isAutoFilter;
		}, asc_getIsApplyAutoFilter: function () {
			return this.isApplyAutoFilter;
		}
	};

	/** @constructor */
	function asc_CFormatTableInfo() {
		this.tableStyleName = null;
		this.tableName = null;

		this.tableRange = null;

		this.firstRow = null;
		this.lastRow = null;
		this.bandHor = null;
		this.firstCol = null;
		this.lastCol = null;
		this.bandVer = null;
		this.filterButton = null;

		//info send in menu - what you can do with row/col into table
		this.isInsertRowAbove = null;
		this.isInsertRowBelow = null;
		this.isInsertColumnLeft = null;
		this.isInsertColumnRight = null;
		this.isDeleteRow = null;
		this.isDeleteColumn = null;
		this.isDeleteTable = null;

		this.altText = null;
		this.altTextSummary = null;
	}

	asc_CFormatTableInfo.prototype = {
		asc_getTableStyleName: function () {
			return this.tableStyleName;
		}, asc_getTableName: function () {
			return this.tableName;
		},

		asc_getFirstRow: function () {
			return this.firstRow;
		}, asc_getLastRow: function () {
			return this.lastRow;
		}, asc_getBandHor: function () {
			return this.bandHor;
		}, asc_getFirstCol: function () {
			return this.firstCol;
		}, asc_getLastCol: function () {
			return this.lastCol;
		}, asc_getBandVer: function () {
			return this.bandVer;
		}, asc_getFilterButton: function () {
			return this.filterButton;
		}, asc_getTableRange: function () {
			return this.tableRange;
		},

		asc_getIsInsertRowAbove: function () {
			return this.isInsertRowAbove;
		}, asc_getIsInsertRowBelow: function () {
			return this.isInsertRowBelow;
		}, asc_getIsInsertColumnLeft: function () {
			return this.isInsertColumnLeft;
		}, asc_getIsInsertColumnRight: function () {
			return this.isInsertColumnRight;
		}, asc_getIsDeleteRow: function () {
			return this.isDeleteRow;
		}, asc_getIsDeleteColumn: function () {
			return this.isDeleteColumn;
		}, asc_getIsDeleteTable: function () {
			return this.isDeleteTable;
		},

		asc_getTitle: function () {
			return this.altText;
		}, asc_getDescription: function () {
			return this.altTextSummary;
		}
	};

	/** @constructor */
	function asc_CCellInfo() {
		this.xfs = null;

		this.text = "";

		this.merge = Asc.c_oAscMergeOptions.None;
		this.selectionType = null;
		this.multiselect = false;
		this.lockText = false;

		this.font = new CFont();
		this.border = null;
		this.innertext = null;
		this.hyperlink = null;
		this.comment = null;
		this.isLocked = false;
		this.isLockedTable = false;
		this.isLockedSparkline = false;
		this.isLockedPivotTable = false;
		this.styleName = null;
		this.numFormatInfo = null;
		this.autoFilterInfo = null;
		this.formatTableInfo = null;
		this.sparklineInfo = null;
		this.pivotTableInfo = null;
		this.dataValidation = null;
		this.selectedColsCount = null;
		this.isLockedHeaderFooter = false;
	}

	asc_CCellInfo.prototype.asc_getText = function () {
		return this.text;
	};
	asc_CCellInfo.prototype.asc_getMerge = function () {
		return this.merge;
	};
	asc_CCellInfo.prototype.asc_getSelectionType = function () {
		return this.selectionType;
	};
	asc_CCellInfo.prototype.asc_getMultiselect = function () {
		return this.multiselect;
	};
	asc_CCellInfo.prototype.asc_getLockText = function () {
		return this.lockText;
	};
	asc_CCellInfo.prototype.asc_getHorAlign = function () {
		return this.xfs.getAlign2().getAlignHorizontal();
	};
	asc_CCellInfo.prototype.asc_getVertAlign = function () {
		return this.xfs.getAlign2().getAlignVertical();
	};
    asc_CCellInfo.prototype.asc_getAngle = function () {
        return this.xfs.getAlign2().getAngle();
    };
	asc_CCellInfo.prototype.asc_getWrapText = function () {
		return this.xfs.getAlign2().getWrap();
	};
	asc_CCellInfo.prototype.asc_getShrinkToFit = function () {
		return this.xfs.getAlign2().getShrinkToFit();
	};
	asc_CCellInfo.prototype.asc_getFont = function () {
		return this.font;
	};
	asc_CCellInfo.prototype.asc_getFillColor = function () {
		return Asc.colorObjToAscColor(this.asc_getFill().bg());
	};
	asc_CCellInfo.prototype.asc_getFill = function () {
		return this.xfs.getFill2().clone();
	};
	asc_CCellInfo.prototype.asc_getBorders = function () {
		return this.border;
	};
	asc_CCellInfo.prototype.asc_getInnerText = function () {
		return this.innertext;
	};
	asc_CCellInfo.prototype.asc_getNumFormat = function () {
		return this.xfs.getNum2().getNumFormatStr();
	};
	asc_CCellInfo.prototype.asc_getNumFormatInfo = function () {
		return this.numFormatInfo;
	};
	asc_CCellInfo.prototype.asc_getHyperlink = function () {
		return this.hyperlink;
	};
	asc_CCellInfo.prototype.asc_getComments = function () {
		return this.comment ? [this.comment] : [];
	};
	asc_CCellInfo.prototype.asc_getLocked = function () {
		return this.isLocked;
	};
	asc_CCellInfo.prototype.asc_getLockedTable = function () {
		return this.isLockedTable;
	};
	asc_CCellInfo.prototype.asc_getLockedSparkline = function () {
		return this.isLockedSparkline;
	};
	asc_CCellInfo.prototype.asc_getLockedPivotTable = function () {
		return this.isLockedPivotTable;
	};
	asc_CCellInfo.prototype.asc_getStyleName = function () {
		return this.styleName;
	};
	asc_CCellInfo.prototype.asc_getAutoFilterInfo = function () {
		return this.autoFilterInfo;
	};
	asc_CCellInfo.prototype.asc_getFormatTableInfo = function () {
		return this.formatTableInfo;
	};
	asc_CCellInfo.prototype.asc_getSparklineInfo = function () {
		return this.sparklineInfo;
	};
	asc_CCellInfo.prototype.asc_getPivotTableInfo = function () {
		return this.pivotTableInfo;
	};
	asc_CCellInfo.prototype.asc_getDataValidation = function () {
		return this.dataValidation;
	};
	asc_CCellInfo.prototype.asc_getSelectedColsCount = function () {
		return this.selectedColsCount;
	};
	asc_CCellInfo.prototype.asc_getLockedHeaderFooter = function () {
		return this.isLockedHeaderFooter;
	};

	/** @constructor */
	function asc_CDefName(n, r, s, t, h, l, x, bLocale) {
		this.Name = n;
		this.LocalSheetId = s;
		this.Ref = r;
		this.isTable = t;
		this.Hidden = h;
		this.isLock = l;
		this.isXLNM = x;

		if(bLocale) {
			this._translate()
		}
	}

	asc_CDefName.prototype = {
		asc_getName: function (bLocale) {
			return bLocale && null !== this.LocalSheetId ? AscCommon.translateManager.getValue(this.Name) : this.Name;
		}, asc_getScope: function () {
			return this.LocalSheetId;
		}, asc_getRef: function () {
			return this.Ref;
		}, asc_getIsTable: function () {
			return this.isTable;
		}, asc_getIsHidden: function () {
			return this.Hidden;
		}, asc_getIsLock: function () {
			return this.isLock;
		}, asc_getIsXlnm: function () {
			return this.isXLNM;
		}, _translate: function() {
			if(null !== this.LocalSheetId) {
				var translatePrintArea = AscCommonExcel.tryTranslateToPrintArea(this.Name);
				if(translatePrintArea) {
					this.Name = translatePrintArea;
					this.isXLNM = true;
				}
			}
		}
	};

	/** @constructor */
	function asc_CCheckDefName(s, r) {
		this.status = s;
		this.reason = r;
	}

	asc_CCheckDefName.prototype.asc_getStatus = function () {
		return this.status;
	};
	asc_CCheckDefName.prototype.asc_getReason = function () {
		return this.reason;
	};

	//----------------------------------------------------------export----------------------------------------------------
	var prot;
	window['Asc'] = window['Asc'] || {};
	window['AscCommonExcel'] = window['AscCommonExcel'] || {};

	window["AscCommonExcel"].CFont = CFont;
	prot = CFont.prototype;
	prot["asc_getName"] = prot.asc_getName;
	prot["asc_getSize"] = prot.asc_getSize;
	prot["asc_getBold"] = prot.asc_getBold;
	prot["asc_getItalic"] = prot.asc_getItalic;
	prot["asc_getUnderline"] = prot.asc_getUnderline;
	prot["asc_getStrikeout"] = prot.asc_getStrikeout;
	prot["asc_getSubscript"] = prot.asc_getSubscript;
	prot["asc_getSuperscript"] = prot.asc_getSuperscript;
	prot["asc_getColor"] = prot.asc_getColor;

	window["Asc"].asc_CBorder = window["Asc"]["asc_CBorder"] = asc_CBorder;
	prot = asc_CBorder.prototype;
	prot["asc_getStyle"] = prot.asc_getStyle;
	prot["asc_getColor"] = prot.asc_getColor;

	window["AscCommonExcel"].asc_CBorders = asc_CBorders;
	prot = asc_CBorders.prototype;
	prot["asc_getLeft"] = prot.asc_getLeft;
	prot["asc_getTop"] = prot.asc_getTop;
	prot["asc_getRight"] = prot.asc_getRight;
	prot["asc_getBottom"] = prot.asc_getBottom;
	prot["asc_getDiagDown"] = prot.asc_getDiagDown;
	prot["asc_getDiagUp"] = prot.asc_getDiagUp;

	window["AscCommonExcel"].asc_CAutoFilterInfo = asc_CAutoFilterInfo;
	prot = asc_CAutoFilterInfo.prototype;
	prot["asc_getTableStyleName"] = prot.asc_getTableStyleName;
	prot["asc_getTableName"] = prot.asc_getTableName;
	prot["asc_getIsAutoFilter"] = prot.asc_getIsAutoFilter;
	prot["asc_getIsApplyAutoFilter"] = prot.asc_getIsApplyAutoFilter;

	window["AscCommonExcel"].asc_CFormatTableInfo = asc_CFormatTableInfo;
	prot = asc_CFormatTableInfo.prototype;
	prot["asc_getTableStyleName"] = prot.asc_getTableStyleName;
	prot["asc_getTableName"] = prot.asc_getTableName;
	prot["asc_getFirstRow"] = prot.asc_getFirstRow;
	prot["asc_getLastRow"] = prot.asc_getLastRow;
	prot["asc_getBandHor"] = prot.asc_getBandHor;
	prot["asc_getFirstCol"] = prot.asc_getFirstCol;
	prot["asc_getLastCol"] = prot.asc_getLastCol;
	prot["asc_getBandVer"] = prot.asc_getBandVer;
	prot["asc_getFilterButton"] = prot.asc_getFilterButton;
	prot["asc_getTableRange"] = prot.asc_getTableRange;
	prot["asc_getIsInsertRowAbove"] = prot.asc_getIsInsertRowAbove;
	prot["asc_getIsInsertRowBelow"] = prot.asc_getIsInsertRowBelow;
	prot["asc_getIsInsertColumnLeft"] = prot.asc_getIsInsertColumnLeft;
	prot["asc_getIsInsertColumnRight"] = prot.asc_getIsInsertColumnRight;
	prot["asc_getIsDeleteRow"] = prot.asc_getIsDeleteRow;
	prot["asc_getIsDeleteColumn"] = prot.asc_getIsDeleteColumn;
	prot["asc_getIsDeleteTable"] = prot.asc_getIsDeleteTable;
	prot["asc_getTitle"] = prot.asc_getTitle;
	prot["asc_getDescription"] = prot.asc_getDescription;

	window["AscCommonExcel"].asc_CCellInfo = asc_CCellInfo;
	prot = asc_CCellInfo.prototype;
	prot["asc_getText"] = prot.asc_getText;
	prot["asc_getMerge"] = prot.asc_getMerge;
	prot["asc_getSelectionType"] = prot.asc_getSelectionType;
	prot["asc_getMultiselect"] = prot.asc_getMultiselect;
	prot["asc_getLockText"] = prot.asc_getLockText;
	prot["asc_getHorAlign"] = prot.asc_getHorAlign;
	prot["asc_getVertAlign"] = prot.asc_getVertAlign;
	prot["asc_getWrapText"] = prot.asc_getWrapText;
	prot["asc_getShrinkToFit"] = prot.asc_getShrinkToFit;
	prot["asc_getFont"] = prot.asc_getFont;
	prot["asc_getFillColor"] = prot.asc_getFillColor;
	prot["asc_getFill"] = prot.asc_getFill;
	prot["asc_getBorders"] = prot.asc_getBorders;
	prot["asc_getInnerText"] = prot.asc_getInnerText;
	prot["asc_getNumFormat"] = prot.asc_getNumFormat;
	prot["asc_getNumFormatInfo"] = prot.asc_getNumFormatInfo;
	prot["asc_getHyperlink"] = prot.asc_getHyperlink;
	prot["asc_getComments"] = prot.asc_getComments;
	prot["asc_getLocked"] = prot.asc_getLocked;
	prot["asc_getLockedTable"] = prot.asc_getLockedTable;
	prot["asc_getLockedSparkline"] = prot.asc_getLockedSparkline;
	prot["asc_getLockedPivotTable"] = prot.asc_getLockedPivotTable;
	prot["asc_getStyleName"] = prot.asc_getStyleName;
	prot["asc_getAngle"] = prot.asc_getAngle;
	prot["asc_getAutoFilterInfo"] = prot.asc_getAutoFilterInfo;
	prot["asc_getFormatTableInfo"] = prot.asc_getFormatTableInfo;
	prot["asc_getSparklineInfo"] = prot.asc_getSparklineInfo;
	prot["asc_getPivotTableInfo"] = prot.asc_getPivotTableInfo;
	prot["asc_getDataValidation"] = prot.asc_getDataValidation;
	prot["asc_getSelectedColsCount"] = prot.asc_getSelectedColsCount;
	prot["asc_getLockedHeaderFooter"] = prot.asc_getLockedHeaderFooter;

	window["Asc"].asc_CDefName = window["Asc"]["asc_CDefName"] = asc_CDefName;
	prot = asc_CDefName.prototype;
	prot["asc_getName"] = prot.asc_getName;
	prot["asc_getScope"] = prot.asc_getScope;
	prot["asc_getRef"] = prot.asc_getRef;
	prot["asc_getIsTable"] = prot.asc_getIsTable;
	prot["asc_getIsHidden"] = prot.asc_getIsHidden;
	prot["asc_getIsLock"] = prot.asc_getIsLock;
	prot["asc_getIsXlnm"] = prot.asc_getIsXlnm;

	window["Asc"].asc_CCheckDefName = window["Asc"]["asc_CCheckDefName"] = asc_CCheckDefName;
	prot = asc_CCheckDefName.prototype;
	prot["asc_getStatus"] = prot.asc_getStatus;
	prot["asc_getReason"] = prot.asc_getReason;

})(window);
