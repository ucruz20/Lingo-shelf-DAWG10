package com.lingoshelf.proyecto.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI lingoShelfOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("LingoShelf API")
                        .version("v1")
                        .description("Documentacion interactiva de la API de LingoShelf.")
                        .contact(new Contact()
                                .name("Grupo 10 proyecto Lingoshelf")
                                .email("grupo10@lingoshelf.local")));
    }
}
