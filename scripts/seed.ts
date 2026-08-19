import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Load .env.local variables manually
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    content.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...values] = trimmed.split("=");
        if (key && values.length > 0) {
          process.env[key.trim()] = values.join("=").trim().replace(/^["']|["']$/g, "");
        }
      }
    });
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("❌ Error: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY deben estar configurados en .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

// 1. Cursos Escolares y STEM para Secundaria
const coursesData = [
  {
    id: "10000000-0000-0000-0000-000000000001",
    titulo: "Matemática Básica Escolar: Operaciones, Fracciones y Geometría",
    descripcion: "Curso integral con lecciones teóricas y prácticas paso a paso sobre aritmética, fracciones, ecuaciones lineales de primer grado, geometría plana y porcentajes.",
    categoria: "Matemática",
    nivel: "principiante",
    portada_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop",
    publicado: true,
  },
  {
    id: "20000000-0000-0000-0000-000000000002",
    titulo: "Historia Universal: Egipto, Grecia, Roma y Edad Media",
    descripcion: "Exploración detallada de las grandes civilizaciones de la antigüedad, el surgimiento de la democracia ateniense, las legiones romanas y la estructura feudal europea.",
    categoria: "Historia",
    nivel: "intermedio",
    portada_url: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&auto=format&fit=crop",
    publicado: true,
  },
  {
    id: "30000000-0000-0000-0000-000000000003",
    titulo: "Biología Celular, ADN y Genética Moderna",
    descripcion: "Estudio exhaustivo de la estructura celular, síntesis de proteínas, las leyes de herencia de Mendel y los avances científicos en tecnología genética CRISPR.",
    categoria: "Ciencia y Tecnología",
    nivel: "avanzado",
    portada_url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop",
    publicado: true,
  },
  {
    id: "40000000-0000-0000-0000-000000000004",
    titulo: "Programación en Python y Pensamiento Computacional (STEM)",
    descripcion: "Introducción a las ciencias de la computación para secundaria: algoritmos, estructuras de control, funciones, análisis de datos y proyectos prácticos en Python.",
    categoria: "Tecnología",
    nivel: "intermedio",
    portada_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop",
    publicado: true,
  },
  {
    id: "50000000-0000-0000-0000-000000000005",
    titulo: "Física Mecánica y Leyes del Movimiento de Newton (STEM)",
    descripcion: "Fundamentos de la física escolar: cinemática, movimiento rectilíneo uniforme (MRU), fuerzas, dinámica de Newton, trabajo, energía y máquinas simples.",
    categoria: "Física",
    nivel: "intermedio",
    portada_url: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&auto=format&fit=crop",
    publicado: true,
  },
  {
    id: "60000000-0000-0000-0000-000000000006",
    titulo: "Química General: Átomos, Tabla Periódica y Reacciones (STEM)",
    descripcion: "Estudio del modelo atómico, enlaces químicos, la tabla periódica de los elementos, balanceo de ecuaciones químicas y principios estequiométricos.",
    categoria: "Química",
    nivel: "avanzado",
    portada_url: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop",
    publicado: true,
  },
];

// 2. Lecciones Académicas Extensas para Secundaria y STEM
const lessonsData = [
  // --- CURSO 1: MATEMÁTICA BÁSICA ---
  {
    id: "10000000-0000-0000-0000-000000000101",
    course_id: "10000000-0000-0000-0000-000000000001",
    titulo: "1. Fracciones Equivalentes, Números Mixtos y Operaciones",
    orden: 1,
    tipo: "teoria",
    contenido_markdown: `# Fracciones y Operaciones Aritméticas Fundamentales

![Aritmética y Fracciones](https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop)

Una **fracción** es la expresión matemática de una cantidad dividida entre otra. Nos indica cuántas partes tomamos de un total dividido en unidades exactamente iguales.

$$\\text{Fracción} = \\frac{\\text{Numerador}}{\\text{Denominador}}$$

---

## Clasificación Sistemática de Fracciones

| Tipo de Fracción | Definición Matemática | Ejemplo Representativo |
|---|---|---|
| **Fracción Propia** | El numerador es menor que el denominador ($N < D$). | $\\frac{3}{5}, \\frac{1}{4}$ |
| **Fracción Impropia** | El numerador es mayor o igual que el denominador ($N \\ge D$). | $\\frac{7}{4}, \\frac{9}{2}$ |
| **Número Mixto** | Expresión compuesta por un entero y una fracción propia. | $1 \\frac{3}{4} = \\frac{7}{4}$ |
| **Fracciones Homogéneas** | Tienen el mismo denominador. | $\\frac{2}{7}, \\frac{5}{7}$ |
| **Fracciones Heterogéneas** | Tienen denominadores diferentes. | $\\frac{1}{3}, \\frac{2}{5}$ |

---

## Operaciones de Suma y Resta Heterogénea

$$\\frac{5}{6} - \\frac{1}{4} = \\frac{10}{12} - \\frac{3}{12} = \\frac{7}{12}$$`,
  },
  {
    id: "10000000-0000-0000-0000-000000000102",
    course_id: "10000000-0000-0000-0000-000000000001",
    titulo: "2. Ecuaciones Lineales de Primer Grado",
    orden: 2,
    tipo: "teoria",
    contenido_markdown: `# Álgebra Escolar: Ecuaciones Lineales de Primer Grado

![Pizarra de Álgebra](https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop)

Una **ecuación de primer grado** es una igualdad matemática con una variable elevada a la primera potencia ($x^1$).

$$5x - 8 = 2x + 13$$
$$3x = 21 \\implies x = 7$$`,
  },
  {
    id: "10000000-0000-0000-0000-000000000103",
    course_id: "10000000-0000-0000-0000-000000000001",
    titulo: "3. Quiz Evaluativo: Operaciones y Álgebra Escolar",
    orden: 3,
    tipo: "quiz",
    contenido_markdown: "# Quiz de Evaluación de Matemática Básica",
  },
  {
    id: "10000000-0000-0000-0000-000000000104",
    course_id: "10000000-0000-0000-0000-000000000001",
    titulo: "4. Geometría Plana: Perímetros y Áreas de Polígonos",
    orden: 4,
    tipo: "teoria",
    contenido_markdown: `# Geometría Plana: Perímetros y Áreas de Polígonos

![Cálculos Geométricos](https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&auto=format&fit=crop)

Estudio de figuras bidimensionales contenidas en una superficie plana.

| Figura | Perímetro | Área |
|---|---|---|
| **Cuadrado** | $P = 4L$ | $A = L^2$ |
| **Rectángulo** | $P = 2(b + h)$ | $A = b \\cdot h$ |
| **Triángulo** | $P = a + b + c$ | $A = \\frac{b \\cdot h}{2}$ |`,
  },
  {
    id: "10000000-0000-0000-0000-000000000105",
    course_id: "10000000-0000-0000-0000-000000000001",
    titulo: "5. Razonamiento Matemático: Porcentajes y Regla de Tres Simple",
    orden: 5,
    tipo: "practica",
    contenido_markdown: `# Razonamiento Matemático: Porcentajes y Proporciones

![Cálculos Comerciales](https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop)

Cálculo de razones directamente proporcionales y porcentajes sobre totales.`,
  },

  // --- CURSO 2: HISTORIA UNIVERSAL ---
  {
    id: "20000000-0000-0000-0000-000000000201",
    course_id: "20000000-0000-0000-0000-000000000002",
    titulo: "1. El Antiguo Egipto: El Río Nilo, Faraones y Pirámides",
    orden: 1,
    tipo: "teoria",
    contenido_markdown: `# El Antiguo Egipto: La Civilización del Río Nilo

![Pirámides de Giza](https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800&auto=format&fit=crop)

La civilización del **Antiguo Egipto** se desarrolló a lo largo del cauce del río Nilo durante más de tres milenios.`,
  },
  {
    id: "20000000-0000-0000-0000-000000000202",
    course_id: "20000000-0000-0000-0000-000000000002",
    titulo: "2. La Grecia Clásica: Atenas, la Democracia y la Filosofía",
    orden: 2,
    tipo: "teoria",
    contenido_markdown: `# La Grecia Clásica: Atenas, la Democracia y el Pensamiento Filosófico

![Partenón en Atenas, Grecia](https://images.unsplash.com/photo-1603565816030-6bb341ae7015?w=800&auto=format&fit=crop)

La **Grecia Antigua** estuvo configurada por polis independientes como Atenas y Esparta.`,
  },
  {
    id: "20000000-0000-0000-0000-000000000203",
    course_id: "20000000-0000-0000-0000-000000000002",
    titulo: "3. Quiz Evaluativo: Civilizaciones Antiguas de Egipto y Grecia",
    orden: 3,
    tipo: "quiz",
    contenido_markdown: "# Quiz Interactivo de Historia Universal",
  },
  {
    id: "20000000-0000-0000-0000-000000000204",
    course_id: "20000000-0000-0000-0000-000000000002",
    titulo: "4. El Imperio Romano: Del Foro al Derecho Romano",
    orden: 4,
    tipo: "teoria",
    contenido_markdown: `# El Imperio Romano: Instituciones, Ingeniería y el Derecho

![Coliseo Romano](https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop)

Evolución política e institucional de Roma desde la Monarquía hasta el Imperio.`,
  },
  {
    id: "20000000-0000-0000-0000-000000000002",
    course_id: "20000000-0000-0000-0000-000000000002",
    titulo: "5. La Edad Media: Feudalismo y las Cruzadas",
    orden: 5,
    tipo: "teoria",
    contenido_markdown: `# La Edad Media: Institución Feudal y las Cruzadas

![Castillo Medieval](https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop)

Estructura socioeconómica del feudalismo europeo y consecuencias de las Cruzadas.`,
  },

  // --- CURSO 3: BIOLOGÍA CELULAR Y GENÉTICA ---
  {
    id: "30000000-0000-0000-0000-000000000301",
    course_id: "30000000-0000-0000-0000-000000000003",
    titulo: "1. La Célula Eucariota, Membrana y Organelas Celulares",
    orden: 1,
    tipo: "teoria",
    contenido_markdown: `# Biología Celular: Estructura y Función de la Célula Eucariota

![Célula al Microscopio](https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=800&auto=format&fit=crop)

Estudio de la unidad anatómicofuncional de los seres vivos y organelas especializadas.`,
  },
  {
    id: "30000000-0000-0000-0000-000000000302",
    course_id: "30000000-0000-0000-0000-000000000003",
    titulo: "2. Estructura del ADN, ARN y Replicación Celular",
    orden: 2,
    tipo: "teoria",
    contenido_markdown: `# Ácidos Nucleicos: ADN, ARN y el Dogma Central

![Modelo Tridimensional del ADN](https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop)

Arquitectura molecular de la doble hélice y expresión génica.

$$\\text{ADN} \\xrightarrow[\\text{Transcripción}]{} \\text{ARNm} \\xrightarrow[\\text{Traducción}]{} \\text{Proteína}$$`,
  },
  {
    id: "30000000-0000-0000-0000-000000000303",
    course_id: "30000000-0000-0000-0000-000000000003",
    titulo: "3. Quiz Evaluativo: Biología Celular y Genética",
    orden: 3,
    tipo: "quiz",
    contenido_markdown: "# Quiz Evaluativo de Biología Celular",
  },
  {
    id: "30000000-0000-0000-0000-000000000304",
    course_id: "30000000-0000-0000-0000-000000000003",
    titulo: "4. Las Leyes de Mendel y la Genética de la Herencia",
    orden: 4,
    tipo: "teoria",
    contenido_markdown: `# Genética Mendeliana: Principios de la Herencia

![Genética y Plantas](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop)

Leyes de la uniformidad y segregación de alelos en la herencia biológica.`,
  },
  {
    id: "30000000-0000-0000-0000-000000000305",
    course_id: "30000000-0000-0000-0000-000000000003",
    titulo: "5. Biotecnología Moderna: Edición Genética CRISPR y PCR",
    orden: 5,
    tipo: "teoria",
    contenido_markdown: `# Biotecnología e Ingeniería Genética Avanzada

![Laboratorio Biotecnológico](https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop)

Técnicas de diagnóstico por PCR y edición genética con tijeras moleculares CRISPR-Cas9.`,
  },

  // --- CURSO 4: PROGRAMACIÓN EN PYTHON (STEM) ---
  {
    id: "40000000-0000-0000-0000-000000000401",
    course_id: "40000000-0000-0000-0000-000000000004",
    titulo: "1. Algoritmos, Variables y Sintaxis Básica en Python",
    orden: 1,
    tipo: "teoria",
    contenido_markdown: `# Introducción a la Programación con Python

![Código de Programación en Python](https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop)

El **pensamiento computacional** es la habilidad de formular problemas y sus soluciones de modo que puedan ser ejecutadas por una computadora. **Python** es uno de los lenguajes de programación más populares del mundo por su sintaxis limpia y su uso masivo en inteligencia artificial y ciencia de datos.

> **¿Qué es un Algoritmo?**  
> Un algoritmo es una secuencia finita, ordenada e inequívoca de pasos lógicos diseñados para resolver un problema específico o realizar una tarea.

---

## Variables y Tipos de Datos Fundamentales

En Python, una **variable** es un contenedor en memoria para almacenar información.

| Tipo de Dato | Nombre en Python | Descripción | Ejemplo de Código |
|---|---|---|---|
| **Entero** | \`int\` | Números sin parte decimal | \`edad = 16\` |
| **Flotante** | \`float\` | Números con decimales | \`promedio = 17.5\` |
| **Texto** | \`str\` | Cadena de caracteres entre comillas | \`nombre = "Ayme"\` |
| **Booleano** | \`bool\` | Valores lógicos de verdad | \`activo = True\` |

---

## Primer Programa en Python: Entradas y Salidas

\`\`\`python
# Programa de bienvenida en Python
nombre = input("¿Cuál es tu nombre? ")
edad = int(input("¿Cuántos años tienes? "))

print(f"Hola {nombre}, el próximo año tendrás {edad + 1} años.")
\`\`\``,
  },
  {
    id: "40000000-0000-0000-0000-000000000402",
    course_id: "40000000-0000-0000-0000-000000000004",
    titulo: "2. Estructuras de Control: Condicionales y Bucles",
    orden: 2,
    tipo: "teoria",
    contenido_markdown: `# Estructuras de Control en Programación

![Lógica de Programación](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop)

Las **estructuras de control** permiten alterar el flujo de ejecución de un programa tomando decisiones o repitiendo bloques de código según condiciones lógicas.

---

## 1. Condicionales (\`if\`, \`elif\`, \`else\`)

Permiten ejecutar bloques de código según el cumplimiento de expresiones booleanas.

\`\`\`python
nota = 15

if nota >= 17:
    print("Excelente rendimiento académico")
elif nota >= 11:
    print("Aprobado satisfactoriamente")
else:
    print("Requiere reforzamiento escolar")
\`\`\`

---

## 2. Bucles de Repetición (\`for\` y \`while\`)

### Bucle \`for\` (Iteración sobre rangos o colecciones):
\`\`\`python
# Imprimir los primeros 5 números pares
for i in range(1, 6):
    print(f"Número par: {i * 2}")
\`\`\`

### Bucle \`while\` (Repetición condicionada):
\`\`\`python
contador = 5
while contador > 0:
    print(f"Cuenta regresiva: {contador}")
    contador -= 1
print("¡Lanzamiento del cohete STEM!")
\`\`\``,
  },
  {
    id: "40000000-0000-0000-0000-000000000403",
    course_id: "40000000-0000-0000-0000-000000000004",
    titulo: "3. Quiz Evaluativo: Pensamiento Computacional y Python",
    orden: 3,
    tipo: "quiz",
    contenido_markdown: "# Quiz de Programación en Python",
  },
  {
    id: "40000000-0000-0000-0000-000000000404",
    course_id: "40000000-0000-0000-0000-000000000004",
    titulo: "4. Funciones, Estructuras de Datos y Algoritmos",
    orden: 4,
    tipo: "teoria",
    contenido_markdown: `# Funciones y Listas en Python

![Estructuras de Datos](https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop)

Una **función** es un bloque de código reutilizable diseñado para realizar una tarea específica cuando es invocado.

---

## Creación de Funciones en Python (\`def\`)

\`\`\`python
def calcular_area_rectangulo(base, altura):
    """Calcula y retorna el área de un rectángulo."""
    area = base * altura
    return area

# Llamada a la función
resultado = calcular_area_rectangulo(10, 5)
print(f"El área calculada es: {resultado} m²")
\`\`\`

---

## Colecciones de Datos: Listas (\`list\`)

Las **listas** permiten almacenar múltiples elementos ordenados en una sola variable.

\`\`\`python
estudiantes = ["Ana", "Carlos", "Beatriz", "David"]
notas = [18, 14, 16, 20]

# Calcular el promedio de la clase
promedio = sum(notas) / len(notas)
print(f"El promedio general es: {promedio}")
\`\`\``,
  },

  // --- CURSO 5: FÍSICA MECÁNICA (STEM) ---
  {
    id: "50000000-0000-0000-0000-000000000501",
    course_id: "50000000-0000-0000-0000-000000000005",
    titulo: "1. Cinemática y Movimiento Rectilíneo Uniforme (MRU)",
    orden: 1,
    tipo: "teoria",
    contenido_markdown: `# Cinemática: Estudio del Movimiento

![Física y Mecánica](https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&auto=format&fit=crop)

La **Cinemática** es la rama de la física que describe el movimiento de los cuerpos sin atender a las causas (fuerzas) que lo producen.

---

## Movimiento Rectilíneo Uniforme (MRU)

Un cuerpo realiza un **MRU** cuando se desplaza en trayectoria recta manteniendo una **velocidad constante** ($v = \\text{cte}$), recorriendo distancias iguales en tiempos iguales.

$$\\text{Distancia} = \\text{Velocidad} \\times \\text{Tiempo} \\implies d = v \\cdot t$$

### Triángulo de Fórmulas:
* $d = v \\cdot t$
* $v = \\frac{d}{t}$
* $t = \\frac{d}{v}$

---

## Ejercicio Desarrollado:

Un tren de alta velocidad viaja en MRU a una velocidad constante de **$72 \\; km/h$** durante **$2.5 \\; \\text{horas}$**. ¿Qué distancia total ha recorrido?

$$d = 72 \\; \\frac{km}{h} \\times 2.5 \\; h = 180 \\; \\text{kilómetros}$$`,
  },
  {
    id: "50000000-0000-0000-0000-000000000502",
    course_id: "50000000-0000-0000-0000-000000000005",
    titulo: "2. Las Leyes del Movimiento de Isaac Newton",
    orden: 2,
    tipo: "teoria",
    contenido_markdown: `# Dinámica: Las Leyes del Movimiento de Newton

![Leyes de Newton](https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop)

Formuladas por Sir Isaac Newton en 1687, las tres leyes de la dinámica constituyen la base fundamental de la física clásica.

---

## Las Tres Leyes Fundamentales

1. **Primera Ley (Inercia):** Todo cuerpo permanece en su estado de reposo o movimiento rectilíneo uniforme a menos que sobre él actúe una fuerza neta externa.
2. **Segunda Ley (Fuerza y Aceleración):** La aceleración de un objeto es directamente proporcional a la fuerza neta ejercida e inversamente proporcional a su masa.
   $$F = m \\cdot a$$
3. **Tercera Ley (Acción y Reacción):** A toda fuerza de acción le corresponde siempre una fuerza de reacción de igual magnitud y sentido opuesto.

---

## Ejemplo Físico Aplicado:

¿Qué fuerza neta constante se requiere para acelerar un vehículo de masa $m = 1200 \\; kg$ a razón de $a = 3 \\; m/s^2$?

$$F = 1200 \\; kg \\times 3 \\; m/s^2 = 3600 \\; \\text{Newtons (N)}$$`,
  },
  {
    id: "50000000-0000-0000-0000-000000000503",
    course_id: "50000000-0000-0000-0000-000000000005",
    titulo: "3. Quiz Evaluativo: Física Mecánica y Leyes de Newton",
    orden: 3,
    tipo: "quiz",
    contenido_markdown: "# Quiz de Física Mecánica",
  },
  {
    id: "50000000-0000-0000-0000-000000000504",
    course_id: "50000000-0000-0000-0000-000000000005",
    titulo: "4. Trabajo, Energía Mecánica y Máquinas Simples",
    orden: 4,
    tipo: "teoria",
    contenido_markdown: `# Energía Mecánica e Ingeniería

![Energía y Mecánica](https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop)

En física, el **Trabajo Mecánico ($W$)** ocurre cuando una fuerza desplaza un cuerpo en su misma dirección.

$$W = F \\cdot d \\cdot \\cos(\\theta)$$

---

## Formas de Energía Mecánica:

* **Energía Cinética ($E_k$):** Energía asociada al movimiento de una masa.
  $$E_k = \\frac{1}{2} m v^2$$

* **Energía Potencial Gravitatoria ($E_p$):** Energía almacenada en función de la altura $h$.
  $$E_p = m \\cdot g \\cdot h$$

> **Ley de Conservación de la Energía:**  
> La energía no se crea ni se destruye, solo se transforma. La energía mecánica total ($E_M = E_k + E_p$) permanece constante en ausencia de fricción.`,
  },

  // --- CURSO 6: QUÍMICA GENERAL (STEM) ---
  {
    id: "60000000-0000-0000-0000-000000000601",
    course_id: "60000000-0000-0000-0000-000000000006",
    titulo: "1. El Modelo Atómico, Protones, Neutrones y Electrones",
    orden: 1,
    tipo: "teoria",
    contenido_markdown: `# Química General: Estructura Atómica

![Laboratorio de Química](https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop)

Toda la materia del universo está formada por **átomos**, la unidad fundamental que conserva las propiedades de un elemento químico.

---

## Partículas Subatómicas Fundamentales

| Partícula | Carga Eléctrica | Ubicación | Masa Relativa |
|---|---|---|---|
| **Protón ($p^+$)** | Positiva ($+1$) | Núcleo atómico | $1 \\; \\text{uma}$ |
| **Neutrón ($n^0$)** | Neutra ($0$) | Núcleo atómico | $1 \\; \\text{uma}$ |
| **Electrón ($e^-$)** | Negativa ($-1$) | Nube electrónica | $\\approx 0 \\; \\text{uma}$ |

---

## Identificadores Atómicos:

* **Número Atómico ($Z$):** Cantidad de protones presentes en el núcleo. Define el elemento químico.
* **Número de Masa ($A$):** Suma total de protones y neutrones:
  $$A = Z + N$$`,
  },
  {
    id: "60000000-0000-0000-0000-000000000602",
    course_id: "60000000-0000-0000-0000-000000000006",
    titulo: "2. La Tabla Periódica y los Enlaces Químicos",
    orden: 2,
    tipo: "teoria",
    contenido_markdown: `# La Tabla Periódica de los Elementos

![Tabla Periódica y Materiales](https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&auto=format&fit=crop)

Diseñada originalmente por Dmitri Mendeléyev en 1869, la **Tabla Periódica** organiza los 118 elementos químicos según su número atómico ($Z$) creciente y sus propiedades químicas periódicas.

---

## Tipos de Enlaces Químicos:

1. **Enlace Iónico:** Transferencia completa de electrones entre un metal y un no metal (ej. sal de mesa, $NaCl$).
2. **Enlace Covalente:** Compartición de pares de electrones entre elementos no metálicos (ej. agua, $H_2O$).
3. **Enlace Metálico:** Red de cationes inmersos en un mar de electrones libres deslocalizados.`,
  },
  {
    id: "60000000-0000-0000-0000-000000000603",
    course_id: "60000000-0000-0000-0000-000000000006",
    titulo: "3. Quiz Evaluativo: Estructura Atómica y Reacciones Químicas",
    orden: 3,
    tipo: "quiz",
    contenido_markdown: "# Quiz de Química General",
  },
  {
    id: "60000000-0000-0000-0000-000000000604",
    course_id: "60000000-0000-0000-0000-000000000006",
    titulo: "4. Balanceo de Ecuaciones y Conservación de la Masa",
    orden: 4,
    tipo: "teoria",
    contenido_markdown: `# Reacciones Químicas y Ley de Lavoisier

![Reacciones Químicas](https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop)

Una **reacción química** es un proceso en el cual una o más sustancias (reactivos) se transforman en sustancias diferentes (productos).

> **Ley de Conservación de la Masa (Antoine Lavoisier):**  
> En toda reacción química, la masa total de los reactivos es igual a la masa total de los productos. La materia no se crea ni se destruye, se transforma.

---

## Balanceo de Ecuación por Tanteo:

Reacción de síntesis del agua:

$$\\text{Reactivos} \\longrightarrow \\text{Productos}$$
$$2 H_2 + O_2 \\longrightarrow 2 H_2O$$

* **Lado izquierdo (Reactivos):** 4 átomos de Hidrógeno y 2 átomos de Oxígeno.
* **Lado derecho (Productos):** 4 átomos de Hidrógeno y 2 átomos de Oxígeno.  
¡Ecuación química correctamente balanceada!`,
  },
];

// 3. Quizzes Evaluativos
const quizzesData = [
  // Quiz de Matemática Básica
  {
    id: "10000000-0000-0000-0000-000000000901",
    lesson_id: "10000000-0000-0000-0000-000000000103",
    preguntas: [
      {
        id: "m1",
        pregunta: "¿Cuál es la fracción equivalente irreductible de 12/18?",
        opciones: ["2/3", "3/4", "4/6", "1/2"],
        respuesta_correcta: 0,
        explicacion: "Dividimos por 6: 12÷6 = 2 y 18÷6 = 3, obteniendo 2/3.",
        tema: "Fracciones",
      },
      {
        id: "m2",
        pregunta: "Si 5x - 8 = 2x + 13, ¿cuál es el valor de x?",
        opciones: ["x = 5", "x = 7", "x = 4", "x = 9"],
        respuesta_correcta: 1,
        explicacion: "3x = 21 => x = 7.",
        tema: "Ecuaciones Lineales",
      },
    ],
  },

  // Quiz de Historia Universal
  {
    id: "20000000-0000-0000-0000-000000000902",
    lesson_id: "20000000-0000-0000-0000-000000000203",
    preguntas: [
      {
        id: "h1",
        pregunta: "¿Qué limo fértil permitía las cosechas en Egipto tras las crecidas del Río Nilo?",
        opciones: ["El limo orgánico del Nilo", "La arcilla del Tigris", "El papiro", "La arena"],
        respuesta_correcta: 0,
        explicacion: "El limo negro fertilizaba los campos.",
        tema: "Antiguo Egipto",
      },
      {
        id: "h2",
        pregunta: "¿En qué polis griega nació la Democracia Directa en el siglo V a.C.?",
        opciones: ["Esparta", "Atenas", "Tebas", "Corinto"],
        respuesta_correcta: 1,
        explicacion: "Atenas creó la Democracia Directa.",
        tema: "Democracia Griega",
      },
    ],
  },

  // Quiz de Biología Celular
  {
    id: "30000000-0000-0000-0000-000000000903",
    lesson_id: "30000000-0000-0000-0000-000000000303",
    preguntas: [
      {
        id: "b1",
        pregunta: "¿Qué organela celular es la encargada de sintetizar ATP?",
        opciones: ["Ribosoma", "Mitocondria", "Golgi", "Lisosoma"],
        respuesta_correcta: 1,
        explicacion: "La mitocondria realiza la respiración celular sintetizando ATP.",
        tema: "Organelas",
      },
      {
        id: "b2",
        pregunta: "En el ADN, ¿con qué base se une siempre la Citosina (C)?",
        opciones: ["Adenina", "Timina", "Guanina", "Uracilo"],
        respuesta_correcta: 2,
        explicacion: "La Citosina (C) se une con la Guanina (G).",
        tema: "Estructura del ADN",
      },
    ],
  },

  // Quiz de Python (STEM)
  {
    id: "40000000-0000-0000-0000-000000000904",
    lesson_id: "40000000-0000-0000-0000-000000000403",
    preguntas: [
      {
        id: "p1",
        pregunta: "¿Cuál de las siguientes es una palabra clave en Python para definir una función reutilizable?",
        opciones: ["function", "def", "func", "define"],
        respuesta_correcta: 1,
        explicacion: "En Python las funciones se definen mediante la palabra clave 'def'.",
        tema: "Sintaxis en Python",
      },
      {
        id: "p2",
        pregunta: "¿Qué tipo de dato en Python representa un valor lógico de verdad (True o False)?",
        opciones: ["int", "string", "bool", "float"],
        respuesta_correcta: 2,
        explicacion: "El tipo 'bool' almacena únicamente valores booleanos (True o False).",
        tema: "Tipos de Datos",
      },
    ],
  },

  // Quiz de Física (STEM)
  {
    id: "50000000-0000-0000-0000-000000000905",
    lesson_id: "50000000-0000-0000-0000-000000000503",
    preguntas: [
      {
        id: "f1",
        pregunta: "Según la Segunda Ley de Newton, ¿qué fórmula expresa la relación entre Fuerza (F), Masa (m) y Aceleración (a)?",
        opciones: ["F = m / a", "F = m * a", "F = m + a", "F = a / m"],
        respuesta_correcta: 1,
        explicacion: "La fuerza neta es igual al producto de la masa por la aceleración (F = m * a).",
        tema: "Leyes de Newton",
      },
      {
        id: "f2",
        pregunta: "En el Movimiento Rectilíneo Uniforme (MRU), ¿cómo se comporta la velocidad del cuerpo?",
        opciones: ["Aumenta constantemente", "Disminuye a cero", "Permanece constante", "Cambia aleatoriamente"],
        respuesta_correcta: 2,
        explicacion: "En un MRU la velocidad es constante (aceleración es cero).",
        tema: "Cinemática MRU",
      },
    ],
  },

  // Quiz de Química (STEM)
  {
    id: "60000000-0000-0000-0000-000000000906",
    lesson_id: "60000000-0000-0000-0000-000000000603",
    preguntas: [
      {
        id: "q1",
        pregunta: "¿Qué partícula subatómica posee carga eléctrica positiva y se encuentra en el núcleo del átomo?",
        opciones: ["Electrón", "Protón", "Neutrón", "Fotón"],
        respuesta_correcta: 1,
        explicacion: "Los protones tienen carga positiva (+1) y están ubicados en el núcleo atómico.",
        tema: "Estructura Atómica",
      },
      {
        id: "q2",
        pregunta: "Según la Ley de Lavoisier de conservación de la masa, en toda reacción química:",
        opciones: ["La masa aumenta", "La masa se destruye", "La masa total se conserva", "La masa se convierte en gas"],
        respuesta_correcta: 2,
        explicacion: "La masa total de los reactivos es igual a la masa total de los productos.",
        tema: "Reacciones Químicas",
      },
    ],
  },
];

async function seed() {
  console.log("🚀 Cargando 6 Cursos Escolares y de Iniciación STEM para Secundaria...");

  // 1. Cursos
  console.log("📦 Insertando/Actualizando 6 cursos (Matemática, Historia, Biología, Python STEM, Física STEM, Química STEM)...");
  const { error: cErr } = await supabase.from("courses").upsert(coursesData, { onConflict: "id" });
  if (cErr) {
    console.error("❌ Error en cursos:", cErr);
    process.exit(1);
  }
  console.log("✅ 6 Cursos cargados correctamente.");

  // 2. Lecciones
  console.log("📖 Cargando lecciones educativas extensas...");
  const { error: lErr } = await supabase.from("lessons").upsert(lessonsData, { onConflict: "id" });
  if (lErr) {
    console.error("❌ Error en lecciones:", lErr);
    process.exit(1);
  }
  console.log("✅ Lecciones de secundaria y STEM cargadas exitosamente.");

  // 3. Quizzes
  console.log("🧠 Cargando evaluaciones y preguntas de opción múltiple...");
  const { error: qErr } = await supabase.from("quizzes").upsert(quizzesData, { onConflict: "id" });
  if (qErr) {
    console.error("❌ Error en quizzes:", qErr);
    process.exit(1);
  }
  console.log("✅ Evaluaciones y quizzes actualizados.");

  console.log("🎉 ¡Catálogo completo de Secundaria y STEM sincronizado en Supabase con éxito!");
}

seed();
