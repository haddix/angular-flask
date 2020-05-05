import { Component, OnInit, ViewChild } from '@angular/core';
import { TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions } from 'angular-tree-component';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { v4 as uuid } from 'uuid';
import * as _ from 'lodash'

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit {

  @ViewChild(ContextMenuComponent, { static: true }) public basicMenu: ContextMenuComponent;

  selected_node = "";
  
  nodes = [
    {
      id: 1,
      name: 'root1',
      children: [
        { id: 2, name: 'child1' },
        { id: 3, name: 'child2' }
      ]
    },
    {
      id: 4,
      name: 'root2',
      children: [
        { id: 5, name: 'child2.1' },
        {
          id: 6,
          name: 'child2.2',
          children: [
            { id: 7, name: 'subsub' }
          ]
        }
      ]
    }
  ];
  
  options: ITreeOptions = {
    displayField: 'nodeName',
    isExpandedField: 'expanded',
    idField: 'uuid',
    hasChildrenField: 'nodes',
    actionMapping: {
      mouse: {
        dblClick: (model: any, node: any, event: any) => {
          if(this.selected_node == ""){
            this.selected_node = node.data.id;
          }
          else{
            this.selected_node = "";
          }
            
          console.log(node.data.id);
        },
        click: (model: any, node: any, event: any) => {
          console.log(node.data.id);
        }
      },
      keys: {
        [KEYS.ENTER]: (tree, node, $event) => {
          node.expandAll();
        }
      }
    },
    nodeHeight: 23,
    allowDrag: (node) => {
      return true;
    },
    allowDrop: (node) => {
      return true;
    },
    allowDragoverStyling: true,
    levelPadding: 10,
    // useVirtualScroll: true, //test for large trees
    animateExpand: true,
    scrollOnActivate: true,
    animateSpeed: 30,
    animateAcceleration: 1.2,
    // scrollContainer: document.documentElement 

    
  }
  
  constructor() { }

  ngOnInit() {
    
  }
  
  treeModel:any;
  tree_init(event){
    event.treeModel.expandAll();
    this.treeModel = event.treeModel;
  }


  add_root_node(){
    this.nodes.push({
      id: uuid(),
      name: 'new item',
      children: [       
      ]
    })
    this.treeModel.update();
  }
  
  add_node(node) {
    console.log(node);
    node.data.children.push({
      id: uuid(),
      name: 'new item',
      children: [       
      ]
    });
    this.treeModel.update();
  }

  delete_node(node){
    let parentNode = node.realParent ? node.realParent : node.treeModel.virtualRoot;
    _.remove(parentNode.data.children, function (child) {
        return child === node.data;
    });
    this.treeModel.update();
    // if (node.parent.data.children.length === 0) {
    //     node.parent.data.hasChildren = false;
    // }
  }

}
