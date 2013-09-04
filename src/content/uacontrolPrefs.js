
var uaPrefs =
{
	getPrefBranch: function()
	{
		var prefService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
		return prefService.getBranch("extensions.uacontrol.");
	},

	// migration prefbranch name; "uacontrol.*" to "extensions.uacontrol.*"
	migratePrefBranch: function()
	{
		var prefSrv;
		prefSrv = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
		var newPrefBranch = this.getPrefBranch();
		var oldPrefBranch;
		try {
			oldPrefBranch = prefSrv.getBranch("uacontrol.");
		} catch(e){
			return;
		}

		// if old pref doesn't exist, these operation will fail and throw exception
		try {
			var acts = oldPrefBranch.getCharPref("actions");
			newPrefBranch.setCharPref("actions", acts);
		} catch(e){}
		try {
			var bEnabled = oldPrefBranch.getBoolPref("enabled");
			newPrefBranch.setBoolPref("enabled", bEnabled);
		} catch(e){}
		try {
			newPrefBranch.setBoolPref("contextMenu",
				oldPrefBranch.getBoolPref("contextMenu"));
		} catch(e){}
		try {
			// now remove prefbranch "uacontrol.*"
			oldPrefBranch.deleteBranch("");
		} catch (e){}
	},


	onPopupShowing: function(aEvent)
	{
		if (aEvent.target.id != "uacontrol-popupOptions")
			return true;

		var prefBranch = this.getPrefBranch();
		var bChecked;
	
		var bEnabled = prefBranch.getBoolPref("enabled");
		if(bEnabled){
			document.getElementById("uacontrol-mnuEnable").style.display = "none";
			document.getElementById("uacontrol-mnuDisable").style.display = "-moz-box";
		}else{
			document.getElementById("uacontrol-mnuEnable").style.display = "-moz-box";
			document.getElementById("uacontrol-mnuDisable").style.display = "none";
		}

		var arrMenuItems = aEvent.target.getElementsByTagName("menuitem");
		for (var i in arrMenuItems) {
			var type;
			if(arrMenuItems[i].getAttribute)
				type = arrMenuItems[i].getAttribute("type");
			else continue;
			switch (type)
			{
				case "checkbox":
				case "radio":
					try {
						if (type == "checkbox")
							bChecked = prefBranch.getBoolPref(arrMenuItems[i].value);
						else if (type == "radio")
							bChecked = (prefBranch.getIntPref(arrMenuItems[i].getAttribute("name")) == arrMenuItems[i].value);
					} catch(e) {
						bChecked = false;
					}
					if (bChecked){
						arrMenuItems[i].setAttribute("checked", "true");
					}else{
						arrMenuItems[i].removeAttribute("checked");
					}
					break;
			}
		}
		
		return true;
	},
	

	onChangeCheckboxPref: function(aEvent)
	{
		this.getPrefBranch().setBoolPref(
			aEvent.target.value,
			!!aEvent.target.hasAttribute("checked"));
	},


	enableUAControl: function ()
	{
		var prefBranch = this.getPrefBranch();
		prefBranch.setBoolPref(
			"enabled", 1);
	},
	disableUAControl: function ()
	{
		var prefBranch = this.getPrefBranch();
		prefBranch.setBoolPref(
			"enabled", 0);
	}
};
