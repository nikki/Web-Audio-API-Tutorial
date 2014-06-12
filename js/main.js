(function() {
  var context, sound, sounds, format, examples;

  /**
   * Test for API support
   */

  try {
    // create an AudioContext
    context = new AudioContext();
  } catch(e) {
    // API not supported
    onError.call($('.container'), 'Web Audio API not supported.');
  }


  /**
   * Example 1a: Load a sound
   * @param  {String}   src      Url of the sound to be loaded.
   * @param  {Function} callback Used in this demo to create success message. Not required.
   */

  function loadSound(src, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', src, true);
    request.responseType = 'arraybuffer';

    request.onload = function() {
      // request.response is encoded... so decode it now
      context.decodeAudioData(request.response, function(buffer) {
        sound = buffer;
        callback && callback();
      }, function() {
        onError.call($('.container'), 'Error loading ' + src);
      });
    }

    request.send();
  }
  // loadSound('audio/baseUnderAttack.mp3');


  /**
   * Example 1b: Test file format support and load a sound
   */

  var format = '.' + (new Audio().canPlayType('audio/ogg') !== '' ? 'ogg' : 'mp3');
  // loadSound('audio/baseUnderAttack' + format);


  /**
   * Example 2: Play a sound
   * @param  {[type]}   buffer   [description]
   * @param  {Function} callback Used in this demo to create success message. Not required.
   */

  function playSound(buffer, callback) {
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.noteOn(0);
    callback && callback();
  }
  // playSound(sound);


  /**
   * Example 3: Loading multiple sounds
   */

  /**
   * Example 3a: Modify playSound fn to accept changed params
   * @param  {Object}   obj      Object containing url of sound to be loaded.
   * @param  {Function} callback Used in this demo to create success message. Not required.
   */

  function loadSoundObj(obj, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', obj.src + format, true);
    request.responseType = 'arraybuffer';

    request.onload = function() {
      // request.response is encoded... so decode it now
      context.decodeAudioData(request.response, function(buffer) {
        obj.buffer = buffer;
        callback && callback();
      }, function() {
        onError('Error loading ' + obj.src);
      });
    }

    request.send();
  }
  // loadSoundObj({ src : 'audio/baseUnderAttack' });


  /**
   * Example 3b: Create a list of sounds
   */

  sounds = {
    laser : {
      src : 'audio/laser'
    },
    coin : {
      src : 'audio/coin'
    },
    explosion : {
      src : 'audio/explosion'
    }
  };


  /**
   * Example 3c: Create a function to loop through and load all sounds
   */

  function loadSounds(obj, callback) {
    var len = obj.length, i;

    // iterate over sounds obj
    for (i in obj) {
      if (obj.hasOwnProperty(i)) {
        // load sound
        loadSoundObj(obj[i]);
      }
    }

    // display success message
    callback && callback();
  }


  /**
   * Example 4: Setting the volume
   */

  /**
   * Example 4a: Set some volume properties on our sounds object
   */

  sounds = {
    laser : {
      src : 'audio/laser',
      volume : 1
    },
    coin : {
      src : 'audio/coin',
      volume : 1
    },
    explosion : {
      src : 'audio/explosion',
      volume : 1
    }
  };

  /**
   * Example 4b: Modify the playSoundObj function to accept additional sound properties
   */

  function playSoundObj(obj, callback) {
    var source = context.createBufferSource(), gain;
    source.buffer = obj.buffer;

    // create a gain node
    gain = context.createGainNode();

    // connect the source to the gain node
    source.connect(gain);

    // set the gain (volume)
    source.gain.value = obj.volume || 1;

    // connect source to destination
    source.connect(context.destination);

    // play sound
    source.noteOn(0);
    callback && callback();
  }
  // playSound(sound);


  /**
   * Example 5: Muting a sound
   */

  function muteSoundObj(obj, callback) {
    obj.buffer.gain = 0;
  }


  /**
   * Example 6: Looping sounds
   */


  /**
   * Example 7: Crossfading sounds
   */


/* ---------------------------------------------------------------- */

  /**
   * Demo Utilities
   */

  // !!! needs more abstraction

  function onError(msg) {
    // clone error alert
    var $alert = $('.alert-danger:last').clone().removeClass('hidden');

    // insert new error message
    $alert.find('.message').text(msg);

    // find parent
    var $parent = this.parent();

    // remove existing alerts
    $parent.children('.alert').each(function() {
      $(this).alert('close');
    });

    // insert alert message after pre
    $parent.children('pre').after($alert);
  }

  function onSuccess(msg) {
    // clone success alert
    var $alert = $('.alert-success:last').clone().removeClass('hidden');

    // insert new success message
    $alert.find('.message').text(msg);

    // find parent
    var $parent = this.parent();

    // remove existing alerts
    $parent.children('.alert').each(function() {
      $(this).alert('close');
    });

    // insert alert message after pre
    $parent.children('pre').after($alert);
  }


  /**
   * Demo Dependencies
   */

  // init sliders
  var $sliders = $('input').slider({
    formater : function(value) {
      return value.toFixed(2);
    }
  });

  // load sounds on init
  var nyan = { src : 'audio/nyan' };
  loadSoundObj(nyan);


  /**
   * Create demo behaviours
   */

  examples = {
    loadOne : function() {
      var $this = this;

      loadSound('audio/baseUnderAttack' + format, function() {
        onSuccess.call($this, 'Sci-Fi RTS sound loaded successfully.');
        $('button[data-button="example-loadOne"]').attr('disabled', 'disabled');
      });
    },

    playOne : function() {
      var $this = this;

      try {
        playSound(sound);
      } catch(e) {
        onError.call($this, 'You must load a sound before you can play it!');
      }
    },

    loadMultiple : function() {
      var $this = this;

      loadSounds(sounds, function() {
        onSuccess.call($this, 'Multiple sounds loaded successfully.');
        $this.attr('disabled', 'disabled');
      });
    },

    playLaser : function() {
      var $this = this;

      try {
        playSound(sounds.laser.buffer);
      } catch(e) {
        onError.call($this, 'You must load a sound before you can play it!');
      }
    },

    playCoin : function() {
      var $this = this;

      try {
        playSound(sounds.coin.buffer);
      } catch(e) {
        onError.call($this, 'You must load a sound before you can play it!');
      }
    },

    playExplosion : function() {
      var $this = this;

      try {
        playSound(sounds.explosion.buffer);
      } catch(e) {
        onError.call($this, 'You must load a sound before you can play it!');
      }
    },

    playLouder : function() {
      playSoundObj(sounds.explosion);
    },

    playNyan : function() {
      playSoundObj(nyan);
    },

    muteNyan : function() {
      muteSoundObj(nyan);
    }
  };


  /**
   * Bind demo behaviours to buttons and sliders
   */

  $(document).on('click', 'button', function(e) {
    var $this = $(this);
    if ($this.data('button')) examples[$this.data('button').split('-')[1]].call($this);
  });


})();