javascript:(function (F, i, r, e, b, u, g, L, I, T, E)
{
    if (document.getElementById('FirebugLite'))
    {
        return; 
    }
    E = document['createElement' + 'NS'] && document.documentElement.namespaceURI;
    E = E 
    ? document['createElement' + 'NS'](E, 'script') 
    : document['createElement']('script'); 
    
    E['setAttribute']('id', 'FirebugLite'); 
    E['setAttribute']('src', 'https://getfirebug.com/' + 'firebug-lite.js' + '#startOpened'); 
    E['setAttribute']('FirebugLite', '4'); 
    (document['getElementsByTagName']('head')[0] || document['getElementsByTagName']('body')[0]).appendChild(E); 
    E = new Image; 
    E['setAttribute']('src', 'https://getfirebug.com/' + 'releases/lite/latest/skin/xp/sprite.png');
})(document, 'createElement', 'setAttribute', 'getElementsByTagName', 'FirebugLite', '4', 'firebug-lite.js', 'releases/lite/latest/skin/xp/sprite.png', 'https://getfirebug.com/', '#startOpened');