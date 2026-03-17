/*
  # NEMAPA - Red Social de Proyectos Creativos
  
  ## Descripción
  Este migration crea el esquema completo para NEMAPA, una plataforma de red social
  para proyectos creativos con un mapa interactivo de nodos.
  
  ## 1. Nuevas Tablas
  
  ### `profiles`
  - `id` (uuid, PK) - referencia a auth.users
  - `username` (text, unique) - nombre de usuario público
  - `full_name` (text) - nombre completo
  - `avatar_url` (text, nullable) - URL del avatar
  - `bio` (text, nullable) - biografía del usuario
  - `created_at` (timestamptz) - fecha de creación
  - `updated_at` (timestamptz) - fecha de última actualización
  
  ### `projects`
  - `id` (uuid, PK) - identificador único
  - `user_id` (uuid, FK) - creador del proyecto
  - `title` (text) - título del proyecto
  - `description` (text) - descripción del proyecto
  - `status` (text) - estado: 'idea', 'en_progreso', 'completado', 'pausado'
  - `image_url` (text, nullable) - URL de la imagen
  - `is_public` (boolean) - visible en el mapa público
  - `created_at` (timestamptz) - fecha de creación
  - `updated_at` (timestamptz) - fecha de actualización
  
  ### `tags`
  - `id` (uuid, PK) - identificador único
  - `name` (text, unique) - nombre del tag
  - `created_at` (timestamptz) - fecha de creación
  
  ### `project_tags`
  - `project_id` (uuid, FK) - referencia al proyecto
  - `tag_id` (uuid, FK) - referencia al tag
  - PK compuesta (project_id, tag_id)
  
  ### `project_links`
  - `id` (uuid, PK) - identificador único
  - `project_id` (uuid, FK) - referencia al proyecto
  - `url` (text) - URL del link
  - `label` (text) - etiqueta descriptiva
  - `created_at` (timestamptz) - fecha de creación
  
  ### `comments`
  - `id` (uuid, PK) - identificador único
  - `project_id` (uuid, FK) - referencia al proyecto
  - `user_id` (uuid, FK) - autor del comentario
  - `content` (text) - contenido del comentario
  - `created_at` (timestamptz) - fecha de creación
  - `updated_at` (timestamptz) - fecha de actualización
  
  ## 2. Seguridad (RLS)
  
  ### profiles
  - Lectura: Todos pueden leer perfiles públicos
  - Inserción: Los usuarios autenticados pueden crear su propio perfil
  - Actualización: Los usuarios pueden actualizar solo su propio perfil
  
  ### projects
  - Lectura: Los proyectos públicos son visibles para todos, los privados solo para el dueño
  - Inserción: Los usuarios autenticados pueden crear proyectos
  - Actualización: Solo el dueño puede actualizar sus proyectos
  - Eliminación: Solo el dueño puede eliminar sus proyectos
  
  ### tags
  - Lectura: Todos pueden leer tags
  - Inserción: Los usuarios autenticados pueden crear tags
  
  ### project_tags
  - Lectura: Visible según la visibilidad del proyecto
  - Inserción: Solo el dueño del proyecto puede agregar tags
  - Eliminación: Solo el dueño del proyecto puede eliminar tags
  
  ### project_links
  - Lectura: Visible según la visibilidad del proyecto
  - Inserción: Solo el dueño del proyecto puede agregar links
  - Actualización: Solo el dueño del proyecto puede actualizar links
  - Eliminación: Solo el dueño del proyecto puede eliminar links
  
  ### comments
  - Lectura: Visibles según la visibilidad del proyecto
  - Inserción: Los usuarios autenticados pueden comentar en proyectos públicos
  - Actualización: Los usuarios pueden actualizar solo sus propios comentarios
  - Eliminación: Los usuarios pueden eliminar solo sus propios comentarios
  
  ## 3. Notas Importantes
  
  - Todas las tablas tienen RLS habilitado para seguridad
  - Los perfiles se crean automáticamente cuando un usuario se registra (trigger)
  - Los timestamps se actualizan automáticamente (triggers)
  - Los tags son case-insensitive y se normalizan a lowercase
*/

-- Crear tabla de perfiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de proyectos
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'idea' CHECK (status IN ('idea', 'en_progreso', 'completado', 'pausado')),
  image_url text,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de tags
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de relación proyecto-tags
CREATE TABLE IF NOT EXISTS project_tags (
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, tag_id)
);

-- Crear tabla de links de proyectos
CREATE TABLE IF NOT EXISTS project_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  url text NOT NULL,
  label text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de comentarios
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_is_public ON projects(is_public);
CREATE INDEX IF NOT EXISTS idx_project_tags_project_id ON project_tags(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tags_tag_id ON project_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_project_links_project_id ON project_links(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_project_id ON comments(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);

-- Función para normalizar tags a lowercase
CREATE OR REPLACE FUNCTION normalize_tag_name()
RETURNS TRIGGER AS $$
BEGIN
  NEW.name = LOWER(TRIM(NEW.name));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para normalizar tags
DROP TRIGGER IF EXISTS normalize_tag_name_trigger ON tags;
CREATE TRIGGER normalize_tag_name_trigger
  BEFORE INSERT OR UPDATE ON tags
  FOR EACH ROW
  EXECUTE FUNCTION normalize_tag_name();

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;
CREATE TRIGGER create_profile_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_user();

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Políticas RLS para projects
CREATE POLICY "Public projects are viewable by everyone"
  ON projects FOR SELECT
  TO authenticated
  USING (is_public = true OR user_id = auth.uid());

CREATE POLICY "Users can create their own projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Políticas RLS para tags
CREATE POLICY "Tags are viewable by everyone"
  ON tags FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create tags"
  ON tags FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Políticas RLS para project_tags
CREATE POLICY "Project tags are viewable based on project visibility"
  ON project_tags FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_tags.project_id
      AND (projects.is_public = true OR projects.user_id = auth.uid())
    )
  );

CREATE POLICY "Project owners can add tags to their projects"
  ON project_tags FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_tags.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can remove tags from their projects"
  ON project_tags FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_tags.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Políticas RLS para project_links
CREATE POLICY "Project links are viewable based on project visibility"
  ON project_links FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_links.project_id
      AND (projects.is_public = true OR projects.user_id = auth.uid())
    )
  );

CREATE POLICY "Project owners can add links to their projects"
  ON project_links FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_links.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can update links in their projects"
  ON project_links FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_links.project_id
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_links.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can delete links from their projects"
  ON project_links FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_links.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Políticas RLS para comments
CREATE POLICY "Comments are viewable based on project visibility"
  ON comments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = comments.project_id
      AND (projects.is_public = true OR projects.user_id = auth.uid())
    )
  );

CREATE POLICY "Authenticated users can comment on public projects"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = comments.project_id
      AND projects.is_public = true
    )
  );

CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);