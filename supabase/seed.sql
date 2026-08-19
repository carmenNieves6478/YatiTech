-- SCRIPT DE SEMBRADO DE DATOS (SEED) IDEMPOTENTE PARA AYME
-- Cursos por Nivel, Lecciones Educativas en Markdown y Quizzes Evaluativos

-- 1. Cursos por Nivel (Principiante, Intermedio, Avanzado)
INSERT INTO public.courses (id, titulo, descripcion, categoria, nivel, portada_url, publicado) VALUES
('10000000-0000-0000-0000-000000000001', 
 'Matemática Básica Escolar: Operaciones, Fracciones y Geometría', 
 'Curso diseñado para fortalecer el razonamiento numérico, la resolución de fracciones, ecuaciones simples y conceptos clave de geometría para primaria y secundaria.', 
 'Matemática', 
 'principiante', 
 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop', 
 true),

('20000000-0000-0000-0000-000000000002', 
 'Historia Universal: Egipto, Grecia, Roma y Edad Media', 
 'Un viaje fascinante a través de las grandes civilizaciones antiguas, la democracia ateniense, el auge del Imperio Romano y la evolución social durante la Edad Media.', 
 'Historia', 
 'intermedio', 
 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&auto=format&fit=crop', 
 true),

('30000000-0000-0000-0000-000000000003', 
 'Biología Celular, ADN y Genética Moderna', 
 'Estudio de la estructura de la célula eucariota y procariota, los mecanismos del ADN y ARN, leyes de Mendel y aplicaciones biotecnológicas actuales.', 
 'Ciencia y Tecnología', 
 'avanzado', 
 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop', 
 true)
ON CONFLICT (id) DO UPDATE SET
  titulo = EXCLUDED.titulo,
  descripcion = EXCLUDED.descripcion,
  categoria = EXCLUDED.categoria,
  nivel = EXCLUDED.nivel,
  portada_url = EXCLUDED.portada_url,
  publicado = EXCLUDED.publicado;

-- 2. Lecciones Reales con Contenido Markdown
INSERT INTO public.lessons (id, course_id, titulo, orden, tipo, contenido_markdown) VALUES
-- Curso 1: Matemática Básica
('10000000-0000-0000-0000-000000000101', '10000000-0000-0000-0000-000000000001', '1. Fracciones Equivalentes y Operaciones Básicas', 1, 'teoria', '# Fracciones en la Vida Cotidiana\n\nUna **fracción** representa una parte de un todo dividido en partes iguales...'),
('10000000-0000-0000-0000-000000000102', '10000000-0000-0000-0000-000000000001', '2. Ecuaciones Lineales de Primer Grado', 2, 'teoria', '# Introducción al Álgebra: Ecuaciones\n\nUna **ecuación de primer grado** es una igualdad matemática con una incógnita...'),
('10000000-0000-0000-0000-000000000103', '10000000-0000-0000-0000-000000000001', '3. Quiz de Evaluación: Operaciones y Álgebra', 3, 'quiz', '# Quiz Interactivo de Matemática Básica'),
('10000000-0000-0000-0000-000000000104', '10000000-0000-0000-0000-000000000001', '4. Geometría Plana: Perímetros y Áreas', 4, 'teoria', '# Geometría Plana Básico\n\nEl perímetro es la suma de los lados de una figura...'),

