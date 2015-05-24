function random (low, high) {
    return Math.random() * (high - low) + low;
}

var renderer;
var scene;
var prevobjectCount;

function clearScene(){
	if(typeof(scene) === 'undefined')
	{
		return;
	}
    var children = scene.children;
    for(var i = children.length-1;i>=0;i--){
        var child = children[i];
        scene.remove(child);
    };
};

Template.ThreeJsCanvas.helpers({
  planes: function () {
	  
	var objPlanes = Planes.find().fetch();
	
	clearScene();
	//////////////////////////////////////////////////////////////////////////////////
	//		Comment								//
	//////////////////////////////////////////////////////////////////////////////////
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	
	var DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1;
	renderer	= new THREE.WebGLRenderer({
		alpha	: true, devicePixelRatio: DPR
	});
	renderer.setClearColor(new THREE.Color('black'), 0)
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	var onRenderFcts	= [];
	scene	= new THREE.Scene();
	var camera	= new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.z = 1
	

	//////////////////////////////////////////////////////////////////////////////////
	//		create THREEx.HtmlMixer						//
	//////////////////////////////////////////////////////////////////////////////////

	var mixerContext= new THREEx.HtmlMixer.Context(renderer, scene, camera)
	mixerContext.rendererCss.setSize( window.innerWidth, window.innerHeight )

	// handle window resize for mixerContext
	window.addEventListener('resize', function(){
		mixerContext.rendererCss.setSize( window.innerWidth, window.innerHeight )
	}, false)

	//////////////////////////////////////////////////////////////////////////////////
	//		mixerContext configuration and dom attachement
	//////////////////////////////////////////////////////////////////////////////////

 	// set up rendererCss
	var rendererCss		= mixerContext.rendererCss
	// set up rendererWebgl
	var rendererWebgl	= mixerContext.rendererWebgl

	var css3dElement		= rendererCss.domElement
	css3dElement.style.position	= 'absolute'
	css3dElement.style.top		= '0px'
	css3dElement.style.width	= '100%'
	css3dElement.style.height	= '100%'
	document.body.appendChild( css3dElement )
	
	var webglCanvas			= rendererWebgl.domElement
	webglCanvas.style.position	= 'absolute'
	webglCanvas.style.top		= '0px'
	webglCanvas.style.width		= '100%'
	webglCanvas.style.height	= '100%'
	webglCanvas.style.pointerEvents	= 'none'
	css3dElement.appendChild( webglCanvas )
	
	//////////////////////////////////////////////////////////////////////////////////
	//		create a Plane for THREEx.HtmlMixer				//
	//////////////////////////////////////////////////////////////////////////////////
	

	for (var key in objPlanes) {
		var mixerPlane	= THREEx.HtmlMixer.createPlaneFromIframe(mixerContext, objPlanes[key].url)
		var x = random(-0.9, 0.9);
		var y = random(-0.5, 0.5);
		mixerPlane.object3d.position.set(x,y,0);
		mixerPlane.object3d.scale.multiplyScalar(.5);
		scene.add(mixerPlane.object3d)
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		handle resize							//
	//////////////////////////////////////////////////////////////////////////////////

	window.addEventListener('resize', function(){
		// notify the renderer of the size change
		renderer.setSize( window.innerWidth, window.innerHeight )
		// update the camera
		camera.aspect	= window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()		
	}, false)


	//////////////////////////////////////////////////////////////////////////////////
	//		handle resize							//
	//////////////////////////////////////////////////////////////////////////////////

	function onResize(){
		// notify the renderer of the size change
		renderer.setSize( window.innerWidth, window.innerHeight )
		// update the camera
		camera.aspect	= window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()		
	}
	
	window.addEventListener('resize', onResize, false)
	//////////////////////////////////////////////////////////////////////////////////
	//		render the scene						//
	//////////////////////////////////////////////////////////////////////////////////
	onRenderFcts.push(function(delta, now){
		mixerContext.update()
	})
	onRenderFcts.push(function(){
		renderer.render( scene, camera );		
	})
	
	//////////////////////////////////////////////////////////////////////////////////
	//		loop runner							//
	//////////////////////////////////////////////////////////////////////////////////
	var lastTimeMsec= null
	requestAnimationFrame(function animate(nowMsec){
		// keep looping
		requestAnimationFrame( animate );
		// measure time
		lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
		var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
		lastTimeMsec	= nowMsec
		// call each update function
		onRenderFcts.forEach(function(onRenderFct){
			onRenderFct(deltaMsec/1000, nowMsec/1000)
		})
	})
  }
});

Template.UrlForm.events({
    'submit form': function(event){
      event.preventDefault();
      var weburl = event.target.url.value;
      Planes.insert({
          url: weburl
      });
    }
  });
  
