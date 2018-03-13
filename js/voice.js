~function(g){


	g.AudioContext = g.AudioContext || g.webkitAudioContext || g.mozAudioContext || g.msAudioContext;

	var voice = g.voice = {}

	voice.context = new AudioContext

	voice.source = null;

    voice.status = 0;

	voice.canvas = document.createElement("canvas");
	voice.canvas.width  = 800;
	voice.canvas.height = 480;

	voice.readBuffer = function(file,cb){

		voice.status = 1;

		var xhr = new XMLHttpRequest;
			xhr.open("get",file,true);
			xhr.responseType = "arraybuffer";

		xhr.onload =  function(){
			 	cb(xhr.response)
		}

		xhr.send();
	}



	voice.decode = function(buffer){
		voice.status = 2;
		voice.context.decodeAudioData(buffer, function(buf) {
                voice.visualize(voice.context, buf);
         });
	}


	


	voice.visualize = function(audioContext, buffer){

		 var audioBufferSouceNode = audioContext.createBufferSource(),
             analyser = audioContext.createAnalyser();

        audioBufferSouceNode.connect(analyser);
        analyser.connect(audioContext.destination);
        audioBufferSouceNode.buffer = buffer;

        
        if (voice.source !== null) 
            voice.source.stop(0);

        audioBufferSouceNode.start(0);
        voice.source = audioBufferSouceNode;
        voice.status = 3;
        audioBufferSouceNode.onended = function() {
            voice.voiceEnd();
            voice.status=0;
        };
        voice.draw(analyser);
	}


	voice.draw = function(analyser){

		var ctx = voice.canvas.getContext("2d");
		var grid = 10;
		var cap = 2;
		var meter  = 800 / (grid + cap);

        capArray = [];
        gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(1, '#0f0');
        gradient.addColorStop(0.5, '#ff0');
        gradient.addColorStop(0, '#f00');
		
		var cycle = function(){

			if(voice.status===0)
				return ;

			var array = new Uint8Array(analyser.frequencyBinCount);
            	analyser.getByteFrequencyData(array);


            var step = Math.round(array.length / meter); 
            ctx.clearRect(0, 0, 800, 480);

            for (var i = 0; i < meter; i++) {

                var value = array[i * step];

                if (capArray.length < meter) {
                    capArray.push(value);
                };

                ctx.fillStyle = "rgb(1.0 , 1.0 , 1.0)";
                
                if (value < capArray[i]) {
                    ctx.fillRect(i * 12, 480 - (--capArray[i]), grid, cap);
                } else {
                    ctx.fillRect(i * 12, 480 - value, grid, cap);
                    capArray[i] = value;
                };
                ctx.fillStyle = gradient; 
                ctx.fillRect(i * 12 , 480 - value + cap, grid, 480); 
            }

            voice.onplay(voice.canvas)
            window.requestAnimationFrame(cycle)

		}

		cycle();

	}


	voice.onplay = function(){}
	voice.voiceEnd = function(){}


}(this);