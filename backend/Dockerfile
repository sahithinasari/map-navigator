# Dockerfile
FROM eclipse-temurin:17-jdk-alpine
# App directory
WORKDIR /app

# Copy project JAR
COPY target/map-navigator.jar app.jar

# Expose port
EXPOSE 2027

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]