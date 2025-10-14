package edu.eci.arsw.blueprints;

import edu.eci.arsw.blueprints.config.AppConfig;
import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.model.Point;
import edu.eci.arsw.blueprints.services.BlueprintsServices;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import java.util.Set;

public class appMain {
    /*public static void main(String[] args) throws Exception{
        ApplicationContext ac = new AnnotationConfigApplicationContext(AppConfig.class);
        BlueprintsServices services = ac.getBean(BlueprintsServices.class);

        Point[] pts0=new Point[]{new Point(40, 40),new Point(15, 15),new Point(15, 15),new Point(15, 15),new Point(15, 15)};
        Blueprint bp0=new Blueprint("andres", "my paint",pts0);
        Point[] pts1=new Point[]{new Point(0, 0),new Point(10, 10), new Point(10,10)};
        Blueprint bp1=new Blueprint("shiro", "the paint",pts1);
        Point[] pts2=new Point[]{new Point(0, 0),new Point(10, 0),new Point(10,20)};
        Blueprint bp2=new Blueprint("shiro", "the real paint",pts2);

        services.addNewBlueprint(bp0);
        services.addNewBlueprint(bp1);
        services.addNewBlueprint(bp2);

        Blueprint bpTest = services.getBlueprint("andres", "my paint");

        System.out.println("Consulta del guardado: "+bpTest.getAuthor()+","+bpTest.getName()+".");
        System.out.println("  Puntos:");
        for (Point pt : bpTest.getPoints()) {
            System.out.println("    (" + pt.getX() + ", " + pt.getY() + ")");
        }

        Set<Blueprint> johnsBlueprints = services.getBlueprintsByAuthor("shiro");
        System.out.println("Planos de shiro:");
        for (Blueprint bpt : johnsBlueprints) {
            System.out.println("- " + bpt.getName());
            System.out.println("  Puntos:");

            for (Point pt : bpt.getPoints()) {
                System.out.println("    (" + pt.getX() + ", " + pt.getY() + ")");
            }
        }
    }
}*/
}