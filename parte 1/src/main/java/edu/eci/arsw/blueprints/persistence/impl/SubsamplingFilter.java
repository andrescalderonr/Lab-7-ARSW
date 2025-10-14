package edu.eci.arsw.blueprints.persistence.impl;

import java.util.ArrayList;
import java.util.List;

import edu.eci.arsw.blueprints.model.Point;
import edu.eci.arsw.blueprints.persistence.*;
import edu.eci.arsw.blueprints.model.Blueprint;
import org.springframework.stereotype.Component;

@Component
public class SubsamplingFilter implements BluePrintFilter {

    @Override
    public Blueprint applyFilter(Blueprint blueprint) {
        List<Point> originalPoints = blueprint.getPoints();
        List<Point> filteredPoints = new ArrayList<>();

        for (int i = 0; i < originalPoints.size(); i++) {
            if (i % 2 == 0) {
                filteredPoints.add(originalPoints.get(i));
            }
        }

        Point[] filteredArray = filteredPoints.toArray(new Point[0]);
        return new Blueprint(blueprint.getAuthor(), blueprint.getName(), filteredArray);
    }
}
