# -------------------------------------------------------
# STAGE 1 — Build da aplicação (Maven + Java 17)
# -------------------------------------------------------
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

# Copia o backend
COPY back/pom.xml .
RUN mvn dependency:go-offline -B

COPY back/src ./src

# Compila o projeto (gera projeto-0.0.1-SNAPSHOT.jar)
RUN mvn clean package -DskipTests


# -------------------------------------------------------
# STAGE 2 — Runtime (somente o jar final)
# -------------------------------------------------------
FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copia o jar gerado no stage 1
COPY --from=builder /app/target/projeto-0.0.1-SNAPSHOT.jar app.jar

# Render expõe 8080 automaticamente
EXPOSE 8080

# Inicia o Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]
