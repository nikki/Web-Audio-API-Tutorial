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
   * @param  {Object}   buffer   AudioBuffer object - a loaded sound.
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
      volume : 2
    },
    coin : {
      src : 'audio/coin',
      volume : 1.5
    },
    explosion : {
      src : 'audio/explosion',
      volume : 0.5
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
    source.gain.value = obj.volume;

    // connect source to destination
    source.connect(context.destination);

    // play sound
    source.noteOn(0);
    callback && callback();
  }
  // playSound(sound);


  /**
   * Example 5: Muting a sound
   * @param  {object} obj Object containing a loaded sound buffer
   */

  function muteSoundObj(obj) {
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

    playBuffer : function() {
      var $this = this,
          name = $this.data('sound'),
          one = (name === 'scifi' ? sound : sounds[name].buffer);

      try {
        playSound(one);
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

    setVolume : function(value) {
      var $this = $(this);
          value = (typeof value === 'number' ? value : +value.value.toFixed(1));

      // set new sound value
      sounds[$this.data('sound')].volume = value;

      // show slider value on button
      $this.parent().next().find('b').text(value);
    },

    playObject : function() {
      var $this = this,
          obj = sounds[$this.data('sound')];

      // sound is loaded?
      if (obj.buffer) {
        try {
          playSoundObj(obj);
        } catch(e) {}
      } else {
        onError.call($this, 'First load the sounds using the button below.');
      }
    },

    playNyan : function() {
      // play the sound once
      playSoundObj(nyan);

      // redefine the function to change the volume
      examples.playNyan = function() {
        nyan.buffer.gain = 1;
      };
    },

    muteNyan : function() {
      muteSoundObj(nyan);
    }
  };


  /**
   * Set up demo UI elements
   */

  // init sliders
  var $sliders = $('.slider').slider({
    formater : function(value) {
      return value.toFixed(1);
    }
  });
  $sliders.slider().on('slide', examples.setVolume);

  // load sounds on init
  var nyan = { src : 'audio/nyan', volume : 1 };
  loadSoundObj(nyan);


  /**
   * Bind demo behaviours to UI elements
   */

  $(document).on('click', 'button', function(e) {
    var $this = $(this);
    if ($this.data('button')) examples[$this.data('button').split('-')[1]].call($this);
  });

  $(window).on('load', function(e) {
    $sliders.each(function() {
      var $this = $(this);
      $this.slider('setValue', sounds[$this.data('sound')].volume);
    })
  });


})();