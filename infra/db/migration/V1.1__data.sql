-- sql
WITH r AS (
INSERT INTO role_info (name, description)
VALUES ('super_admin', 'Super administrator with full privileges')
    RETURNING id
    ),
    u AS (
INSERT INTO user_info (uid, username, email, password_hash, full_name, is_active)
VALUES (gen_random_uuid(), 'superadmin', 'admin@example.com', '<REPLACE_WITH_BCRYPT_HASH>', 'Super Admin', true)
    RETURNING id
    )
INSERT INTO user_role (user_id, role_id, assigned_at)
SELECT u.id, r.id, now() FROM u, r;
