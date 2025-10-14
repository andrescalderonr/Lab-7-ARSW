/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.blueprints.persistence.impl;

import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.model.Point;
import edu.eci.arsw.blueprints.persistence.BlueprintNotFoundException;
import edu.eci.arsw.blueprints.persistence.BlueprintPersistenceException;
import edu.eci.arsw.blueprints.persistence.BlueprintsPersistence;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

/**
 *
 * @author hcadavid
 */
@Repository
public class InMemoryBlueprintPersistence implements BlueprintsPersistence {

    private final ConcurrentMap<Tuple<String, String>, Blueprint> blueprints = new ConcurrentHashMap<>();

    public InMemoryBlueprintPersistence() {
        Point[] pts = new Point[]{new Point(140, 140), new Point(115, 115)};
        Blueprint bp = new Blueprint("_authorname_", "_bpname_ ", pts);
        blueprints.put(new Tuple<>(bp.getAuthor(), bp.getName()), bp);

        Point[] pts0 = new Point[]{new Point(40, 40), new Point(15, 15), new Point(15, 15), new Point(15, 15), new Point(15, 15)};
        Blueprint bp0 = new Blueprint("andres", "my paint", pts0);
        Point[] pts1 = new Point[]{new Point(0, 0), new Point(10, 10), new Point(10, 10)};
        Blueprint bp1 = new Blueprint("shiro", "the paint", pts1);
        Point[] pts2 = new Point[]{new Point(0, 0), new Point(10, 0), new Point(10, 20)};
        Blueprint bp2 = new Blueprint("shiro", "the real paint", pts2);

        blueprints.put(new Tuple<>(bp0.getAuthor(), bp0.getName()), bp0);
        blueprints.put(new Tuple<>(bp1.getAuthor(), bp1.getName()), bp1);
        blueprints.put(new Tuple<>(bp2.getAuthor(), bp2.getName()), bp2);
    }

    @Override
    public void saveBlueprint(Blueprint bp) throws BlueprintPersistenceException {
        Tuple<String, String> key = new Tuple<>(bp.getAuthor(), bp.getName());
        Blueprint existing = blueprints.putIfAbsent(key, bp);
        if (existing != null) {
            throw new BlueprintPersistenceException("The given blueprint already exists: " + bp);
        }
    }

    @Override
    public Blueprint getBlueprint(String author, String bprintname) throws BlueprintNotFoundException {
        Blueprint bp = blueprints.get(new Tuple<>(author, bprintname));
        if (bp == null) {
            throw new BlueprintNotFoundException("Blueprint not found: " + author + " - " + bprintname);
        }
        return bp;
    }

    @Override
    public Set<Blueprint> getBlueprintsByAuthor(String author) throws BlueprintNotFoundException {
        Set<Blueprint> blueprintsByAuthor = new HashSet<>();
        for (Map.Entry<Tuple<String, String>, Blueprint> entry : blueprints.entrySet()) {
            Tuple<String, String> key = entry.getKey();
            if (key.getElem1().equals(author)) {
                blueprintsByAuthor.add(entry.getValue());
            }
        }
        if (blueprintsByAuthor.isEmpty()) {
            throw new BlueprintNotFoundException("No blueprints found for author: " + author);
        }
        return blueprintsByAuthor;
    }

    @Override
    public Set<Blueprint> getAllBluePrints() {
        return new HashSet<>(blueprints.values());
    }

    @Override
    public void update(String author, String name, Blueprint bp) {
        Tuple<String, String> key = new Tuple<>(author, name);
        Blueprint old = blueprints.replace(key, bp);
        if (old == null) {

        }
    }
}