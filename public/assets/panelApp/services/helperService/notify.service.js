/* global Noty:false */
(function(ng) {
  'use strict';

  var SERVICE_NAME = 'helper.service.notify';

  ng.module('panelApp').service(SERVICE_NAME, [_fn]);

  var BASE_NOTIFICATION = {
    'type': 'alert',
    'layout': 'bottomLeft',
    'timeout': 3000,
    'modal': false,
    'animation': {
      'open': 'animated flipInY',
      'close': 'animated zoomOutLeft'
    },
    'progressBar': true
  };

  function _fn() {
    var $this = this;
    var $parent = null;

    //Het HS parent
    $this.$setParent = function(parent) {
      $parent = parent;
      return $this;
    };

    $this.notify = function(data) {
      var _data = ng.extend(ng.copy(BASE_NOTIFICATION), data);
      new Noty(_data).show();
    };

    $this.info = function(text) {
      return $this.notify({
        'type': 'info',
        'text': text,
      });
    };

    $this.success = function(text) {
      return $this.notify({
        'type': 'success',
        'text': text,
      });
    };

    $this.error = function(text) {
      return $this.notify({
        'type': 'error',
        'text': text,
      });
    };
  }

})(angular);