UIBeardcore.DeveloperTool | Lite
================================================

## Overview

Normally you have three options to track your `XMLHTTPRequests` in CME.

1. Using Fiddler;
2. Using Browser native developer tools;
3. Using UIBeardcore Developer Tool Lite;

First two options provides you a ton of information, but is a pain when it came to Internet Explorer or when requests are combined, or when you have not very well formatted response data XML.
Normally you need to only check some values which are possibly is in response or just check what response has. If it is your case, then probably option 3 is for you.
 
## Bookmarklet

```javascript
javascript:(function(UI,B,e,a,r,d,C,O,R,E){try{if(UI.Tridion!=undefined)R=UI.document;else{var E=0;while(!(R=UI.frames[E++].Tridion));R=R.getApplicationWindow().document}}catch(ex){alert("Not a Tridion!");return}if(R.getElementById(r))return;E=R[B+"NS"]&&R.documentElement.namespaceURI;E=E?R[B+"NS"](E,O):R[B](O);E[e]("id",r);E[e]("src",C+d);(R[a]("head")[0]||R[a]("body")[0]).appendChild(E)})(window.top,"createElement","setAttribute","getElementsByTagName","UIBeardcoreDevTools","uibc-lite.js","https://cdn.rawgit.com/UIBeardcore/UIBeardcore.DeveloperTool/master/Lite/","script");
```


## How-To use it

  * Add the bookmarklet link from above to your bookmarks;
  * Open Tridion CME;
  * Click on this bookrmarklet;
  * …wait a moment;
  * Check the request by double-clicking on it;
  * Have a nice day!


## Tested Tridion Versions

*	2011 SP1 HR2
*	2013 SP1

## Contributing

Found a bug? Or have a suggestion? Please [report it](http://tridion.uibeardcore.com/2014/08/dev-tool-lite-v-0/ "UIBeardcore.DeveloperTool | Lite") as a comment to initial article.

