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

// 1. Cursos Escolares
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
    descripcion: "Exploración detallada de las grandes civilizaciones de la antigüedad, el surgimiento de la democracia ateniensa, las legiones romanas y la estructura feudal europea.",
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
];

// 2. Lecciones Completas con Información Real
const lessonsData = [
  // --- CURSO 1: MATEMÁTICA BÁSICA ---
  {
    id: "10000000-0000-0000-0000-000000000101",
    course_id: "10000000-0000-0000-0000-000000000001",
    titulo: "1. Fracciones Equivalentes, Números Mixtos y Operaciones",
    orden: 1,
    tipo: "teoria",
    contenido_markdown: `# Fracciones en la Vida Cotidiana

Una **fracción** expresa una o varias partes iguales en las que se ha dividido una unidad completa.

## Elementos de la Fracción:
- **Numerador:** Indica cuántas partes tomamos.
- **Denominador:** Indica en cuántas partes se divide el entero.

$$\\text{Fracción} = \\frac{\\text{Numerador}}{\\text{Denominador}}$$

---

## 1. Fracciones Equivalentes
Son aquellas que representan la **misma cantidad**, aunque sus numeradores y denominadores sean números distintos.

$$\\frac{1}{2} = \\frac{2}{4} = \\frac{4}{8} = \\frac{5}{10}$$

### Método de Amplificación:
Consiste en multiplicar el numerador y el denominador por un mismo número diferente de cero:

$$\\frac{3}{5} \\times \\frac{3}{3} = \\frac{9}{15}$$

---

## 2. Suma y Resta de Fracciones con Distinto Denominador
Para sumar o restar fracciones heterogéneas, se utiliza el **Mínimo Común Múltiplo (M.C.M.)**:

$$\\frac{1}{4} + \\frac{2}{3} = \\frac{3 + 8}{12} = \\frac{11}{12}$$

### Ejercicio Resuelto:
Calcula: $\\frac{5}{6} - \\frac{1}{4}$
1. M.C.M. de $6$ y $4$ es **$12$**.
2. Convertimos a denominadores $12$: $\\frac{10}{12} - \\frac{3}{12} = \\frac{7}{12}$.`,
  },
  {
    id: "10000000-0000-0000-0000-000000000102",
    course_id: "10000000-0000-0000-0000-000000000001",
    titulo: "2. Ecuaciones Lineales de Primer Grado",
    orden: 2,
    tipo: "teoria",
    contenido_markdown: `# Ecuaciones de Primer Grado con una Incógnita

Una **ecuación** es una igualdad en la que se desconoce un término llamado **incógnita** (generalmente la letra $x$).

## Reglas de Transposición de Términos:
- Lo que está **sumando** en un miembro pasa **restando** al otro.
- Lo que está **restando** pasa **sumando**.
- Lo que está **multiplicando** pasa **dividiendo**.
- Lo que está **dividiendo** pasa **multiplicando**.

---

## Ejemplo Paso a Paso:
Resuelve: $4x - 7 = 2x + 9$

1. Agrupamos las incógnitas $x$ a la izquierda y los números a la derecha:
   $$4x - 2x = 9 + 7$$
2. Reducimos términos semejantes:
   $$2x = 16$$
3. Despejamos $x$:
   $$x = \\frac{16}{2} = 8$$

¡Respuesta verificada: **$x = 8$**!`,
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
    contenido_markdown: `# Geometría Plana Escolar

La **Geometría Plana** estudia las figuras de dos dimensiones (largo y ancho) contenidas en un plano.

## Formulario de Figuras Principales:

| Figura | Perímetro | Área |
|---|---|---|
| **Cuadrado** | $P = 4 \\cdot L$ | $A = L^2$ |
| **Rectángulo** | $P = 2(b + h)$ | $A = b \\cdot h$ |
| **Triángulo** | $P = a + b + c$ | $A = \\frac{b \\cdot h}{2}$ |
| **Círculo** | $P = 2\\pi r$ | $A = \\pi r^2$ |

### Ejemplo:
Un jardín rectangular mide **10 metros de base** y **6 metros de altura**.
- **Perímetro:** $2 \\times (10 + 6) = 32$ metros.
- **Área:** $10 \\times 6 = 60$ metros cuadrados ($m^2$).`,
  },
  {
    id: "10000000-0000-0000-0000-000000000105",
    course_id: "10000000-0000-0000-0000-000000000001",
    titulo: "5. Razonamiento Matemático: Porcentajes y Regla de Tres Simple",
    orden: 5,
    tipo: "practica",
    contenido_markdown: `# Porcentajes y Regla de Tres

## 1. Regla de Tres Simple Directa
Se utiliza cuando dos magnitudes son directamente proporcionales (si una aumenta, la otra también).

### Caso Práctico:
Si 5 cuadernos cuestan **S/. 25 soles**, ¿cuánto costarán **12 cuadernos**?

$$\\begin{aligned}
5 \\text{ cuadernos} &\\longrightarrow 25 \\text{ soles} \\\\
12 \\text{ cuadernos} &\\longrightarrow x \\text{ soles}
\\end{aligned}$$

$$x = \\frac{12 \\times 25}{5} = \\frac{300}{5} = 60 \\text{ soles}$$

---

## 2. Cálculo de Porcentajes:
El porcentaje es una razón que indica cuántas partes tomamos de cada 100.

- **Calcular el 15% de 200:**
  $$\\text{Resultado} = 200 \\times \\frac{15}{100} = 30$$`,
  },

  // --- CURSO 2: HISTORIA UNIVERSAL ---
  {
    id: "20000000-0000-0000-0000-000000000201",
    course_id: "20000000-0000-0000-0000-000000000002",
    titulo: "1. El Antiguo Egipto: El Río Nilo, Faraones y Pirámides",
    orden: 1,
    tipo: "teoria",
    contenido_markdown: `# El Imperio de los Faraones

La civilización del **Antiguo Egipto** nació hace más de 5,000 años a lo largo del fértil valle del **Río Nilo**.

## El Regalo del Nilo:
Cada año, el río Nilo inundaba las tierras dejando una capa fertilizante llamada **limo**, lo que permitió un desarrollo agrícola masivo en medio del desierto.

---

## La Organización Política y Religiosa:
- **El Faraón:** Rey divino, comandante militar y máximo líder religioso.
- **Escritura Jeroglífica:** Sistema complejo de símbolos grabado en papiros y templos.
- **Creencia en la Vida Tras la Muerte:** Llevó a la práctica de la **momificación** y a la construcción de las grandiosas Pirámides de Giza (*Keops, Kefrén y Micerino*).`,
  },
  {
    id: "20000000-0000-0000-0000-000000000202",
    course_id: "20000000-0000-0000-0000-000000000002",
    titulo: "2. La Grecia Clásica: Atenas, la Democracia y la Filosofía",
    orden: 2,
    tipo: "teoria",
    contenido_markdown: `# La Cuna de la Civilización Occidental

La **Grecia Antigua** estaba dividida en ciudades-estado independientes llamadas **Polis**.

## Atenas vs. Esparta:
- **Atenas:** Capital de las artes, el teatro, las ciencias y la cuna de la **Democracia Directa**, ideada por líderes como Solón y Pericles.
- **Esparta:** Ciudad guerrera y oligárquica donde la educación (la *Agogé*) estaba volcada al combate.

---

## Los Grandes Filósofos Atenienses:
1. **Sócrates:** Enseñaba dialogando mediante preguntas (método socrático o mayéutica).
2. **Platón:** Fundó La Academia y escribió *La República*.
3. **Aristóteles:** Fundó El Liceo y sentó las bases de la lógica y la biología.`,
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
    contenido_markdown: `# La Expansión del Imperio Romano

Roma atravesó tres grandes etapas históricas: **Monarquía**, **República** e **Imperio**.

## Principales Aportes Culturales:
- **El Derecho Romano:** Conjunto de leyes que definió conceptos como la presunción de inocencia y los contratos, sirviendo de base al código civil moderno.
- **Ingeniería y Acueductos:** Construcción de vías (*Vía Appia*), alcantarillado, el Coliseo Romano y acueductos que llevaban agua limpia a las ciudades.
- **Expansión del Latín:** Idioma del cual nacieron las lenguas romances como el español, francés, italiano y portugués.`,
  },
  {
    id: "20000000-0000-0000-0000-000000000205",
    course_id: "20000000-0000-0000-0000-000000000002",
    titulo: "5. La Edad Media: Feudalismo y las Cruzadas",
    orden: 5,
    tipo: "teoria",
    contenido_markdown: `# La Europa Feudal

Tras la caída del Imperio Romano de Occidente (476 d.C.), Europa ingresó a la **Edad Media**.

## La Sociedad Feudal:
- **El Señor Feudal:** Dueño del castillo y de las tierras (*los feudos*).
- **Los Vasallos y Siervos:** Trabajaban la tierra a cambio de protección militar.

## Las Cruzadas:
Fueron una serie de expediciones militares (siglos XI al XIII) convocadas por el Papa para recuperar Tierra Santa (Jerusalén) de manos musulmanas, lo que reabrió las rutas comerciales entre Europa y Oriente.`,
  },

  // --- CURSO 3: BIOLOGÍA CELULAR Y GENÉTICA ---
  {
    id: "30000000-0000-0000-0000-000000000301",
    course_id: "30000000-0000-0000-0000-000000000003",
    titulo: "1. La Célula Eucariota, Membrana y Organelas Celulares",
    orden: 1,
    tipo: "teoria",
    contenido_markdown: `# Biología Celular

La **célula** es la unidad anátomo-funcional básica de todos los seres vivos.

## Diferencia Fundamental:
- **Procariotas:** Sin núcleo delimitado (ej. bacterias).
- **Eucariotas:** Con núcleo celular verdadero que contiene el ADN (ej. plantas, animales, hongos).

---

## Principales Organelas Celulares:
1. **Mitocondrias:** Producen la energía de la célula (ATP) mediante la respiración celular.
2. **Núcleo Celular:** Controla las actividades de la célula y custodia el genoma.
3. **Ribosomas:** Sintetizan las cadenas de proteínas.
4. **Cloroplastos (Solo en vegetales):** Realizan la **fotosíntesis** para transformar luz solar en glucosa.`,
  },
  {
    id: "30000000-0000-0000-0000-000000000302",
    course_id: "30000000-0000-0000-0000-000000000003",
    titulo: "2. Estructura del ADN, ARN y Replicación Celular",
    orden: 2,
    tipo: "teoria",
    contenido_markdown: `# Ácidos Nucleicos y Genética

El **Ácido Desoxirribonucleico (ADN)** es la molécula que alberga el código genético hereditario.

## La Doble Hélice:
Descubierta por James Watson, Francis Crick y Rosalind Franklin en 1953.

### Apareamiento de Bases Nitrogenadas:
- **Adenina (A)** se une exclusivamente con la **Timina (T)** ($A = T$).
- **Citosina (C)** se une exclusivamente con la **Guanina (G)** ($C \\equiv G$).

---

## Expresión Génica:
1. **Transcripción:** El ADN copia su información a un ARN mensajero (ARNm).
2. **Traducción:** Los ribosomas leen el ARNm y fabrican las proteínas.`,
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
    contenido_markdown: `# Genética Mendeliana

**Gregor Mendel**, un monje agustino, es considerado el **Padre de la Genética** tras sus experimentos con arvejas (*Pisum sativum*).

## Conceptos Clave:
- **Alelo Dominante (A):** Se expresa siempre que esté presente.
- **Alelo Recesivo (a):** Solo se expresa cuando está en homocigosis ($aa$).
- **Genotipo:** La composición genética interna ($AA$, $Aa$, $aa$).
- **Fenotipo:** Las características físicas observables (ej. color de ojos o flor).

---

## 1° Ley de Mendel (Uniformidad):
Al cruzar dos razas puras ($AA \\times aa$), el 100% de los descendientes ($F_1$) serán heterocigotos iguales ($Aa$).`,
  },
  {
    id: "30000000-0000-0000-0000-000000000305",
    course_id: "30000000-0000-0000-0000-000000000003",
    titulo: "5. Biotecnología Moderna: Edición Genética CRISPR y PCR",
    orden: 5,
    tipo: "teoria",
    contenido_markdown: `# Biotecnología e Ingeniería Genética

La **biotecnología moderna** utiliza herramientas moleculares para modificar genéticamente organismos en beneficio de la salud, medicina y agricultura.

## 1. La Técnica PCR (Reacción en Cadena de la Polimerasa):
Permite amplificar y hacer millones de copias de un fragmento de ADN específico en pocas horas.

---

## 2. Sistema CRISPR-Cas9:
Descubierto por Jennifer Doudna y Emmanuelle Charpentier (Premio Nobel 2020).
Funciona como unas **"tijeras moleculares"** de precisión capaces de cortar y editar genes defectuosos directamente en el ADN de células vivas.`,
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
        pregunta: "¿Cuál es la fracción equivalente a 2/4?",
        opciones: ["1/2", "3/4", "4/2", "1/4"],
        respuesta_correcta: 0,
        explicacion: "Al simplificar 2/4 dividiendo entre 2 al numerador y denominador obtenemos 1/2.",
        tema: "Fracciones Equivalentes",
      },
      {
        id: "m2",
        pregunta: "Si 4x - 8 = 12, ¿cuál es el valor de la incógnita x?",
        opciones: ["x = 3", "x = 5", "x = 4", "x = 2"],
        respuesta_correcta: 1,
        explicacion: "Sumamos 8 a ambos lados: 4x = 20. Luego dividimos entre 4: x = 5.",
        tema: "Ecuaciones Lineales",
      },
      {
        id: "m3",
        pregunta: "¿Cuál es el área de un triángulo de base 8 cm y altura 5 cm?",
        opciones: ["40 cm²", "20 cm²", "13 cm²", "10 cm²"],
        respuesta_correcta: 1,
        explicacion: "Área del triángulo = (base * altura) / 2 = (8 * 5) / 2 = 20 cm².",
        tema: "Geometría Plana",
      },
      {
        id: "m4",
        pregunta: "Si compras una pizza dividida en 10 partes iguales y te comes 4, ¿qué fracción reducida representa lo que comiste?",
        opciones: ["2/5", "1/2", "4/5", "3/10"],
        respuesta_correcta: 0,
        explicacion: "4/10 simplificado dividiendo entre 2 es igual a 2/5.",
        tema: "Fracciones en la vida cotidiana",
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
        pregunta: "¿En qué polis griega nació el concepto de Democracia Directa?",
        opciones: ["Esparta", "Atenas", "Tebas", "Corinto"],
        respuesta_correcta: 1,
        explicacion: "Atenas creó la democracia directa donde los ciudadanos participaban en la Asamblea.",
        tema: "Democracia Griega",
      },
      {
        id: "h2",
        pregunta: "¿Cuál es el principal río alrededor del cual floreció el Antiguo Egipto?",
        opciones: ["Tigris", "Éufrates", "Nilo", "Danubio"],
        respuesta_correcta: 2,
        explicacion: "El río Nilo proveyó agua y tierras fértiles (el limo) fundamentales para Egipto.",
        tema: "Antiguo Egipto",
      },
      {
        id: "h3",
        pregunta: "¿Qué filósofo ateniense fue maestro de Platón y utilizaba el método de la Mayéutica?",
        opciones: ["Aristóteles", "Sócrates", "Hérodoto", "Pitágoras"],
        respuesta_correcta: 1,
        explicacion: "Sócrates utilizaba la mayéutica para ayudar a sus estudiantes a descubrir la verdad mediante preguntas.",
        tema: "Filosofía Griega",
      },
      {
        id: "h4",
        pregunta: "¿Cuál de las siguientes construcciones funerarias fue erigida en el Antiguo Egipto?",
        opciones: ["El Coliseo", "El Partenón", "Las Pirámides de Giza", "El Zigurat de Ur"],
        respuesta_correcta: 2,
        explicacion: "Las Pirámides de Giza (Keops, Kefrén y Micerino) fueron sepulcros monumentales de los faraones.",
        tema: "Arquitectura Egipcia",
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
        pregunta: "¿Qué organela celular es la encargada de producir ATP mediante la respiración celular?",
        opciones: ["Ribosoma", "Mitocondria", "Aparato de Golgi", "Lisosoma"],
        respuesta_correcta: 1,
        explicacion: "La mitocondria lleva a cabo la respiración celular para suministrar energía (ATP) a la célula.",
        tema: "Organelas Celulares",
      },
      {
        id: "b2",
        pregunta: "En la doble hélice del ADN, ¿con qué base nitrogenada se aparea siempre la Adenina (A)?",
        opciones: ["Citosina (C)", "Guanina (G)", "Timina (T)", "Uracilo (U)"],
        respuesta_correcta: 2,
        explicacion: "En el ADN la Adenina (A) se une específicamente con la Timina (T) a través de dos puentes de hidrógeno.",
        tema: "Estructura del ADN",
      },
      {
        id: "b3",
        pregunta: "¿Cuál es la función principal de los Ribosomas en la célula?",
        opciones: ["Digestión celular", "Síntesis de proteínas", "Almacenamiento de agua", "Fotosíntesis"],
        respuesta_correcta: 1,
        explicacion: "Los ribosomas leen las instrucciones del ARNm para ensamblar aminoácidos y sintetizar proteínas.",
        tema: "Síntesis Proteica",
      },
      {
        id: "b4",
        pregunta: "¿Qué característica principal diferencia a una célula Eucariota de una Procariota?",
        opciones: ["La presencia de membrana plasmática", "Un núcleo celular delimitado por envoltura nuclear", "Poseer ADN en su interior", "Tener mayor resistencia térmica"],
        respuesta_correcta: 1,
        explicacion: "Las células eucariotas poseen un núcleo delimitado por una carioteca que encierra el ADN.",
        tema: "Estructura Celular",
      },
    ],
  },
];

