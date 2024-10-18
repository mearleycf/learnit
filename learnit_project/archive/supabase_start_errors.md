# Supabase errors

## ran the commands you told me to run regarding removing the volume unlinking, etc. 
 
  ~/code/learnit  feature/db_migration_2 +1                                  󰔟 54s  20.3.1 󰌠 3.12.4 (learnit)running kubectl config view
❯ docker volume rm learnit_db_data                                                                                               08:52:19 AM
Error response from daemon: get learnit_db_data: no such volume

  ~/code/learnit  feature/db_migration_2                                            20.3.1 󰌠 3.12.4 (learnit)running kubectl config view
❯ docker volume rm learnit                                                                                                       08:52:52 AM
Error response from daemon: get learnit: no such volume

  ~/code/learnit  feature/db_migration_2                                            20.3.1 󰌠 3.12.4 (learnit)running kubectl config view
❯ supabase unlink                                                                                                                08:53:01 AM
Unlinking project: ulecmcfezpqhzmajuqwl
Finished supabase unlink.

  ~/code/learnit  feature/db_migration_2                                            20.3.1 󰌠 3.12.4 (learnit)running kubectl config view
❯ supabase init                                                                                                                  08:53:38 AM
failed to create config file: open supabase/config.toml: file exists
Run supabase init --force to overwrite existing config file.

  ~/code/learnit  feature/db_migration_2                                            20.3.1 󰌠 3.12.4 (learnit)running kubectl config view
❯ supabase link --project-ref ulecmcfezpqhzmajuqwl                                                                               08:53:46 AM
Enter your database password (or leave blank to skip): 
Connecting to remote database...
Finished supabase link.

  ~/code/learnit  feature/db_migration_2                                     󰔟 12s  20.3.1 󰌠 3.12.4 (learnit)running kubectl config view
❯ supabase start                                                                                                                 08:54:10 AM
WARNING: analytics requires mounting default docker socket: /var/run/docker.sock
v1.11.7: Pulling from supabase/storage-api
cf04c63912e1: Pull complete 
ad7cc170d29b: Pull complete 
429a73a5ac4c: Pull complete 
1a456893b376: Pull complete 
d625f6289da2: Pull complete 
8a08e96703ee: Pull complete 
b415c57cbbba: Pull complete 
a520247df952: Pull complete 
cf5df21c5b70: Pull complete 
406471203532: Pull complete 
Digest: sha256:de95d0a652bb7fd79840171f3a70a6c9d1d303787b5de9c6aa34defecc09c0f3
Status: Downloaded newer image for public.ecr.aws/supabase/storage-api:v1.11.7
supabase_analytics_learnit container logs:

