FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app
COPY . .

RUN mvn clean install -DskipTests

# Etapa final
FROM eclipse-temurin:21-jdk-jammy

EXPOSE 7070

COPY --from=build /app/target/deploy_render-1.0.0.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
