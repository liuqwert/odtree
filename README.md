# odtree
Custom Tree Structure In ListView or KanbanView ,eg: Product category tree ,Department tree

product kanview(listView) in the category tree 
===
<img  src="https://github.com/openliu/odtree/blob/10.0/odtree/static/description/demo.jpg?raw=true" />

empoyee kanview(listView) in th department tree 
===
<img  src="https://github.com/openliu/odtree/blob/10.0/odtree/static/description/demo2.jpg?raw=true" />

usage
----------------------------
treelist view:
```
            <xpath expr="//tree" position="attributes">
                <attribute name="categ_property">categ_id</attribute>
                <attribute name="categ_model">product.category</attribute>
                <attribute name="categ_parent_key">parent_id</attribute>
            </xpath>
```            
            
kanban view:
```
            <xpath expr="//kanban" position="attributes">
                <attribute name="categ_property">categ_id</attribute>
                <attribute name="categ_model">product.category</attribute>
                <attribute name="categ_parent_key">parent_id</attribute>
            </xpath>
```

thanks for the opensource libs used in this module:
https://github.com/zTree/zTree_v3
https://github.com/jquery/jquery
https://github.com/odoo/odoo