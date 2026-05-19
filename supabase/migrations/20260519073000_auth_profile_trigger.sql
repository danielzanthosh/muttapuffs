CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER AS $$
DECLARE
  base_username TEXT;
BEGIN
  base_username := COALESCE(
    NULLIF(
      regexp_replace(
        lower(
          COALESCE(
            NEW.raw_user_meta_data ->> 'user_name',
            NEW.raw_user_meta_data ->> 'name',
            split_part(NEW.email, '@', 1),
            'puff_detective'
          )
        ),
        '[^a-z0-9_-]+',
        '_',
        'g'
      ),
      ''
    ),
    'puff_detective'
  );

  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    base_username || '_' || left(NEW.id::TEXT, 8),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
    NEW.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_profile();

INSERT INTO public.profiles (id, username, full_name, avatar_url)
SELECT
  users.id,
  COALESCE(
    NULLIF(
      regexp_replace(
        lower(
          COALESCE(
            users.raw_user_meta_data ->> 'user_name',
            users.raw_user_meta_data ->> 'name',
            split_part(users.email, '@', 1),
            'puff_detective'
          )
        ),
        '[^a-z0-9_-]+',
        '_',
        'g'
      ),
      ''
    ),
    'puff_detective'
  ) || '_' || left(users.id::TEXT, 8),
  COALESCE(users.raw_user_meta_data ->> 'full_name', users.raw_user_meta_data ->> 'name'),
  users.raw_user_meta_data ->> 'avatar_url'
FROM auth.users
LEFT JOIN public.profiles ON profiles.id = users.id
WHERE profiles.id IS NULL;
