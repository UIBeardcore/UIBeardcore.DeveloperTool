/**
    * WARNING: Hide implementation in local scope, 
    * so it won`t mess up with other extensions, ot other variables
    */
(function ()
{
	var BEARDCORE_LOAD_BASE = "https://rawgit.com/UIBeardcore/UIBeardcore.DeveloperTool/master/Lite/";
	//var BEARDCORE_LOAD_BASE = "http://localhost:9077/";
	var HIGHLIGHTJS_LOAD_BASE = "http://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.1/";

	var sequanceId = 0;
	var requestsTable = [];

	// Lets do BeardCore!!!!111
	
	var xsltData = '<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml"><xsl:output method="xml" indent="no" omit-xml-declaration="yes" encoding="utf-8"/><xsl:template match="/ |node() | @*"><xsl:copy><xsl:apply-templates select="node() | @*"/></xsl:copy></xsl:template></xsl:stylesheet>';
	var xsltProcessor;

	UIBeardcoreDeveloperTool = function UIBeardcoreDeveloperTool()
	{
		this.isInitialized = false;
		this.resourcesToLoad = 0;
		this.activePopup = null;
	};

	UIBeardcoreDeveloperTool.prototype.initialize = function UIBeardcoreDeveloperTool$initialize()
	{
		if (!this.initialized)
		{
			this.appendResourceFile("uibc-lite.css", BEARDCORE_LOAD_BASE + "uibc-lite.css", "link");

			this.appendResourceFile("highlight.css", HIGHLIGHTJS_LOAD_BASE + "/styles/vs.min.css", "link");
			this.appendResourceFile("highlight.js", HIGHLIGHTJS_LOAD_BASE + "highlight.min.js", "script");

			console.log("UI Beardcore :: Developer Tool is initializing...");
		}
	};

	UIBeardcoreDeveloperTool.prototype._onInitialized = function UIBeardcoreDeveloperTool$_onInitialized()
	{
		if (this.resourcesToLoad == 0)
		{
			console.log("UI Beardcore :: Developer Tool initialization is done. Have a nice day!");

			this.initialized = true;

			var tableElement = this.tableElement;
			if (!tableElement)
			{
				tableElement = document.createElement("div");
				tableElement.id = "UIBeardcoreDeveloperTool";

				document.body.appendChild(tableElement);

				this.tableElement = tableElement;
			}
		}
	};

	UIBeardcoreDeveloperTool.prototype.appendResourceFile = function UIBeardcore$DeveloperTool$appendResourceFile(id, filePath, type)
	{
		this.resourcesToLoad++;

		if (document.getElementById(id))
		{
			return;
		}

		var el = document['createElementNS'] && document.documentElement.namespaceURI;
		if (el)
		{
			el = document['createElementNS'](el, type);
		}
		else
		{
			el = document['createElement'](type);
		}

		el['setAttribute']('id', id);

		//console.log("Loading resource :: " + filePath);

		var onResourceLoaded = Function.getDelegate(this, function UIBeardcore$DeveloperTool$appendResourceFile$onResourceLoaded()
		{
			//console.log("onResource loaded :: " + filePath);
			this.resourcesToLoad--;
			this._onInitialized();
		});

		if (type == "script")
		{
			el['setAttribute']("src", filePath);
			el.onload = el.onerror = el.onreadystatechange = function ()
			{
				if (!this.readyState || /loaded|complete/.test(this.readyState))
				{
					this.onerror = this.onload = this.onreadystatechange = null;
					onResourceLoaded();
				}
			};
		}
		else if (type === "link")
		{
			el['setAttribute']("rel", "stylesheet");
			el['setAttribute']("type", "text/css");
			el['setAttribute']("href", filePath);

			var img = document.createElement('img');
			img.onerror = function ()
			{
				img.onerror = null;
				img = null;
				onResourceLoaded();
			}
			img.src = filePath;
		}

		document['getElementsByTagName']('head')[0].appendChild(el);
	};

	UIBeardcoreDeveloperTool.prototype.onRequestComplete = function UIBeardcore$DeveloperTool$onRequestComplete(requestId, result)
	{
		//console.log("Request is Handled");

		var requestedItem = requestsTable[requestId];
		if (requestedItem)
		{
			requestedItem.result = result;
			requestedItem.isCompleted = true;
		}

		this._updateBoxStatus();
	};

	UIBeardcoreDeveloperTool.prototype.isJson = function UIBeardcore$DeveloperTool$isJson(str)
	{
		try
		{
			JSON.parse(str);
		}
		catch (e)
		{
			return false;
		}

		return true;
	};

	UIBeardcoreDeveloperTool.prototype.isXml = function UIBeardcore$DeveloperTool$isXml(str)
	{
		try
		{
			return !$xml.hasParseError($xml.getNewXmlDocument(str));
		}
		catch (e)
		{
			return false;
		}
	};

	UIBeardcoreDeveloperTool.prototype.getPrettifiedContent = function UIBeardcore$DeveloperTool$getPrettifiedContent(rawData)
	{
		if (Type.isObject(rawData))
		{
			return JSON.stringify(rawData, null, "\t");
		}
		if (this.isJson(rawData))
		{
			return JSON.stringify(rawData, null, "\t");
		}
		else if (this.isXml(rawData))
		{
			if (!xsltProcessor)
			{
				xsltProcessor = $xml.getNewXsltProcessor(xsltData);
			}

			var xmlString = $xml.transformToString($xml.getNewXmlDocument(rawData), xsltProcessor);

			var closeTags = [];
			var splitter = ":::";

			var sbArray = xmlString.replace(/>\s*</g, ">" + splitter + "<").split(splitter);
			sbArray.reverse();
			sbArray.each(function appendIdent(element, index, array)
			{
				var m = element && element.match(/^\s*<(\/)?([\w:]+)/);
				if (m && m.length > 2)
				{
					var tagName = m[2];
					var ident = closeTags.length;
					if (m[1])
					{
						closeTags.push(tagName);
					}
					else
					{
						var ind = closeTags.indexOf(tagName);
						if (ind != -1)
						{
							closeTags.removeAt(ind);
							ident = closeTags.length;
						}
					}

					array[index] = (new Array(ident + 1)).join("\t") + element;
				}
			});

			sbArray.reverse();
			return $xml.escape(sbArray.join("\n"));
		}

		return rawData;
	};

	UIBeardcoreDeveloperTool.prototype.openPopup = function UIBeardcore$DeveloperTool$openPopup(dialogTitle, dialogContent)
	{
		function DeveloperTool$ExpandItemContent$onDialogClosed(event)
		{
			event.source.close();
		};

		function DeveloperTool$ExpandItemContent$onDialogOpen(event)
		{
			hljs.highlightBlock(event.source.properties.description);
		};

		var options = {};
		options.className = "popupdialog messagebox uibcdt-responce-info";
		options.popupType = Tridion.Controls.Popup.Type.MESSAGE_BOX;
		options.title = dialogTitle;

		var popup = this.activePopup;
		if (popup)
		{
			popup.close();
			popup = null;
		}

		var parameters = {};
		parameters.width = 800;
		parameters.height = 800;

		// For 2013 version
		if (Type.implementsInterface($popup, "Tridion.Controls.PopupManager"))
		{
			options.description = dialogContent;

			popup = $popup.createExternalContentPopup(null, parameters, options);

			$evt.addEventHandler(popup, "open", DeveloperTool$ExpandItemContent$onDialogOpen);
		}
		// For 2011 version
		else if (Type.implementsInterface($popup, "Tridion.Controls.Popup"))
		{
			parameters.height = null;
			options.header = dialogTitle;
			options.messageBoxType = Tridion.Controls.Popup.MessageType.CUSTOM_HTML;
			options.customHtml = dialogContent;

			popup = $popup.create(null, parameters, options);

			setTimeout(function()
			{
				hljs.highlightBlock(popup.properties.dialogCenter);
			}, 0);
		}
		else
		{
			alert("Unsupporterd version");
			return;
		}

		
		$evt.addEventHandler(popup, "dialog_closed", DeveloperTool$ExpandItemContent$onDialogClosed);
		popup.open();

		this.activePopup = popup;
	};

	UIBeardcoreDeveloperTool.prototype._updateBoxStatus = function UIBeardcore$DeveloperTool$_updateBoxStatus()
	{
		var tableElement = this.tableElement;
		if (tableElement)
		{
			for (var i = 0, l = requestsTable.length; i < l; i++)
			{
				var requestedItem = requestsTable[i];
				var el = $("#beardcore-devtool-item-" + i, tableElement);
				if (!el)
				{
					el = document.createElement("div");
					el.id = "beardcore-devtool-item-" + i;
					//el.innerHTML = String.format("{0}[<b>{1}</b>]", requestedItem.servicePath, requestedItem.methodName);
					el.innerHTML = requestedItem.servicePath;

					$dom.disableSelection(el);
				}

				if (!requestedItem.isCompleted)
				{
					if (!$css.hasClass(el, "uibcdt-loading"))
					{
						$css.addClass(el, "uibcdt-loading");
					}
				}
				else
				{
					if ($css.hasClass(el, "uibcdt-loading"))
					{
						$css.removeClass(el, "uibcdt-loading");

						//var dialogTitle = String.format("{0} [{1}]", requestedItem.servicePath, requestedItem.methodName);
						var dialogTitle = requestedItem.servicePath;
						var dialogContent = this.getPrettifiedContent(requestedItem.result);

						$css.addClass(el, "uibcdt-clickable");
						$evt.addEventHandler(el, "dblclick", Function.getDelegate(this, this.openPopup, [dialogTitle, dialogContent]));
					}
				}

				if (tableElement.firstChild)
				{
					tableElement.insertBefore(el, tableElement.firstChild);
				}
				else
				{
					tableElement.appendChild(el);
				}
			}
		}
	};


	function whedDisplayIsReady$UIBeardcore()
	{
		// Extend Existing functionality

		//Tridion.Type.registerNamespace("Tridion.Sys.Net");
		Tridion.Type.registerNamespace("Sys.Net");

		//if (Tridion.Sys.Net.WebRequest)
		if (Sys.Net.WebRequest)
		{
			//var _overridden$WebServiceProxy$invoke$UIBeardcore = Tridion.Sys.Net.WebRequest.prototype.invoke;
			//Tridion.Sys.Net.WebRequest.prototype.invoke = function WebRequest$realinvoke()

			var _overridden$WebServiceProxy$invoke$UIBeardcore = Sys.Net.WebRequest.prototype.invoke;
			Sys.Net.WebRequest.prototype.invoke = function WebRequest$realinvoke()
			{
				if (this.httpVerb == "POST")
				{
					var requestId = sequanceId++;

					var request = this;
					var onSuccess = request.onSuccess;
					request.onSuccess = function onLocalSuccess(result, context)
					{
						$uibcDevtool.onRequestComplete(requestId, result);

						Type.isFunction(onSuccess) && onSuccess.apply(request, [result, context]);
					}

					var onFailure = request.onFailure;
					request.onFailure = function onLocalFailure(result, context)
					{
						$uibcDevtool.onRequestComplete(requestId, result);

						Type.isFunction(onFailure) && onFailure.apply(request, [result, context]);
					}

					requestsTable[requestId] = {
						servicePath: this.url,
						params: this.body
					};

					$uibcDevtool._updateBoxStatus();
				}

				return _overridden$WebServiceProxy$invoke$UIBeardcore.apply(this, arguments);
			};
		}

		var $uibcDevtool = new UIBeardcoreDeveloperTool();
		$uibcDevtool.initialize();

	};

	if ($display)
	{
		if ($display.getView())
		{
			whedDisplayIsReady$UIBeardcore();
		}
		else
		{
			$evt.addEventHandler($display, "start", whedDisplayIsReady$UIBeardcore);
		}
	}

}());

