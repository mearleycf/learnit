Description
The CREATE TRIGGER statement is used to add triggers to the database schema. Triggers are database operations that are automatically performed when a specified database event occurs.

Each trigger must specify that it will fire for one of the following operations: DELETE, INSERT, UPDATE. The trigger fires once for each row that is deleted, inserted, or updated. If the "UPDATE OF column-name" syntax is used, then the trigger will only fire if column-name appears on the left-hand side of one of the terms in the SET clause of the UPDATE statement.

Due to an historical oversight, columns named in the "UPDATE OF" clause do not actually have to exist in the table being updated. Unrecognized column names are silently ignored. It would be more helpful if SQLite would fail the CREATE TRIGGER statement if any of the names in the "UPDATE OF" clause are not columns in the table. However, as this problem was discovered many years after SQLite was widely deployed, we have resisted fixing the problem for fear of breaking legacy applications.

At this time SQLite supports only FOR EACH ROW triggers, not FOR EACH STATEMENT triggers. Hence explicitly specifying FOR EACH ROW is optional. FOR EACH ROW implies that the SQL statements specified in the trigger may be executed (depending on the WHEN clause) for each database row being inserted, updated or deleted by the statement causing the trigger to fire.

Both the WHEN clause and the trigger actions may access elements of the row being inserted, deleted or updated using references of the form "NEW.column-name" and "OLD.column-name", where column-name is the name of a column from the table that the trigger is associated with. OLD and NEW references may only be used in triggers on events for which they are relevant, as follows:

INSERT	NEW references are valid
UPDATE	NEW and OLD references are valid
DELETE	OLD references are valid
If a WHEN clause is supplied, the SQL statements specified are only executed if the WHEN clause is true. If no WHEN clause is supplied, the SQL statements are executed every time the trigger fires.

The BEFORE or AFTER keyword determines when the trigger actions will be executed relative to the insertion, modification or removal of the associated row. BEFORE is the default when neither keyword is present.

An ON CONFLICT clause may be specified as part of an UPDATE or INSERT action within the body of the trigger. However if an ON CONFLICT clause is specified as part of the statement causing the trigger to fire, then conflict handling policy of the outer statement is used instead.

Triggers are automatically dropped when the table that they are associated with (the table-name table) is dropped. However if the trigger actions reference other tables, the trigger is not dropped or modified if those other tables are dropped or modified.

Triggers are removed using the DROP TRIGGER statement.

2.1. Syntax Restrictions On UPDATE, DELETE, and INSERT Statements Within Triggers
The UPDATE, DELETE, and INSERT statements within triggers do not support the full syntax for UPDATE, DELETE, and INSERT statements. The following restrictions apply:

The name of the table to be modified in an UPDATE, DELETE, or INSERT statement must be an unqualified table name. In other words, one must use just "tablename" not "database.tablename" when specifying the table.

For non-TEMP triggers, the table to be modified or queried must exist in the same database as the table or view to which the trigger is attached. TEMP triggers are not subject to the same-database rule. A TEMP trigger is allowed to query or modify any table in any ATTACH-ed database.

The "INSERT INTO table DEFAULT VALUES" form of the INSERT statement is not supported.

The INDEXED BY and NOT INDEXED clauses are not supported for UPDATE and DELETE statements.

The ORDER BY and LIMIT clauses on UPDATE and DELETE statements are not supported. ORDER BY and LIMIT are not normally supported for UPDATE or DELETE in any context but can be enabled for top-level statements using the SQLITE_ENABLE_UPDATE_DELETE_LIMIT compile-time option. However, that compile-time option only applies to top-level UPDATE and DELETE statements, not UPDATE and DELETE statements within triggers.

Common table expression are not supported for statements inside of triggers.

3. INSTEAD OF triggers
BEFORE and AFTER triggers work only on ordinary tables. INSTEAD OF triggers work only on views.

If an INSTEAD OF INSERT trigger exists on a view, then it is possible to execute an INSERT statement against that view. No actual insert occurs. Instead, the statements contained within the trigger are run. INSTEAD OF DELETE and INSTEAD OF UPDATE triggers work the same way for DELETE and UPDATE statements against views.

