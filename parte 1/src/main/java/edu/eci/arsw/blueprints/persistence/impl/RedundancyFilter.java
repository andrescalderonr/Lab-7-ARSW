package edu.eci.arsw.blueprints.persistence.impl;

import java.util.ArrayList;
import java.util.List;

import edu.eci.arsw.blueprints.model.Point;
import edu.eci.arsw.blueprints.persistence.*;
import edu.eci.arsw.blueprints.model.Blueprint;
import org.springframework.stereotype.Component;

//@Component
public class RedundancyFilter implements BluePrintFilter {

    @Override
    public Blueprint applyFilter(Blueprint blueprint) {
        List<Point> originalPoints = blueprint.getPoints();
        List<Point> filteredPoints = new ArrayList<>();

        if (!originalPoints.isEmpty()) {
            Point prev = null;
            for (Point pt : originalPoints) {
                if (prev == null || !(pt.getX() == prev.getX() && pt.getY() == prev.getY())) {
                    filteredPoints.add(pt);
                    prev = pt;
                }
            }
        }

        Point[] filteredArray = filteredPoints.toArray(new Point[0]);
        return new Blueprint(blueprint.getAuthor(), blueprint.getName(), filteredArray);
    }
}