12:54:26.520 [error] Postgrex.Protocol (#PID<0.161.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:54:26.520 [error] Postgrex.Protocol (#PID<0.162.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:54:27.960 [error] Postgrex.Protocol (#PID<0.162.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:54:28.225 [error] Postgrex.Protocol (#PID<0.161.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:54:29.492 [error] Postgrex.Protocol (#PID<0.162.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:54:30.198 [error] Postgrex.Protocol (#PID<0.161.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:54:31.601 [error] Postgrex.Protocol (#PID<0.162.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:54:34.759 [error] Postgrex.Protocol (#PID<0.161.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:54:35.507 [error] Postgrex.Protocol (#PID<0.162.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:54:37.467 [error] Could not create schema migrations table. This error usually happens due to the following:

  * The database does not exist
  * The "schema_migrations" table, which Ecto uses for managing
    migrations, was defined by another library
  * There is a deadlock while migrating (such as using concurrent
    indexes with a migration_lock)

To fix the first issue, run "mix ecto.create" for the desired MIX_ENV.

To address the second, you can run "mix ecto.drop" followed by
"mix ecto.create", both for the desired MIX_ENV. Alternatively you may
configure Ecto to use another table and/or repository for managing
migrations:

    config :logflare, Logflare.Repo,
      migration_source: "some_other_table_for_schema_migrations",
      migration_repo: AnotherRepoForSchemaMigrations

The full error report is shown below.

** (DBConnection.ConnectionError) connection not available and request was dropped from queue after 10981ms. This means requests are coming in and your connection pool cannot serve them fast enough. You can address this by:

  1. Ensuring your database is available and that you can connect to it
  2. Tracking down slow queries and making sure they are running fast enough
  3. Increasing the pool_size (although this increases resource consumption)
  4. Allowing requests to wait longer by increasing :queue_target and :queue_interval

See DBConnection.start_link/2 for more information

    (ecto_sql 3.10.1) lib/ecto/adapters/sql.ex:913: Ecto.Adapters.SQL.raise_sql_call_error/1
    (elixir 1.14.4) lib/enum.ex:1658: Enum."-map/2-lists^map/1-0-"/2
    (ecto_sql 3.10.1) lib/ecto/adapters/sql.ex:1005: Ecto.Adapters.SQL.execute_ddl/4
    (ecto_sql 3.10.1) lib/ecto/migrator.ex:738: Ecto.Migrator.verbose_schema_migration/3
    (ecto_sql 3.10.1) lib/ecto/migrator.ex:552: Ecto.Migrator.lock_for_migrations/4
    (ecto_sql 3.10.1) lib/ecto/migrator.ex:428: Ecto.Migrator.run/4
    (ecto_sql 3.10.1) lib/ecto/migrator.ex:170: Ecto.Migrator.with_repo/3
    nofile:1: (file)

12:54:39.107 [error] Postgrex.Protocol (#PID<0.4725.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:54:39.107 [error] Postgrex.Protocol (#PID<0.4724.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:54:39.107 [error] Postgrex.Protocol (#PID<0.4723.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:54:39.107 [error] Postgrex.Protocol (#PID<0.4722.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:54:39.108 [error] Postgrex.Protocol (#PID<0.4719.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:54:39.108 [error] Postgrex.Protocol (#PID<0.4729.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:54:39.110 [error] Postgrex.Protocol (#PID<0.4727.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:54:39.111 [error] Postgrex.Protocol (#PID<0.4728.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:54:39.111 [error] Postgrex.Protocol (#PID<0.4718.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:54:39.111 [error] Postgrex.Protocol (#PID<0.4726.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist
{"Kernel pid terminated",application_controller,"{application_start_failure,logflare,{{shutdown,{failed_to_start_child,'Elixir.Cainophile.Adapters.Postgres',{error,fatal,<<\"3D000\">>,invalid_catalog_name,<<\"database \\"_supabase\\" does not exist\">>,[{file,<<\"postinit.c\">>},{line,<<\"945\">>},{routine,<<\"InitPostgres\">>},{severity,<<\"FATAL\">>}]}}},{'Elixir.Logflare.Application',start,[normal,[]]}}}"}
Kernel pid terminated (application_controller) ({application_start_failure,logflare,{{shutdown,{failed_to_start_child,'Elixir.Cainophile.Adapters.Postgres',{error,fatal,<<"3D000">>,invalid_catalog_name,<<"database \"_supabase\" does not exist">>,[{file,<<"postinit.c">>},{line,<<"945">>},{routine,<<"InitPostgres">>},{severity,<<"FATAL">>}]}}},{'Elixir.Logflare.Application',start,[normal,[]]}}})

Crash dump is being written to: erl_crash.dump...done

12:54:41.946 [error] Postgrex.Protocol (#PID<0.162.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:54:41.946 [error] Postgrex.Protocol (#PID<0.161.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:54:44.167 [error] Postgrex.Protocol (#PID<0.161.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:54:44.708 [error] Postgrex.Protocol (#PID<0.162.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:54:49.138 [error] Postgrex.Protocol (#PID<0.161.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:54:50.711 [error] Postgrex.Protocol (#PID<0.162.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:54:52.921 [error] Could not create schema migrations table. This error usually happens due to the following:

  * The database does not exist
  * The "schema_migrations" table, which Ecto uses for managing
    migrations, was defined by another library
  * There is a deadlock while migrating (such as using concurrent
    indexes with a migration_lock)

To fix the first issue, run "mix ecto.create" for the desired MIX_ENV.

To address the second, you can run "mix ecto.drop" followed by
"mix ecto.create", both for the desired MIX_ENV. Alternatively you may
configure Ecto to use another table and/or repository for managing
migrations:

    config :logflare, Logflare.Repo,
      migration_source: "some_other_table_for_schema_migrations",
      migration_repo: AnotherRepoForSchemaMigrations

The full error report is shown below.

** (DBConnection.ConnectionError) connection not available and request was dropped from queue after 10989ms. This means requests are coming in and your connection pool cannot serve them fast enough. You can address this by:

  1. Ensuring your database is available and that you can connect to it
  2. Tracking down slow queries and making sure they are running fast enough
  3. Increasing the pool_size (although this increases resource consumption)
  4. Allowing requests to wait longer by increasing :queue_target and :queue_interval

See DBConnection.start_link/2 for more information

    (ecto_sql 3.10.1) lib/ecto/adapters/sql.ex:913: Ecto.Adapters.SQL.raise_sql_call_error/1
    (elixir 1.14.4) lib/enum.ex:1658: Enum."-map/2-lists^map/1-0-"/2
    (ecto_sql 3.10.1) lib/ecto/adapters/sql.ex:1005: Ecto.Adapters.SQL.execute_ddl/4
    (ecto_sql 3.10.1) lib/ecto/migrator.ex:738: Ecto.Migrator.verbose_schema_migration/3
    (ecto_sql 3.10.1) lib/ecto/migrator.ex:552: Ecto.Migrator.lock_for_migrations/4
    (ecto_sql 3.10.1) lib/ecto/migrator.ex:428: Ecto.Migrator.run/4
    (ecto_sql 3.10.1) lib/ecto/migrator.ex:170: Ecto.Migrator.with_repo/3
    nofile:1: (file)

12:54:55.132 [error] Postgrex.Protocol (#PID<0.4727.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:54:55.134 [error] Postgrex.Protocol (#PID<0.4720.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:54:55.132 [error] Postgrex.Protocol (#PID<0.4723.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:54:55.134 [error] Postgrex.Protocol (#PID<0.4725.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:54:55.134 [error] Postgrex.Protocol (#PID<0.4724.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist
{"Kernel pid terminated",application_controller,"{application_start_failure,logflare,{{shutdown,{failed_to_start_child,'Elixir.Cainophile.Adapters.Postgres',{error,fatal,<<\"3D000\">>,invalid_catalog_name,<<\"database \\"_supabase\\" does not exist\">>,[{file,<<\"postinit.c\">>},{line,<<\"945\">>},{routine,<<\"InitPostgres\">>},{severity,<<\"FATAL\">>}]}}},{'Elixir.Logflare.Application',start,[normal,[]]}}}"}
Kernel pid terminated (application_controller) ({application_start_failure,logflare,{{shutdown,{failed_to_start_child,'Elixir.Cainophile.Adapters.Postgres',{error,fatal,<<"3D000">>,invalid_catalog_name,<<"database \"_supabase\" does not exist">>,[{file,<<"postinit.c">>},{line,<<"945">>},{routine,<<"InitPostgres">>},{severity,<<"FATAL">>}]}}},{'Elixir.Logflare.Application',start,[normal,[]]}}})

Crash dump is being written to: erl_crash.dump...done

12:54:58.716 [error] Postgrex.Protocol (#PID<0.162.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:54:58.716 [error] Postgrex.Protocol (#PID<0.161.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:55:00.377 [error] Postgrex.Protocol (#PID<0.162.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:55:01.131 [error] Postgrex.Protocol (#PID<0.161.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:55:02.850 [error] Postgrex.Protocol (#PID<0.162.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:55:06.742 [error] Postgrex.Protocol (#PID<0.162.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:55:07.688 [error] Postgrex.Protocol (#PID<0.161.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:55:09.549 [error] Could not create schema migrations table. This error usually happens due to the following:

  * The database does not exist
  * The "schema_migrations" table, which Ecto uses for managing
    migrations, was defined by another library
  * There is a deadlock while migrating (such as using concurrent
    indexes with a migration_lock)

To fix the first issue, run "mix ecto.create" for the desired MIX_ENV.

To address the second, you can run "mix ecto.drop" followed by
"mix ecto.create", both for the desired MIX_ENV. Alternatively you may
configure Ecto to use another table and/or repository for managing
migrations:

    config :logflare, Logflare.Repo,
      migration_source: "some_other_table_for_schema_migrations",
      migration_repo: AnotherRepoForSchemaMigrations

The full error report is shown below.

** (DBConnection.ConnectionError) connection not available and request was dropped from queue after 10907ms. This means requests are coming in and your connection pool cannot serve them fast enough. You can address this by:

  1. Ensuring your database is available and that you can connect to it
  2. Tracking down slow queries and making sure they are running fast enough
  3. Increasing the pool_size (although this increases resource consumption)
  4. Allowing requests to wait longer by increasing :queue_target and :queue_interval

See DBConnection.start_link/2 for more information

    (ecto_sql 3.10.1) lib/ecto/adapters/sql.ex:913: Ecto.Adapters.SQL.raise_sql_call_error/1
    (elixir 1.14.4) lib/enum.ex:1658: Enum."-map/2-lists^map/1-0-"/2
    (ecto_sql 3.10.1) lib/ecto/adapters/sql.ex:1005: Ecto.Adapters.SQL.execute_ddl/4
    (ecto_sql 3.10.1) lib/ecto/migrator.ex:738: Ecto.Migrator.verbose_schema_migration/3
    (ecto_sql 3.10.1) lib/ecto/migrator.ex:552: Ecto.Migrator.lock_for_migrations/4
    (ecto_sql 3.10.1) lib/ecto/migrator.ex:428: Ecto.Migrator.run/4
    (ecto_sql 3.10.1) lib/ecto/migrator.ex:170: Ecto.Migrator.with_repo/3
    nofile:1: (file)

12:55:11.145 [error] Postgrex.Protocol (#PID<0.4718.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:55:11.145 [error] Postgrex.Protocol (#PID<0.4726.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:55:11.145 [error] Postgrex.Protocol (#PID<0.4722.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:55:11.145 [error] Postgrex.Protocol (#PID<0.4729.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:55:11.145 [error] Postgrex.Protocol (#PID<0.4724.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:55:11.145 [error] Postgrex.Protocol (#PID<0.4720.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:55:11.145 [error] Postgrex.Protocol (#PID<0.4721.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:55:11.145 [error] Postgrex.Protocol (#PID<0.4719.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:55:11.145 [error] Postgrex.Protocol (#PID<0.4727.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:55:11.145 [error] Postgrex.Protocol (#PID<0.4728.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist
{"Kernel pid terminated",application_controller,"{application_start_failure,logflare,{{shutdown,{failed_to_start_child,'Elixir.Cainophile.Adapters.Postgres',{error,fatal,<<\"3D000\">>,invalid_catalog_name,<<\"database \\"_supabase\\" does not exist\">>,[{file,<<\"postinit.c\">>},{line,<<\"945\">>},{routine,<<\"InitPostgres\">>},{severity,<<\"FATAL\">>}]}}},{'Elixir.Logflare.Application',start,[normal,[]]}}}"}
Kernel pid terminated (application_controller) ({application_start_failure,logflare,{{shutdown,{failed_to_start_child,'Elixir.Cainophile.Adapters.Postgres',{error,fatal,<<"3D000">>,invalid_catalog_name,<<"database \"_supabase\" does not exist">>,[{file,<<"postinit.c">>},{line,<<"945">>},{routine,<<"InitPostgres">>},{severity,<<"FATAL">>}]}}},{'Elixir.Logflare.Application',start,[normal,[]]}}})

Crash dump is being written to: erl_crash.dump...done

12:55:13.459 [error] Postgrex.Protocol (#PID<0.162.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:55:13.459 [error] Postgrex.Protocol (#PID<0.161.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist
Stopping containers...
supabase_analytics_learnit container is not ready: starting
Try rerunning the command with --debug to troubleshoot the error.


## Ran supabase start --debug

2024/10/09 08:57:22 Sent Header: Host [api.moby.localhost]
2024/10/09 08:57:22 Sent Header: User-Agent [Docker-Client/unknown-version (darwin)]
2024/10/09 08:57:22 Send Done
2024/10/09 08:57:22 Recv First Byte
supabase_analytics_learnit container logs:

12:56:50.325 [error] Postgrex.Protocol (#PID<0.162.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:56:50.325 [error] Postgrex.Protocol (#PID<0.161.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:56:52.098 [error] Postgrex.Protocol (#PID<0.162.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:56:53.219 [error] Postgrex.Protocol (#PID<0.161.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:56:55.798 [error] Postgrex.Protocol (#PID<0.162.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:56:58.582 [error] Postgrex.Protocol (#PID<0.161.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:57:01.239 [error] Could not create schema migrations table. This error usually happens due to the following:

  * The database does not exist
  * The "schema_migrations" table, which Ecto uses for managing
    migrations, was defined by another library
  * There is a deadlock while migrating (such as using concurrent
    indexes with a migration_lock)

To fix the first issue, run "mix ecto.create" for the desired MIX_ENV.

To address the second, you can run "mix ecto.drop" followed by
"mix ecto.create", both for the desired MIX_ENV. Alternatively you may
configure Ecto to use another table and/or repository for managing
migrations:

    config :logflare, Logflare.Repo,
      migration_source: "some_other_table_for_schema_migrations",
      migration_repo: AnotherRepoForSchemaMigrations

The full error report is shown below.

** (DBConnection.ConnectionError) connection not available and request was dropped from queue after 10973ms. This means requests are coming in and your connection pool cannot serve them fast enough. You can address this by:

  1. Ensuring your database is available and that you can connect to it
  2. Tracking down slow queries and making sure they are running fast enough
  3. Increasing the pool_size (although this increases resource consumption)
  4. Allowing requests to wait longer by increasing :queue_target and :queue_interval

See DBConnection.start_link/2 for more information

    (ecto_sql 3.10.1) lib/ecto/adapters/sql.ex:913: Ecto.Adapters.SQL.raise_sql_call_error/1
    (elixir 1.14.4) lib/enum.ex:1658: Enum."-map/2-lists^map/1-0-"/2
    (ecto_sql 3.10.1) lib/ecto/adapters/sql.ex:1005: Ecto.Adapters.SQL.execute_ddl/4
    (ecto_sql 3.10.1) lib/ecto/migrator.ex:738: Ecto.Migrator.verbose_schema_migration/3
    (ecto_sql 3.10.1) lib/ecto/migrator.ex:552: Ecto.Migrator.lock_for_migrations/4
    (ecto_sql 3.10.1) lib/ecto/migrator.ex:428: Ecto.Migrator.run/4
    (ecto_sql 3.10.1) lib/ecto/migrator.ex:170: Ecto.Migrator.with_repo/3
    nofile:1: (file)

12:57:02.558 [error] Postgrex.Protocol (#PID<0.4726.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:57:02.558 [error] Postgrex.Protocol (#PID<0.4723.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:57:02.558 [error] Postgrex.Protocol (#PID<0.4727.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:57:02.558 [error] Postgrex.Protocol (#PID<0.4724.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:57:02.558 [error] Postgrex.Protocol (#PID<0.4718.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:57:02.558 [error] Postgrex.Protocol (#PID<0.4725.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:57:02.558 [error] Postgrex.Protocol (#PID<0.4728.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:57:02.558 [error] Postgrex.Protocol (#PID<0.4729.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:57:02.559 [error] Postgrex.Protocol (#PID<0.4722.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:57:02.561 [error] Postgrex.Protocol (#PID<0.4719.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist
{"Kernel pid terminated",application_controller,"{application_start_failure,logflare,{{shutdown,{failed_to_start_child,'Elixir.Cainophile.Adapters.Postgres',{error,fatal,<<\"3D000\">>,invalid_catalog_name,<<\"database \\"_supabase\\" does not exist\">>,[{file,<<\"postinit.c\">>},{line,<<\"945\">>},{routine,<<\"InitPostgres\">>},{severity,<<\"FATAL\">>}]}}},{'Elixir.Logflare.Application',start,[normal,[]]}}}"}
Kernel pid terminated (application_controller) ({application_start_failure,logflare,{{shutdown,{failed_to_start_child,'Elixir.Cainophile.Adapters.Postgres',{error,fatal,<<"3D000">>,invalid_catalog_name,<<"database \"_supabase\" does not exist">>,[{file,<<"postinit.c">>},{line,<<"945">>},{routine,<<"InitPostgres">>},{severity,<<"FATAL">>}]}}},{'Elixir.Logflare.Application',start,[normal,[]]}}})

Crash dump is being written to: erl_crash.dump...done

12:57:04.927 [error] Postgrex.Protocol (#PID<0.162.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:57:04.927 [error] Postgrex.Protocol (#PID<0.161.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:57:06.910 [error] Postgrex.Protocol (#PID<0.161.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:57:06.911 [error] Postgrex.Protocol (#PID<0.162.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:57:09.932 [error] Postgrex.Protocol (#PID<0.161.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:57:11.015 [error] Postgrex.Protocol (#PID<0.162.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:57:13.574 [error] Postgrex.Protocol (#PID<0.161.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:57:15.906 [error] Could not create schema migrations table. This error usually happens due to the following:

  * The database does not exist
  * The "schema_migrations" table, which Ecto uses for managing
    migrations, was defined by another library
  * There is a deadlock while migrating (such as using concurrent
    indexes with a migration_lock)

To fix the first issue, run "mix ecto.create" for the desired MIX_ENV.

To address the second, you can run "mix ecto.drop" followed by
"mix ecto.create", both for the desired MIX_ENV. Alternatively you may
configure Ecto to use another table and/or repository for managing
migrations:

    config :logflare, Logflare.Repo,
      migration_source: "some_other_table_for_schema_migrations",
      migration_repo: AnotherRepoForSchemaMigrations

The full error report is shown below.

** (DBConnection.ConnectionError) connection not available and request was dropped from queue after 10989ms. This means requests are coming in and your connection pool cannot serve them fast enough. You can address this by:

  1. Ensuring your database is available and that you can connect to it
  2. Tracking down slow queries and making sure they are running fast enough
  3. Increasing the pool_size (although this increases resource consumption)
  4. Allowing requests to wait longer by increasing :queue_target and :queue_interval

See DBConnection.start_link/2 for more information

    (ecto_sql 3.10.1) lib/ecto/adapters/sql.ex:913: Ecto.Adapters.SQL.raise_sql_call_error/1
    (elixir 1.14.4) lib/enum.ex:1658: Enum."-map/2-lists^map/1-0-"/2
    (ecto_sql 3.10.1) lib/ecto/adapters/sql.ex:1005: Ecto.Adapters.SQL.execute_ddl/4
    (ecto_sql 3.10.1) lib/ecto/migrator.ex:738: Ecto.Migrator.verbose_schema_migration/3
    (ecto_sql 3.10.1) lib/ecto/migrator.ex:552: Ecto.Migrator.lock_for_migrations/4
    (ecto_sql 3.10.1) lib/ecto/migrator.ex:428: Ecto.Migrator.run/4
    (ecto_sql 3.10.1) lib/ecto/migrator.ex:170: Ecto.Migrator.with_repo/3
    nofile:1: (file)

12:57:18.123 [error] Postgrex.Protocol (#PID<0.4723.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:57:18.123 [error] Postgrex.Protocol (#PID<0.4724.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:57:18.123 [error] Postgrex.Protocol (#PID<0.4718.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:57:18.124 [error] Postgrex.Protocol (#PID<0.4729.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:57:18.126 [error] Postgrex.Protocol (#PID<0.4725.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:57:18.128 [error] Postgrex.Protocol (#PID<0.4719.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:57:18.130 [error] Postgrex.Protocol (#PID<0.4726.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:57:18.136 [error] Postgrex.Protocol (#PID<0.4727.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:57:18.137 [error] Postgrex.Protocol (#PID<0.4728.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:57:18.138 [error] Postgrex.Protocol (#PID<0.4722.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist
{"Kernel pid terminated",application_controller,"{application_start_failure,logflare,{{shutdown,{failed_to_start_child,'Elixir.Cainophile.Adapters.Postgres',{error,fatal,<<\"3D000\">>,invalid_catalog_name,<<\"database \\"_supabase\\" does not exist\">>,[{file,<<\"postinit.c\">>},{line,<<\"945\">>},{routine,<<\"InitPostgres\">>},{severity,<<\"FATAL\">>}]}}},{'Elixir.Logflare.Application',start,[normal,[]]}}}"}
Kernel pid terminated (application_controller) ({application_start_failure,logflare,{{shutdown,{failed_to_start_child,'Elixir.Cainophile.Adapters.Postgres',{error,fatal,<<"3D000">>,invalid_catalog_name,<<"database \"_supabase\" does not exist">>,[{file,<<"postinit.c">>},{line,<<"945">>},{routine,<<"InitPostgres">>},{severity,<<"FATAL">>}]}}},{'Elixir.Logflare.Application',start,[normal,[]]}}})

Crash dump is being written to: erl_crash.dump...done

12:57:20.854 [error] Postgrex.Protocol (#PID<0.161.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:57:20.854 [error] Postgrex.Protocol (#PID<0.162.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist

12:57:22.117 [error] Postgrex.Protocol (#PID<0.162.0>) failed to connect: ** (Postgrex.Error) FATAL 3D000 (invalid_catalog_name) database "_supabase" does not exist
Stopping containers...
Pruned containers: [9c7b02bf031756dbe514c1a029cbf05a5674cb9067511c2b9de4408532ab6623 dd35738168b6f3009cb31065338f46fb256f52291c56406ee94b9683b1710600 7ca1c2509a3a0912f02d653f449190ee90a2823cedf71b383ce472e915121da0 220b92c86a7ccffada3bc9256c958398c70d7485101382e9422dc397cf59da79 a8f92481d38f30229185bdacbc6d361ec5b49a1c84781cca596b4bf66fcc6439 8403818a279faa05c17099c8a50052194b3cf60bc49f754cfa0e587b548a6e76 ab6c86692c8a10ba9b55939cc96ab8e5b0addc15f129172eb3167e89069544ec b1368e9b4aa244c454b8c7fd0ddb1db0d72db4ae51224b3d7dcca7f179b095c6 8330d5af71aeeb41cb94b9871c5195098935544c098dbb06c1dcdeda098d40ae d6d11cd64bea732bc0bbf368339c0519a3f0880b3e485bc7b6ae61dbe608ba48 b524a74933870c8898567ea92ec4aa204fa7fda095876757ae3fba6dba009954 873de9937c63c92934c0eaef1e56eaab4f00250825ff6995fef51deaf8dd9833 6255b21bbe881ce06b6b98225d94b63ee6352731ed299ca74334a71c1133c408]
Pruned network: [supabase_network_learnit]