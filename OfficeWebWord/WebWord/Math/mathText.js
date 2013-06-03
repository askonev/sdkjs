//change FontSize
// api 2003: asc_docs_api.prototype.put_TextPrFontSize
//Document: Paragraph_Add

//api 2215: asc_docs_api.prototype.sync_TextPrFontSizeCallBack
// возвращает размер шрифта

//api 2212: asc_docs_api.prototype.sync_TextPrFontFamilyCallBack
// возвращает название шрифта

function CMathText(params)
{
    this.pos = null;
    this.size = null;
    this.sizeSymbol = null;

    //this.value = val;
    this.font = { FontFamily: params.font.FontFamily,  FontSize : params.font.FontSize };
    this.metrics = params.font.metrics;
    this.indefSize = params.indefSize;

    this.bMText = params.bMText ? true : false;

    
    this.SUBCONTENT = false;
    this.empty = false;

    this.transform = {
        sx:  1,
        shy: 0,
        shx: 0,
        sy:  1
    };

}
//TODO
//переделать индефикатор размера перетащить в инициализацию
CMathText.prototype =
{
    init: function(code)
    {
        this.add(code);

        //MathControl.pGraph.transform(1, 0, 0, 1, 0, 0);
        this.setIndefSize(this.indefSize);
    },
    recalculateSize_2: function()
    {
        g_oTextMeasurer.SetFont(this.font);

        var metricsTxt = g_oTextMeasurer.Measure2Code(this.value);
        var _width = metricsTxt.Width;

        //var _ascent = g_oTextMeasurer.GetHeight() + g_oTextMeasurer.GetDescender();
        //var _descent = (-1)*g_oTextMeasurer.GetDescender();

        var _ascent = metricsTxt.Ascent;
        var _descent = (metricsTxt.Height - metricsTxt.Ascent);
        var _height = _ascent + _descent;
        var placeholder = this.metrics.Placeholder;
        var  _center = _ascent - placeholder.Height*0.375;

        this.sizeSymbol = {width: _width, height: _height, center: _center, ascent: _ascent, descent: _descent};
        this.size = {width: _width, height: _height, center: _center, ascent: _ascent, descent: _descent, gap: 0 };
    },
    recalculateSize_1: function()
    {
        var FontHeight =  this.metrics.Height;
        var FontDescent = this.metrics.Descender;

        g_oTextMeasurer.SetFont(this.font);
        var metricsTxt = g_oTextMeasurer.Measure2Code(this.value);
        var _width = metricsTxt.Width;
        var _ascent = metricsTxt.Ascent;
        var placeholder = this.metrics.Placeholder;
        var  _center = _ascent - placeholder.Height/2;

        //var _descent = FontHeight - FontDescent - placeholder.Height;
        var _descent = FontHeight - placeholder.Height;
        var _height = _ascent + _descent;

        this.sizeSymbol = {width: _width, height: _height, center: _center, ascent: _ascent, descent: _descent};
        this.size = {width: _width, height: _height, center: _center, ascent: _ascent, descent: _descent, gap: 0 };
    },

    // ascent = Symbol.Ascent // = Placeholder.Ascent (= Placeholder.Height)
    // descent = FontAscent - Placeholder.Height (FontAscent = FontHeight - FontDescent)

    // ascent = FontDescent + Placeholder.Height
    // descent = Symbol.Descent ( = 0)

    // gap = FontHeight - FontDescent - Placeholder.Height + FontDescent

    recalculateSize_3: function()
    {
        var FontHeight =  this.metrics.Height;
        var FontDescent = this.metrics.Descender;

        g_oTextMeasurer.SetFont(this.font);
        var metricsTxt = g_oTextMeasurer.Measure2Code(this.value);
        var TxtDescent = metricsTxt.Height - metricsTxt.Ascent;

        var _width = metricsTxt.Width;
        var placeholder = this.metrics.Placeholder;

        var _descent = TxtDescent;
        //var _ascent = FontHeight - FontDescent;
        var _ascent = FontDescent + placeholder.Height;
        var _height = _descent + _ascent;

        var  _center = _ascent - placeholder.Height/2;

        this.sizeSymbol = {width: _width, height: _height, center: _center, ascent: _ascent, descent: _descent};
        this.size = {width: _width, height: _height, center: _center, ascent: _ascent, descent: _descent, gap: 0 };
    },
    recalculateSize_4: function()
    {
        g_oTextMeasurer.SetFont(this.font);

        var metricsTxt = g_oTextMeasurer.Measure2Code(this.value);
        //    ??!!
        var gap = metricsTxt.Ascent - g_oTextMeasurer.Measure2Code(0x1D44E).Ascent - metricsTxt.Height;
        gap = gap < g_dKoef_pt_to_mm  ? g_dKoef_pt_to_mm  : gap;
        //

        var _width = metricsTxt.WidthG;
        var _height = metricsTxt.Height + gap;
        var _ascent = metricsTxt.Ascent;
        //var _ascent = _height/2;
        var _descent = _height/2;
        var _center = _height/2;

        this.sizeSymbol = {width: _width, height: _height, center: _center, ascent: _ascent, descent: _descent};
        this.size = {width: _width, height: _height, center: _center, ascent: _ascent, descent: _descent, gap: 0 };
    },
    old_draw: function()
    {
        MathControl.pGraph.b_color1(0,0,0,255);
        MathControl.pGraph.SetFont(this.font);

        var sx = this.transform.sx, shx = this.transform.shx,
            shy = this.transform.shy, sy = this.transform.sy;
        var X = this.pos.x,
            Y = this.pos.y - this.size.center + this.size.ascent;

        var tx = X*(1 - sx) - Y*shx;
        var ty = Y*(1 - sy) - X*shy;
        
        MathControl.pGraph.transform(sx, shy, shx, sy, tx, ty);
        MathControl.pGraph.FillTextCode(X, Y , this.value); // прибавляем аскент, тк на отрисовку символа отправляем положение baseLine

        //var tx = 0;
        //var ty = 0;

        //var x = (X*sy  - Y*shx - tx*sy)/(sx*sy- shy*shx);
        //var y = (Y - x*shy - ty*shx)/sy;

        //MathControl.pGraph.transform(sx, shy, shx, sy, tx, ty);
        //MathControl.pGraph.FillTextCode(x, y , this.value); // прибавляем аскент, тк на отрисовку символа отправляем положение baseLine
    },
    draw: function()
    {
        MathControl.pGraph.b_color1(0,0,0,255);
        MathControl.pGraph.SetFont(this.font);

        var X = this.pos.x ,
            Y = this.pos.y - this.size.center + this.size.ascent; // прибавляем аскент, тк на отрисовку символа отправляем положение baseLine

        var invert = new CMatrix();
        invert.sx = this.transform.sx;
        invert.sy = this.transform.sy;
        invert.shx = this.transform.shx;
        invert.shy = this.transform.shy;
        invert.tx = 0;
        invert.ty = 0;
        invert.Invert();

        var xx = invert.TransformPointX(X, Y);
        var yy = invert.TransformPointY(X, Y);

        /*var invert1= new CMatrix();
        invert1.sx = this.transform.sx;
        invert1.sy = this.transform.sy;
        invert1.shx = this.transform.shx;
        invert1.shy = this.transform.shy;
        invert1.tx = 0;
        invert1.ty = 0;

        var xxx = invert1.TransformPointX(xx, yy);
        var yyy = invert1.TransformPointY(xx, yy);*/

        var sx = this.transform.sx, shx = this.transform.shx,
            shy = this.transform.shy, sy = this.transform.sy;

        var tx = 0;
        var ty = 0;
        
        /*var x = (X*sy  - Y*shx - tx*sy)/(sx*sy- shy*shx);
        var y = (Y - x*shy - ty*shx)/sy;*/

        MathControl.pGraph.transform(sx, shy, shx, sy, 0, 0);
        MathControl.pGraph.FillTextCode(xx, yy , this.value);

    },
    draw2: function()
    {
        MathControl.pGraph.b_color1(0,0,0,255);
        MathControl.pGraph.SetFont(this.font);

        var sx = this.transform.sx, shx = this.transform.shx,
            shy = this.transform.shy, sy = this.transform.sy;
        var X = this.pos.x,
            Y = this.pos.y - this.size.center + this.size.ascent;

        var tx = 0;
        var ty = 0;

        var x = (X*sy  - Y*shx - tx*sy)/(sx*sy- shy*shx);
        var y = (Y - x*shy - ty*shx)/sy;

        MathControl.pGraph.transform(sx, shy, shx, sy, tx, ty);
        MathControl.pGraph.FillTextCode(x, y , this.value); // прибавляем аскент, тк на отрисовку символа отправляем положение baseLine
    },
    getMetrics: function()
    {
        return g_oTextMeasurer.Measure2Code(this.value);
    },
    setFont: function(font)
    {
        this.font = font;
        this.recalculateSize();
    },
    setPosition: function( _pos )
    {
        /*if(this.value == 0x307)
            this.pos = {x : _pos.x + this.size.width, y: _pos.y };
        else
            this.pos = {x : _pos.x, y: _pos.y };
        */

        this.pos = {x : _pos.x, y: _pos.y };
    },
    setIndefSize: function(indef)
    {
        if(indef == indef - 0 && indef > 0 && indef < 5)
        {
            switch( indef )
            {
                case SizeOrdinary:
                    this.recalculateSize = this.recalculateSize_1;
                    break;
                case SizeDefault:
                    this.recalculateSize = this.recalculateSize_2;
                    break;
                case SizeDenominator:
                    this.recalculateSize = this.recalculateSize_3;
                    break;
                case SizeDiacritic:
                    this.recalculateSize = this.recalculateSize_4;
                    break;
            }
        }
        else
            this.recalculateSize = this.recalculateSize_2;

        this.recalculateSize();
    },
    setCoeffTransform: function(sx, shx, shy, sy)
    {
        this.transform = {sx: sx, shx: shx, shy: shy, sy: sy};

        //здесь надо будет по-другому считать размер, после трансформации размер будет выставляться в g_oTextMeasurer
        //
        //MathControl.pGraph.transform(sx, shy, shx, sy, 0, 0);
        this.applyTransformation();

    },
    applyTransformation: function()
    {
        var sx = this.transform.sx, shx = this.transform.shx,
            shy = this.transform.shy, sy = this.transform.sy;
        sy = (sy < 0) ? -sy : sy;

        this.size.width = this.sizeSymbol.width*sx + (-1)*this.sizeSymbol.width*shx;
        this.size.height = this.sizeSymbol.height*sy + this.sizeSymbol.height*shy;
        this.size.ascent = this.sizeSymbol.ascent*(sy + shy);
        this.size.descent = this.sizeSymbol.descent*(sy + shy);
        this.size.center = this.sizeSymbol.center*(sy + shy);

        /*this.size.width = this.size.width*this.transform.sx + (-1)*this.size.width*this.transform.shx;
        this.size.height = this.size.height*this.transform.sy + this.size.height*this.transform.shy;
        this.size.ascent = this.size.ascent*(this.transform.sy + this.transform.shy);
        this.size.descent = this.size.descent*(this.transform.sy + this.transform.shy);
        this.size.center = this.size.center*(this.transform.sy + this.transform.shy);*/

    },
    IsHighElement: function()
    {
        g_oTextMeasurer.SetFont(this.font);
        return (this.size.ascent - 0.001 > g_oTextMeasurer.Measure2Code(0x1D44E).Ascent) ;
    },
    trasformByDimensions: function(width, height, restrW, restrH)
    {
        //если restrict == 0 => ограничений нет
        var restrictW = (restrW > 0 && restrW < 90) ?  restrW : 90;
        var restrictH = (restrH > 0 && restrH < 90) ?  restrH : 90;

        var sx = width/this.sizeSymbol.width,
            sy = height/this.sizeSymbol.height,
            shx = this.transform.shx,
            shy = this.transform.shy;

        sx = (sx > restrictW) ? restrictW : sx;
        sy = (sy > restrictH) ? restrictH : sy;

        this.setCoeffTransform(sx, shx, shy, sy);
    },
    transformByWidth: function(width, restrict, restrict0)
    {
        var restr0 = (restrict0 > 0) ? restrict0 : 0;
        var restr = ( restrict > 0 && restrict < 90) ? restrict : 90;
        restr = (restr < restr0) ? restr0 : restr;

        var sx = width/this.sizeSymbol.width,
            sy = this.transform.sy,
            shx = this.transform.shx,
            shy = this.transform.shy;

        sx = (sx > restr) ? restr : sx;

        this.setCoeffTransform(sx, shx, shy, sy);
    },
    trasformByHeight: function(height, restrict, restrict0)
    {
        var restr0 = (restrict0 > 0) ? restrict0 : 0;
        var restr = ( restrict > 0 && restrict < 90) ? restrict : 90;
        restr = (restr < restr0) ? restr0 : restr;

        var sx =  this.transform.sx,
            sy = height/this.sizeSymbol.height,
            shx = this.transform.shx,
            shy = this.transform.shy;

        sy = (sy > restr) ? restr : sy;

        this.setCoeffTransform(sx, shx, shy, sy);
    },
    transformLength: function(height)
    {
        var sx =  height/this.sizeSymbol.height,
            sy = height/this.sizeSymbol.height,
            shx = this.transform.shx,
            shy = this.transform.shy;

        this.setCoeffTransform(sx, shx, shy, sy);
    },
    add: function(code)
    {
        if(this.bMText)
        {
            if(code == 0x0068) // h
                code = 0x210E;

            var bCapitale = (code > 0x0040 && code < 0x005B),
                bSmall = (code > 0x0060 && code < 0x007b),
                bDigit = (code > 0x002F && code < 0x003A),
                bCapGreek = (code > 0x0390 && code < 0x03AA ),
                bSmallGreek = (code > 0x03B0 && code < 0x03CA);

            if(bCapitale)
                code  = code + 0x1D3F3;
            else if(bSmall)
                code  = code + 0x1D3ED;
            else if(bCapGreek)
                code = code + 0x1D351;
            else if(bSmallGreek)
                code = code + 0x1D34B;

            if(code == 0x131) // "i" without dot
                code = 0x1D6A4;
            else if(code == 0x237) // "j" without dot
                code = 0x1D6A5;

        }
        else
        {
            if(code == 0x210E) // h
                code = 0x0068;

            var bCapitale = (code >= 0x1D434 && code <= 0x1D44D),
                bSmall = (code >= 0x1D44E && code <= 0x1D467);

            if(bCapitale)
                code  = code - 0x1D3F3;
            else if(bSmall)
                code  = code - 0x1D3ED;
            else if(bCapGreek)
                code = code - 0x1D351;
            else if(bSmallGreek)
                code = code - 0x1D34B;

            if(code == 0x1D6A4) // "i" without dot
                code = 0x131;
            else if(code == 0x1D6A5) // "j" without dot
                code = 0x237;

        }

        this.value = code;
    },
    IsIncline: function()
    {
        var flag = false;

        if(this.value >= 0x1D434 && this.value <= 0x1D44D ) // capitale
            flag = true;
        else if(this.value >= 0x1D44E && this.value <= 0x1D467) //small
            flag = true;
        else if(this.value == 0x1D6A4 || this.value == 0x1D6A5)// i & j without dot
            flag = true;

        return flag;
     }

}
function CSymbol(IFont)
{
    var TParms =
    {
        font:       IFont,
        indefSize:  SizeDiacritic,
        bMText:     true
    };
    CMathText.call(this, TParms);

}
extend(CSymbol, CMathText);
CSymbol.prototype.relate = function()
{

}
CSymbol.prototype.setPosition = function(pos)
{
    var coord = {x: pos.x , y: pos.y + this.size.center};
    CSymbol.superclass.setPosition.call(this, coord);
}
CSymbol.prototype.IsJustDraw = function()
{
    return true;
}