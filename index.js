/**
 * Instantiate boilerplate audio component
 *
 * @param {AudioContext} context
 * @param {Object} config
 */

function Module (context, config) {

  // Must have input and output properties
  // that are `AudioNode` instances

  this.input = context.createGainNode();
  this.output = context.createGainNode();

  // Internal AudioNodes used in the
  // effect. In this case, just a simple
  // gain node

  this._gain = context.createGainNode();

  // AudioNode graph routing
  
  this.input.connect(this._gain);
  this._gain.connect(this.output);

  // Apply config, falling back on defaults
  
  config = config || {};

  this._gain.gain.value = config.gain || this.meta.params.gain.defaultValue;
}

Module.prototype = Object.create(null, {

  /**
   * AudioNode prototype `connect` method.
   *
   * @param {AudioNode} dest
   */

  connect: {
    value: function (dest) {
      this.output.connect(dest && dest.input ? dest.input : dest);
    }
  },

  /**
   * AudioNode prototype `disconnect` method.
   */

  disconnect: {
    value: function () {
      this.output.disconnect();
    }
  },

  /**
   * Module parameter metadata.
   */

  meta: {
    value: {
      name: 'moduleName',
      params: {
        gain: {
          min: 0,
          max: 1,
          defaultValue: 0.5,
          type: 'float'
        }
      }
    }
  },

  /**
   * Public gain parameter.
   */

  gain: {
    enumerable: true,
    get: function () { return this._gain.gain.value; },
    set: function (value) {
      this._gain.gain.setValueAtTime(value, 0);
    }
  }

});

/**
 * Expose `Module`
 */

module.exports = Module;
