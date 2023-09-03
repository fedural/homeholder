/**
 * @name QuadrophonicSound
 * @version 0.0.1
 * @author xure
 */
//

module.exports = (() => { 
    const config = {"main":"index.js","info":{"name":"QuadrophonicSound","authors":[{"name":"syskey","discord_id":"645354124115705872"}],"version":"1","description":"Adds Quadrophonic Capabilities"},"changelog":[{"title":"Changes","items":["Fixed"]}],"defaultConfig":[{"type":"switch","id":"enableToasts","name":"Enable Toasts","note":"Warns you about ur settings. - Syskey Quadrophonic","value":true}]};

    return !global.ZeresPluginLibrary ? class {
        constructor() {this._config = config;}
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Library) => {
  const { WebpackModules, Patcher, Toasts } = Library;

  return class QuadrophonicSound extends Plugin {
    onStart() {
      this.settingsWarning();
      const voiceModule = WebpackModules.getModule(BdApi.Webpack.Filters.byPrototypeFields("updateVideoQuality"));
      BdApi.Patcher.after("QuadrophonicSound", voiceModule.prototype, "updateVideoQuality", (thisObj, _args, ret) => {
	  if(thisObj){
      const setTransportOptions = thisObj.conn.setTransportOptions;
      thisObj.conn.setTransportOptions = function (obj) {
        if (obj.audioEncoder) {
          obj.audioEncoder.params = { quadraphonic: "4" };
          obj.audioEncoder.channels = 4;
          obj.prioritySpeakerDucking = 0;
        }
        if (obj.fec) {
          obj.fec = false;
        }
        if (obj.encodingVoiceBitRate < 812000 ) { //128
          obj.encodingVoiceBitRate = 812000
        }
        if (obj.setInputVolume) {
          obj.setInputVolume += 100
        }

        setTransportOptions.call(thisObj, obj);
      };
      return ret;
	  }});
    }
    settingsWarning() {  
      if (this.settings.enableToasts) {
        Toasts.show(
          "Its time to drown made by dad syskey.",
          { type: "warning", timeout: 5000 }
        );
      }
      return true;
  }
	
    onStop() {
      Patcher.unpatchAll();
    }
    getSettingsPanel() {
      const panel = this.buildSettingsPanel();
      return panel.getElement();
    }
  };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();


/*@end@*/