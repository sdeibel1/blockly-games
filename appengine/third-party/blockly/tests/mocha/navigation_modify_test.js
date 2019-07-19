suite('Insert/Modify', function() {
  setup(function() {
    var xmlText = '<xml xmlns="http://www.w3.org/1999/xhtml">' +
      '<block type="stack_block" id="stack_block_1" x="12" y="38"></block>' +
      '<block type="stack_block" id="stack_block_2" x="12" y="113"></block>' +
      '<block type="row_block" id="row_block_1" x="13" y="213"></block>' +
      '<block type="row_block" id="row_block_2" x="12" y="288"></block>' +
    '</xml>';
    defineStackBlock();
    defineRowBlock();

    var toolbox = document.getElementById('toolbox-connections');
    this.workspace = Blockly.inject('blocklyDiv', {toolbox: toolbox});
    Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xmlText), this.workspace);

    this.stack_block_1 = this.workspace.getBlockById('stack_block_1');
    this.stack_block_2 = this.workspace.getBlockById('stack_block_2');
    this.row_block_1 = this.workspace.getBlockById('row_block_1');
    this.row_block_2 = this.workspace.getBlockById('row_block_2');

    Blockly.Navigation.enableKeyboardAccessibility();
    Blockly.Navigation.focusWorkspace();
  });

  teardown(function() {
    delete Blockly.Blocks['stack_block'];
    delete Blockly.Blocks['row_block'];
    this.workspace.dispose();
    // Does disposing of the workspace dispose of cursors and markers
    // correctly?
  });

  suite('Marked Connection', function() {
    // TODO: Marked connection or cursor connection is already connected.
    suite('Marker on next', function() {
      setup(function() {
        Blockly.Navigation.marker_.setLocation(
            Blockly.ASTNode.createConnectionNode(
                this.stack_block_1.nextConnection));
      });
      test('Cursor on workspace', function() {
        Blockly.Navigation.cursor_.setLocation(
            Blockly.ASTNode.createWorkspaceNode(this.workspace,
                new goog.math.Coordinate(0, 0)));
        chai.assert.isFalse(Blockly.Navigation.modify());
      });
      test('Cursor on compatible connection', function() {
        Blockly.Navigation.cursor_.setLocation(
            Blockly.ASTNode.createConnectionNode(
                this.stack_block_2.previousConnection));
        chai.assert.isTrue(Blockly.Navigation.modify());
        chai.assert.equal(this.stack_block_1.getNextBlock().id, 'stack_block_2');
      });
      test('Cursor on incompatible connection', function() {
        Blockly.Navigation.cursor_.setLocation(
            Blockly.ASTNode.createConnectionNode(
                this.stack_block_2.nextConnection));
        chai.assert.isFalse(Blockly.Navigation.modify());
        chai.assert.isNull(this.stack_block_1.getNextBlock());
      });
      test('Cursor on really incompatible connection', function() {
        Blockly.Navigation.cursor_.setLocation(
            Blockly.ASTNode.createConnectionNode(
                this.row_block_1.outputConnection));
        chai.assert.isFalse(Blockly.Navigation.modify());
        chai.assert.isNull(this.stack_block_1.getNextBlock());
      });
      test('Cursor on block', function() {
        Blockly.Navigation.cursor_.setLocation(
            Blockly.ASTNode.createBlockNode(
                this.stack_block_2));
        chai.assert.isTrue(Blockly.Navigation.modify());
        chai.assert.equal(this.stack_block_1.getNextBlock().id, 'stack_block_2');
      });
    });

    suite('Marker on previous', function() {
      setup(function() {
        Blockly.Navigation.marker_.setLocation(
            Blockly.ASTNode.createConnectionNode(
                this.stack_block_1.previousConnection));
      });
      test('Cursor on compatible connection', function() {
        Blockly.Navigation.cursor_.setLocation(
            Blockly.ASTNode.createConnectionNode(
                this.stack_block_2.nextConnection));
        chai.assert.isTrue(Blockly.Navigation.modify());
        chai.assert.equal(this.stack_block_1.getPreviousBlock().id, 'stack_block_2');
      });
      test('Cursor on incompatible connection', function() {
        Blockly.Navigation.cursor_.setLocation(
            Blockly.ASTNode.createConnectionNode(
                this.stack_block_2.previousConnection));
        chai.assert.isFalse(Blockly.Navigation.modify());
        chai.assert.isNull(this.stack_block_1.getPreviousBlock());
      });
      test('Cursor on really incompatible connection', function() {
        Blockly.Navigation.cursor_.setLocation(
            Blockly.ASTNode.createConnectionNode(
                this.row_block_1.outputConnection));
        chai.assert.isFalse(Blockly.Navigation.modify());
        chai.assert.isNull(this.stack_block_1.getNextBlock());
      });
      test('Cursor on block', function() {
        Blockly.Navigation.cursor_.setLocation(
            Blockly.ASTNode.createBlockNode(
                this.stack_block_2));
        chai.assert.isTrue(Blockly.Navigation.modify());
        chai.assert.equal(this.stack_block_1.getPreviousBlock().id, 'stack_block_2');
      });
      test('Cursor on incompatible block', function() {
        Blockly.Navigation.cursor_.setLocation(
            Blockly.ASTNode.createBlockNode(
                this.row_block_1));
        chai.assert.isFalse(Blockly.Navigation.modify());
        chai.assert.isNull(this.stack_block_1.getPreviousBlock());
      });
    });

    suite('Marker on value input', function() {
      setup(function() {
        Blockly.Navigation.marker_.setLocation(
            Blockly.ASTNode.createConnectionNode(
                this.row_block_1.inputList[0].connection));
      });
      test('Cursor on compatible connection', function() {
        Blockly.Navigation.cursor_.setLocation(
            Blockly.ASTNode.createConnectionNode(
                this.row_block_2.outputConnection));
        chai.assert.isTrue(Blockly.Navigation.modify());
        chai.assert.equal(this.row_block_2.getParent().id, 'row_block_1');
      });
      test('Cursor on incompatible connection', function() {
        Blockly.Navigation.cursor_.setLocation(
            Blockly.ASTNode.createConnectionNode(
                this.row_block_2.inputList[0].connection));
        chai.assert.isFalse(Blockly.Navigation.modify());
      });
      test('Cursor on really incompatible connection', function() {
        Blockly.Navigation.cursor_.setLocation(
            Blockly.ASTNode.createConnectionNode(
                this.stack_block_1.previousConnection));
        chai.assert.isFalse(Blockly.Navigation.modify());
      });
      test('Cursor on block', function() {
        Blockly.Navigation.cursor_.setLocation(
            Blockly.ASTNode.createBlockNode(
                this.row_block_2));
        chai.assert.isTrue(Blockly.Navigation.modify());
        chai.assert.equal(this.row_block_2.getParent().id, 'row_block_1');
      });
    });

    suite('Statement input', function() {
      // TODO: fill this out.
    });

    suite('Marker on output', function() {
      setup(function() {
        Blockly.Navigation.marker_.setLocation(
            Blockly.ASTNode.createConnectionNode(
                this.row_block_1.outputConnection));
      });
      test('Cursor on compatible connection', function() {
        Blockly.Navigation.cursor_.setLocation(
            Blockly.ASTNode.createConnectionNode(
                this.row_block_2.inputList[0].connection));
        chai.assert.isTrue(Blockly.Navigation.modify());
        chai.assert.equal(this.row_block_1.getParent().id, 'row_block_2');
      });
      test('Cursor on incompatible connection', function() {
        Blockly.Navigation.cursor_.setLocation(
            Blockly.ASTNode.createConnectionNode(
                this.row_block_2.outputConnection));
        chai.assert.isFalse(Blockly.Navigation.modify());
      });
      test('Cursor on really incompatible connection', function() {
        Blockly.Navigation.cursor_.setLocation(
            Blockly.ASTNode.createConnectionNode(
                this.stack_block_1.previousConnection));
        chai.assert.isFalse(Blockly.Navigation.modify());
      });
      test('Cursor on block', function() {
        Blockly.Navigation.cursor_.setLocation(
            Blockly.ASTNode.createBlockNode(
                this.row_block_2));
        chai.assert.isTrue(Blockly.Navigation.modify());
        chai.assert.equal(this.row_block_1.getParent().id, 'row_block_2');
      });
    });
  });


  suite('Marked Workspace', function() {
    setup(function() {
      Blockly.Navigation.marker_.setLocation(
          Blockly.ASTNode.createWorkspaceNode(
              this.workspace, new goog.math.Coordinate(100, 200)));
    });
    test('Cursor on row block', function() {
      Blockly.Navigation.cursor_.setLocation(
          Blockly.ASTNode.createBlockNode(
              this.row_block_1));
      chai.assert.isTrue(Blockly.Navigation.modify());
      var pos = this.row_block_1.getRelativeToSurfaceXY();
      chai.assert.equal(100, pos.x);
      chai.assert.equal(200, pos.y);
    });

    test('Cursor on output connection', function() {
      Blockly.Navigation.cursor_.setLocation(
          Blockly.ASTNode.createConnectionNode(
              this.row_block_1.outputConnection));
      chai.assert.isTrue(Blockly.Navigation.modify());
      var pos = this.row_block_1.getRelativeToSurfaceXY();
      chai.assert.equal(100, pos.x);
      chai.assert.equal(200, pos.y);
    });

    test('Cursor on previous connection', function() {
      Blockly.Navigation.cursor_.setLocation(
          Blockly.ASTNode.createConnectionNode(
              this.stack_block_1.previousConnection));
      chai.assert.isTrue(Blockly.Navigation.modify());
      var pos = this.stack_block_1.getRelativeToSurfaceXY();
      chai.assert.equal(100, pos.x);
      chai.assert.equal(200, pos.y);
    });

    test('Cursor on input connection', function() {
      Blockly.Navigation.cursor_.setLocation(
          Blockly.ASTNode.createConnectionNode(
              this.row_block_1.inputList[0].connection));
      chai.assert.isFalse(Blockly.Navigation.modify());
    });

    test('Cursor on next connection', function() {
      Blockly.Navigation.cursor_.setLocation(
          Blockly.ASTNode.createConnectionNode(
              this.stack_block_1.nextConnection));
      chai.assert.isFalse(Blockly.Navigation.modify());
    });

    test('Cursor on child block (row)', function() {
      this.row_block_1.inputList[0].connection.connect(
          this.row_block_2.outputConnection);

      Blockly.Navigation.cursor_.setLocation(
          Blockly.ASTNode.createBlockNode(
              this.row_block_2));

      chai.assert.isTrue(Blockly.Navigation.modify());
      chai.assert.isNull(this.row_block_2.getParent());
      var pos = this.row_block_2.getRelativeToSurfaceXY();
      chai.assert.equal(100, pos.x);
      chai.assert.equal(200, pos.y);
    });

    test('Cursor on child block (stack)', function() {
      this.stack_block_1.nextConnection.connect(
          this.stack_block_2.previousConnection);

      Blockly.Navigation.cursor_.setLocation(
          Blockly.ASTNode.createBlockNode(
              this.stack_block_2));

      chai.assert.isTrue(Blockly.Navigation.modify());
      chai.assert.isNull(this.stack_block_2.getParent());
      var pos = this.stack_block_2.getRelativeToSurfaceXY();
      chai.assert.equal(100, pos.x);
      chai.assert.equal(200, pos.y);
    });

    test('Cursor on workspace', function() {
      Blockly.Navigation.cursor_.setLocation(
          Blockly.ASTNode.createWorkspaceNode(
              this.workspace, new goog.math.Coordinate(100, 100)));
      chai.assert.isFalse(Blockly.Navigation.modify());
    });
  });

  suite('Marked Block', function() {
    // TODO: Decide whether it ever makes sense to mark a block, and what to do
    // if so.  For now all of these attempted modifications will fail.
    suite('Marked any block', function() {
      // These tests are using a stack block, but do not depend on the type of
      // the block.
      setup(function() {
        Blockly.Navigation.marker_.setLocation(
            Blockly.ASTNode.createBlockNode(
                this.stack_block_1));
      });
      test('Cursor on workspace', function() {
        Blockly.Navigation.cursor_.setLocation(
            Blockly.ASTNode.createWorkspaceNode(
                this.workspace, new goog.math.Coordinate(100, 100)));
        chai.assert.isFalse(Blockly.Navigation.modify());

      });
    });
    suite('Marked stack block', function() {
      setup(function() {
        Blockly.Navigation.marker_.setLocation(
            Blockly.ASTNode.createBlockNode(
                this.stack_block_1));
      });
      test('Cursor on row block', function() {
        Blockly.Navigation.cursor_.setLocation(
            Blockly.ASTNode.createBlockNode(
                this.row_block_1));
        chai.assert.isFalse(Blockly.Navigation.modify());
      });
      test('Cursor on stack block', function() {
        Blockly.Navigation.cursor_.setLocation(
            Blockly.ASTNode.createBlockNode(
                this.stack_block_1));
        chai.assert.isFalse(Blockly.Navigation.modify());
      });
      test('Cursor on next connection', function() {
        Blockly.Navigation.cursor_.setLocation(
            Blockly.ASTNode.createConnectionNode(
                this.stack_block_2.nextConnection));
        chai.assert.isFalse(Blockly.Navigation.modify());
      });
      test('Cursor on previous connection', function() {
        Blockly.Navigation.cursor_.setLocation(
            Blockly.ASTNode.createConnectionNode(
                this.stack_block_2.previousConnection));
        chai.assert.isFalse(Blockly.Navigation.modify());
      });
    });
    suite('Marked row block', function() {
      setup(function() {
        Blockly.Navigation.marker_.setLocation(
            Blockly.ASTNode.createBlockNode(
                this.row_block_1));
      });
      test('Cursor on stack block', function() {
        Blockly.Navigation.cursor_.setLocation(
            Blockly.ASTNode.createBlockNode(
                this.stack_block_1));
        chai.assert.isFalse(Blockly.Navigation.modify());
      });
      test('Cursor on row block', function() {
        Blockly.Navigation.cursor_.setLocation(
            Blockly.ASTNode.createBlockNode(
                this.row_block_1));
        chai.assert.isFalse(Blockly.Navigation.modify());
      });
      test('Cursor on value input connection', function() {
        Blockly.Navigation.cursor_.setLocation(
            Blockly.ASTNode.createConnectionNode(
                this.row_block_2.inputList[0].connection));
        chai.assert.isFalse(Blockly.Navigation.modify());
      });
      test('Cursor on output connection', function() {
        Blockly.Navigation.cursor_.setLocation(
            Blockly.ASTNode.createConnectionNode(
                this.row_block_2.outputConnection));
        chai.assert.isFalse(Blockly.Navigation.modify());
      });
    });
  });
});
