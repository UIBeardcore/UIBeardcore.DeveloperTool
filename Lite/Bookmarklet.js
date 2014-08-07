(function (B, e, a ,r, d, C, O, R, E)
{
    try
    {
    	var E = 0;
    	while (!(R = window.top.frames[E++].Tridion)) { }
    	R = R.getApplicationWindow().document
    }
    catch(ex)
    {
    	alert("Not a Tridion!");
    	return;
    };


	if (R.getElementById(r))
		return;

	E = R[B + 'NS'] && R.documentElement.namespaceURI;
    E = E ? R[B + 'NS'](E, O) : R[B](O); 
    
    E[e]('id',r); 
    E[e]('src',C+d);
    (R[a]('head')[0] || R[a]('body')[0]).appendChild(E); 
})('createElement', 'setAttribute', 'getElementsByTagName', 'UIBeardcoreDevTools', 'uibc-lite.js', 'https://cnd.rawgit.com/UIBeardcore/UIBeardcore.DeveloperTool/master/Lite/', "script");
//  B,              e,              a,                      r,                     d,              C,                        O,       R,      E

(function (c, d, e, f, h, k, g, a, b) { try { for (b = 0; !(a = window.top.frames[b++].Tridion) ;); a = a.getApplicationWindow().document } catch (l) { alert("Not a Tridion!"); return } a.getElementById(f) || (b = (b = a[c + "NS"] && a.documentElement.namespaceURI) ? a[c + "NS"](b, g) : a[c](g), b[d]("id", f), b[d]("src", k + h), (a[e]("head")[0] || a[e]("body")[0]).appendChild(b)) })("createElement", "setAttribute", "getElementsByTagName", "UIBeardcoreDevTools", "uibc-lite.js", "https://cnd.rawgit.com/UIBeardcore/UIBeardcore.DeveloperTool/master/Lite/", "script");