Note that the sqlite3_changes() and sqlite3_total_changes() interfaces do not count INSTEAD OF trigger firings, but the count_changes pragma does count INSTEAD OF trigger firing.

4. Some Example Triggers
Assuming that customer records are stored in the "customers" table, and that order records are stored in the "orders" table, the following UPDATE trigger ensures that all associated orders are redirected when a customer changes his or her address:

CREATE TRIGGER update_customer_address UPDATE OF address ON customers 
  BEGIN
    UPDATE orders SET address = new.address WHERE customer_name = old.name;
  END;
With this trigger installed, executing the statement:

UPDATE customers SET address = '1 Main St.' WHERE name = 'Jack Jones';
causes the following to be automatically executed:

UPDATE orders SET address = '1 Main St.' WHERE customer_name = 'Jack Jones';
For an example of an INSTEAD OF trigger, consider the following schema:

CREATE TABLE customer(
  cust_id INTEGER PRIMARY KEY,
  cust_name TEXT,
  cust_addr TEXT
);
CREATE VIEW customer_address AS
   SELECT cust_id, cust_addr FROM customer;
CREATE TRIGGER cust_addr_chng
INSTEAD OF UPDATE OF cust_addr ON customer_address
BEGIN
  UPDATE customer SET cust_addr=NEW.cust_addr
   WHERE cust_id=NEW.cust_id;
END;
With the schema above, a statement of the form:

UPDATE customer_address SET cust_addr=$new_address WHERE cust_id=$cust_id;
Causes the customer.cust_addr field to be updated for a specific customer entry that has customer.cust_id equal to the $cust_id parameter. Note how the values assigned to the view are made available as field in the special "NEW" table within the trigger body.

5. Cautions On The Use Of BEFORE triggers
If a BEFORE UPDATE or BEFORE DELETE trigger modifies or deletes a row that was to have been updated or deleted, then the result of the subsequent update or delete operation is undefined. Furthermore, if a BEFORE trigger modifies or deletes a row, then it is undefined whether or not AFTER triggers that would have otherwise run on those rows will in fact run.

The value of NEW.rowid is undefined in a BEFORE INSERT trigger in which the rowid is not explicitly set to an integer.

Because of the behaviors described above, programmers are encouraged to prefer AFTER triggers over BEFORE triggers.

6. The RAISE() function
A special SQL function RAISE() may be used within a trigger-program, with the following syntax

raise-function:

RAISE
(
ROLLBACK
,
error-message
)
IGNORE
ABORT
FAIL
When one of RAISE(ROLLBACK,...), RAISE(ABORT,...) or RAISE(FAIL,...) is called during trigger-program execution, the specified ON CONFLICT processing is performed and the current query terminates. An error code of SQLITE_CONSTRAINT is returned to the application, along with the specified error message.

When RAISE(IGNORE) is called, the remainder of the current trigger program, the statement that caused the trigger program to execute and any subsequent trigger programs that would have been executed are abandoned. No database changes are rolled back. If the statement that caused the trigger program to execute is itself part of a trigger program, then that trigger program resumes execution at the beginning of the next step.

7. TEMP Triggers on Non-TEMP Tables
A trigger normally exists in the same database as the table named after the "ON" keyword in the CREATE TRIGGER statement. Except, it is possible to create a TEMP TRIGGER on a table in another database. Such a trigger will only fire when changes are made to the target table by the application that defined the trigger. Other applications that modify the database will not be able to see the TEMP trigger and hence cannot run the trigger.

When defining a TEMP trigger on a non-TEMP table, it is important to specify the database holding the non-TEMP table. For example, in the following statement, it is important to say "main.tab1" instead of just "tab1":

CREATE TEMP TRIGGER ex1 AFTER INSERT ON main.tab1 BEGIN ...
Failure to specify the schema name on the target table could result in the TEMP trigger being reattached to a table with the same name in another database whenever any schema change occurs.

This page last modified on 2024-09-18 15:57:24 UTC