(function (B, e, a ,r, d, C, O, R, E)
{
    try
    {
    	var E = 0;
    	while (!(R = window.top.frames[E++].Tridion)) { }
	    R = R.getApplicationWindow().document;
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
})('createElement', 'setAttribute', 'getElementsByTagName', 'UIBeardcoreDevTools', 'uibc-lite.js', 'https://cdn.rawgit.com/UIBeardcore/UIBeardcore.DeveloperTool/master/Lite/', "script");
//  B,              e,              a,                      r,                     d,              C,                        O,       R,      E


javascript:(function(B,e,a,r,d,C,O,R,E){try{var E=0;while(!(R=window.top.frames[E++].Tridion));R=R.getApplicationWindow().document}catch(ex){alert("Not a Tridion!");return}if(R.getElementById(r))return;E=R[B+"NS"]&&R.documentElement.namespaceURI;E=E?R[B+"NS"](E,O):R[B](O);E[e]("id",r);E[e]("src",C+d);(R[a]("head")[0]||R[a]("body")[0]).appendChild(E)})("createElement","setAttribute","getElementsByTagName","UIBeardcoreDevTools","uibc-lite.js","https://cdn.rawgit.com/UIBeardcore/UIBeardcore.DeveloperTool/master/Lite/","script");