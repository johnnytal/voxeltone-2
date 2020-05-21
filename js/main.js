document.addEventListener("deviceready", start, false);
//window.onload = start;

var container;
var camera, scene, renderer, plane, rowCheck, mouse, raycaster;

var rndColor1 = getRandomColor(13);
var rndColor2 = getRandomColor(13);
var rndColor3 = getRandomColor(13);

var cubeGeometry = new THREE.BoxGeometry( 50, 50, 50 );
var cubeMaterial = new THREE.MeshLambertMaterial( { color: rndColor1, opacity: 0.9, overdraw: 0.3 } );
var cubePentaMaterial = new THREE.MeshLambertMaterial( { color: rndColor3, opacity: 0.9, overdraw: 0.3 } );
var objects = [];
var tempo = 120;
var PENTA = true;

var WATCHING = false;

var sine1 = T("cosc", {wave:'sin', freq: teoria.note('d#3').fq(), beats:6, mul:0.50});
var sine2 = T("cosc", {wave:'sin', freq: teoria.note('f#3').fq(), beats:6, mul:0.45});
var sine3 = T("cosc", {wave:'sin', freq: teoria.note('g#3').fq(), beats:6, mul:0.40});
var sine4 = T("cosc", {wave:'sin', freq: teoria.note('a#3').fq(), beats:5, mul:0.35});
var sine5 = T("cosc", {wave:'sin', freq: teoria.note('c#4').fq(), beats:5, mul:0.35});
var sine6 = T("cosc", {wave:'sin', freq: teoria.note('d#4').fq(), beats:5, mul:0.35});
var sine7 = T("cosc", {wave:'sin', freq: teoria.note('f#4').fq(), beats:5, mul:0.35});
var sine8 = T("cosc", {wave:'sin', freq: teoria.note('g#4').fq(), beats:5, mul:0.35});
var sine9 = T("cosc", {wave:'sin', freq: teoria.note('a#4').fq(), beats:4, mul:0.30});
var sine10 = T("cosc", {wave:'sin', freq: teoria.note('c#5').fq(), beats:4, mul:0.30});
var sine11 = T("cosc", {wave:'sin', freq: teoria.note('d#5').fq(), beats:4, mul:0.25});
var sine12 = T("cosc", {wave:'sin', freq: teoria.note('f#5').fq(), beats:3, mul:0.20});

var sine13 = T("cosc", {wave:'sin', freq: teoria.note('c4').fq(), beats:6, mul:0.50});
var sine14 = T("cosc", {wave:'sin', freq: teoria.note('c#4').fq(), beats:6, mul:0.45});
var sine15 = T("cosc", {wave:'sin', freq: teoria.note('d4').fq(), beats:6, mul:0.40});
var sine16 = T("cosc", {wave:'sin', freq: teoria.note('d#4').fq(), beats:5, mul:0.35});
var sine17 = T("cosc", {wave:'sin', freq: teoria.note('e4').fq(), beats:5, mul:0.35});
var sine18 = T("cosc", {wave:'sin', freq: teoria.note('f4').fq(), beats:5, mul:0.35});
var sine19 = T("cosc", {wave:'sin', freq: teoria.note('f#4').fq(), beats:5, mul:0.35});
var sine20 = T("cosc", {wave:'sin', freq: teoria.note('g4').fq(), beats:5, mul:0.35});
var sine21 = T("cosc", {wave:'sin', freq: teoria.note('g#4').fq(), beats:4, mul:0.30});
var sine22 = T("cosc", {wave:'sin', freq: teoria.note('a4').fq(), beats:4, mul:0.30});
var sine23 = T("cosc", {wave:'sin', freq: teoria.note('a#4').fq(), beats:4, mul:0.25});
var sine24 = T("cosc", {wave:'sin', freq: teoria.note('b4').fq(), beats:3, mul:0.20});

