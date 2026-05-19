ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE public.profiles
SET is_admin = TRUE
WHERE id IN (
  SELECT id
  FROM auth.users
  WHERE email = 'danielzanthosh@gmail.com'
);

CREATE POLICY "Admins can update all profiles." ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles admin_profile
      WHERE admin_profile.id = auth.uid()
      AND admin_profile.is_admin = TRUE
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles admin_profile
      WHERE admin_profile.id = auth.uid()
      AND admin_profile.is_admin = TRUE
    )
  );

CREATE POLICY "Admins can delete bakeries." ON public.bakeries
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles admin_profile
      WHERE admin_profile.id = auth.uid()
      AND admin_profile.is_admin = TRUE
    )
  );

CREATE POLICY "Admins can delete reviews." ON public.reviews
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles admin_profile
      WHERE admin_profile.id = auth.uid()
      AND admin_profile.is_admin = TRUE
    )
  );

CREATE POLICY "Admins can delete review photos." ON public.review_photos
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles admin_profile
      WHERE admin_profile.id = auth.uid()
      AND admin_profile.is_admin = TRUE
    )
  );

CREATE POLICY "Admins can manage badges." ON public.bakery_badges
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles admin_profile
      WHERE admin_profile.id = auth.uid()
      AND admin_profile.is_admin = TRUE
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles admin_profile
      WHERE admin_profile.id = auth.uid()
      AND admin_profile.is_admin = TRUE
    )
  );
