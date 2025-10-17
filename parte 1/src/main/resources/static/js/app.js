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
            let transformed = bps.map(function (bp) {
                return {
                    nombre: bp.name,
                    numPuntos: bp.points.length
                };
            });
            selectedBlueprints = transformed;
            $("#tableBlueprints tbody").empty();
            transformed.map(function (bp) {
                let row = `
                    <tr>
                        <td>${bp.nombre}</td>
                        <td>${bp.numPuntos}</td>
                        <td>
                            <button class="open-btn" data-name="${bp.nombre}">Open</button>
                            <button class="delete-btn btn btn-danger btn-sm" data-name="${bp.nombre}">Delete</button>
                        </td>
                    </tr>`;
                $("#tableBlueprints tbody").append(row);
            });

            let total = transformed.reduce(function (acc, bp) {
                return acc + bp.numPuntos;
            }, 0);

            $("#totalPoints").text(total);

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

    function createNewBlueprint(author, bpName) {
        currentBlueprint = {
            author: author,
            name: bpName,
            points: []
        };

        const canvas = document.getElementById("blueprintCanvas");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        $("#blueprintName").text(bpName);
        $("#authorName").text(author);

        alert(`Nuevo blueprint "${bpName}" creado. Puede comenzar a dibujar.`);
    }

    function saveCurrentBlueprint() {
        if (!currentBlueprint) {
            alert("No hay un plano seleccionado para guardar.");
            return;
        }

        const blueprintToSend = {
            author: currentBlueprint.author,
            name: currentBlueprint.name,
            points: [...currentBlueprint.points]
        };

        const isNew = !selectedBlueprints.some(bp => bp.nombre === currentBlueprint.name);

        const savePromise = new Promise((resolve, reject) => {
            if (isNew) {
                api.addBlueprint(blueprintToSend, resolve);
            } else {
                api.updateBlueprint(currentBlueprint.author, currentBlueprint.name, blueprintToSend, resolve);
            }
        });

        savePromise
            .then(() => {
                return new Promise((resolve) => {
                    api.getBlueprintsByAuthor(currentBlueprint.author, resolve);
                });
            })
            .then((bps) => {
                selectedBlueprints = bps.map(bp => ({
                    nombre: bp.name,
                    numPuntos: bp.points.length
                }));

                $("#tableBlueprints").on("click", ".open-btn", function () {
                    let bpName = String($(this).data("name"));
                    let author = app.getSelectedAuthor();
                    app.drawBlueprintByNameAndAuthor(author, bpName);
                });


                const total = selectedBlueprints.reduce((acc, bp) => acc + bp.numPuntos, 0);
                $("#totalPoints").text(total);
                app.updateBlueprintsTable(currentBlueprint.author);

                alert(isNew ? "Nuevo blueprint creado correctamente!" : "Blueprint actualizado correctamente!");
            })
            .catch(err => {
                console.error("Error al guardar el plano:", err);
                alert("Error al guardar el plano.");
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
        createNewBlueprint: createNewBlueprint,
        // Dibujar blueprint por nombre y autor
        drawBlueprintByNameAndAuthor: function (author, bpname) {
            api.getBlueprintsByAuthor(author, function (bps) {
                let bp = bps.find(function (e) { return String(e.name) === String(bpname); });
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