var notesToPlay = []; 
var pentatonic = [sine1, sine2, sine3, sine4, sine5, sine6, sine7, sine8, sine9, sine10, sine11, sine12];
var chromatic = [sine13, sine14, sine15, sine16, sine17, sine18, sine19, sine20, sine21, sine22, sine23, sine24];

function start(){
    init();
    render();
    paintRow();

    try{
   	   initAd();
    } catch(e){}  

    try{
        StatusBar.hide();
    } catch(e){}   

    try{
        window.plugins.insomnia.keepAwake();
    } catch(e){}
    
	document.addEventListener('DOMContentLoaded', function() {
		FastClick.attach(document.body);
	}, false);
}

function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 23, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 200, 750, 1300 );
    camera.lookAt( new THREE.Vector3() );
    scene = new THREE.Scene();
    // Grid
    var size = 300, step = 50;
    var geometry = new THREE.Geometry();
    for ( var i = - size; i <= size; i += step ) {
        geometry.vertices.push( new THREE.Vector3( - size, 0, i ) );
        geometry.vertices.push( new THREE.Vector3(   size, 0, i ) );
        geometry.vertices.push( new THREE.Vector3( i, 0, - size ) );
        geometry.vertices.push( new THREE.Vector3( i, 0,   size ) );
    }

    controls = new THREE.TrackballControls( camera );
    controls.rotateSpeed = 2.2;
    controls.zoomSpeed = 1.2;
    controls.noZoom = false;
    controls.noPan = true;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    controls.minDistance = 400;
    controls.maxDistance = 2200;
    
    var material = new THREE.LineBasicMaterial( { color: 'lightblue', opacity: 0.8 } );
    var line = new THREE.LineSegments( geometry, material );
    scene.add( line );

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    var geometry = new THREE.PlaneBufferGeometry( 600, 600 );
    geometry.rotateX( - Math.PI / 2 );
    plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: false } ) );
    scene.add( plane );
    objects.push( plane );
    var material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: false } );
    
    // Lights
    var ambientLight = new THREE.AmbientLight( 0x20a0dd );
    scene.add( ambientLight );
    var directionalLight = new THREE.DirectionalLight( 0xffffff );
    directionalLight.position.x = Math.random() - 0.5;
    directionalLight.position.y = Math.random() - 0.5;
    directionalLight.position.z = Math.random() - 0.5;
    directionalLight.position.normalize();
    scene.add( directionalLight );
    var directionalLight = new THREE.DirectionalLight( 0x808080 );
    directionalLight.position.x = Math.random() - 0.5;
    directionalLight.position.y = Math.random() - 0.5;
    directionalLight.position.z = Math.random() - 0.5;
    directionalLight.position.normalize();
    scene.add( directionalLight );
    
    renderer = new THREE.CanvasRenderer({ antialias: false,alpha:true });
    renderer.setClearColor( 0x000000, 0);
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    container.appendChild(renderer.domElement);
    
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    window.addEventListener( 'resize', onWindowResize, false );
    
    //watching = navigator.accelerometer.watchAcceleration(accelerometerSuccess, onError, { frequency: 20 });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    render();
}

function onDocumentMouseDown( event ) {
    event.preventDefault();
    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( objects );

    if ( intersects.length > 0 ) {
        var intersect = intersects[ 0 ];
        
        if ( intersect.object != plane && intersect.object != rowCheck) {
                        
            for (var i in notesToPlay) {
                if (notesToPlay[i].y === intersect.object && notesToPlay[i].x == intersect.object.position.x) {
                    spliceNote = notesToPlay[i];
                }
            }
            
            scene.remove( intersect.object );
            objects.splice( objects.indexOf( intersect.object ), 1 );

            notesToPlay.splice(spliceNote, 1);
        }
    
        else {
            var voxel;
            
            if (PENTA){
                voxel = new THREE.Mesh( cubeGeometry, cubePentaMaterial ); 
            }
            else{
                voxel = new THREE.Mesh( cubeGeometry, cubeMaterial );
            }
            voxel.position.copy( intersect.point ).add( intersect.face.normal );
            voxel.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
            
            scene.add( voxel );
            objects.push( voxel );
            
            var note = (voxel.position.z + 275) / 50;
            var noteRow = voxel.position.x;
            
            if (PENTA){
                notesToPlay.push({
                    y: voxel,
                    z: pentatonic[note],
                    x: noteRow
                });
            }
            else{
                notesToPlay.push({
                    y: voxel,
                    z: chromatic[note],
                    x: noteRow
                });    
            }
        }
        render();
    }
}

