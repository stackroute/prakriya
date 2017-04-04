CREATE CONSTRAINT ON (c:Concept) ASSERT c.Name IS UNIQUE;

## Creating all the nodes from CSV file
USING PERIODIC COMMIT 50
LOAD CSV WITH HEADERS FROM "file:///concepts.csv" AS Line
WITH Line
WHERE Line.Name IS NOT NULL
COALESCE(Line.NodeId,'')
COALESCE(Line.NodeType,'')
COALESCE(Line.ParentRelation,'')
COALESCE(Line.Description,'')
CALL apoc.create.node([Line.NodeType], {
	name:Line.Name,
	nodeid:Line.NodeId,
	nodetype:Line.NodeType,
	parent:Line.ParentNodeId,
	relation:Line.ParentRelation,
	description:Line.Description
}) YIELD node
return node


## Merge duplicate nodes
MATCH (c)
WITH COLLECT(c) AS cp
CALL apoc.refactor.mergeNodes(cp) YIELD node
return node

## Create a relationship between nodes dynamically
USING PERIODIC COMMIT 50
LOAD CSV WITH HEADERS FROM "file:///concepts.csv" AS Line
WITH Line
WHERE Line.Name IS NOT NULL
MATCH (c {name:Line.Name})
MATCH (pc {nodeid:Line.ParentNodeId})
call apoc.create.relationship(c, Line.ParentRelation, {}, pc) YIELD rel
return c, pc, rel