async function seed() {
  console.log("🚀 Cargando contenido educativo REAL y completo para la plataforma Ayme...");

  // 1. Cursos
  console.log("📦 Insertando/Actualizando 3 cursos escolares reales...");
  const { error: cErr } = await supabase.from("courses").upsert(coursesData, { onConflict: "id" });
  if (cErr) {
    console.error("❌ Error en cursos:", cErr);
    process.exit(1);
  }
  console.log("✅ Cursos actualizados correctamente.");

  // 2. Lecciones
  console.log("📖 Insertando/Actualizando 15 lecciones completas en Markdown...");
  const { error: lErr } = await supabase.from("lessons").upsert(lessonsData, { onConflict: "id" });
  if (lErr) {
    console.error("❌ Error en lecciones:", lErr);
    process.exit(1);
  }
  console.log("✅ 15 Lecciones cargadas exitosamente.");

  // 3. Quizzes
  console.log("🧠 Insertando/Actualizando evaluaciones y quizzes...");
  const { error: qErr } = await supabase.from("quizzes").upsert(quizzesData, { onConflict: "id" });
  if (qErr) {
    console.error("❌ Error en quizzes:", qErr);
    process.exit(1);
  }
  console.log("✅ Evaluaciones y preguntas JSONB cargadas exitosamente.");

  console.log("🎉 ¡Todo el contenido educativo real fue sincronizado en Supabase con éxito!");
}

seed();