function paintRow(){       
    var rowGeometry = new THREE.BoxGeometry( 50, 15, 600 );
    var rowMaterial = new THREE.MeshLambertMaterial( { color: rndColor2, opacity: 0.8, overdraw: 0.2 } );

    rowCheck = new THREE.Mesh( rowGeometry, rowMaterial );
    rowCheck.position.x -= 325;

    scene.add( rowCheck );
    objects.push( rowCheck );   
    
    rowTimer(rowCheck);
    
}

function rowTimer(rowCheck){   
    changeRow = setTimeout(function(){
        rowCheck.position.x += 50;
        if ( rowCheck.position.x > 275 ) rowCheck.position.x = -275;
        
        for(n = 0; n< notesToPlay.length; n++){
            var noteX = notesToPlay[n].x;

            if (rowCheck.position.x == noteX){
                    
                var synth = notesToPlay[n].z;
                    
                env = T("perc", {a: 235, s:70, d:70, r:70}, synth).on("ended", function() {
                    this.pause();
                }).bang().play();             
            }     
        }
        render();
        rowTimer(rowCheck);
    }, 60000/tempo);     
}

function info(){
    $('section').toggle(400);
    
    $('section').click(function(){
        $('section').hide(400);
    });
}

function toggleSensor(){
    if (WATCHING){
    	try{
        	navigator.accelerometer.clearWatch(watching);
        }catch(e){}
        
        $('#stopAccel').val('Sensors Off');
        WATCHING = false;
    }
    else{
        watching = navigator.accelerometer.watchAcceleration(accelerometerSuccess, onError, { frequency: 20 });
        $('#stopAccel').val('Sensors On');
        WATCHING = true;
    }
}

function initAd(){
    var admobid = {
        banner: 'ca-app-pub-9795366520625065/6150763354'
    };

    if(AdMob) AdMob.createBanner({
       adId: admobid.banner,
       position: AdMob.AD_POSITION.BOTTOM_CENTER,
       autoShow: true
    });
}

function render() {
    controls.update();
    renderer.render( scene, camera );
}

$(function(){
    var handle = $( "#custom-handle" );

    $( "#slider" ).slider({
        min: 70,
        max: 280,
        create: function() {
            $("#slider").slider('value', 120);
            handle.text( $( this ).slider( "value" ) );
        },
        slide: function( event, ui ) {
            handle.text( ui.value );
            tempo = ui.value;
        }
    });
});

function getRandomColor(num) {
    var letters = '3456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * num)];
    }
    return color;
}

function accelerometerSuccess(acceleration){
     camera.position.y = 1200 - acceleration.x * 100;
     
     rowCheck.material.color.r = 1 / (Math.abs(acceleration.x)) + 0.15;
     rowCheck.material.color.g = 1 / (Math.abs(acceleration.y)) + 0.15;
     rowCheck.material.color.b = 1 / (Math.abs(acceleration.z)) + 0.15;
}

function reload(){
    setTimeout(function(){
        location.reload();
    },500);
}

function changeScale(){
    if (PENTA){
       PENTA = false; 
       $('#scaleBtn').val('Chromatic');
    }
    else{
        PENTA = true;
        $('#scaleBtn').val('Pentatonic');
    }
}

function onError(){}