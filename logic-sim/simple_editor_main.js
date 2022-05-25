LogicSimApp.prototype = Object.create(LogicSim.prototype);
LogicSimApp.prototype.constuctor = LogicSimApp;

function LogicSimApp()
{
	LogicSim.call(this);

	this.initialize = function(canvas)
	{
		this.setCanvas(canvas);
		
		var toolbar = new Toolbar(256);
		var grp = toolbar.addGroup("Tools");
		grp.addItem(new Button.Tool(images.newfile, function() {
			if (confirm("Are you sure you want to delete all existing gates, "
				+ "wires and custom circuits?")) {
				this.clear();
			}
		}.bind(this) ));
		grp.addItem(new Button.Tool(images.save, function() {
			Saving.save(this);
		}.bind(this) ));
		grp.addItem(new Button.Tool(images.open, function() {
			Saving.loadFromPrompt(this);
			this.centerOnCanvas();
		}.bind(this) ));
		this.setDeleteBtn(
			grp.addItem(new Button.Tool(images.delete, function() {
				if (this.mode == ControlMode.deleting)
					this.setMode(ControlMode.wiring);
				else
					this.setMode(ControlMode.deleting);
		}.bind(this) )));
		this.setSelectBtn(
			grp.addItem(new Button.Tool(images.select, function() {
				if (this.mode == ControlMode.wiring)
					this.setMode(ControlMode.wiring);
				else
					this.setMode(ControlMode.selecting);
			}.bind(this) )));
		grp.addItem(new Button.Tool(images.newic, function() {
			if (this.getOutputs().length == 0) {
				alert("At least one output required to create an integrated circuit.");
				return;
			}

			var name = prompt("Please enter a name for the new integrated circuit.", "");
			if (name == null) return;

			this.customGroup.addItem(new CustomIC(name, this.clone()));
		}.bind(this) ));
		
		this.setLabelBtn(
			grp.addItem(new Button.Tool(images.label, function() {
				if (this.mode == ControlMode.labeling)
					this.setMode(ControlMode.wiring);
				else
					this.setMode(ControlMode.labeling);
		}.bind(this) )));
		
		grp.addItem(new Button.Tool(images.grid, function() {
			this.setGridType( (this.getGridType()+1)%6 );
		}.bind(this) ));

		grp.addItem(new Button.Tool(images.center, function() {
			this.centerOnCanvas();
		}.bind(this) ));

		// set to false to disable dragging resize
		toolbar.setAllowResize(true);
		
		grp = toolbar.addGroup("Logic Gates");
		grp.addItem(new BufferGate());
		grp.addItem(new AndGate());
		grp.addItem(new OrGate());
		grp.addItem(new XorGate());
		grp.addItem(new NotGate());
		grp.addItem(new NandGate());
		grp.addItem(new NorGate());
		grp.addItem(new XnorGate());

		grp = toolbar.addGroup("Input");
		grp.addItem(new ConstInput());
		grp.addItem(new ClockInput());
		grp.addItem(new ToggleSwitch());
		grp.addItem(new PushSwitchA());
		grp.addItem(new PushSwitchB());
		grp.addItem(new ICInput());

		grp = toolbar.addGroup("Output");
		grp.addItem(new OutputDisplay());
		grp.addItem(new SevenSegDisplay());
		grp.addItem(new ICOutput());

		grp = toolbar.addGroup("Flip Flops", true);
		grp.addItem(new DFlipFlop());

		grp = toolbar.addGroup("Integrated Circuits", true);
		grp.addItem(new Encoder());
		grp.addItem(new Decoder());
		grp.addItem(new SevenSegDecoder());

		this.customGroup = toolbar.addGroup("Custom Circuits");
		
		this.setToolbar(toolbar);

		this.onResizeCanvas();

		Saving.loadFromHash(this);
		
		var popup = new PopupMenu();
		popup.add('Edit Label', function(gate){ 
			var lbl = prompt("Type a label ", gate.label);
			if (lbl != null) gate.label = lbl;
		} );
		
		var menu = popup.add('Display Label');
		
		popup.add('Hide Label', function(gate){ gate.displayLabel = LabelDisplay.none;  }, menu );
		popup.add('On Left'   , function(gate){ gate.displayLabel = LabelDisplay.left;  }, menu );
		popup.add('On Top'	  , function(gate){ gate.displayLabel = LabelDisplay.top;   }, menu );
		popup.add('On Right'  , function(gate){ gate.displayLabel = LabelDisplay.right; }, menu );
		popup.add('On Bottom' , function(gate){ gate.displayLabel = LabelDisplay.bottom;}, menu );
		
		this.setPopupMenu(popup);
		
		
		/* // enviroment events
		this.setOnStateChanged( function (enviroment) {console.log('state changed'); } );
		this.setOnChanged( 		function (enviroment) {console.log('circuit changed'); } );
		*/
	}
		
}

var logicSim = new LogicSimApp();

function runApp(){
	logicSim.initialize("canvas");
	// run simulation at 20 steps/second
	logicSim.run(20);	
}

window.onload = function(e){
	if (!images.allImagesLoaded()) {
		images.onAllLoaded = function(){
			runApp();
		}
	} else {
		runApp();
	}
};
