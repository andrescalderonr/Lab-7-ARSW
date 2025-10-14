var app = (function () {

    var selectedAuthor = null;
    var selectedBlueprints = [];
    var offset = null;
    var currentBlueprint = null;

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

    function updateBlueprintsTable(authname) {
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
    }

    // ---------------------- LAB 7 ----------------------

    function initCanvasEvents() {
        var canvas = document.getElementById("blueprintCanvas"),
            context = canvas.getContext("2d");
        offset = getOffset(canvas);
        if (window.PointerEvent) {
            canvas.addEventListener("pointerdown", draw, false);
        } else {
            canvas.addEventListener("mousedown", draw, false);
        }
    }

    function draw(event) {
        if (!currentBlueprint) return;

        var canvas = document.getElementById("blueprintCanvas"),
            context = canvas.getContext("2d");

        if (!offset) offset = getOffset(canvas);

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        currentBlueprint.points.push({ x: x, y: y });

        // Limpiar y redibujar
        context.clearRect(0, 0, canvas.width, canvas.height);
        let pts = currentBlueprint.points;

        if (pts.length > 0) {
            context.beginPath();
            context.moveTo(pts[0].x, pts[0].y);
            for (let i = 1; i < pts.length; i++) {
                context.lineTo(pts[i].x, pts[i].y);
            }
            context.strokeStyle = "blue";
            context.lineWidth = 2;
            context.stroke();
        }

        pts.forEach(pt => context.fillRect(pt.x, pt.y, 5, 5));
        $("#totalPoints").text(currentBlueprint.points.length);
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
        } while (obj = obj.offsetParent);
        return { left: offsetLeft, top: offsetTop };
    }

    function saveCurrentBlueprint() {
        if (!currentBlueprint) {
            alert("No hay un plano seleccionado para guardar.");
            return;
        }

        const blueprintToSend = {
            author: currentBlueprint.author,
            name: currentBlueprint.name,
            points: [...currentBlueprint.points] // Copia de los puntos actuales
        };

        // Convertimos updateBlueprint en promesa
        const updatePromise = new Promise((resolve, reject) => {
            api.updateBlueprint(currentBlueprint.author, currentBlueprint.name, blueprintToSend, function (data) {
                resolve(data);
            });
        });

        updatePromise
            .then(() => {
                // Convertimos getBlueprintsByAuthor en promesa
                return new Promise((resolve, reject) => {
                    api.getBlueprintsByAuthor(currentBlueprint.author, function (bps) {
                        resolve(bps);
                    });
                });
            })
            .then((bps) => {
                // Actualizamos selectedBlueprints y la tabla
                selectedBlueprints = bps.map(bp => ({
                    nombre: bp.name,
                    numPuntos: bp.points.length
                }));

                $("#tableBlueprints tbody").empty();
                selectedBlueprints.forEach(bp => {
                    let row = `<tr>
                                   <td>${bp.nombre}</td>
                                   <td>${bp.numPuntos}</td>
                                   <td><button class="open-btn" data-name="${bp.nombre}">Open</button></td>
                               </tr>`;
                    $("#tableBlueprints tbody").append(row);
                });

                const total = selectedBlueprints.reduce((acc, bp) => acc + bp.numPuntos, 0);
                $("#totalPoints").text(total);

                alert("Plano actualizado correctamente!");
            })
            .catch(err => {
                console.error("Error guardando el plano:", err);
                alert("Error al actualizar el plano");
            });
    }

    // ---------------------- EXPORTS ----------------------

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

        // Dibujar blueprint por nombre y autor
        drawBlueprintByNameAndAuthor: function (author, bpname) {
            api.getBlueprintsByAuthor(author, function (bps) {
                let bp = bps.find(function (e) { return e.name === bpname });
                if (bp) {
                    currentBlueprint = bp;
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
                        bp.points.forEach(pt => ctx.fillRect(pt.x, pt.y, 5, 5));
                    }

                    $("#blueprintName").text(bp.name);
                } else {
                    alert("No se encontró el plano " + bpname + " del autor " + author);
                }
            });
        },

        initCanvasEvents: initCanvasEvents,
        saveCurrentBlueprint: saveCurrentBlueprint,
        updateBlueprintsTable: updateBlueprintsTable
    };
})();

$(document).ready(function () {
    $("#tableBlueprints").on("click", ".open-btn", function () {
        let bpName = $(this).data("name");
        let author = app.getSelectedAuthor();
        app.drawBlueprintByNameAndAuthor(author, bpName);
    });

    app.initCanvasEvents();

    $("#saveBlueprints").click(function () {
        app.saveCurrentBlueprint();
    });
});
