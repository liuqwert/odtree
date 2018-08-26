// ##############################################################################
// #    odtree
// #    author:15251908@qq.com (openliu)
// #    license:'LGPL-3
// #
// ##############################################################################
odoo.define('odtree', function (require) {
    "use strict";

    var core = require('web.core');
    var ajax = require('web.ajax');
    var ListView = require('web.ListView');
    var KanbanView = require('web_kanban.KanbanView');
    //var data = require('web.data');
    //var pyeval = require('web.pyeval');
    var qweb = core.qweb;

    var node_id_selected = 0;
    var treejson = [];
    var treeObj;
    var last_view_id;

    var buildTree = function (view, categ_model, categ_parent_key) {

        var setting = {
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onClick: function (event, treeId, treeNode, clickFlag) {
                    node_id_selected = treeNode.id;
                    var search_view = view.getParent().searchview;
                    var search_data = search_view.build_search_data();
                    var domains = search_data.domains;
                    search_view.do_search(domains, search_data.contexts, search_data.groupbys || []);
                }
            }
        };
        var fields = ['id', 'name'];
        if (categ_parent_key != null) {
            fields.push(categ_parent_key);
        }
        var ctx = view.dataset.get_context().__contexts[0] || {};
//        var ctx = pyeval.eval(
//            'context', new data.CompoundContext(
//                view.dataset.get_context(), {}));

        ajax.jsonRpc('/web/dataset/call_kw', 'call', {
            model: categ_model,
            method: 'search_read',
            args: [],
            kwargs: {
                domain: [],
                fields: fields,
                order: 'id asc',
                context: ctx
            }
        }).then(function (respdata) {
            if (respdata.length > 0) {
                var treejson_cur = [];
                for (var index = 0; index < respdata.length; index++) {
                    var obj = respdata[index];
                    var parent_id = 0;
                    if (obj.hasOwnProperty(categ_parent_key)) {
                        parent_id = obj[categ_parent_key];
                        if (parent_id !== null || parent_id !== undefined || parent_id !== false) {
                            parent_id = parent_id[0];
                        }
                    }
                    treejson_cur.push({id: obj['id'], pId: parent_id, name: obj['name'], open: true});
                }

                if (view.getParent().$('.o_list_view_categ').length === 0
                    || last_view_id !== view.fields_view.view_id
                    || (JSON.stringify(treejson) !== JSON.stringify(treejson_cur))) {
                    last_view_id = view.fields_view.view_id;
                    view.getParent().$('.o_list_view_categ').remove();
                    treejson = treejson_cur;
                    var fragment = document.createDocumentFragment();
                    var content = qweb.render('Odtree');
                    $(content).appendTo(fragment);
                    view.getParent().$el.prepend(fragment);
                    treeObj = $.fn.zTree.init(view.getParent().$('.ztree'), setting, treejson);
                }
                if (node_id_selected != null && node_id_selected > 0) {
                    var node = treeObj.getNodeByParam('id', node_id_selected, null);
                    treeObj.selectNode(node);
                }

            }

        });

    };


    ListView.include({

        do_search: function (domain, context, group_by) {
            if (this.fields_view.arch.attrs.categ_property && this.fields_view.arch.attrs.categ_model) {
                if (node_id_selected != null && node_id_selected > 0) {
                    arguments[0][arguments[0].length] = [this.fields_view.arch.attrs.categ_property, '=', node_id_selected];
                }
            }
            return this._super.apply(this, arguments);
        },

        load_list: function () {
            var self = this;
            var result = this._super.apply(this, arguments);
            if (this.fields_view.arch.attrs.categ_property && this.fields_view.arch.attrs.categ_model) {
                this.$('.table-responsive').addClass("o_list_view_width_withcateg");
                this.$('.table-responsive').css("overflow-x", "auto");
                buildTree(self, self.fields_view.arch.attrs.categ_model, self.fields_view.arch.attrs.categ_parent_key);
            } else {
                this.getParent().$('.o_list_view_categ').remove();
            }
            return result;
        }
    });


    KanbanView.include({

        do_search: function (domain, context, group_by) {
            if (this.fields_view.arch.attrs.categ_property && this.fields_view.arch.attrs.categ_model) {
                if (node_id_selected != null && node_id_selected > 0) {
                    arguments[0][arguments[0].length] = [this.fields_view.arch.attrs.categ_property, '=', node_id_selected];
                }
            }
            return this._super.apply(this, arguments);
        },

        render: function () {
            var self = this;
            var result = this._super.apply(this, arguments);
            if (this.fields_view.arch.attrs.categ_property && this.fields_view.arch.attrs.categ_model) {
                buildTree(self, self.fields_view.arch.attrs.categ_model, self.fields_view.arch.attrs.categ_parent_key);
            } else {
                this.getParent().$('.o_list_view_categ').remove();
            }
            return result;
        }
    });


});
