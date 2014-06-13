(function() {
  var context, format, sound, sounds, loops, crossfade, examples,
      $wrapper = $('.wrapper');


  /**
   * Test for API support
   */

  try {
    // create an AudioContext
    context = new AudioContext();
  } catch(e) {
    // API not supported
    message.call($wrapper, 'error', 'Web Audio API not supported.');
  }


  /**
   * Example 1a: Load a sound
   * @param {String} src Url of the sound to be loaded.
   * @param {Function} callback Used in this demo to create success message. Not required.
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
        message.call($wrapper, 'error', 'Error loading ' + src);
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
   * @param {Object} buffer AudioBuffer object - a loaded sound.
   * @param {Function} callback Used in this demo to create success message. Not required.
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
   * @param {Object} obj Object containing url of sound to be loaded.
   * @param {Function} callback Used in this demo to create success message. Not required.
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
        message.call($wrapper, 'error', 'Error loading ' + obj.src);
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
   * @param {Object} obj List of sounds to loop through.
   * @param {Function} callback Used in this demo to create success message. Not required.
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
   * Example 4b: Modify the playSoundObj function to accept a volume property
   * @param {Object} obj Object containing url of sound to be loaded.
   * @param {Function} callback Used in this demo to create success message. Not required.
   */

  function playSoundObj(obj, callback) {
    var source = context.createBufferSource();
    source.buffer = obj.buffer;

    // create a gain node
    obj.gainNode = context.createGainNode();

    // connect the source to the gain node
    source.connect(obj.gainNode);

    // set the gain (volume)
    obj.gainNode.gain.value = obj.volume;

    // connect gain node to destination
    obj.gainNode.connect(context.destination);

    // play sound
    source.noteOn(0);
    callback && callback();
  }
  // playSound(sound);


  /**
   * Example 5: Muting a sound
   * @param  {object} obj Object containing a loaded sound buffer.
   */

  function muteSoundObj(obj) {
    obj.gainNode.gain.value = 0;
  }


  /**
   * Example 6: Looping sounds
   */

  loops = {
    laser : {
      src : 'audio/laser',
      volume : 2,
      loop: true
    },
    coin : {
      src : 'audio/coin',
      volume : 1.5,
      loop: true
    },
    explosion : {
      src : 'audio/explosion',
      volume : 0.5,
      loop: true
    }
  };


  /**
   * Example 6a: Modify the playSoundObj function again to accept a loop property
   * @param {Object} obj Object containing url of sound to be loaded.
   * @param {Function} callback Used in this demo to create success message. Not required.
   */

  function playSoundObj(obj, callback) {
    var source = context.createBufferSource();
    source.buffer = obj.buffer;

    // loop the audio?
    source.loop = obj.loop;

    // create a gain node
    obj.gainNode = context.createGainNode();

    // connect the source to the gain node
    source.connect(obj.gainNode);

    // set the gain (volume)
    obj.gainNode.gain.value = obj.volume;

    // connect gain node to destination
    obj.gainNode.connect(context.destination);

    // play sound
    source.noteOn(0);
    callback && callback();
  }
  // playSound(sound);


  /**
   * Example 7: Crossfading sounds
   */

  crossfade = {
    battle : {
      src : 'audio/the-last-encounter',
      volume : 1,
      loop : true
    },
    eclipse : {
      src : 'audio/red-eclipse',
      volume : 0,
      loop : true
    }
  };

  /**
   * Example 7a: Crossfading between two sounds
   * @param  {Object} a Sound object to fade out.
   * @param  {Object} b Sound object to fade in.
   */

  function crossFadeSounds(a, b) {
    var currentTime = context.currentTime,
        fadeTime = 3; // 3 seconds fade time

    // fade out
    a.gainNode.gain.linearRampToValueAtTime(1, currentTime);
    a.gainNode.gain.linearRampToValueAtTime(0, currentTime + fadeTime);

    // fade in
    b.gainNode.gain.linearRampToValueAtTime(0, currentTime);
    b.gainNode.gain.linearRampToValueAtTime(1, currentTime + fadeTime);
  }


/* ---------------------------------------------------------------- */

  /**
   * Demo Utilities
   */

  // !!! TODO: wait until audio is _actually loaded_ before displaying messages

  function message(type, msg) {
    var $alert = $('.alert-' + (type === 'error' ? 'danger' : 'success') + ':last').clone().removeClass('hidden'), // clone alert
        $parent;

    // insert new message
    $alert.find('.message').text(msg);

    // insert alert in correct place
    if (this.hasClass('wrapper')) { // global alert
      this.children().children().eq(0).prepend($alert);
    } else { // example alert
      // find parent
      $parent = this.parent();

      // remove existing alerts
      $parent.children('.alert').each(function() {
        $(this).alert('close');
      });

      // insert alert message after pre
      $parent.children('pre').after($alert);
    }
  }


  /**
   * Create demo behaviours
   */

  examples = {
    testApi : function() {
      var $this = this;

      if (typeof context === 'object') {
        message.call($this, 'success', 'The Web Audio API is supported in this browser. Yay :)');
      } else {
        message.call($this, 'error', 'The Web Audio API not supported in this browser. Boo :(');
      }

      // remove button
      $this.remove();
    },

    loadOne : function() {
      var $this = this;

      loadSound('audio/baseUnderAttack' + format, function() {
        message.call($this, 'success', 'Sci-Fi RTS sound loaded successfully.');
        $('button[data-button="example-loadOne"]').remove();
      });
    },

    playBuffer : function() {
      var $this = this,
          name = $this.data('sound'),
          one = (name === 'scifi' ? sound : sounds[name].buffer);

      try {
        playSound(one);
      } catch(e) {
        message.call($this, 'error', 'You must load a sound before you can play it!');
      }
    },

    loadMultiple : function() {
      var $this = this;

      // load single play sounds
      loadSounds(sounds, function() {
        message.call($this, 'success', 'Multiple sounds loaded successfully.');
        $('button[data-button="example-loadMultiple"]').remove();
      });

      // load looped sounds
      loadSounds(loops);
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
        message.call($this, 'error', 'First load the sounds using the button below.');
      }
    },

    playNyan : function() {
      // play the sound once
      playSoundObj(nyan);

      // redefine the function to change the volume
      examples.playNyan = function() {
        nyan.gainNode.gain.value = 1;
      };
    },

    muteNyan : function() {
      muteSoundObj(nyan);
    },

    playLooped : function() {
      var $this = this,
          obj = loops[$this.data('sound')];

      // sound is loaded?
      if (obj.buffer) {
        if (!obj.played) {
          try {
            playSoundObj(obj, function() {
              obj.played = true;
            });
          } catch(e) {}
        } else {
          // played once, mute it?
          obj.gainNode.gain.value = 1;
        }
      } else {
        message.call($this, 'error', 'First load the sounds using the button below.');
      }
    },

    muteAllLooped : function() {
      $.each(loops, function(sound) {
        if (loops[sound].gainNode) loops[sound].gainNode.gain.value = 0;
      });
    },

    loadMusic : function() {
      var $this = this;

      loadSounds(crossfade, function() {
        message.call($this, 'success', 'Music tracks loaded successfully.');
        $this.remove();
      });
    },

    crossFadeMusic : function() {
      var $this = this;

      // play both tracks
      try {
        playSoundObj(crossfade.battle);
        playSoundObj(crossfade.eclipse, function() {
          $this.html('<span class="glyphicon glyphicon-refresh"></span> Crossfade tracks');
        });
      } catch(e) {
        message.call($this, 'error', 'You must load a sound before you can play it!');
      }

      // redefine fn
      examples.crossFadeMusic = function() {
        if (crossfade.battle.gainNode.gain.value) {
          crossFadeSounds(crossfade.battle, crossfade.eclipse);
        } else {
          crossFadeSounds(crossfade.eclipse, crossfade.battle);
        }
      }
    },

    muteMusic : function() {
      $.each(crossfade, function(sound) {
        if (crossfade[sound].gainNode) {
          // cancel existing schedules
          crossfade[sound].gainNode.gain.cancelScheduledValues(context.currentTime);

          // shush!
          crossfade[sound].gainNode.gain.setValueAtTime(0, context.currentTime);
        }
      });
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

  // load sounds on page load
  var nyan = { src : 'audio/nyan', volume : 1, loop : true };
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