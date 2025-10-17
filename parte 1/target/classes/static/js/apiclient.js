apiclient = (function () {

    const apiUrl = "http://localhost:8080/blueprints";

    return {
        getBlueprintsByAuthor: function (author, callback) {
            $.get(apiUrl + "/" + author, function (data) {
                callback(data);
            }).fail(function () {
                alert("Error obteniendo planos del autor: " + author);
            });
        },
        addBlueprint: function (bp, callback) {
            $.ajax({
                url: apiUrl,
                type: "POST",
                data: JSON.stringify(bp),
                contentType: "application/json",
                success: function (data) {
                    callback(data);
                },
                error: function () {
                    alert("Error al crear el plano");
                }
            });
        },
        getBlueprintsByNameAndAuthor: function (author, name, callback) {
            $.get(apiUrl + "/" + author + "/" + name, function (data) {
                // Ojo: el backend devuelve un Set (conjunto) aunque sea un solo plano
                // entonces hay que tomar el primero del arreglo
                if (Array.isArray(data)) {
                    callback(data[0]);
                } else {
                    callback(data);
                }
            }).fail(function () {
                alert("Error obteniendo el plano: " + name + " del autor: " + author);
            });
        },

        addBlueprint: function (bp, callback) {
            $.ajax({
                url: apiUrl,
                type: "POST",
                data: JSON.stringify(bp),
                contentType: "application/json",
                success: function (data) {
                    callback(data);
                },
                error: function () {
                    alert("Error al crear el plano");
                }
            });
        },
        deleteBlueprint: function (author, name, callback) {
            $.ajax({
                url: apiUrl + "/" + author + "/" + name,
                type: "DELETE",
                success: function () {
                    callback();
                },
                error: function () {
                    alert("Error al eliminar el plano " + name + " del autor " + author);
                }
            });
        },
        updateBlueprint: function (author, name, bp, callback) {
            $.ajax({
                url: apiUrl + "/" + author + "/" + name,
                type: "PUT",
                data: JSON.stringify(bp),
                contentType: "application/json",
                success: function (data) {
                    callback(data);
                },
                error: function () {
                    alert("Error al actualizar el plano");
                }
            });
        }
    };

})();
