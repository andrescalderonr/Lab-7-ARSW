package edu.eci.arsw.collabpaint.controller;


import edu.eci.arsw.collabpaint.model.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class STOMPMessagesHandler {

    @Autowired
    SimpMessagingTemplate msgt;

    private final Map<String, List<Point>> drawings = new ConcurrentHashMap<>();

    @MessageMapping("/newpoint.{numdibujo}")
    public void handlePointEvent(Point pt, @DestinationVariable String numdibujo) throws Exception {
        System.out.println("Nuevo punto recibido en el servidor!:"+pt);

        drawings.putIfAbsent(numdibujo, Collections.synchronizedList(new ArrayList<>()));
        drawings.get(numdibujo).add(pt);

        // Notificar a todos los clientes el nuevo punto
        msgt.convertAndSend("/topic/newpoint." + numdibujo, pt);

        // Sí hay 4 o más puntos, crear el polígono
        List<Point> points = drawings.get(numdibujo);
        if (points.size() >= 4) {
            Map<String, Object> polygon = new HashMap<>();
            polygon.put("points", new ArrayList<>(points));
            msgt.convertAndSend("/topic/newpolygon." + numdibujo, polygon);

            // Reiniciar puntos si quieres empezar otro polígono
            points.clear();
        }
    }
}

