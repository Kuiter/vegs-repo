import { Component, OnInit } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatDialog } from '@angular/material/dialog';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Router, ActivatedRoute, RouterState } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { TreeService } from '../services/tree.service';
import { ItemAllocateDialogComponent } from '../item-allocate-dialog/item-allocate-dialog.component';
import { union } from 'underscore';
import { TreatmentService } from '../services/treatment.service';

/**
 * Tree Component: Handles creation of custom filter trees
 */
@Component({
  selector: 'app-tree-create',
  templateUrl: './tree-create.component.html',
  styleUrls: ['./tree-create.component.scss']
})
export class TreeCreateComponent implements OnInit {

  /**
   * Base object for storing custom filter tree.
   */
  obj = {
    form: this.fb.group({
      name: [''],
      description: ['']
    }),
    trees: []
  }
  /**Reference to trees in this.obj */
  filterTrees = this.obj.trees;
  /**Stores treeID if tree is edited after creation. */
  treeID: String
  /**Stores treatmentID */
  treatmentID: String;
  /**Switch for displaying page content after ngOninit. */
  show = false;
  /**Checks if the edit in question is performed on a treatment or of a base filter tree. */
  editTreatment = false;

  // displayFilters: any[] = [];
  /** */
  index = 0;
  /**For Mat-tree hanling */
  parentNodeMap = new Map<any, any>();
  /**Tree control (Mat-tree) */
  treeControl = new NestedTreeControl<any>(node => node.children);
  /**Datasource for Mat-tree */
  dataSource = new MatTreeNestedDataSource<any>();

