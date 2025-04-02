# 📝 Prueba Técnica - Desarrollador Backend Semi-Senior

## ⚠️ Antes de comenzar

Por favor, **lee toda la prueba completa antes de empezar**. El tiempo estimado para completarla es de **2-3 horas**, pero puedes tomar hasta **24 horas** para entregarla. La entrega se realiza a través de un **Pull Request (PR)** en este repositorio.

## 🔥 Instrucciones Generales

1. **Haz un fork** de este repositorio en tu cuenta de GitHub.
2. Crea una nueva rama con tu nombre o un identificador único:
   ```bash
   git checkout -b tu-nombre
   ```
3. Desarrolla tu solución en la rama creada.
4. Una vez finalizado, sube tus cambios a tu repositorio y abre un **Pull Request (PR)** hacia este repositorio.
5. **Asegúrate de incluir una breve descripción en el PR** explicando tu enfoque y decisiones técnicas.
6. Puedes usar **IA o cualquier recurso** que consideres necesario, pero ten en cuenta que podrías ser requerido para sustentar tu solución.

## 📌 Requerimientos

### 1️⃣ Implementación de API en NestJS

- Crea un servicio en **NestJS** que exponga endpoints para manejar entidades en **PostgreSQL** usando el ORM de tu preferencia (TypeORM o Prisma).
- Debe incluir CRUD para una entidad llamada `Productos` con los siguientes campos:
  - `id` (UUID, PK)
  - `nombre` (string)
  - `precio` (decimal)
  - `stock` (entero)

### 2️⃣ Seguridad y Buenas Prácticas

- Implementa **validaciones** con DTOs en los endpoints.
- Manejo adecuado de **excepciones**.
- Configuración de variables de entorno con `.env`.

### 3️⃣ Pruebas Unitarias

- Escribe pruebas unitarias para al menos un servicio usando **Jest**.

### 4️⃣ Conocimientos en AWS (Opcional, suma puntos)

- Describe cómo desplegarías esta API en **AWS ECS + RDS**.
- Explica brevemente cómo manejarías secretos con **AWS Secrets Manager**.
- Opcionalmente, agrega un pequeño **Terraform** para crear el RDS.

### 5️⃣ CI/CD con GitHub Actions y Terraform (Opcional, suma puntos)

- Crea un workflow en **GitHub Actions** para ejecutar pruebas automáticamente en cada `push` o `PR`.
- Opcionalmente, agrega un paso en el pipeline para desplegar la API en AWS usando **Terraform**.

## ⏳ Tiempo Estimado

Queremos que tengas el tiempo suficiente para hacerlo bien, pero sin presionarte demasiado. Lo ideal es que puedas completarlo en unas **2-3 horas**, pero puedes tomar hasta **24 horas** para entregarlo.

## 📬 Entrega

- Haz un **Pull Request** con tu código.
- Asegúrate de que los endpoints sean funcionales.
- Si tienes comentarios o explicaciones, agrégalas en el `README.md` de tu fork.

---

¡Buena suerte y esperamos ver tu solución! 🚀


# 🚀 Despliegue de la API en AWS ECS + RDS

Este documento describe cómo desplegar la API en AWS utilizando **ECS (Elastic Container Service)** y **RDS (Relational Database Service)**, además de cómo manejar secretos de forma segura con **AWS Secrets Manager** y cómo configurar un pipeline de **CI/CD con GitHub Actions y Terraform**.

---

## 📌 1️⃣ Infraestructura con AWS ECS y RDS (Terraform)

El despliegue de la API sigue estos pasos clave:

### 🛠️ **Base de Datos (RDS)**
- Se usa **AWS RDS (PostgreSQL)**.
- Se habilita **Multi-AZ** para alta disponibilidad.
- Las credenciales de la base de datos se almacenan en **AWS Secrets Manager**.

### 🚢 **ECS (Elastic Container Service)**
- Se define una **Task Definition** en **Fargate**.
- Se crea un **ECS Service** dentro de un **Cluster**.
- Se asocia un **Load Balancer** para manejar el tráfico HTTP.
- Se configura **Auto Scaling** basado en CPU y memoria.

### 🌐 **Red (Networking)**
- Se despliega la infraestructura en una **VPC con subnets privadas y públicas**.
- Se configuran **Security Groups** para restringir el acceso a la base de datos.


---

## 🔑 2️⃣ Manejo de Secretos con AWS Secrets Manager

Para manejar credenciales de manera segura:

1. **Almacenar variables sensibles** (`DB_USER`, `DB_PASSWORD`, `JWT_SECRET`, etc.) en **AWS Secrets Manager**.
2. **Configurar IAM** para que **solo ECS tenga acceso** a los secretos.
3. **Pasar secretos a la Task Definition de ECS**.

---

## 🔄 3️⃣ CI/CD con GitHub Actions y Terraform

Para automatizar el despliegue, se configura un **pipeline en GitHub Actions** que:

1. **Ejecuta pruebas con Jest** en cada `push` o `pull request`.
2. **Construye y sube la imagen Docker** a **Amazon ECR**.
3. **Ejecuta Terraform** para desplegar la infraestructura.
4. **Actualiza el servicio en ECS** con la nueva imagen.

