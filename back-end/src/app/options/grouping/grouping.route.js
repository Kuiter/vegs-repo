const mongoose = require('mongoose');
const Tree = mongoose.model('Tree');


var verifySession =require('../../auth/verifytoken.middleware');

module.exports = function (app) {

  app.get('/options/groups/tree/:id', verifySession, (req, res) => {
    Tree.findById(req.params.id, (err, tree) => {
      if (err) { return res.status(500).send(err) }
      res.send(tree);
    })
  });
  // modify specific tree
  app.put('/options/groups/tree/:id', verifySession, (req, res) => {
    Tree.findById(req.body._id, (err, tree) => {
      if (err) { return res.status(500).send(err) }
      if (!tree) { return res.status(404).send({ msg: 'No tree found' }) }
      Object.assign(tree, req.body);
      tree.save().then((newTree) => {
        res.send(newTree);
      });
    })
  });

  // all trees which I am the owner
  app.get(
    '/options/groups/allMyTrees',
    verifySession,
    (req, res) => {
      Tree.find({ owner: req.user.username }, (err, trees) => {
        if (err) { return res.status(500).send(err) }
        let withoutTreatmentFilters = trees.filter(t => t.oldID == '')
        res.status(200).send(withoutTreatmentFilters);
      })
    })

  // admin function?
  app.get(
    '/options/groups/allTrees',
    verifySession,
    (req, res) => {
      Tree.find({}, (err, trees) => {
        if (err) { return res.status(500).send(err) }
        res.send(trees);
      })
    });

  app.post('/options/groups/tree', verifySession, (req, res) => {
    let treeData = {};
    Object.assign(treeData, req.body);
    treeData.owner = req.user.username;
    let tree = new Tree(treeData);
    tree.save((err, newTree) => {
      if (err) { return res.status(500).send(err) }
      res.send(newTree)
    })
  });

  app.delete('/options/groups/tree', verifySession, (req, res) => {
    Tree.deleteMany({}, (err, deletion) => {
      if (err) { return res.status(500).send(err) }
      res.send(deletion);
    })
  })

}
