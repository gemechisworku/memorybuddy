-- Create a policy to allow admins to view all notes
CREATE POLICY "Admins can view all notes"
ON public.notes
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
); 