/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.blueprints.controllers;

import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.persistence.BlueprintPersistenceException;
import edu.eci.arsw.blueprints.persistence.BlueprintsPersistence;
import edu.eci.arsw.blueprints.services.BlueprintsServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 *
 * @author hcadavid
 */
@RestController
@RequestMapping(value = "/blueprints")
public class BlueprintAPIController {

    @Autowired
    BlueprintsServices blueprintServices;

    @Autowired
    BlueprintsPersistence bpp;

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<?> getAllBlueprints() {
        try {
            Set<Blueprint> data = blueprintServices.getAllBlueprints();
            return new ResponseEntity<>(data, HttpStatus.ACCEPTED);
        } catch (Exception ex) {
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("Error al obtener los planos", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{author}")
    public ResponseEntity<?> getBlueprintById(@PathVariable("author") String author) {
        try {
            Set<Blueprint> data = blueprintServices.getBlueprintsByAuthor(author);
            return new ResponseEntity<>(data, HttpStatus.ACCEPTED);
        } catch (Exception ex) {
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("Error al obtener los planos", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{author}/{bpname}")
    public ResponseEntity<?> getBlueprintByAuthorAndName(
            @PathVariable("author") String author,
            @PathVariable("bpname") String blueprintName) {
        try {
            Set<Blueprint> data = Collections.singleton(blueprintServices.getBlueprint(author, blueprintName));
            return new ResponseEntity<>(data, HttpStatus.ACCEPTED);
        } catch (Exception ex) {
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("Error al obtener los planos", HttpStatus.NOT_FOUND);
        }
    }


    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<?> addNewBlueprint(@RequestBody Blueprint bp) {
        try {
            blueprintServices.addNewBlueprint(bp);
            Set<Blueprint> data = Collections.singleton(bp);
            return new ResponseEntity<>(data, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            // Caso: datos inválidos
            return new ResponseEntity<>("Datos inválidos para crear el plano", HttpStatus.BAD_REQUEST);

        } catch (Exception e) {
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, e);
            return new ResponseEntity<>("Error interno al crear el plano", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{author}/{bpname}")
    public ResponseEntity<?> editBlueprint(
            @PathVariable("author") String author,
            @PathVariable("bpname") String bpname,
            @RequestBody Blueprint bp) {
        try {
            // Verificamos que el blueprint coincida con el author y el nombre de la URL
            if (!bp.getAuthor().equals(author) || !bp.getName().equals(bpname)) {
                return new ResponseEntity<>("Los datos del cuerpo no coinciden con la URL", HttpStatus.BAD_REQUEST);
            }

            blueprintServices.updateBlueprint(author, bpname, bp);
            return new ResponseEntity<>(bp, HttpStatus.OK);

        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Datos inválidos para actualizar el plano", HttpStatus.BAD_REQUEST);

        } catch (Exception e) {
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, e);
            return new ResponseEntity<>("Error interno al actualizar el plano", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}





