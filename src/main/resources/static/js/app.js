var app = (function(){

    var selectedAuthor = null;
    var selectedBlueprints = [];
    var offset = null;

    function updateBlueprints() {
        if (selectedAuthor) {
            api.getBlueprintsByAuthor(selectedAuthor, function (bps) {
                selectedBlueprints = [];
                for (var i = 0; i < bps.length; i++) {
                    var plano = bps[i];
                    var nuevo = {
                        nombre: plano.name,
                        numPuntos: plano.points.length
                    };
                    selectedBlueprints.push(nuevo);
                }
            });
        } else {
            selectedBlueprints = [];
        }
    }
    // Lab 7
     function initCanvasEvents() {
             var canvas = document.getElementById("blueprintCanvas"),
             context = canvas.getContext("2d");
             offset  = getOffset(canvas);
             if(window.PointerEvent) {
               canvas.addEventListener("pointerdown", draw, false);
             }
             else {
               canvas.addEventListener("mousedown", draw, false);
             }
           }

           function draw(event) {
                var canvas = document.getElementById("blueprintCanvas"),
                context = canvas.getContext("2d");
                if (!offset) offset = getOffset(canvas);
                context.fillRect(event.pageX-offset.left, event.pageY-offset.top, 5, 5);
           }

           function getOffset(obj) {
               var offsetLeft = 0;
               var offsetTop = 0;
               do {
                 if (!isNaN(obj.offsetLeft)) {
                     offsetLeft += obj.offsetLeft;
                 }
                 if (!isNaN(obj.offsetTop)) {
                     offsetTop += obj.offsetTop;
                 }
               } while(obj = obj.offsetParent );
               return {left: offsetLeft, top: offsetTop};
           }
//Lab 7

    return {
        getBlueprintsByAuthor: function (authname, callback) {
            api.getBlueprintsByAuthor(authname, callback);
        },

        getBlueprintsByNameAndAuthor: function (authname, bpname, callback) {
            api.getBlueprintsByAuthor(authname, function (bps) {
                callback(bps.find(function (e) { return e.name === bpname }));
            });
        },

        setSelectedAuthor: function (authname) {
            selectedAuthor = authname;
            updateBlueprints();
        },

        getSelectedAuthor: function () {
            return selectedAuthor;
        },

        getSelectedBlueprints: function () {
            return selectedBlueprints;
        },

        updateBlueprintsTable: function (authname) {
            selectedAuthor = authname;

            api.getBlueprintsByAuthor(authname, function (bps) {
                // 1. Transformar con map
                let transformed = bps.map(function (bp) {
                    return {
                        nombre: bp.name,
                        numPuntos: bp.points.length
                    };
                });

                // Guardar en estado
                selectedBlueprints = transformed;

                // 2. Limpiar tabla antes de llenarla
                $("#tableBlueprints tbody").empty();

                // 3. Agregar filas a la tabla con botones Open
                transformed.map(function (bp) {
                    let row = `<tr>
                                  <td>${bp.nombre}</td>
                                  <td>${bp.numPuntos}</td>
                                  <td><button class="open-btn" data-name="${bp.nombre}">Open</button></td>
                               </tr>`;
                    $("#tableBlueprints tbody").append(row);
                });

                // 4. Calcular total de puntos con reduce
                let total = transformed.reduce(function (acc, bp) {
                    return acc + bp.numPuntos;
                }, 0);

                // 5. Actualizar el DOM
                $("#totalPoints").text(total);
                // 6. Mostrar autor en la cabecera
                $("#authorName").text(authname);
            });
        },

        // Nueva operación: dibujar blueprint por nombre y autor
        drawBlueprintByNameAndAuthor: function (author, bpname) {
            api.getBlueprintsByAuthor(author, function (bps) {
                let bp = bps.find(function (e) { return e.name === bpname });
                if (bp) {
                    // --- Dibujar en canvas ---
                    let canvas = document.getElementById("blueprintCanvas");
                    let ctx = canvas.getContext("2d");

                    // Limpiar canvas
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    if (bp.points.length > 0) {
                        ctx.beginPath();
                        ctx.moveTo(bp.points[0].x, bp.points[0].y);

                        for (let i = 1; i < bp.points.length; i++) {
                            ctx.lineTo(bp.points[i].x, bp.points[i].y);
                        }

                        ctx.strokeStyle = "blue";
                        ctx.lineWidth = 2;
                        ctx.stroke();
                    }

                    // --- Actualizar el DOM con el nombre del plano ---
                    $("#blueprintName").text(bp.name);
                } else {
                    alert("No se encontró el plano " + bpname + " del autor " + author);
                }
            });
        },
initCanvasEvents: initCanvasEvents

    };
})();

$(document).ready(function () {
    $("#tableBlueprints").on("click", ".open-btn", function () {
        let bpName = $(this).data("name");
        let author = app.getSelectedAuthor();
        app.drawBlueprintByNameAndAuthor(author, bpName);
    });
    app.initCanvasEvents();
});
