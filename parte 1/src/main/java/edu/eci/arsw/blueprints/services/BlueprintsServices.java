/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.blueprints.services;

import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.persistence.BluePrintFilter;
import edu.eci.arsw.blueprints.persistence.BlueprintNotFoundException;
import edu.eci.arsw.blueprints.persistence.BlueprintPersistenceException;
import edu.eci.arsw.blueprints.persistence.BlueprintsPersistence;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author hcadavid
 */
@Service
public class BlueprintsServices {
   
    @Autowired
    private BlueprintsPersistence bpp;
    @Autowired
    private BluePrintFilter filter;

    public void addNewBlueprint(Blueprint bp){
        try {
            bpp.saveBlueprint(bp);
        } catch (BlueprintPersistenceException e) {
            throw new RuntimeException(e);
        }
    }
    
    public Set<Blueprint> getAllBlueprints(){
        Set<Blueprint> originals = bpp.getAllBluePrints();
        Set<Blueprint> filtered = new HashSet<>();

        for (Blueprint bp : originals) {
            filtered.add(filter.applyFilter(bp));
        }

        return filtered;
    }
    
    /**
     * 
     * @param author blueprint's author
     * @param name blueprint's name
     * @return the blueprint of the given name created by the given author
     * @throws BlueprintNotFoundException if there is no such blueprint
     */
    public Blueprint getBlueprint(String author,String name) throws BlueprintNotFoundException{
        return filter.applyFilter(bpp.getBlueprint(author,name));
    }
    
    /**
     * 
     * @param author blueprint's author
     * @return all the blueprints of the given author
     * @throws BlueprintNotFoundException if the given author doesn't exist
     */
    public Set<Blueprint> getBlueprintsByAuthor(String author) throws BlueprintNotFoundException{
        Set<Blueprint> originals = bpp.getBlueprintsByAuthor(author);
        Set<Blueprint> filtered = new HashSet<>();

        for (Blueprint bp : originals) {
            filtered.add(filter.applyFilter(bp));
        }

        return filtered;
    }

    public void updateBlueprint(String author, String name, Blueprint bp){
        bpp.update(author,name,bp);
    }

}
