SET FOREIGN_KEY_CHECKS=0;

INSERT INTO department 
    (name) 
 VALUES 
    ( "IT" ),
    ( "Sales" ),
    ( "HR" ),
    ( "Finance" ),
    ( "Operations" ),
    ( "Customer Relations" );
    
INSERT INTO role 
    (title, salary, department_id)
VALUES
    ( "Salesperson" , 70000 , 2 ),
    ( "Lead Engineer" , 160000 , 1 ),
    ( "Software Engineer" , 150000 , 1 ),
    ( "Account Manager" , 80000 , 4 ),
    ( "Accountant" , 100000 , 4 ),
    ( "Legal Team Lead" , 100000 , 3 ),
    ( "Lawyer" , 100000 , 3 ),
    ( "Customer Service" , 80000 , 6 ),
    ( "Sales Lead" , 80000 , 2 );
    
INSERT INTO employee 
    ( first_name, last_name, role_id, manager_id)
VALUES
    ( "Lenord", "Kihn", 1, 13 ),
    ( "Palma", "Beahan", 5, null ),
    ( "Hebert", "Muller", 9, 5 ),
    ( "Virginia", "Ullrich", 8, 4 ),
    ( "Roby", "Hudson", 3, 13 ),
    ( "Jaeda", "Effertz", 8, null ),
    ( "Jalissa", "Bogisich", 3, null ),
    ( "Lexie", "Robel", 2, 7 ),
    ( "Billy", "Reilly", 3, 3 ),
    ( "Marlana", "Moen", 4, null ),
    ( "Aja", "Lynch", 2, 4 ),
    ( "Jabez", "McLaughlin", 5, null ),
    ( "Adrienne", "Stokes", 1, null ),
    ( "Florene", "OConnell", 1, null ),
    ( "Migdalia", "Sauer", 6, 3 ),
    ( "Ace", "Upton", 8, null ),
    ( "Jelani", "Quitzon", 2, null );

 SET FOREIGN_KEY_CHECKS=1;