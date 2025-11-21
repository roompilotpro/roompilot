package com.roompilot.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {

  @Bean
  public OpenAPI roompilotOpenAPI() {
    Server localServer = new Server();
    localServer.setUrl("http://localhost:8080");
    localServer.setDescription("Local Development Server");

    Contact contact = new Contact();
    contact.setName("RoomPilot Team");

    Info info =
        new Info()
            .title("RoomPilot API")
            .version("1.0.0")
            .description("API for managing roommate messages and communications")
            .contact(contact)
            .license(new License().name("MIT License"));

    return new OpenAPI().info(info).servers(List.of(localServer));
  }
}
