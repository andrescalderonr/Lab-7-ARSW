var app = (function () {

    var drawingId = null;

    class Point{
        constructor(x,y){
            this.x=x;
            this.y=y;
        }        
    }
    
    var stompClient = null;

    var addPointToCanvas = function (point) {        
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(point.x, point.y, 1, 0, 2 * Math.PI);
        ctx.stroke();
    };
    
    
    var getMousePosition = function (evt) {
        canvas = document.getElementById("canvas");
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };


    var connectAndSubscribe = function (drawingId) {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);
        
        //subscribe to /topic/TOPICXX when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/newpoint.' + drawingId, function (message) {
            /*Lab7*/
                var theObject = JSON.parse(message.body);
                console.log("Punto recibido:", theObject);
                addPointToCanvas(theObject)
               /*Lab 7*/
            });
             stompClient.subscribe('/topic/newpolygon.' + drawingId, function (message) {
                var polygon = JSON.parse(message.body);
                console.log("Polígono recibido:", polygon);
                drawPolygon(polygon);
             });
        });

    };
    
    var drawPolygon = function (polygon) {
            var points = polygon.points;
            var canvas = document.getElementById("canvas");
            var ctx = canvas.getContext("2d");

            if (points.length > 0) {
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length; i++) {
                    ctx.lineTo(points[i].x, points[i].y);
                }
                ctx.closePath();
                ctx.strokeStyle = "blue";
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        };

    return {

        init: function () {
            var can = document.getElementById("canvas");
            /*Lab 7*/
            can.addEventListener("click", function(event){
                var pos = getMousePosition(event);
                var pt = new Point(pos.x, pos.y);
                app.publishPoint(pt.x, pt.y);
            });
            /*Lab 7*/
        },

        publishPoint: function(px,py){
            var pt=new Point(px,py);
            console.info("publishing point at "+pt);
            addPointToCanvas(pt);

            //publicar el evento
            /*Lab 7*/
            stompClient.send("/app/newpoint." + drawingId, {}, JSON.stringify(pt));
            /*Lab 7*/
        },

        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            console.log("Disconnected");
        },

        connect: function () {
            var idInput = document.getElementById("drawId");
            drawingId = idInput.value;
            if (drawingId) {
                connectAndSubscribe(drawingId);
            } else {
                alert("Por favor ingresa un ID de dibujo antes de conectarte.");
            }
        },

    };

})();