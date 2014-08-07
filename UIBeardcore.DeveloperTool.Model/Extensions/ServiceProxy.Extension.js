/**
 * WARNING:  Register the namespace of what you are going to extend.
 */
Tridion.Type.registerNamespace("Sys.Net");

var BEARDCORE_IS_REGISTERED = true;

/**
 * WARNING:  Check if Object is initialized already
 */
if (Sys.Net.WebServiceProxy)
{
	/**
	 * WARNING: Hide implementation in local scope, 
	 * so it won`t mess up with other extensions, ot other variables
	 */
	(function ()
	{
		var sequanceId = 0;

		//	Clearly identify the method you override, and an extension where you are doing so.
		//	I`d suggest the following pattern "_overridden${original function name}${extension name}"
		/**
		 * Clearly identify the method you override, 
		 * and an extension where you are doing this.
		 *
		 * I`d suggest the following pattern "_overridden${original function name}${extension name}"
		 */

		var requestsTable = [];

		var _overridden$WebServiceProxy$invoke$UIBeardcore = Sys.Net.WebServiceProxy.invoke;
		Sys.Net.WebServiceProxy.invoke = function WebServiceProxy$invoke$UIBeardcore(servicePath, methodName, useGet, params, onSuccess, onFailure, userContext, sync)
		{
			var requestId = sequanceId++;

			var self = this;
			function onLocalSuccess(result, context)
			{
				UIBeardcore.DeveloperTool.Model.onRequestComplete(requestId, result);

				Type.isFunction(onSuccess) && onSuccess.apply(self, [result, context]);
			}

			function onLocalFailure(result, context)
			{
				UIBeardcore.DeveloperTool.Model.onRequestComplete(requestId, result);

				Type.isFunction(onFailure) && onFailure.apply(self, [result, context]);
			}

			requestsTable[requestId] = {
				servicePath: servicePath,
				methodName: methodName,
				params: params
			};

			UIBeardcore.DeveloperTool.Model._updateBoxStatus();

			//console.log("Invoking : " + arguments[0] + "/" + arguments[1]);
			return _overridden$WebServiceProxy$invoke$UIBeardcore.apply(this, [servicePath, methodName, useGet, params, onLocalSuccess, onLocalFailure, userContext, sync]);
		};


		// Developer Tool region

		Tridion.Type.registerNamespace("UIBeardcore.DeveloperTool.Model");

		var tableElement = null;
		var isInitialized = false;

		$evt.addEventHandler($display, "start", function()
		{
			isInitialized = true;
		});

		UIBeardcore.DeveloperTool.Model.onRequestComplete = function UIBeardcore$DeveloperTool$onRequestComplete(requestId, result)
		{
			var requestedItem = requestsTable[requestId];
			if (requestedItem)
			{
				requestedItem.result = result;
				requestedItem.isCompleted = true;
			}

			UIBeardcore.DeveloperTool.Model._updateBoxStatus();
		};

		var xsltData = '<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml"><xsl:output method="xml" indent="no" omit-xml-declaration="yes" encoding="utf-8"/><xsl:template match="/ |node() | @*"><xsl:copy><xsl:apply-templates select="node() | @*"/></xsl:copy></xsl:template></xsl:stylesheet>';
		var xsltProcessor;

		UIBeardcore.DeveloperTool.Model.isJson = function UIBeardcore$DeveloperTool$isJson(str)
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

		UIBeardcore.DeveloperTool.Model.isXml = function UIBeardcore$DeveloperTool$isXml(str)
		{
			try
			{
				return !$xml.hasParseError($xml.getNewXmlDocument(str));
			}
			catch (e)
			{
				return false;
			}
			return true;
		};

		UIBeardcore.DeveloperTool.Model.getPrettifiedContent = function UIBeardcore$DeveloperTool$getPrettifiedContent(rawData)
		{
			if (Type.isObject(rawData))
			{
				return JSON.stringify(rawData, null, "\t");
			}
			if (UIBeardcore.DeveloperTool.Model.isJson(rawData))
			{
				return JSON.stringify(rawData, null, "\t");
			}
			else if (UIBeardcore.DeveloperTool.Model.isXml(rawData))
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

		UIBeardcore.DeveloperTool.Model._updateBoxStatus = function UIBeardcore$DeveloperTool$_updateBoxStatus()
		{
			if (isInitialized)
			{
				if (!tableElement)
				{
					tableElement = document.createElement("div");
					tableElement.id = "UIBeardcoreDeveloperTool";

					document.body.appendChild(tableElement);
				}

				for (var i = 0, l = requestsTable.length; i < l; i++)
				{
					var requestedItem = requestsTable[i];
					var el = $("#beardcore-devtool-item-" + i, tableElement);
					if (!el)
					{
						el = document.createElement("div");
						el.id = "beardcore-devtool-item-" + i;
						el.innerHTML = String.format("{0}[<b>{1}</b>]", requestedItem.servicePath, requestedItem.methodName);

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

							var dialogTitle = String.format("{0} [{1}]", requestedItem.servicePath, requestedItem.methodName);
							var dialogContent = UIBeardcore.DeveloperTool.Model.getPrettifiedContent(requestedItem.result);

							$css.addClass(el, "uibcdt-clickable");
							$evt.addEventHandler(el, "dblclick", function DeveloperTool$ExpandItemContent()
							{
								console.log("dblclick ::  " + dialogTitle);

								var activePopup = $popupManager.getActivePopup();
								if (activePopup)
								{
									activePopup.close();
								}

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
								options.popupType = $popupManager.Type.MESSAGE_BOX;
								options.title = dialogTitle;
								options.description = dialogContent;
								
								var parameters = {};
								parameters.width = 800;
								parameters.height = 800;

								var popup = $popupManager.createExternalContentPopup(null, parameters, options);
								$evt.addEventHandler(popup, "dialog_closed", DeveloperTool$ExpandItemContent$onDialogClosed);
								$evt.addEventHandler(popup, "open", DeveloperTool$ExpandItemContent$onDialogOpen);
								popup.open();
							});
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
	})();
}