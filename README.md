# Nombre del proyecto: CampoYa

> Plataforma digital de comercio agrícola local — Riohacha, La Guajira, Colombia.

CampoYa es una aplicación web de mercado local que conecta de forma directa a **productores agrícolas** de la región de La Guajira con **consumidores** de Riohacha. A través de la plataforma, los granjeros publican diariamente su oferta de productos frescos —frutas, verduras, tubérculos y otros cultivos—, los cuales permanecen disponibles durante 24 horas. Los clientes pueden explorar el catálogo, añadir productos al carrito y gestionar sus pedidos desde cualquier dispositivo, sin necesidad de intermediarios.

# Problema que resuelve

La cadena de comercialización agrícola en municipios como Riohacha presenta una brecha significativa entre productores y consumidores. Los pequeños agricultores de la región carecen de herramientas digitales para ofrecer su producción diaria, lo que los obliga a depender de intermediarios comerciales que reducen considerablemente sus márgenes de ganancia. Por otro lado, los consumidores no cuentan con un canal confiable y accesible para adquirir productos frescos directamente del campo, lo que afecta tanto la calidad de los alimentos que reciben como el precio que pagan por ellos.

CampoYa responde a esta problemática contribuyendo de la siguiente manera: el agricultor registra y publica lo que produjo ese día, fija su precio por libra, y el consumidor puede comprarlo de forma directa, transparente y sin comisiones ocultas. De esta manera, la plataforma promueve la economía local, dignifica el trabajo del campesino guajiro y garantiza al consumidor acceso a alimentos frescos y de origen verificable.

# Stack tecnológico

| Capa |        | Tecnología |
| Backend       | Django 6 + Django REST Framework |
| Autenticación | JSON Web Tokens — SimpleJWT |
| Base de datos | PostgreSQL alojada en Railway |
| Frontend      | HTML5, CSS3 y JavaScript (Vanilla) |
| Despliegue Backend   |  Railway |
| Despliegue Frontend  |  Netlify |

## Instalación y ejecución local

Las siguientes instrucciones permiten levantar el entorno de desarrollo en una máquina local. Asegúrese de contar con los requisitos previos antes de continuar.

### Requisitos previos

- Python 3.11 o superior
- Git
- Acceso a la base de datos PostgreSQL (credenciales del proyecto o instancia local)
- Editor de código recomendado: Visual Studio Code

### 1. Clonar el repositorio

bash
git clone https://github.com/miguelosorioc/Campo-Ya.git
cd Campo-Ya

### 2. Crear y activar el entorno virtual

Se recomienda el uso de un entorno virtual para aislar las dependencias del proyecto y evitar conflictos con otros paquetes instalados en el sistema.

en terminal de bash:
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python -m venv venv
source venv/bin/activate

Una vez activado, En el terminal se mostrará el prefijo `(venv)`, indicando que el entorno está activo.

## 3. Instalar dependencias

Con el entorno virtual activo, instale todas las dependencias del proyecto listadas en `requirements.txt`:

en terminal de bash:
pip install -r requirements.txt

# 4. Aplicar migraciones

Ejecute las migraciones para crear el esquema de la base de datos:

en terminal de bash:
python manage.py migrate

# 5. Crear un superusuario (opcional)

Si desea acceder al panel de administración de Django (`/admin/`), puede crear un superusuario con el siguiente comando:

en terminal de bash:

python manage.py createsuperuser

El sistema solicitará un nombre de usuario, correo electrónico y contraseña.

# 6. Ejecutar el servidor de desarrollo

bash
python manage.py runserver

Una vez iniciado, la API estará disponible en: `http://127.0.0.1:8000/`

### 7. Abrir el frontend

Abra el archivo `Frontend/index.html` directamente en su navegador, o utilice la extensión **Live Server** de Visual Studio Code para una mejor experiencia de desarrollo.

> **Nota:** Por defecto, el frontend apunta a la API de producción desplegada en Railway. Si desea apuntarlo al servidor local, edite la constante `API` en `Frontend/js/main.js`:
> ```js
> const API = 'http://127.0.0.1:8000/api';
> ```

# Endpoints principales de la API

La API REST del proyecto expone los siguientes recursos principales. Todos los endpoints protegidos requieren el encabezado `Authorization: Bearer <token>` con un JWT válido.

| Método |        Ruta      |                   Descripción                       | Autenticación |
| `GET` | `/api/productos/` | Lista todos los productos activos del día           | No requerida |
| `POST` | `/api/productos/crear/` | Publicar un nuevo producto (solo granjeros)  | Requerida    |
| `DELETE` | `/api/productos/<id>/` | Eliminar un producto propio                 | Requerida    |
| `GET` | `/api/pedidos/` | Consultar pedidos del usuario autenticado             | Requerida    |
| `POST` | `/api/pedidos/` | Crear un nuevo pedido                                | Requerida    |
| `POST` | `/api/users/register/` | Registro de un nuevo usuario                  | No requerida |
| `POST` | `/api/users/login/` | Inicio de sesión — retorna token JWT             | No requerida |
| `GET` | `/api/users/profile/` | Consultar perfil del usuario autenticado        | Requerida    |
| `PUT` | `/api/users/profile/` | Actualizar información del perfil               | Requerida    |

#  Uso de Inteligencia Artificial

Durante el proceso de desarrollo de CampoYa, el equipo integró diversas herramientas de inteligencia artificial como apoyo en distintas etapas del ciclo de trabajo. A continuación se detalla cómo se utilizó cada herramienta:

# Conversión de Figma a código (Frontend)

El diseño visual de la plataforma fue elaborado previamente en Figma. Para agilizar el proceso de implementación, se emplearon las siguientes herramientas de IA para traducir esos prototipos a código HTML y CSS funcional:

- **OpenAI Codex** — Utilizado para generar bloques de código estructural a partir de las descripciones visuales de los diseños.
- **Claude (Anthropic)** — Empleado para interpretar los diseños de Figma y producir componentes HTML semánticos con estilos CSS coherentes con la identidad visual del proyecto.
- **ChatGPT (OpenAI)** — Apoyó en la generación de variantes de diseño, sugerencias de maquetado y adaptaciones responsivas de los componentes visuales.
- **GitHub Copilot** — Utilizado durante la escritura de código en el editor para corregir errores de diseño, ajustar detalles visuales y completar fragmentos de CSS con mayor precisión.

# Backend y lógica de negocio

Las herramientas de IA también apoyaron la fase de desarrollo del backend como asistentes de codificación, ayudando en la definición de modelos de Django, la construcción de serializers y la resolución de errores de configuración en Django REST Framework y CORS. Aunque, primordialmente el backend fue hecho por nuestro compañero Miguel Angel Osorio, lider de este proyecto. 

# Documentación

La redacción de este documento la inteligencia artificial claude code fue utilizada para garantizar claridad, estructura formal y completitud de la información presentada.

> Las herramientas de inteligencia artificial actuaron en todo momento como asistentes de productividad. Las decisiones de arquitectura, diseño de producto, lógica de negocio e implementación final fueron responsabilidad del equipo de desarrollo.

## Integrantes del equipo

| Nombres completo:
| Cristian David Ceballos Cotes |
| Juan Edil Brito Cotes |
| Miguel Angel Osorio |

# Demo en producción

La aplicación se encuentra desplegada y disponible en el siguiente enlace:

*Control + clic izquierdo para abrir el siguiente enlace:

 [campo-ya.netlify.app](https://campo-ya.netlify.app/)
