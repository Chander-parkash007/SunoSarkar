FROM eclipse-temurin
WORKDIR /app
COPY sunosarkar/target/sunosarkar-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