-- Curso 2: Historia Universal
('20000000-0000-0000-0000-000000000201', '20000000-0000-0000-0000-000000000002', '1. El Antiguo Egipto: Pirámides y el Río Nilo', 1, 'teoria', '# La Civilización del Nilo\n\nEl Antiguo Egipto floreció a lo largo del río Nilo...'),
('20000000-0000-0000-0000-000000000202', '20000000-0000-0000-0000-000000000002', '2. Grecia Antigua: Atenas y la Democracia', 2, 'teoria', '# La Grecia Clásica\n\nGrecia es considerada la cuna de la civilización occidental...'),
('20000000-0000-0000-0000-000000000203', '20000000-0000-0000-0000-000000000002', '3. Quiz de Evaluación: Egipto y Grecia', 3, 'quiz', '# Quiz Interactivo de Historia Universal'),
('20000000-0000-0000-0000-000000000204', '20000000-0000-0000-0000-000000000002', '4. El Imperio Romano y su Legado Jurídico', 4, 'teoria', '# Roma: De Monarquía a Imperio\n\nEl Derecho Romano es el mayor legado a la humanidad...'),

-- Curso 3: Biología Celular
('30000000-0000-0000-0000-000000000301', '30000000-0000-0000-0000-000000000003', '1. La Célula Eucariota y sus Organelas', 1, 'teoria', '# Biología Celular Avanzada\n\nLa célula eucariota posee un núcleo delimitado por una membrana...'),
('30000000-0000-0000-0000-000000000302', '30000000-0000-0000-0000-000000000003', '2. Estructura del ADN y Replicación Celular', 2, 'teoria', '# El Código Genético: ADN\n\nEl ADN contiene la información genética de todos los seres vivos...'),
('30000000-0000-0000-0000-000000000303', '30000000-0000-0000-0000-000000000003', '3. Quiz de Evaluación: Biología Celular y Genética', 3, 'quiz', '# Quiz Evaluativo de Biología Avanzada')
ON CONFLICT (id) DO UPDATE SET
  titulo = EXCLUDED.titulo,
  orden = EXCLUDED.orden,
  tipo = EXCLUDED.tipo,
  contenido_markdown = EXCLUDED.contenido_markdown;

-- 3. Quizzes Evaluativos con Preguntas JSONB
INSERT INTO public.quizzes (id, lesson_id, preguntas) VALUES
('10000000-0000-0000-0000-000000000901', '10000000-0000-0000-0000-000000000103', '[{"id":"m1","pregunta":"¿Cuál es la fracción equivalente a 2/4?","opciones":["1/2","3/4","4/2","1/4"],"respuesta_correcta":0,"explicacion":"Al simplificar 2/4 se obtiene 1/2."},{"id":"m2","pregunta":"Si 4x - 8 = 12, ¿cuál es el valor de x?","opciones":["x = 3","x = 5","x = 4","x = 2"],"respuesta_correcta":1,"explicacion":"4x = 20 => x = 5."}]'::jsonb),
('20000000-0000-0000-0000-000000000902', '20000000-0000-0000-0000-000000000203', '[{"id":"h1","pregunta":"¿En qué ciudad griega nació el concepto de Democracia Directa?","opciones":["Esparta","Atenas","Tebas","Corinto"],"respuesta_correcta":1,"explicacion":"Atenas creó la democracia directa."},{"id":"h2","pregunta":"¿Cuál es el principal río alrededor del cual se desarrolló el Antiguo Egipto?","opciones":["Tigris","Éufrates","Nilo","Danubio"],"respuesta_correcta":2,"explicacion":"El río Nilo proveyó tierras fértiles."}]'::jsonb),
('30000000-0000-0000-0000-000000000903', '30000000-0000-0000-0000-000000000303', '[{"id":"b1","pregunta":"¿Qué organela celular es responsable de la producción de ATP (energía)?","opciones":["Ribosoma","Mitocondria","Aparato de Golgi","Lisosoma"],"respuesta_correcta":1,"explicacion":"La mitocondria sintetiza ATP."},{"id":"b2","pregunta":"En la estructura del ADN, ¿con qué base nitrogenada se aparea siempre la Adenina (A)?","opciones":["Citosina (C)","Guanina (G)","Timina (T)","Uracilo (U)"],"respuesta_correcta":2,"explicacion":"La Adenina (A) se une con la Timina (T)."}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET preguntas = EXCLUDED.preguntas;
