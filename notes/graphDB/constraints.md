## Creating a constraint for the Candidate node 

CREATE CONSTRAINT ON (c:Candidate) ASSERT c.EmployeeID IS UNIQUE;