  /**
   * @ignore
   * @param router 
   * @param route 
   * @param fb 
   * @param treeService 
   * @param dialog 
   * @param treatmentService 
   */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private treeService: TreeService,
    private dialog: MatDialog,
    private treatmentService: TreatmentService
  ) { }

  /**
   * OnInit Lifecylcle hook, cheks if existing tree should be edited or if a new 
   * tree is created. In addition it checks if it is editted on treatment edit (only item ref addition)
   * or on base tree creation/ editing (creating new and edit existing).
   */
  ngOnInit() {
    // if in treatment edit; and tree shouls be placed on filters array... 
    if (this.route.snapshot.parent.url[0].path == 'treatmentEdit') {
      this.treatmentID = this.route.snapshot.parent.url[1].path;
      this.editTreatment = true;
      this.treatmentService.getSpecificTreatment(this.route.snapshot.parent.url[1].path).subscribe(
        (val: any) => {
          this.treeID = this.route.snapshot.url[1].path
          const ind = val.filters.findIndex(x => x._id == this.treeID);
          if (ind == -1) {
            // handle if tree not present
            return;
          }
          let tree = val.filters[ind];
          this.obj.form = this.fb.group({ name: tree.name, description: tree.description })
          let resTree = this.populateFormsTree(tree.tree);
          this.obj.trees = resTree;
          this.refresh();
        }
      );
      // this.populateFormsTree()
      return;
      // this.showNav = false;
    } else if (this.route.snapshot.url[0].path != 'new') {
      const treeID = this.route.snapshot.url[1].path;
      this.treeService.getSpecificTree(treeID).subscribe(
        (tree: any) => {
          this.obj.form = this.fb.group({ name: tree.name, description: tree.description })
          let resTree = this.populateFormsTree(tree.tree);
          this.obj.trees = resTree;
          this.refresh();
        }
      )
    } else {
      this.show = true;
    }
    // if ()
    // this.getTrees();
  }
  /**
   * Click listener for closing edit without saving.
   */
  closeEdit() {
    this.treeService.emitCloseEdit();
  }

  // for adding items to subcategory
  /**
   * OnClick listener function that handles item ref addition to node.
   * @param node 
   */
  addItems(node) {
    const dialogRef = this.dialog.open(ItemAllocateDialogComponent, {
      width: '80%',
      data: {
        treatmentID: this.treatmentID,
        items: node.items,
        ref: 'tree'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let itemIds = []
        result.forEach(element => {
          itemIds.push(element._id);
        });
        node.items = union(node.items, itemIds);
      }
    });
  }

  // for tree population when selected
  /**
   * Function that adds node definition to trees ref of this.obj
   * @param tree 
   */
  populateFormsTree(tree) {
    let res = [];
    tree.forEach((element, i) => {
      res.push(this.recursivePopulate(null, element, {}, i));
    });
    return res
  }

  /**
   * Functions that recursivly iterates tree
   * @param parent 
   * @param obj 
   * @param res 
   * @param i 
   */
  recursivePopulate(parent, obj, res, i) {
    if (!parent) {
      res.parentId = null;
      res.index = i;
      res.id = 0;
      res.level = 0;
      if (!obj.items) {
        res.items = [];
      } else {
        res.items = obj.items;
      }
    } else {
      const id = parent.level + (parent.children.length + 1) / 10.0;
      res.index = parent.index;
      res.level = parent.level + 1;
      res.parentId = parent.id;
      res.id = id;
      res.items = obj.items;
    }
    res.name = this.fb.group({
      name: [obj.name]
    });
    res.children = [];
    if (obj.children && obj.children.length > 0) {
      obj.children.forEach((element, ind) => {
        res.children.push({});
        this.recursivePopulate(res, element, res.children[ind], i);
      });
    }
    return res;
  }
  /**Necessary for Mat-tree in template. */
  hasChild = (_: number, node: any) => !!node.children && node.children.length > 0;

  // function add tree
  /**
   * OnClick listener for beginning to add a new filter tree to base trees.
   */
  addFilterTree() {
    this.obj.trees.push({
      parentId: null,
      index: this.index,
      id: 0,
      level: 0,
      name: this.fb.group({
        name: [''],
      }),
      children: [],
      items: []
    });
    this.index += 1;
    this.refresh();
  }

  // function add child
  /**
   * OnClick listener for adding node to parent node. 
   * @param parent 
   */
  addChild(parent) {
    const id = parent.level + (parent.children.length + 1) / 10.0;
    parent.children.push({
      index: parent.index,
      level: parent.level + 1,
      parentId: parent.id,
      id: id,
      name: this.fb.group({
        name: [''],
      }),
      children: [],
      items: []
    });
    this.refresh()
  }

  // central delete function checks if entire tree or child
  /**
   * OnClick listener for deleteing specified node.
   * @param node 
   */
  deleteTree(node) {
    if (node.parentId == null) {
      this.obj.trees.splice(this.obj.trees.findIndex(x => x == node), 1);
      this.refresh();
      this.index -= 1;
      this.updateIndexes(this.obj.trees);
      if (this.obj.trees.length == 0) {
        this.show = false;
      }
      return;
    }
    this.removeItem(node, this.obj.trees[node.index]);
    // this.refresh();
  }

  // for refreshing the dom view
  /**
   * Function for refreshing UI data.
   */
  refresh() {
    this.show = false;
    this.dataSource.data = null;
    this.dataSource.data = this.obj.trees;
    this.show = true;
  }

  // remove item from tree
  /**
   * OnClick listener for removing items ref of nodes.
   * @param currentNode 
   * @param root 
   */
  removeItem(currentNode: any, root: any) {
    const parentNode = this.findParent(currentNode.parentId, root);
    const index = parentNode.children.indexOf(currentNode);
    if (index !== -1) {
      parentNode.children.splice(index, 1);
      this.refresh();
      this.parentNodeMap.delete(currentNode);
    }
  }
  /**
   * Recursive find parent node function.
   * @param id 
   * @param node 
   */
  findParent(id: number, node: any): any {
    if (node != undefined && node.id === id) {
      return node;
    } else {
      for (let element in node.children) {
        if (node.children[element].children != undefined && node.children[element].children.length > 0) {
          return this.findParent(id, node.children[element]);
        } else {
          continue;
        }
      }
    }
  }

  // update indexes when sub tree from array is deleted
  /**
   * Function for updating node indexes. 
   * @param array 
   */
  updateIndexes(array) {
    if (array.length == 0) { return }
    array.forEach((element, index) => {
      this.eachRecursive(element, index);
    });
  }

  /**
   * Recursivley updates indexes for passed branch of filter tree.
   * @param obj 
   * @param i 
   */
  eachRecursive(obj, i) {
    if (obj.children.length > 0) {
      obj.children.forEach(element => {
        this.eachRecursive(element, i);
      });
    }
    obj.index = i;
  }

  // prints resulting tree structure {name: '...', children:[...], items:[...]}
  /**
   * 
   */
  printTree() {
    let trees = [];
    this.obj.trees.forEach(element => {
      let res = this.recursiveTree(element, {})
      trees.push(res);
    });
    let result: any = {
      name: this.obj.form.controls.name.value,
      description: this.obj.form.controls.description.value,
      tree: trees
    }
    if (this.editTreatment) {
      result._id = this.treeID;
      this.treeService.updateFilterOnTreatment(this.treatmentID, result).subscribe((val) => {
        this.treatmentService.replaceTreatment(val);
      });
    } else if (this.route.snapshot.url[0].path == 'edit') {
      result._id = this.route.snapshot.url[1].path;
      this.treeService.updateFilterTree(result).subscribe(
        (val) => {
          this.treeService.emitUpdateFilterList();
        },
        (error) => { console.error(error) }
      );
    } else {
      this.treeService.saveNewFilterTree(result).subscribe(
        () => {
          this.treeService.emitUpdateFilterList();
        }
      );
    }
  }
  /**
   * Function for recursivley building tree structure before saving to API.
   * @param obj 
   * @param res 
   */
  recursiveTree(obj, res) {
    res.name = obj.name.controls.name.value;
    res.items = obj.items;
    res.children = [];
    if (obj.children.length > 0) {
      obj.children.forEach((element, i) => {
        res.children.push({});
        this.recursiveTree(element, res.children[i]);
      });
    }
    return res;
  }

  // navigate Back
  /**@ignore */
  onBack() {
    this.router.navigate(['/admin']);
  }

}
